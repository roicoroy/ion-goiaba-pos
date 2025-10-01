import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedusaCartResponse, DeleteProdRespoonse, MedusaProductsResponse, MedusaProductsCategoriesResponse, MedusaRegionListResponse, IShippingOptionsResponse, MedusaOrderResponse, CreateReturnRequest, ReturnReason, ReturnResponse, ReturnsListResponse } from '../interfaces';

/**
 * Abstract service that defines the contract for Medusa API operations.
 * Implement this service in your application to provide the actual API calls.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class MedusaApiService {

  // Authentication methods
  abstract medusaLoginWithGoogle(): Observable<any>;
  abstract validateGoogleLoginCallback(code: string, state: string): Observable<any>;
  abstract medusaAuthenticate(): Observable<any>;
  abstract medusaExists(email: string): Observable<any>;
  abstract loginEmailPassword(email: string, password?: string): Observable<any>;
  abstract createMedusaCustomer(payloadRegister: any): Observable<any>;
  abstract getMedusaCustomer(): Observable<any>;
  abstract getMedusaSession(): Observable<any>;
  abstract getMedusaToken(email: string, password: string): Observable<any>;
  abstract refreshMedusaToken(): Observable<any>;
  abstract medusaLogout(): Observable<any>;

  // Customer methods
  abstract addAddress(payload: any): Observable<any>;
  abstract updateAddress(addressId: string, address: any): Observable<any>;
  abstract deleteAddress(addressId: string): Observable<any>;
  abstract updateDefaultAddress(addressId: string, data: any): Observable<any>;
  abstract getCutomerAddress(addressId: string): Observable<any>;
  abstract updateCustomeDetails(payload: any): Observable<any>;

  // Cart methods
  abstract cartsRetrieve(cartId: string): Observable<MedusaCartResponse>;
  abstract cartsCreate(region_id: string): Observable<MedusaCartResponse>;
  abstract AddCartLineItems(cartId: string, data: { variant_id: string, quantity: number }): Observable<MedusaCartResponse>;
  abstract updateCartLineItems(cartId: string, lineId: string, data: any): Observable<MedusaCartResponse>;
  abstract cartsLineItemsDelete(cartId: string, lineId: string): Observable<DeleteProdRespoonse>;
  abstract cartsUpdate(cartId: string, data: any): Observable<MedusaCartResponse>;
  abstract completeMedusaCart(cartId: string): Observable<any>;

  // Product methods
  abstract productsRetrieve(regionId?: string): Observable<MedusaProductsResponse>;
  abstract medusaProductsList(regionId: string): Observable<MedusaProductsResponse>;
  abstract showProductVariantPrice(productId: string, regionId: string): Observable<any>;

  // Category methods
  abstract getCategories(): Observable<MedusaProductsCategoriesResponse>;
  abstract getCategory(categoryId: string): Observable<any>;
  abstract getCategoryHandle(handle: string): Observable<any>;

  // Region methods
  abstract regionsList(): Observable<MedusaRegionListResponse>;
  abstract regionsRetrieve(regionId: string): Observable<any>;

  // Shipping methods
  abstract getShippingOptions(): Observable<any>;
  abstract ListOptionsForCart(cartId: string): Observable<IShippingOptionsResponse>;
  abstract addShippingMethod(cartId: string, option_id: string): Observable<MedusaCartResponse>;

  // Payment methods
  abstract createPaymentSessions(data: any): Observable<any>;
  abstract setPaymentSession(cartId: string, provider_id: string): Observable<any>;
  abstract refreshPaymentSession(cartId: string, provider_id: string): Observable<any>;
  abstract updatePaymentSession(cartId: string, provider_id: string): Observable<any>;

  // Promotion methods
  abstract AddPromotionstoCart(cartId: string, promo_code: string): Observable<any>;
  abstract RemovePromotionstoCart(cartId: string): Observable<any>;

  // Order methods
  abstract retriveCompletedOrder(orderId: string): Observable<MedusaOrderResponse>;
  abstract retriveOrdersList(): Observable<MedusaOrderResponse>;
  abstract completeOrder(orderId: string): Observable<any>;
  abstract capturePayment(paymentCollectionId: string): Observable<any>;
  abstract updateOrderStatus(orderId: string, status: string): Observable<any>;

  // Returns methods
  abstract createReturn(returnData: CreateReturnRequest): Observable<ReturnResponse>;
  abstract getReturn(returnId: string): Observable<ReturnResponse>;
  abstract getReturns(limit?: number, offset?: number): Observable<ReturnsListResponse>;
  abstract getReturnReasons(): Observable<{ return_reasons: ReturnReason[] }>;
}
