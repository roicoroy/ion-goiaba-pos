import { Injectable, inject } from "@angular/core";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { lastValueFrom, Observable, take, tap } from "rxjs";
import { MedusaService } from "../../shared/api/medusa.service";
import { MedusaCartActions } from "./medusa-cart.actions";
import { MedusaCart } from "../../shared/interfaces/medusa-cart.interface";
import { MedusaLineItem } from "../../shared/interfaces/medusa-line-items.interface";
import { RegionsState } from "../regions/regions.state";


import { MedusaOrder, MedusaOrderResponse } from "../../shared/interfaces/medusa-order";
import { DeleteProdRespoonse } from "../../shared/interfaces/delete-prod-response.interface";

export interface MedusaCartResponse {
  cart: MedusaCart;
}

export interface MedusaCartStateModel {
  medusaCart: MedusaCart | null;
  completed_order_id: string;
  completedOrder: MedusaOrder | null;
}

@State({
  name: 'medusaCart',
  defaults: {
    medusaCart: null,
    completed_order_id: '',
    completedOrder: null
  }
})
@Injectable()
export class MedusaCartState {

  private medusaApi = inject(MedusaService);

  private store = inject(Store);

  @Selector()
  static getMedusaCart(state: MedusaCartStateModel): MedusaCart | null {
    return state.medusaCart;
  }

  @Selector()
  static getCartId(state: MedusaCartStateModel): string | undefined {
    return state.medusaCart?.id;
  }

  @Selector()
  static getCompleterdOrderId(state: MedusaCartStateModel): string {
    return state?.completed_order_id;
  }
  @Selector()
  static getCompleterdOrder(state: MedusaCartStateModel): MedusaOrder | null {
    return state.completedOrder;
  }

  @Action(MedusaCartActions.AddToMedusaCart)
  addToCart(ctx: StateContext<MedusaCartStateModel>, { variant }: MedusaCartActions.AddToMedusaCart): Observable<any> | void {
    try {
      const medusaCart = ctx.getState().medusaCart;
      const lineItem: MedusaLineItem = {
        variant_id: variant.id,
        quantity: 1,
      }
      if (!medusaCart) {
        const selectedCoutry = this.store.selectSnapshot(RegionsState.getDefaultRegion);
        return this.medusaApi.cartsCreate(selectedCoutry?.region_id).pipe(
          take(1),
          tap((res: MedusaCartResponse) => {
            if (res.cart) {
              ctx.patchState({
                medusaCart: res.cart,
              });
              this.store.dispatch(new MedusaCartActions.AddCartLineItems(res.cart.id, lineItem))
            }
          })
        );
      } else {
        this.store.dispatch(new MedusaCartActions.AddCartLineItems(medusaCart.id, lineItem))
      }
    } catch (error) {
      console.error(error);
    }
  }

  @Action(MedusaCartActions.AddCartLineItems)
  addCartLineItems(ctx: StateContext<MedusaCartStateModel>, { cartId, items }: MedusaCartActions.AddCartLineItems): Observable<any> {
    return this.medusaApi.AddCartLineItems(cartId, items).pipe(
      take(1),
      tap((res: any) => {
        ctx.patchState({
          medusaCart: res?.cart,
        });
      })
    );
  }
  //
  @Action(MedusaCartActions.RefreshCart)
  refreshCart(ctx: StateContext<MedusaCartStateModel>): Observable<any> | void {
    try {
      const cartId = ctx.getState().medusaCart?.id
      if (cartId != null) {
        return this.medusaApi.cartsRetrieve(cartId).pipe(
          take(1),
          tap({
            next: (res: MedusaCartResponse) => {
              ctx.patchState({
                medusaCart: res.cart,
              });
            },
            error: (error) => {
              console.error('Error refreshing cart:', error);
              // If cart doesn't exist, clear the state
              ctx.patchState({
                medusaCart: null,
              });
            }
          })
        );
      } else {
        // No cart ID, ensure state is cleared
        console.log('No cart ID found, clearing cart state');
        ctx.patchState({
          medusaCart: null,
        });
      }
    } catch (error) {
      console.error('Error in refreshCart:', error);
      ctx.patchState({
        medusaCart: null,
      });
    }
  }
  //
  @Action(MedusaCartActions.RetriveCompletedOrder)
  retriveCompletedOrder(ctx: StateContext<MedusaCartStateModel>, { orderId }: MedusaCartActions.RetriveCompletedOrder): Observable<any> {
    return this.medusaApi.retriveCompletedOrder(orderId).pipe(
      take(1),
      tap((res: MedusaOrderResponse) => {
        ctx.patchState({
          completedOrder: res.order,
        });
      })
    );
  }

  @Action(MedusaCartActions.UpdateCartRegion)
  updateCartRegion(ctx: StateContext<MedusaCartStateModel>, { region_id }: MedusaCartActions.UpdateCartRegion): Observable<any> | void {
    const cartId = ctx.getState().medusaCart?.id;
    const data: any = {
      region_id,
    };
    if (cartId) {
      return this.medusaApi.cartsUpdate(cartId, data).pipe(
        take(1),
        tap((res: MedusaCartResponse) => {
          if (res.cart) {
            ctx.patchState({
              medusaCart: res?.cart,
            });
          }
        })
      );
    }
  }

