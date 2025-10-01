import { Injectable, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { catchError, Observable, take, tap, throwError } from "rxjs";
import { AuthActions } from "./auth.actions";
import { MedusaService } from "../../shared/api/medusa.service";
import { MedusaCustomer } from "../../shared/interfaces/customer-product.interface";
import { jwtDecode } from "jwt-decode";

export interface IAuthStateModel {
    isLoggedIn: boolean,
    shouldCreateCustomer: boolean,
    access_token: string,
    customer: MedusaCustomer | null,
    newNovelForm: {
        model?: {
            novelName: string;
            authors: {
                name: string;
            }[];
        };
    };
}

@State<IAuthStateModel>({
    name: 'auth',
    defaults: {
        isLoggedIn: false,
        shouldCreateCustomer: false,
        access_token: '',
        customer: null,
        newNovelForm: {
            model: undefined
        }
    }
})
@Injectable({
    providedIn: 'root'
})
export class AuthState {

    private medusaApi = inject(MedusaService);

    private store = inject(Store);

    @Selector()
    static getToken(state: IAuthStateModel): string {
        return state.access_token;
    }

    @Selector()
    static isLoggedIn(state: IAuthStateModel): boolean {
        return state.isLoggedIn;
    }

    @Selector()
    static getCustomer(state: IAuthStateModel): MedusaCustomer | null {
        return state.customer;
    }

    @Selector()
    static shouldCreateCustomer(state: IAuthStateModel): boolean {
        return state.shouldCreateCustomer;
    }

    @Action(AuthActions.Register)
    register(ctx: StateContext<IAuthStateModel>, { registerPayload, medusaAddress }: AuthActions.Register): Observable<any> {
        return this.medusaApi.createMedusaCustomer(registerPayload).pipe(
            take(1),
            tap((res: any) => {
                if (res.customer) {
                    this.store.dispatch(new AuthActions.Login(registerPayload));
                    this.store.dispatch(new AuthActions.GetSession());
                    this.store.dispatch(new AuthActions.AddACustomerAddress(medusaAddress));
                }
            }),
            catchError(error => {
                console.error('Error during registration:', error);
                ctx.patchState({
                    access_token: '',
                    isLoggedIn: false,
                });
                return throwError(() => error);
            })
        );
    }



    @Action(AuthActions.Login)
    login(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.Login): Observable<any> {
        return this.medusaApi.loginEmailPassword(loginPayload.email, loginPayload.password).pipe(
            take(1),
            tap((res: any) => {
                if (res.token) {
                    ctx.patchState({
                        access_token: res.token.toString(),
                        isLoggedIn: true,
                    });
                    this.store.dispatch(new AuthActions.GetSession());
                }
            }),
            catchError(error => {
                console.error('Error during login:', error);
                ctx.patchState({
                    access_token: '',
                    isLoggedIn: false,
                });
                return throwError(() => error);
            })
        );
    }

    @Action(AuthActions.GetSession)
    getSession(ctx: StateContext<IAuthStateModel>): Observable<any> {
        return this.medusaApi.getMedusaSession().pipe(
            take(1),
            tap((res: any) => {
                if (res.customer) {
                    ctx.patchState({
                        isLoggedIn: true,
                        customer: res.customer,
                    });
                } else {
                    // If no customer in session, try alternative method
                    this.medusaApi.getMedusaCustomer().pipe(
                        take(1),
                        tap((customerRes: any) => {
                            if (customerRes.customer) {
                                ctx.patchState({
                                    isLoggedIn: true,
                                    customer: customerRes.customer,
                                });
                            } else {
                                ctx.patchState({
                                    isLoggedIn: false,
                                    customer: null,
                                });
                            }
                        }),
                        catchError(customerError => {
                            console.error('Error getting customer:', customerError);
                            ctx.patchState({
                                isLoggedIn: false,
                                customer: null,
                            });
                            return throwError(() => customerError);
                        })
                    ).subscribe();
                }
            }),
            catchError(error => {
                console.error('Error getting session:', error);
                ctx.patchState({
                    isLoggedIn: false,
                    customer: null,
                });
                return throwError(() => error);
            })
        );
    }



    @Action(AuthActions.AddACustomerAddress)
    addaShippingAddress(ctx: StateContext<IAuthStateModel>, { address }: AuthActions.AddACustomerAddress): Observable<any> {
        const state = ctx.getState();
        return this.medusaApi.addAddress(address).pipe(
            take(1),
            tap((res: any) => {
                ctx.patchState({
                    ...state,
                    customer: res.customer,
                });
                this.store.dispatch(new AuthActions.GetSession());
            })
        );
    }

    @Action(AuthActions.UpdateCustomerAddress)
    updateCustomerAddress(ctx: StateContext<IAuthStateModel>, { addressId, address }: AuthActions.UpdateCustomerAddress): Observable<any> {
        const state = ctx.getState();
        return this.medusaApi.updateAddress(addressId, address).pipe(
            take(1),
            tap((res: any) => {
                ctx.patchState({
                    ...state,
                    customer: res.customer,
                });
            })
        );
    }
    //
    @Action(AuthActions.DeleteCustomerAddress)
    deleteCustomerAddress(ctx: StateContext<IAuthStateModel>, { addressId }: AuthActions.DeleteCustomerAddress): Observable<any> {
        return this.medusaApi.deleteAddress(addressId).pipe(
            take(1),
            tap(() => {
                this.store.dispatch(new AuthActions.GetSession());
            })
        );
    }
    //
    @Action(AuthActions.SetDefaultCustomerBillingAddress)
    setDefaultCustomerBillingAddress(ctx: StateContext<IAuthStateModel>, { addressId, value }: AuthActions.SetDefaultCustomerBillingAddress): Observable<any> {
        const state = ctx.getState();
        const data = {
            is_default_billing: value,
        }
        return this.medusaApi.updateDefaultAddress(addressId, data).pipe(
            take(1),
            tap((res: any) => {
                ctx.patchState({
                    ...state,
                    customer: res.customer,
                });
            })
        );
    }
    @Action(AuthActions.SetDefaultCustomerShippingAddress)
    setDefaultCustomerShippingAddress(ctx: StateContext<IAuthStateModel>, { addressId, value }: AuthActions.SetDefaultCustomerShippingAddress): Observable<any> {
        const state = ctx.getState();
        const data = {
            is_default_shipping: value,
        }
        return this.medusaApi.updateDefaultAddress(addressId, data).pipe(
            take(1),
            tap((res: any) => {
                ctx.patchState({
                    ...state,
                    customer: res.customer,
                });
            })
        );
    }
    //
    @Action(AuthActions.ValidateGoogleCallback)
    validateGoogleCallback(ctx: StateContext<IAuthStateModel>, { code, state }: AuthActions.ValidateGoogleCallback): Observable<any> {
        return this.medusaApi.validateGoogleLoginCallback(code, state).pipe(
            take(1),
            tap((res: any) => {
                console.log(res);
                if (res.token) {
                    ctx.patchState({
                        access_token: res.token.toString(),
                        isLoggedIn: true,
                    });
                    const shouldCreateCustomer = (jwtDecode(JSON.stringify(res.token)) as { actor_id: string }).actor_id === ""
                    if (!shouldCreateCustomer) {
                        ctx.patchState({
                            shouldCreateCustomer: shouldCreateCustomer,
                            isLoggedIn: true,
                        });
                        this.store.dispatch(new AuthActions.GetSession());
                    } else {
                        ctx.patchState({
                            shouldCreateCustomer: shouldCreateCustomer,
                            isLoggedIn: true,
                        });
                    }
                }
            }),
            catchError(err => {
                ctx.patchState({
                    access_token: '',
                    isLoggedIn: false,
                });
                return throwError(() => new Error(JSON.stringify(err)));
            })
        );
    }
    @Action(AuthActions.CreateGoogleUser)
    CreateGoogleUser(ctx: StateContext<IAuthStateModel>, { registerPayload, medusaAddress }: AuthActions.CreateGoogleUser): Observable<any> {
        return this.medusaApi.createMedusaCustomer(registerPayload).pipe(
            take(1),
            tap((res: any) => {
                if (res.customer) {
                    this.store.dispatch(new AuthActions.AddACustomerAddress(medusaAddress));
                    this.store.dispatch(new AuthActions.GetSession());
                }
            }),
            catchError(error => {
                console.error('Error creating Google user:', error);
                ctx.patchState({
                    access_token: '',
                    isLoggedIn: false,
                });
                return throwError(() => error);
            })
        );
    }
    //
    @Action(AuthActions.UpdateCustomerDetails)
    updateCustomerDetails(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.UpdateCustomerDetails): Observable<any> {
        const state = ctx.getState();
        return this.medusaApi.updateCustomeDetails(payload).pipe(
            take(1),
            tap((res: any) => {
                ctx.patchState({
                    ...state,
                    customer: res.customer,
                });
            }),
            catchError(error => {
                console.error('Error updating customer details:', error);
                return throwError(() => error);
            })
        );
    }
    //
    @Action(AuthActions.AuthLogout)
    authLogout(ctx: StateContext<IAuthStateModel>, { }: AuthActions.AuthLogout) {
        return ctx.patchState({
            isLoggedIn: false,
            access_token: '',
            customer: null
        });
    }
}
