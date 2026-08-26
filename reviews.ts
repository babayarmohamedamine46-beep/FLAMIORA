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
import type { Review } from '@/types/models';

// SINGLE SOURCE OF TRUTH for reviews: Firestore `reviews` collection.
// No seed/fallback file — an empty state here means "no reviews yet",
// which is honest; we do not fabricate testimonials.
const COLLECTION = 'reviews';

export async function getApprovedReviews(productId?: string): Promise<Review[]> {
  const clauses = [where('approved', '==', true)];
  if (productId) clauses.push(where('product_id', '==', productId));
  const q = query(collection(db, COLLECTION), ...clauses, orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

// Admin view: all reviews, pending + approved.
export async function getAllReviewsAdmin(): Promise<Review[]> {
  const q = query(collection(db, COLLECTION), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

// Public submission — always created as unapproved (see firestore.rules,
// which enforces approved === false on create so a visitor cannot
// self-publish a review).
export async function submitReview(
  data: Omit<Review, 'id' | 'approved' | 'created_at'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    approved: false,
    created_at: new Date().toISOString(),
  });
  return ref.id;
}

export async function approveReview(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { approved: true });
}

export async function rejectReview(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { approved: false });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

