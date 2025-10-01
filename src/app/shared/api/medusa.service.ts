import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ICustomerDetails, ICustomerLoginData } from '../interfaces';
import { RegisterPayload } from '../interfaces/auth.interface';
import { MedusaProduct } from '../interfaces/customer-product.interface';
import { MedusaCategory } from '../interfaces/medusa-categories.interface';
import { IShippingOptionsResponse } from '../../store/checkout/checkout.state';
import { MedusaCartResponse } from '../../store/medusa-cart/medusa-cart.state';
import { MedusaProductsCategoriesResponse, MedusaProductsResponse } from '../../store/products/products.state';
import { MedusaRegionListResponse } from '../../store/regions/regions.state';

import { environment } from '../../../environments/environment';

import { MedusaOrderResponse } from '../interfaces/medusa-order';
import { DeleteProdRespoonse } from '../interfaces/delete-prod-response.interface';
import {
  CreateReturnRequest,
  ReturnResponse,
  ReturnsListResponse,
  ReturnReason
} from '../interfaces/medusa-return.interface';

@Injectable({
  providedIn: 'root'
})
export class MedusaService {
  private baseUrl = environment.MEDUSA_API_BASE_PATH;

  private http = inject(HttpClient);
  private store = inject(Store);

  private get<T>(endpoint: string, options?: { headers?: HttpHeaders; withCredentials?: boolean }): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders; withCredentials?: boolean }): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private put<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders; withCredentials?: boolean }): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, options).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private delete<T>(endpoint: string, options?: { headers?: HttpHeaders; withCredentials?: boolean }): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;

      // Handle specific error cases
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found';
          break;
        case 422:
          errorMessage = 'Validation Error: Please check your input';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later';
          break;
      }
    }

    console.error('HTTP Error:', errorMessage, error);
    return throwError(() => ({ ...error, userMessage: errorMessage }));
  }

  private getHttpOptions(includeAuth: boolean = true) {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (environment.MEDUSA_PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = environment.MEDUSA_PUBLISHABLE_KEY;
    }

    return {
      headers: new HttpHeaders(headers),
      withCredentials: includeAuth
    };
  }

  medusaLoginWithGoogle(): Observable<any> {
    const url = `/auth/customer/google`;
    return this.post(url, {}, this.getHttpOptions());
  }

  validateGoogleLoginCallback(code: string, state: string): Observable<any> {
    const url = `/auth/customer/google/callback?code=${code}&state=${state}`;
    return this.post(url, {}, this.getHttpOptions());
  }

  medusaAuthenticate() {
    return this.post('/store/customers', {}, this.getHttpOptions());
  }

  medusaExists(email: string) {
    return this.get(`/store/auth/${email}`, this.getHttpOptions());
  }

  loginEmailPassword(email: string, password?: string) {
    const loginReq: ICustomerLoginData = {
      email: email,
      password,
    };
    const url = `/auth/customer/emailpass`;
    return this.post(url, loginReq, this.getHttpOptions());
  }

  createMedusaCustomer(payloadRegister: RegisterPayload) {
    return this.post('/store/customers', payloadRegister, this.getHttpOptions());
  }



  getMedusaCustomer() {
    const url = `/store/customers/me`
    return this.get<any>(url, this.getHttpOptions());
  }

  getMedusaSession(): Observable<any> {
    const url = `/auth/session`
    return this.post<any>(url, {}, this.getHttpOptions());
  }

  getMedusaToken(email: string, password: string): Observable<any> {
    const url = `/store/auth/token`;
    return this.post<any>(url, {
      "email": email,
      "password": password,
    }, this.getHttpOptions());
  }

  refreshMedusaToken(): Observable<any> {
    const url = `/auth/token/refresh`;
    return this.post<any>(url, {}, this.getHttpOptions());
  }

  getTokenGetLoggedinCustomer(email: string, password: string) {
    const url = `/store/customers/me`;
    return this.post(url, { "email": email, "password": password }, this.getHttpOptions());
  }

  shippingOptions(cartId: string) {
    return this.get(`/store/shipping-options/${cartId}`, this.getHttpOptions());
  }

  addShippingMethod(cartId: string, option_id: string): Observable<MedusaCartResponse> {
    const data = {
      option_id: option_id
    }
    return this.post<MedusaCartResponse>(`/store/carts/${cartId}/shipping-methods`, data, this.getHttpOptions());
  }

  createPaymentSessions(data: {
    cart_id: string,
    region_id: string,
    currency_code: string,
    amount: number,
  }) {
    const url = `/store/payment-collections`
    return this.post(url, data, this.getHttpOptions());
  }

  cartsRetrieve(cartId: string): Observable<MedusaCartResponse> {
    return this.get<MedusaCartResponse>(`/store/carts/${cartId}`, this.getHttpOptions());
  }

  cartsCreate(region_id: string): Observable<MedusaCartResponse> {
    const createCart = {
      region_id,
    }
    return this.post<MedusaCartResponse>(`/store/carts`, createCart, this.getHttpOptions());
  }

  AddCartLineItems(cartId: string, data: { variant_id: string, quantity: number }): Observable<MedusaCartResponse> {
    return this.post<MedusaCartResponse>(`/store/carts/${cartId}/line-items/`, data, this.getHttpOptions());
  }

  updateCartLineItems(cartId: string, lineId: string, data: any): Observable<MedusaCartResponse> {
    return this.post<MedusaCartResponse>(`/store/carts/${cartId}/line-items/${lineId}`, data, this.getHttpOptions());
  }

  cartsLineItemsDelete(cartId: string, lineId: string) {
    const url = `/store/carts/${cartId}/line-items/${lineId}`;
    return this.delete<DeleteProdRespoonse>(url, this.getHttpOptions());
  }

  cartsUpdate(cartId: string, data: any): Observable<MedusaCartResponse> {
    return this.post<MedusaCartResponse>(`/store/carts/${cartId}`, data, this.getHttpOptions());
  }

  setPaymentSession(cartId: string, provider_id: string) {
    return this.post(`/store/carts/${cartId}/payment-session`, {
      provider_id
    }, this.getHttpOptions());
  }

  refreshPaymentSession(cartId: string, provider_id: string): Observable<any> {
    return this.post(`/store/carts/${cartId}/payment-sessions/${provider_id}/refresh`, null, this.getHttpOptions());
  }

  updatePaymentSession(cartId: string, provider_id: string): Observable<any> {
    const data = {}
    return this.post(`/store/carts/${cartId}/payment-sessions/${provider_id}`, data, this.getHttpOptions());
  }

  productsRetrieve(regionId?: string) {
    const url = `/store/products`;
    return this.get<MedusaProductsResponse>(url, this.getHttpOptions());
  }

  regionsList() {
    const url = `/store/regions`;
    return this.get<MedusaRegionListResponse>(url, this.getHttpOptions());
  }

  regionsRetrieve(regionId: string) {
    const url = `/store/regions/${regionId}`;
    return this.get(url, this.getHttpOptions());
  }

  getShippingOptions() {
    const url = `/store/shipping-options`;
    return this.get(url, this.getHttpOptions());
  }

  ListOptionsForCart(cartId: string) {
    return this.get<IShippingOptionsResponse>(`/store/shipping-options?cart_id=${cartId}`, this.getHttpOptions());
  }

  addAddress(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-publishable-api-key': environment.MEDUSA_PUBLISHABLE_KEY,
      }),
    };
    const data = {
      first_name: payload?.first_name,
      last_name: payload?.last_name,
      address_1: payload?.address_1,
      address_2: payload?.address_2,
      city: payload?.city,
      country_code: payload?.country_code,
      postal_code: payload?.postal_code,
      phone: payload?.phone,
    }
    const url = `/store/customers/me/addresses`;
    return this.post(url, data, httpOptions);
  }

  updateAddress(addressId: string, address: any) {
    const url = `/store/customers/me/addresses/${addressId}`;
    return this.post(url, address, this.getHttpOptions());
  }

  deleteAddress(addressId: string) {
    const url = `/store/customers/me/addresses/${addressId}`;
    return this.delete(url, this.getHttpOptions());
  }

  getCategories() {
    const url = `/store/product-categories`;
    return this.get<MedusaProductsCategoriesResponse>(url, this.getHttpOptions());
  }

  AddPromotionstoCart(cartId: string, promo_code: string) {
    const promo_codes = {
      promo_codes: [
        promo_code
      ]
    };
    const url = `/store/carts/${cartId}/promotions`;
    return this.post<any>(url, promo_codes, this.getHttpOptions());
  }

  RemovePromotionstoCart(cartId: string) {
    const promo_codes = {
      promo_codes: [
        "GOIABA"
      ]
    };
    const url = `/store/carts/${cartId}/promotions`;
    return this.delete<any>(url, this.getHttpOptions());
  }

  getCategory(categoryId: string) {
    const searchParams = new URLSearchParams({
      "category_id[]": categoryId,
    })
    const url = `/store/products?${searchParams.toString()}`;
    return this.get<MedusaCategory>(url, this.getHttpOptions());
  }

  getCategoryHandle(handle: string) {
    const url = `/store/product-categories?handle=${handle}`;
    return this.get<MedusaProduct[]>(url, this.getHttpOptions());
  }

  medusaProductsList(regionId: string) {
    const queryParams = new URLSearchParams({
      fields: `*variants.calculated_price`,
      region_id: regionId,
    });
    const url = `/store/products/?${queryParams.toString()}`;
    return this.get<MedusaProductsResponse>(url, this.getHttpOptions());
  }

  showProductVariantPrice(productId: string, regionId: string) {
    const queryParams = new URLSearchParams({
      fields: `*variants.calculated_price`,
      region_id: regionId,
    });

    const url = `/store/products/${productId}?${queryParams.toString()}`;
    return this.get<MedusaCategory>(url, this.getHttpOptions());
  }

  retriveCompletedOrder(orderId: string) {
    const url = `/store/orders/${orderId}`;
    return this.get<MedusaOrderResponse>(url, this.getHttpOptions());
  }

  retriveOrdersList() {
    const url = `/store/orders/`;
    return this.get<MedusaOrderResponse>(url, this.getHttpOptions());
  }

  completeMedusaCart(cartId: string) {
    const url = `/store/carts/${cartId}/complete`;
    return this.post<any>(url, null, this.getHttpOptions());
  }

  updateCustomeDetails(payload: ICustomerDetails) {
    const url = `/store/customers/me`;
    return this.post<object>(url, payload, this.getHttpOptions());
  }

  medusaLogout() {
    return this.delete('/store/auth', this.getHttpOptions());
  }

  updateDefaultAddress(addressId: string, data: any) {
    const url = `/store/customers/me/addresses/${addressId}`;
    return this.post(url, data, this.getHttpOptions());
  }

  getCutomerAddress(addressId: string) {
    const url = `/store/customers/me/addresses/${addressId}`;
    return this.get(url, this.getHttpOptions());
  }

  // Returns API methods
  createReturn(returnData: CreateReturnRequest) {
    const url = `/store/returns`;
    return this.post<ReturnResponse>(url, returnData, this.getHttpOptions());
  }

  getReturn(returnId: string) {
    const url = `/store/returns/${returnId}`;
    return this.get<ReturnResponse>(url, this.getHttpOptions());
  }

  getReturns(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const url = `/store/returns${params.toString() ? `?${params.toString()}` : ''}`;
    return this.get<ReturnsListResponse>(url, this.getHttpOptions());
  }

  getReturnReasons() {
    const url = `/store/return-reasons`;
    return this.get<{ return_reasons: ReturnReason[] }>(url, this.getHttpOptions());
  }

  // Order completion methods
  completeOrder(orderId: string) {
    const url = `/admin/orders/${orderId}/complete`;
    return this.post<any>(url, {}, this.getHttpOptions());
  }

  capturePayment(paymentCollectionId: string) {
    const url = `/admin/payment-collections/${paymentCollectionId}/capture`;
    return this.post<any>(url, {}, this.getHttpOptions());
  }

  updateOrderStatus(orderId: string, status: string) {
    const url = `/admin/orders/${orderId}`;
    return this.post<any>(url, { status }, this.getHttpOptions());
  }
}

export interface product_category {
  "id": any;
  "name": any;
  "handle": any;
  "mpath": any;
  "is_internal": any;
  "is_active": any;
  "category_children": any;
  "parent_category_id": any;
  "created_at": any;
  "updated_at": any;
  "metadata": any
}
