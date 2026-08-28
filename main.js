const STORE = {
  name: 'FLAMIORA',
  whatsappNumber: '212711088984',
  phoneDisplay: '+212 711-088984',
  email: 'babayarmohamedamine4@gmail.com',
};

function formatPrice(amount) {
  const locale = getLocale();
  const value = Number(amount).toFixed(2);
  return locale === 'ar' ? `${value} د.م.` : `${value} DH`;
}

function stockBadge(product) {
  if (product.stock <= 0) return `<span class="stock-badge out">${t('product.outOfStock')}</span>`;
  if (product.stock <= 5) return `<span class="stock-badge low">${t('product.lowStock')}</span>`;
  return `<span class="stock-badge ok">${t('product.inStock')}</span>`;
}

const CART_KEY = 'flm_cart';

function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter((line) => line && typeof line.id === 'string' && Number.isFinite(line.qty) && line.qty > 0 && getProductById(line.id));
  } catch {
    return [];
  }
}

function saveCart(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product || product.stock <= 0) return;
  const lines = getCart();
  const existing = lines.find((l) => l.id === productId);
  const maxQty = product.stock;
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, maxQty);
  } else {
    const initialQty = Math.max(1, Math.min(qty, maxQty));
    lines.push({ id: productId, qty: initialQty });
  }
  saveCart(lines);
}

function updateCartQty(productId, qty) {
  const product = getProductById(productId);
  if (!product) return;
  let lines = getCart();
  const clamped = Math.max(1, Math.min(qty, product.stock));
  lines = lines.map((l) => (l.id === productId ? { ...l, qty: clamped } : l));
  saveCart(lines);
}

function removeFromCart(productId) {
  const lines = getCart().filter((l) => l.id !== productId);
  saveCart(lines);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, l) => {
    const product = getProductById(l.id);
    return product ? sum + product.price * l.qty : sum;
  }, 0);
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function genericWhatsAppUrl() {
  const locale = getLocale();
  const msg = locale === 'ar'
    ? 'مرحبًا FLAMIORA، أريد الاستفسار عن أحد المنتجات.'
    : 'Bonjour FLAMIORA, je souhaite avoir des informations sur un produit.';
  return buildWhatsAppUrl(msg);
}

function buildOrderMessage({ name, phone, cityId, address, notes }) {
  const locale = getLocale();
  const city = getCityById(cityId);
  const lines = getCart();
  const shipping = city ? city.price : 0;
  const subtotal = cartSubtotal();
  const total = subtotal + shipping;

  const itemLines = lines.map((l) => {
    const p = getProductById(l.id);
    return `- ${localized(p, 'name')} x${l.qty} = ${formatPrice(p.price * l.qty)}`;
  }).join('\n');

  if (locale === 'ar') {
    return [
      `طلب جديد من موقع FLAMIORA`,
      ``,
      `الاسم: ${name}`,
      `الهاتف: ${phone}`,
      `المدينة: ${city ? localized(city, 'name') : ''}`,
      `العنوان: ${address}`,
      notes ? `ملاحظات: ${notes}` : null,
      ``,
      `المنتجات:`,
      itemLines,
      ``,
      `المجموع الفرعي: ${formatPrice(subtotal)}`,
      `التوصيل: ${formatPrice(shipping)}`,
      `المجموع الكلي: ${formatPrice(total)}`,
      `طريقة الدفع: عند الاستلام`,
    ].filter(Boolean).join('\n');
  }

  return [
    `Nouvelle commande FLAMIORA`,
    ``,
    `Nom : ${name}`,
    `Téléphone : ${phone}`,
    `Ville : ${city ? localized(city, 'name') : ''}`,
    `Adresse : ${address}`,
    notes ? `Remarques : ${notes}` : null,
    ``,
    `Produits :`,
    itemLines,
    ``,
    `Sous-total : ${formatPrice(subtotal)}`,
    `Livraison : ${formatPrice(shipping)}`,
    `Total : ${formatPrice(total)}`,
    `Paiement : à la livraison`,
  ].filter(Boolean).join('\n');
}

function wireSharedChrome() {
  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.addEventListener('click', () => setLocale(btn.dataset.lang));
  });

  const toggle = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    const open = () => drawer.classList.add('open');
    const close = () => drawer.classList.remove('open');
    toggle.addEventListener('click', open);
    drawer.querySelector('.backdrop')?.addEventListener('click', close);
    drawer.querySelector('.close-btn')?.addEventListener('click', close);
  }

  document.querySelectorAll('.js-whatsapp-generic').forEach((el) => {
    el.setAttribute('href', genericWhatsAppUrl());
  });

  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', () => {
  applyLocale();
  wireSharedChrome();
});
