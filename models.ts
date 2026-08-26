export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_fr: string;
  description_ar?: string;
  description_fr?: string;
  image: string;
  active: boolean;
  display_order: number;
}

export interface City {
  id: string;
  name_ar: string;
  name_fr: string;
  shipping_price: number;
  active: boolean;
}

export interface OrderItem {
  product_id: string;
  slug: string;
  name_ar: string;
  name_fr: string;
  price: number; // price at time of order
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  city_id: string;
  city_name_ar: string;
  city_name_fr: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  image: string;
  title_ar: string;
  title_fr: string;
  description_ar?: string;
  description_fr?: string;
  cta_ar?: string;
  cta_fr?: string;
  url?: string;
  active: boolean;
  display_order: number;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  stars: number; // 1-5
  comment: string;
  created_at: string;
  approved: boolean;
}

export interface StoreSettings {
  store_name: string;
  whatsapp_number: string;
  instagram_url?: string;
  email?: string;
  address_ar?: string;
  address_fr?: string;
  working_hours_ar?: string;
  working_hours_fr?: string;
  logo: string;
  favicon: string;
}

export interface ShippingSettings {
  marrakech_city_id: string;
  marrakech_price: number;
  default_price: number;
}

