export interface MedusaOrderResponse {
    order: MedusaOrder;
    type: string;
}

export interface MedusaOrder {
    id: string
    status: string
    summary: Summary
    currency_code: string
    display_id: number
    region_id: string
    email: string
    total: number
    subtotal: number
    tax_total: number
    discount_total: number
    discount_subtotal: number
    discount_tax_total: number
    original_total: number
    original_tax_total: number
    item_total: number
    item_subtotal: number
    item_tax_total: number
    original_item_total: number
    original_item_subtotal: number
    original_item_tax_total: number
    shipping_total: number
    shipping_subtotal: number
    shipping_tax_total: number
    original_shipping_tax_total: number
    original_shipping_subtotal: number
    original_shipping_total: number
    created_at: string
    updated_at: string
    version: number
    items: Item[]
    shipping_address: ShippingAddress
    billing_address: BillingAddress
    shipping_methods: any[]
    payment_collections: PaymentCollection[]
    fulfillments: any[]
    payment_status: string
    fulfillment_status: string
}

export interface Summary {
    paid_total: number
    difference_sum: number
    raw_paid_total: RawPaidTotal
    refunded_total: number
    accounting_total: number
    credit_line_total: number
    transaction_total: number
    pending_difference: number
    raw_difference_sum: RawDifferenceSum
    raw_refunded_total: RawRefundedTotal
    current_order_total: number
    original_order_total: number
    raw_accounting_total: RawAccountingTotal
    raw_credit_line_total: RawCreditLineTotal
    raw_transaction_total: RawTransactionTotal
    raw_pending_difference: RawPendingDifference
    raw_current_order_total: RawCurrentOrderTotal
    raw_original_order_total: RawOriginalOrderTotal
}

export interface RawPaidTotal {
    value: string
    precision: number
}

export interface RawDifferenceSum {
    value: string
    precision: number
}

export interface RawRefundedTotal {
    value: string
    precision: number
}

export interface RawAccountingTotal {
    value: string
    precision: number
}

export interface RawCreditLineTotal {
    value: string
    precision: number
}

export interface RawTransactionTotal {
    value: string
    precision: number
}

export interface RawPendingDifference {
    value: string
    precision: number
}

export interface RawCurrentOrderTotal {
    value: string
    precision: number
}

export interface RawOriginalOrderTotal {
    value: string
    precision: number
}

export interface Item {
    id: string
    title: string
    subtitle: string
    thumbnail: string
    variant_id: string
    product_id: string
    product_title: string
    product_description: string
    product_subtitle: any
    product_type: any
    product_type_id: any
    product_collection: any
    product_handle: string
    variant_sku: string
    variant_barcode: any
    variant_title: string
    variant_option_values: any
    requires_shipping: boolean
    is_discountable: boolean
    is_tax_inclusive: boolean
    is_custom_price: boolean
    metadata: OrderMetadata
    raw_compare_at_unit_price: any
    raw_unit_price: RawUnitPrice
    created_at: string
    updated_at: string
    deleted_at: any
    tax_lines: TaxLine[]
    adjustments: any[]
    compare_at_unit_price: any
    unit_price: number
    quantity: number
    raw_quantity: RawQuantity
    detail: Detail
    subtotal: number
    total: number
    original_total: number
    discount_total: number
    discount_subtotal: number
    discount_tax_total: number
    tax_total: number
    original_tax_total: number
    refundable_total_per_unit: number
    refundable_total: number
    fulfilled_total: number
    shipped_total: number
    return_requested_total: number
    return_received_total: number
    return_dismissed_total: number
    write_off_total: number
}

export interface OrderMetadata {}

export interface RawUnitPrice {
    value: string
    precision: number
}

export interface TaxLine {
    id: string
    description: string
    tax_rate_id: string
    code: string
    provider_id: string
    item_id: string
    raw_rate: RawRate
    created_at: string
    updated_at: string
    deleted_at: any
    rate: number
    total: number
    subtotal: number
    raw_total: RawTotal
    raw_subtotal: RawSubtotal
}

export interface RawRate {
    value: string
    precision: number
}

export interface RawTotal {
    value: string
    precision: number
}

export interface RawSubtotal {
    value: string
    precision: number
}

export interface RawQuantity {
    value: string
    precision: number
}

export interface Detail {
    id: string
    version: number
    metadata: any
    order_id: string
    raw_unit_price: any
    raw_compare_at_unit_price: any
    raw_quantity: RawQuantity2
    raw_fulfilled_quantity: RawFulfilledQuantity
    raw_delivered_quantity: RawDeliveredQuantity
    raw_shipped_quantity: RawShippedQuantity
    raw_return_requested_quantity: RawReturnRequestedQuantity
    raw_return_received_quantity: RawReturnReceivedQuantity
    raw_return_dismissed_quantity: RawReturnDismissedQuantity
    raw_written_off_quantity: RawWrittenOffQuantity
    created_at: string
    updated_at: string
    deleted_at: any
    item_id: string
    unit_price: any
    compare_at_unit_price: any
    quantity: number
    fulfilled_quantity: number
    delivered_quantity: number
    shipped_quantity: number
    return_requested_quantity: number
    return_received_quantity: number
    return_dismissed_quantity: number
    written_off_quantity: number
}

export interface RawQuantity2 {
    value: string
    precision: number
}

export interface RawFulfilledQuantity {
    value: string
    precision: number
}

export interface RawDeliveredQuantity {
    value: string
    precision: number
}

export interface RawShippedQuantity {
    value: string
    precision: number
}

export interface RawReturnRequestedQuantity {
    value: string
    precision: number
}

export interface RawReturnReceivedQuantity {
    value: string
    precision: number
}

export interface RawReturnDismissedQuantity {
    value: string
    precision: number
}

export interface RawWrittenOffQuantity {
    value: string
    precision: number
}

export interface ShippingAddress {
    id: string
    customer_id: any
    company: any
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    country_code: string
    province: any
    postal_code: string
    phone: string
    metadata: any
    created_at: string
    updated_at: string
    deleted_at: any
}

export interface BillingAddress {
    id: string
    customer_id: any
    company: any
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    country_code: string
    province: any
    postal_code: string
    phone: string
    metadata: any
    created_at: string
    updated_at: string
    deleted_at: any
}

export interface PaymentCollection {
    id: string
    currency_code: string
    completed_at: any
    status: string
    metadata: any
    raw_amount: RawAmount
    raw_authorized_amount: RawAuthorizedAmount
    raw_captured_amount: RawCapturedAmount
    raw_refunded_amount: RawRefundedAmount
    created_at: string
    updated_at: string
    deleted_at: any
    amount: number
    authorized_amount: number
    captured_amount: number
    refunded_amount: number
}

export interface RawAmount {
    value: string
    precision: number
}

export interface RawAuthorizedAmount {
    value: string
    precision: number
}

export interface RawCapturedAmount {
    value: string
    precision: number
}

export interface RawRefundedAmount {
    value: string
    precision: number
}
