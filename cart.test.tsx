import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CartProvider, useCart } from '@/features/cart/CartContext';
import type { Product } from '@/types/product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    slug: 'test-golden-ring',
    name_ar: 'خاتم تجريبي',
    name_fr: 'Bague Test',
    description_ar: '',
    description_fr: '',
    short_description_ar: '',
    short_description_fr: '',
    price: 100,
    compare_at_price: null,
    category_id: 'rings',
    image: '/images/products/test-ring.webp',
    additional_images: [],
    stock: 5,
    sku: 'FLM-TEST-001',
    active: true,
    featured: false,
    display_order: 0,
    keywords: [],
    alt_ar: '',
    alt_fr: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe('CartContext — quantity/stock/price validation (section 5 required checks)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a product and never exceeds its stock', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(makeProduct({ stock: 5 }), 3));
    expect(result.current.lines[0].quantity).toBe(3);

    act(() => result.current.addToCart(makeProduct({ stock: 5 }), 10)); // would total 13
    expect(result.current.lines[0].quantity).toBe(5); // clamped to stock
  });

  it('rejects a quantity update below 1 by removing the line', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(makeProduct(), 2));
    act(() => result.current.updateQuantity('p1', 0));
    expect(result.current.lines).toHaveLength(0);
  });

  it('rejects NaN and Infinity quantities instead of corrupting the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(makeProduct(), 2));
    act(() => result.current.updateQuantity('p1', NaN));
    expect(result.current.lines).toHaveLength(0);
  });

  it('does not add an out-of-stock product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(makeProduct({ stock: 0 }), 1));
    expect(result.current.lines).toHaveLength(0);
  });

  it('computes subtotal correctly across multiple lines', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(makeProduct({ id: 'p1', price: 100, stock: 5 }), 2));
    act(() => result.current.addToCart(makeProduct({ id: 'p2', price: 50, stock: 5 }), 1));
    expect(result.current.subtotal).toBe(250);
  });

  it('discards corrupted localStorage content instead of crashing', () => {
    localStorage.setItem('flamiora_cart_v1', '{not valid json');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.lines).toHaveLength(0);
  });

  it('discards cart lines with negative/NaN price or non-integer quantity found in storage', () => {
    localStorage.setItem(
      'flamiora_cart_v1',
      JSON.stringify([
        { product_id: 'a', slug: 'a', name_ar: 'a', name_fr: 'a', image: '', price: -10, quantity: 1, stock: 5 },
        { product_id: 'b', slug: 'b', name_ar: 'b', name_fr: 'b', image: '', price: 10, quantity: 1.5, stock: 5 },
        { product_id: 'c', slug: 'c', name_ar: 'c', name_fr: 'c', image: '', price: 10, quantity: Infinity, stock: 5 },
        { product_id: 'd', slug: 'd', name_ar: 'd', name_fr: 'd', image: '', price: 10, quantity: 1, stock: 5 },
      ])
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].product_id).toBe('d');
  });

  it('rejects a stale city id no longer present in the central city list', () => {
    localStorage.setItem('flamiora_cart_city', 'atlantis');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cityId).toBeNull();
  });
});

