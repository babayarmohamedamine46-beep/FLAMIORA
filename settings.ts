import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { StoreSettings, ShippingSettings } from '@/types/models';
import { STORE_CONFIG } from '@/config/store';
import { MARRAKECH_SHIPPING_PRICE, DEFAULT_MOROCCO_SHIPPING_PRICE } from '@/config/shipping';

// All settings live as single documents in the `settings` collection:
// settings/store, settings/seo, settings/shipping.
// This keeps ONE source of truth per concern instead of scattering
// values across components. Defaults below are only a fallback for local
// dev / first run before the admin has saved anything from the dashboard.

function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
}

export interface SeoSettings {
  site_title: string;
  meta_description: string;
  og_image?: string;
  homepage_seo_title_ar?: string;
  homepage_seo_title_fr?: string;
  homepage_seo_description_ar?: string;
  homepage_seo_description_fr?: string;
}

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  store_name: STORE_CONFIG.name,
  whatsapp_number: STORE_CONFIG.whatsappNumber,
  instagram_url: '',
  email: STORE_CONFIG.email,
  address_ar: '',
  address_fr: '',
  working_hours_ar: '',
  working_hours_fr: '',
  logo: '/images/logo-flamiora.png',
  favicon: '/favicon.svg',
};

const DEFAULT_SEO_SETTINGS: SeoSettings = {
  site_title: 'FLAMIORA | مجوهرات فاخرة',
  meta_description: 'FLAMIORA — مجوهرات فاخرة تعبر عن أناقتك.',
  og_image: '/images/og-flamiora.jpg',
};

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  marrakech_city_id: 'marrakech',
  marrakech_price: MARRAKECH_SHIPPING_PRICE,
  default_price: DEFAULT_MOROCCO_SHIPPING_PRICE,
};

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!isFirebaseConfigured()) return DEFAULT_STORE_SETTINGS;
  const snap = await getDoc(doc(db, 'settings', 'store'));
  return snap.exists() ? { ...DEFAULT_STORE_SETTINGS, ...(snap.data() as StoreSettings) } : DEFAULT_STORE_SETTINGS;
}

export async function updateStoreSettings(data: Partial<StoreSettings>): Promise<void> {
  await setDoc(doc(db, 'settings', 'store'), data, { merge: true });
}

export async function getSeoSettings(): Promise<SeoSettings> {
  if (!isFirebaseConfigured()) return DEFAULT_SEO_SETTINGS;
  const snap = await getDoc(doc(db, 'settings', 'seo'));
  return snap.exists() ? { ...DEFAULT_SEO_SETTINGS, ...(snap.data() as SeoSettings) } : DEFAULT_SEO_SETTINGS;
}

export async function updateSeoSettings(data: Partial<SeoSettings>): Promise<void> {
  await setDoc(doc(db, 'settings', 'seo'), data, { merge: true });
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  if (!isFirebaseConfigured()) return DEFAULT_SHIPPING_SETTINGS;
  const snap = await getDoc(doc(db, 'settings', 'shipping'));
  return snap.exists()
    ? { ...DEFAULT_SHIPPING_SETTINGS, ...(snap.data() as ShippingSettings) }
    : DEFAULT_SHIPPING_SETTINGS;
}

export async function updateShippingSettings(data: Partial<ShippingSettings>): Promise<void> {
  await setDoc(doc(db, 'settings', 'shipping'), data, { merge: true });
}

