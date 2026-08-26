import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category } from '@/types/models';
import seedCategories from '@/data/categories.seed.json';

// SINGLE SOURCE OF TRUTH for category data: Firestore `categories`
// collection in production. categories.seed.json is ONLY a local dev
// fallback when Firebase env vars aren't configured — never imported
// directly by pages/components, always go through this service.
const COLLECTION = 'categories';

function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured()) return seedCategories as Category[];
  const q = query(collection(db, COLLECTION), where('active', '==', true), orderBy('display_order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
}

// Admin view: includes inactive categories too.
export async function getAllCategoriesAdmin(): Promise<Category[]> {
  if (!isFirebaseConfigured()) return seedCategories as Category[];
  const q = query(collection(db, COLLECTION), orderBy('display_order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getAllCategoriesAdmin();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!isFirebaseConfigured()) {
    return (seedCategories as Category[]).find((c) => c.id === id) ?? null;
  }
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Category) : null;
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

