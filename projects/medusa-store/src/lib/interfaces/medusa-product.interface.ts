export interface MedusaProduct {
  id: string;
  title?: string;
  subtitle?: null;
  status?: string;
  external_id?: null;
  description?: string;
  handle?: string;
  is_giftcard?: boolean;
  discountable?: boolean;
  thumbnail?: any;
  collection_id?: null;
  type_id?: null;
  weight: number;
  length?: null;
  height?: null;
  width?: null;
  hs_code?: null;
  origin_country?: null;
  mid_code?: any;
  material?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  metadata?: any;
  profile_id?: string;
  collection?: any;
  images?: (ProductImagesEntity)[] | any;
  options?: (ProductOptionsEntity)[] | any;
  profiles?: (ProductProfilesEntity)[] | any;
  tags?: (any)[];
  type?: any;
  variants?: (ProductVariantsEntity)[] | any;
}

export interface MedusaProductsResponse {
  count: number,
  limit: number,
  offset: number,
  products: MedusaProduct[],
}

export interface ProductImagesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  url: string;
  metadata?: null;
}

export interface ProductOptionsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  title: string;
  product_id: string;
  metadata?: null;
  values?: (ProductValuesEntity)[] | null;
}

export interface ProductValuesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  value: string;
  option_id: string;
  variant_id: string;
  metadata?: null;
}

export interface ProductProfilesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  name: string;
  type: string;
  metadata?: null;
}

export interface ProductVariantsEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  title: string;
  product_id: string;
  sku?: null;
  barcode?: null;
  ean?: null;
  upc?: null;
  variant_rank: number;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code?: null;
  origin_country?: null;
  mid_code?: null;
  material?: null;
  weight?: null;
  length?: null;
  height?: null;
  width?: null;
  metadata?: null;
  options?: (ProductValuesEntity)[] | null;
  prices?: (ProductPricesEntity)[] | null;
  original_price?: null;
  calculated_price?: null;
  original_price_incl_tax?: null;
  calculated_price_incl_tax?: null;
  original_tax?: null;
  calculated_tax?: null;
  tax_rates?: null;
}

export interface ProductPricesEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  currency_code: string;
  amount: number;
  min_quantity?: null;
  max_quantity?: null;
  price_list_id?: null;
  region_id?: null;
  price_list?: null;
  variant_id: string;
}
