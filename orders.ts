import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from './firebase';
import type { Order, OrderStatus } from '@/types/models';

const COLLECTION = 'orders';
const functions = getFunctions(app);

export interface CreateOrderInput {
  customer_name: string;
  phone: string;
  city_id: string;
  address: string;
  notes?: string;
  items: Array<{ product_id: string; quantity: number }>;
  /**
   * Client-generated random ID, one per checkout attempt (see
   * CheckoutPage.tsx — generated once when the form mounts, not on every
   * click). Lets the server detect "Submit" pressed twice (double-click,
   * slow network + retry) and return the SAME order instead of creating a
   * duplicate. This is NOT a security/price mechanism — it's a
   * duplicate-submission guard (section 20 of the audit).
   */
  idempotency_key: string;
}

export class OrderCreationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Creates an order through the trusted `createOrder` Cloud Function
 * (functions/src/index.ts) instead of writing to Firestore directly.
 *
 * SECURITY: this function intentionally sends ONLY customer info, city,
 * and { product_id, quantity } pairs — no price, subtotal, shipping fee,
 * or total. The server recomputes all of that from authoritative
 * Firestore data and rejects/corrects any inconsistency. This replaces
 * the earlier client-writes-Firestore-directly approach, which was a
 * known price-tampering security blocker (see README "Security Status").
 *
 * NOT VERIFIED end-to-end: this has never been executed against a
 * deployed Cloud Function in this environment (no network access). The
 * server-side calculation it calls into has been executed and verified
 * in isolation — see functions/scripts/verify-order-pricing.ts.
 */
export async function createOrder(
  input: Omit<CreateOrderInput, 'idempotency_key'>,
  idempotencyKey: string
): Promise<{ orderId: string }> {
  const callable = httpsCallable<CreateOrderInput, { orderId: string }>(functions, 'createOrder');
  try {
    const result = await callable({ ...input, idempotency_key: idempotencyKey });
    return result.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const code =
      err && typeof err === 'object' && 'details' in err && (err as { details?: { code?: string } }).details?.code
        ? (err as { details: { code: string } }).details.code
        : 'UNKNOWN';
    throw new OrderCreationError(code, message);
  }
}

// --- Admin dashboard: reading/updating existing orders (unaffected by
// the price-security change above — these still go through normal
// Firestore reads/writes, protected by firestore.rules `isAdmin()`) ---

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, COLLECTION), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status, updated_at: new Date().toISOString() });
}

