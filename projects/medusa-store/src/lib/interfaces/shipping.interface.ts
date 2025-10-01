export interface IShippingOptions {
  id: string;
  name: string;
  region_id: string;
  profile_id: string;
  provider_id: string;
  price_type: string;
  amount: number;
  is_return: boolean;
  admin_only: boolean;
  data: any;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface IShippingOptionsResponse {
  shipping_options: IShippingOptions[];
}

export interface IPaymentProviders {
  id: string;
  is_installed: boolean;
}
