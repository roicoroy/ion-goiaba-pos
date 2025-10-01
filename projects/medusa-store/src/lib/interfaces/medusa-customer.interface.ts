import { MedusaAddress } from "./medusa-address.interface";

export interface MedusaCustomer {
  customer: any;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  email: string;
  first_name: string;
  last_name: string;
  billing_address_id?: null;
  phone?: null;
  has_account: boolean;
  metadata?: null;
  company_name?:string;
  orders: (CustomerOrdersEntity)[];
  shipping_addresses?: (MedusaAddress)[];
  addresses?: (MedusaAddress)[];
}

export interface CustomerOrdersEntity {
  object: string;
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  cart_id: string;
  customer_id: string;
  email: string;
  billing_address_id: string;
  shipping_address_id: string;
  region_id: string;
  currency_code: string;
  tax_rate?: null;
  draft_order_id?: null;
  canceled_at?: null;
  metadata: CustomerMetadata;
  no_notification?: null;
  idempotency_key?: null;
  external_id?: null;
  sales_channel_id: string;
  items?: (CustomerItemsEntity)[] | null;
}

export interface CustomerMetadata {
}

export interface CustomerItemsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  cart_id: string;
  order_id: string;
  swap_id?: null;
  claim_order_id?: null;
  original_item_id?: null;
  order_edit_id?: null;
  title: string;
  description: string;
  thumbnail: string;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id: string;
  quantity: number;
  fulfilled_quantity?: null;
  returned_quantity?: null;
  shipped_quantity?: null;
  metadata: CustomerMetadata;
}