  @Action(MedusaCartActions.UpdateMedusaCart)
  updateMedusaCart(ctx: StateContext<MedusaCartStateModel>, { updateCartData }: MedusaCartActions.UpdateMedusaCart): Observable<any> | void {
    const cartId = ctx.getState().medusaCart?.id;

    // Check if this is a line item update
    if (updateCartData.line_items && updateCartData.line_items.length > 0) {
      // Handle line item updates using the specific endpoint
      const lineItem = updateCartData.line_items[0];
      if (cartId) {
        return this.medusaApi.updateCartLineItems(cartId, lineItem.id, { quantity: lineItem.quantity }).pipe(
          take(1),
          tap((res: MedusaCartResponse) => {
            if (res.cart) {
              ctx.patchState({
                medusaCart: res?.cart,
              });
            }
          })
        );
      }
    } else {
      // Handle general cart updates
      if (cartId) {
        return this.medusaApi.cartsUpdate(cartId, updateCartData).pipe(
          take(1),
          tap((res: MedusaCartResponse) => {
            if (res.cart) {
              ctx.patchState({
                medusaCart: res?.cart,
              });
            }
          })
        );
      }
    }
  }
  //
  @Action(MedusaCartActions.AddPromotionstoCart)
  addPromotionstoCart(ctx: StateContext<MedusaCartStateModel>, { promo_code }: MedusaCartActions.AddPromotionstoCart): Observable<any> {
    const cartId = ctx.getState().medusaCart?.id;
    return this.medusaApi.AddPromotionstoCart(cartId!, promo_code).pipe(
      take(1),
      tap((cart: any) => {
        ctx.patchState({
          medusaCart: cart?.cart,
        });
      })
    );
  }
  //
  @Action(MedusaCartActions.RemovePromotionsfromCart)
  async removePromotionsfromCart(ctx: StateContext<MedusaCartStateModel>, { promo_code }: MedusaCartActions.RemovePromotionsfromCart) {
    const cartId = ctx.getState().medusaCart?.id;
    const url = `${process.env.MEDUSA_API_BASE_PATH}/store/carts/${cartId}/promotions`;
    const { cart } = await fetch(
      url,
      {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          promo_codes: [
            promo_code
          ]
        }),
      }
    ).then((res) => res.json())
    // console.log('#️⃣', cart);
    ctx.patchState({
      medusaCart: cart,
    });
  }
  //
  @Action(MedusaCartActions.IncreaseCartItem)
  increaseCartItem(ctx: StateContext<MedusaCartStateModel>, { cartItem }: MedusaCartActions.IncreaseCartItem): Observable<any> | void {
    const cartId = ctx.getState().medusaCart?.id
    if (cartId != null) {
      return this.medusaApi.AddCartLineItems(cartId, {
        variant_id: cartItem.variant_id,
        quantity: 1
      }).pipe(
        take(1),
        tap((res: any) => {
          ctx.patchState({
            medusaCart: res.cart,
          });
        })
      );
    }
  }
  //
  @Action(MedusaCartActions.DecreaseCartItem)
  decreaseCartItem(ctx: StateContext<MedusaCartStateModel>, { cartItem }: MedusaCartActions.DecreaseCartItem): Observable<any> | void {
    const cart = ctx.getState().medusaCart;
    if (cart?.id != null) {
      const filteredItem: any = cart.items?.filter((item: any) => item.variant_id === cartItem.variant_id);
      if (filteredItem[0].quantity >= 2) {
        return this.medusaApi.AddCartLineItems(cart.id, {
          variant_id: cartItem.variant_id,
          quantity: -1
        }).pipe(
          take(1),
          tap((res: any) => {
            ctx.patchState({
              medusaCart: res.cart,
            });
          })
        );
      } else {
        this.store.dispatch(new MedusaCartActions.DeleteCartItem(filteredItem[0].id));
      }
    }
  }
  //
  @Action(MedusaCartActions.DeleteCartItem)
  deleteProductMedusaFromCart(ctx: StateContext<MedusaCartStateModel>, { line_id }: MedusaCartActions.DeleteCartItem): Observable<any> | void {
    const savedCart = ctx.getState().medusaCart;
    if (savedCart != null) {
      return this.medusaApi.cartsLineItemsDelete(savedCart.id, line_id).pipe(
        take(1),
        tap((res: DeleteProdRespoonse) => {
          ctx.patchState({
            medusaCart: res.parent,
          });
        })
      );
    }
  }
  //
  @Action(MedusaCartActions.CompleteCart)
  async completeCart(ctx: StateContext<MedusaCartStateModel>) {
    try {
      const cartId = ctx.getState().medusaCart?.id;
      // console.log('⭕', cartId);
      if (cartId != null) {
        const res = await lastValueFrom(this.medusaApi.completeMedusaCart(cartId));
        // console.log('⭕', res);
        return ctx.patchState({
          medusaCart: undefined,
          completed_order_id: res.order.id,
          completedOrder: res.type === 'order' ? res?.order : undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //
  @Action(MedusaCartActions.UpdateMedusaCartState)
  async updateMedusaCartState(ctx: StateContext<MedusaCartStateModel>, { cart }: MedusaCartActions.UpdateMedusaCartState) {
    return ctx.patchState({
      medusaCart: cart,
    });
  }
  //
  @Action(MedusaCartActions.LogOut)
  logout(ctx: StateContext<MedusaCartStateModel>) {
    ctx.patchState({
      medusaCart: undefined,
      completedOrder: undefined,
      completed_order_id: '',
    });
  }
}
