export interface PaypalOrderStatusResponse {
  id: string;
  intent: string;
  status: string;
  payment_source: PaymentSource;
  purchase_units: PurchaseUnit[];
  payer: Payer;
  create_time: string;
  update_time: string;
  links: Link[];
}

export interface Payer {
  name: Name;
  email_address: string;
  payer_id: string;
  address: Address;
}

export interface PurchaseUnit {
  reference_id: string;
  amount: Amount;
  payee: Payee;
  shipping: Shipping;
  payments: Payments;
}

export interface Payments {
  captures: Capture[];
}

export interface Capture {
  id: string;
  status: string;
  amount: Amount;
  final_capture: boolean;
  seller_protection: SellerProtection;
  seller_receivable_breakdown: SellerReceivableBreakdown;
  links: Link[];
  create_time: string;
  update_time: string;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface SellerReceivableBreakdown {
  gross_amount: Amount;
  paypal_fee: Amount;
  net_amount: Amount;
}

export interface SellerProtection {
  status: string;
  dispute_categories: string[];
}

export interface Shipping {
  name: Name2;
  address: Address2;
}

export interface Address2 {
  address_line_1: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

export interface Name2 {
  full_name: string;
}

export interface Payee {
  email_address: string;
  merchant_id: string;
}

export interface Amount {
  currency_code: string;
  value: string;
}

export interface PaymentSource {
  paypal: Paypal;
}

export interface Paypal {
  email_address: string;
  account_id: string;
  name: Name;
  address: Address;
}

export interface Address {
  country_code: string;
}

export interface Name {
  given_name: string;
  surname: string;
}
