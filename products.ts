import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '@/types/product';
import seedProducts from '@/data/products.seed.json';

// SINGLE SOURCE OF TRUTH for product data: the Firestore `products`
// collection in production. `products.seed.json` is ONLY used as a local
// fallback when Firebase env vars are not configured (e.g. first-time
// local dev before you've created a Firebase project) — it must never be
// imported directly by pages/components. Always go through this service.
const COLLECTION = 'products';

function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured()) return seedProducts as Product[];
  const q = query(collection(db, COLLECTION), where('active', '==', true), orderBy('display_order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category_id === categoryId);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function searchProducts(term: string): Promise<Product[]> {
  const all = await getAllProducts();
  const t = term.trim().toLowerCase();
  if (!t) return [];
  return all.filter((p) =>
    [p.name_ar, p.name_fr, p.description_ar, p.description_fr, p.sku, ...p.keywords]
      .join(' ')
      .toLowerCase()
      .includes(t)
  );
}

export async function getSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, limit);
}

// --- Dashboard CRUD (requires authenticated admin — enforced by Firestore rules) ---

export async function createProduct(data: Omit<Product, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), data);
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updated_at: new Date().toISOString() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

