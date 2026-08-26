import { describe, it, expect } from 'vitest';
import { searchProducts, getAllProducts } from '@/services/products';

// isFirebaseConfigured() returns false when VITE_FIREBASE_PROJECT_ID is
// unset, which is the case in this test environment — so these run
// against products.seed.json, exercising the same search logic that
// runs against Firestore results in production (search filters the
// already-fetched array either way).
describe('searchProducts — Arabic/French, section 19 required checks', () => {
  it('finds a product by its Arabic name', async () => {
    const results = await searchProducts('خاتم');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.name_ar.includes('خاتم'))).toBe(true);
  });

  it('finds a product by its French name', async () => {
    const results = await searchProducts('Collier');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.name_fr.includes('Collier'))).toBe(true);
  });

  it('is case-insensitive for French/Latin terms', async () => {
    const results = await searchProducts('collier');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns an empty array for a term matching nothing', async () => {
    const results = await searchProducts('xyznonexistent123');
    expect(results).toHaveLength(0);
  });

  it('returns an empty array for an empty/blank term instead of the whole catalog', async () => {
    const results = await searchProducts('   ');
    expect(results).toHaveLength(0);
  });

  it('finds a product by SKU', async () => {
    const all = await getAllProducts();
    const target = all[0];
    const results = await searchProducts(target.sku);
    expect(results.some((p) => p.id === target.id)).toBe(true);
  });
});

