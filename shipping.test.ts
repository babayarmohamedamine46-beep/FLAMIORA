import { describe, it, expect } from 'vitest';
import {
  calculateShippingFee,
  calculateTotal,
  calculateShippingFeeWithSettings,
  calculateTotalWithSettings,
  MARRAKECH_SHIPPING_PRICE,
  DEFAULT_MOROCCO_SHIPPING_PRICE,
} from '@/config/shipping';

describe('shipping — static config (section 37 required test)', () => {
  it('charges 20 MAD for Marrakech', () => {
    expect(calculateShippingFee('marrakech')).toBe(20);
    expect(MARRAKECH_SHIPPING_PRICE).toBe(20);
  });

  it('charges 35 MAD for any other configured city', () => {
    expect(calculateShippingFee('casablanca')).toBe(35);
    expect(calculateShippingFee('fes')).toBe(35);
    expect(DEFAULT_MOROCCO_SHIPPING_PRICE).toBe(35);
  });

  it('charges 0 when no city is selected', () => {
    expect(calculateShippingFee(null)).toBe(0);
  });

  it('computes subtotal + shipping = total correctly', () => {
    const result = calculateTotal(200, 'marrakech');
    expect(result).toEqual({ subtotal: 200, shipping_fee: 20, total: 220 });

    const result2 = calculateTotal(200, 'casablanca');
    expect(result2).toEqual({ subtotal: 200, shipping_fee: 35, total: 235 });
  });
});

describe('shipping — dashboard-overridden settings', () => {
  const settings = { marrakech_city_id: 'marrakech', marrakech_price: 20, default_price: 35 };

  it('matches the static config by default', () => {
    expect(calculateShippingFeeWithSettings('marrakech', settings)).toBe(20);
    expect(calculateShippingFeeWithSettings('rabat', settings)).toBe(35);
  });

  it('reflects an admin-edited price immediately', () => {
    const edited = { ...settings, marrakech_price: 15, default_price: 40 };
    expect(calculateShippingFeeWithSettings('marrakech', edited)).toBe(15);
    expect(calculateShippingFeeWithSettings('rabat', edited)).toBe(40);
  });

  it('computes total with overridden settings', () => {
    const result = calculateTotalWithSettings(100, 'marrakech', settings);
    expect(result.total).toBe(120);
  });
});

