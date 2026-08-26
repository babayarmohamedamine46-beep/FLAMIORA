import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Banner } from '@/types/models';

const COLLECTION = 'banners';
const LOCAL_BANNERS: Banner[] = [{ id: 'local-hero', image: '/images/hero-jewelry.jpg', title_ar: 'أناقة خالدة', title_fr: 'L’élégance intemporelle', description_ar: 'مجوهرات مختارة بعناية من FLAMIORA', description_fr: 'Une sélection précieuse signée FLAMIORA', cta_ar: 'اكتشفي المجموعة', cta_fr: 'Découvrir la collection', url: '/products', active: true, display_order: 0 }];
function isFirebaseConfigured() { return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID); }

export async function getActiveBanners(): Promise<Banner[]> {
  if (!isFirebaseConfigured()) return LOCAL_BANNERS;
  const q = query(collection(db, COLLECTION), where('active', '==', true), orderBy('display_order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Banner);
}

export async function getAllBannersAdmin(): Promise<Banner[]> {
  const q = query(collection(db, COLLECTION), orderBy('display_order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Banner);
}

export async function createBanner(data: Omit<Banner, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

