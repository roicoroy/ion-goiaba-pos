import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedusaService } from './medusa.service';
import { MedusaApiService, IShippingOptionsResponse } from 'projects/medusa-store/src/public-api';

/**
 * Concrete implementation of MedusaApiService that delegates to the existing MedusaService
 */
@Injectable({
  providedIn: 'root'
})
export class ConcreteMedusaService extends MedusaApiService {

  constructor(private medusaService: MedusaService) {
    super();
  }

  // Delegate all methods to the existing MedusaService
  medusaLoginWithGoogle() {
    return this.medusaService.medusaLoginWithGoogle();
  }

  validateGoogleLoginCallback(code: string, state: string) {
    return this.medusaService.validateGoogleLoginCallback(code, state);
  }

  medusaAuthenticate() {
    return this.medusaService.medusaAuthenticate();
  }

  medusaExists(email: string) {
    return this.medusaService.medusaExists(email);
  }

  loginEmailPassword(email: string, password?: string) {
    return this.medusaService.loginEmailPassword(email, password);
  }

  createMedusaCustomer(payloadRegister: any) {
    return this.medusaService.createMedusaCustomer(payloadRegister);
  }

  getMedusaCustomer() {
    return this.medusaService.getMedusaCustomer();
  }

  getMedusaSession() {
    return this.medusaService.getMedusaSession();
  }

  getMedusaToken(email: string, password: string) {
    return this.medusaService.getMedusaToken(email, password);
  }

  refreshMedusaToken() {
    return this.medusaService.refreshMedusaToken();
  }

  medusaLogout() {
    return this.medusaService.medusaLogout();
  }

  addAddress(payload: any) {
    return this.medusaService.addAddress(payload);
  }

  updateAddress(addressId: string, address: any) {
    return this.medusaService.updateAddress(addressId, address);
  }

  deleteAddress(addressId: string) {
    return this.medusaService.deleteAddress(addressId);
  }

  updateDefaultAddress(addressId: string, data: any) {
    return this.medusaService.updateDefaultAddress(addressId, data);
  }

  getCutomerAddress(addressId: string) {
    return this.medusaService.getCutomerAddress(addressId);
  }

  updateCustomeDetails(payload: any) {
    return this.medusaService.updateCustomeDetails(payload);
  }

  cartsRetrieve(cartId: string) {
    return this.medusaService.cartsRetrieve(cartId);
  }

  cartsCreate(region_id: string) {
    return this.medusaService.cartsCreate(region_id);
  }

  AddCartLineItems(cartId: string, data: { variant_id: string, quantity: number }) {
    return this.medusaService.AddCartLineItems(cartId, data);
  }

  updateCartLineItems(cartId: string, lineId: string, data: any) {
    return this.medusaService.updateCartLineItems(cartId, lineId, data);
  }

  cartsLineItemsDelete(cartId: string, lineId: string) {
    return this.medusaService.cartsLineItemsDelete(cartId, lineId);
  }

  cartsUpdate(cartId: string, data: any) {
    return this.medusaService.cartsUpdate(cartId, data);
  }

  completeMedusaCart(cartId: string) {
    return this.medusaService.completeMedusaCart(cartId);
  }

  productsRetrieve(regionId?: string) {
    return this.medusaService.productsRetrieve(regionId);
  }

  medusaProductsList(regionId: string) {
    return this.medusaService.medusaProductsList(regionId);
  }

  showProductVariantPrice(productId: string, regionId: string) {
    return this.medusaService.showProductVariantPrice(productId, regionId);
  }

  getCategories() {
    return this.medusaService.getCategories();
  }

  getCategory(categoryId: string) {
    return this.medusaService.getCategory(categoryId);
  }

  getCategoryHandle(handle: string) {
    return this.medusaService.getCategoryHandle(handle);
  }

  regionsList() {
    return this.medusaService.regionsList();
  }

  regionsRetrieve(regionId: string) {
    return this.medusaService.regionsRetrieve(regionId);
  }

  getShippingOptions() {
    return this.medusaService.getShippingOptions();
  }

  ListOptionsForCart(cartId: string): Observable<IShippingOptionsResponse> {
    return this.medusaService.ListOptionsForCart(cartId).pipe(
      map((response: any) => {
        // Map from main app's IShippingOptions format to library's expected format
        const mappedOptions = response.shipping_options.map((option: any) => ({
          id: option.id,
          name: option.name,
          region_id: option.service_zone?.fulfillment_set_id || '',
          profile_id: option.shipping_profile_id || '',
          provider_id: option.provider_id,
          price_type: option.price_type,
          amount: option.calculated_price || 0,
          is_return: false,
          admin_only: false,
          data: option.data || {},
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        return {
          shipping_options: mappedOptions
        };
      })
    );
  }

  addShippingMethod(cartId: string, option_id: string) {
    return this.medusaService.addShippingMethod(cartId, option_id);
  }

  createPaymentSessions(data: any) {
    return this.medusaService.createPaymentSessions(data);
  }

  setPaymentSession(cartId: string, provider_id: string) {
    return this.medusaService.setPaymentSession(cartId, provider_id);
  }

  refreshPaymentSession(cartId: string, provider_id: string) {
    return this.medusaService.refreshPaymentSession(cartId, provider_id);
  }

  updatePaymentSession(cartId: string, provider_id: string) {
    return this.medusaService.updatePaymentSession(cartId, provider_id);
  }

  AddPromotionstoCart(cartId: string, promo_code: string) {
    return this.medusaService.AddPromotionstoCart(cartId, promo_code);
  }

  RemovePromotionstoCart(cartId: string) {
    return this.medusaService.RemovePromotionstoCart(cartId);
  }

  retriveCompletedOrder(orderId: string) {
    return this.medusaService.retriveCompletedOrder(orderId);
  }

  retriveOrdersList() {
    return this.medusaService.retriveOrdersList();
  }

  completeOrder(orderId: string) {
    return this.medusaService.completeOrder(orderId);
  }

  capturePayment(paymentCollectionId: string) {
    return this.medusaService.capturePayment(paymentCollectionId);
  }

  updateOrderStatus(orderId: string, status: string) {
    return this.medusaService.updateOrderStatus(orderId, status);
  }

  createReturn(returnData: any) {
    return this.medusaService.createReturn(returnData);
  }

  getReturn(returnId: string) {
    return this.medusaService.getReturn(returnId);
  }

  getReturns(limit?: number, offset?: number) {
    return this.medusaService.getReturns(limit, offset);
  }

  getReturnReasons() {
    return this.medusaService.getReturnReasons();
  }
}
