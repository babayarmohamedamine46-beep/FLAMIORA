export type Locale = 'ar' | 'fr';

export interface Product {
  id: string;
  slug: string;

  name_ar: string;
  name_fr: string;

  description_ar: string;
  description_fr: string;

  short_description_ar: string;
  short_description_fr: string;

  price: number;
  compare_at_price?: number | null;

  category_id: string;

  image: string;
  additional_images: string[];

  stock: number;
  sku: string;

  active: boolean;
  featured: boolean;
  display_order: number;

  keywords: string[];

  seo_title_ar?: string;
  seo_title_fr?: string;
  seo_description_ar?: string;
  seo_description_fr?: string;

  alt_ar: string;
  alt_fr: string;

  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export function getStockStatus(stock: number, lowStockThreshold = 3): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= lowStockThreshold) return 'low_stock';
  return 'in_stock';
}

export function localizedName(p: Product, locale: Locale): string {
  return locale === 'ar' ? p.name_ar : p.name_fr;
}

export function localizedDescription(p: Product, locale: Locale): string {
  return locale === 'ar' ? p.description_ar : p.description_fr;
}

