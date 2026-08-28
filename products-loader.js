const SEED_CATEGORIES = [
  { id: 'earrings', slug: 'earrings', name_ar: 'الأقراط', name_fr: "Boucles d'oreilles", image: 'images/products/category-earrings.svg', active: true, display_order: 1 },
  { id: 'necklaces', slug: 'necklaces', name_ar: 'السلاسل', name_fr: 'Colliers', image: 'images/products/category-necklaces.svg', active: true, display_order: 2 },
  { id: 'rings', slug: 'rings', name_ar: 'الخواتم', name_fr: 'Bagues', image: 'images/products/category-rings.svg', active: true, display_order: 3 },
  { id: 'bracelets', slug: 'bracelets', name_ar: 'الأساور', name_fr: 'Bracelets', image: 'images/products/category-bracelets.svg', active: true, display_order: 4 },
];

const SEED_PRODUCTS = [
  { id: 'prod_001', slug: 'bague-rose-de-luxe', category_id: 'rings', name_ar: 'خاتم زهري فاخر', name_fr: 'Bague Rose de Luxe', short_ar: 'خاتم فاخر بحجر لامع', short_fr: 'Bague luxueuse à pierre étincelante', desc_ar: 'خاتم أنيق مرصع بحجر مركزي لامع، مثالي للمناسبات الخاصة.', desc_fr: "Bague élégante ornée d'une pierre centrale étincelante, parfaite pour les occasions spéciales.", price: 2299, compare_at: null, stock: 15, featured: true, active: true, display_order: 1, image: 'images/products/bague-rose-de-luxe.svg' },
  { id: 'prod_002', slug: 'collier-elegant', category_id: 'necklaces', name_ar: 'سلسلة أنيقة', name_fr: 'Collier Élégant', short_ar: 'سلسلة ذهبية أنيقة', short_fr: 'Collier doré élégant', desc_ar: 'سلسلة ذهبية ناعمة بتصميم بسيط وأنيق يناسب الإطلالة اليومية والمناسبات.', desc_fr: 'Collier doré au design sobre et élégant, adapté au quotidien comme aux occasions.', price: 1999, compare_at: null, stock: 20, featured: true, active: true, display_order: 2, image: 'images/products/collier-elegant.svg' },
  { id: 'prod_003', slug: 'boucles-doreilles-perle', category_id: 'earrings', name_ar: 'أقراط لؤلؤ', name_fr: "Boucles d'Oreilles Perle", short_ar: 'أقراط لؤلؤ راقية', short_fr: "Boucles d'oreilles perlées raffinées", desc_ar: 'أقراط مرصعة بلآلئ ناعمة تضفي لمسة رقيقة وفاخرة.', desc_fr: "Boucles d'oreilles ornées de perles douces apportant une touche raffinée.", price: 2499, compare_at: null, stock: 10, featured: true, active: true, display_order: 3, image: 'images/products/boucles-doreilles-perle.svg' },
  { id: 'prod_004', slug: 'bague-classique', category_id: 'rings', name_ar: 'خاتم كلاسيكي', name_fr: 'Bague Classique', short_ar: 'خاتم بتصميم كلاسيكي', short_fr: 'Bague au design classique', desc_ar: 'خاتم بتصميم كلاسيكي أنيق يناسب جميع الإطلالات.', desc_fr: 'Bague au design classique et intemporel, adaptée à toutes les tenues.', price: 1799, compare_at: 2099, stock: 12, featured: false, active: true, display_order: 4, image: 'images/products/bague-classique.svg' },
  { id: 'prod_005', slug: 'bague-royale', category_id: 'rings', name_ar: 'خاتم ملكي', name_fr: 'Bague Royale', short_ar: 'خاتم فخم بتصميم ملكي', short_fr: 'Bague luxueuse au design royal', desc_ar: 'خاتم فخم مستوحى من التصاميم الملكية، بحجر مركزي بارز.', desc_fr: "Bague luxueuse inspirée des créations royales, avec une pierre centrale imposante.", price: 2899, compare_at: null, stock: 6, featured: true, active: true, display_order: 5, image: 'images/products/bague-royale.svg' },
  { id: 'prod_006', slug: 'boucles-zircon', category_id: 'earrings', name_ar: 'أقراط زركون', name_fr: 'Boucles Zircon', short_ar: 'أقراط بأحجار زركون لامعة', short_fr: 'Boucles ornées de zircons scintillants', desc_ar: 'أقراط أنيقة مرصعة بأحجار زركون لامعة تمنحك إطلالة متألقة.', desc_fr: 'Boucles élégantes serties de zircons scintillants pour un éclat remarquable.', price: 1599, compare_at: null, stock: 18, featured: false, active: true, display_order: 6, image: 'images/products/boucles-zircon.svg' },
  { id: 'prod_007', slug: 'bracelet-infinity', category_id: 'bracelets', name_ar: 'سوار إنفينيتي', name_fr: 'Bracelet Infinity', short_ar: 'سوار برمز اللانهاية', short_fr: "Bracelet symbole de l'infini", desc_ar: 'سوار أنيق برمز اللانهاية، هدية مثالية تعبر عن الحب الأبدي.', desc_fr: "Bracelet élégant orné du symbole infini, cadeau parfait symbolisant un amour éternel.", price: 1399, compare_at: null, stock: 3, featured: false, active: true, display_order: 7, image: 'images/products/bracelet-infinity.svg' },
  { id: 'prod_008', slug: 'collier-coeur', category_id: 'necklaces', name_ar: 'سلسلة قلب', name_fr: 'Collier Cœur', short_ar: 'سلسلة بدلاية قلب', short_fr: 'Collier avec pendentif cœur', desc_ar: 'سلسلة رقيقة بدلاية على شكل قلب، رمز للحب والعاطفة.', desc_fr: "Collier délicat avec pendentif en forme de cœur, symbole d'amour.", price: 1699, compare_at: null, stock: 0, featured: false, active: true, display_order: 8, image: 'images/products/collier-coeur.svg' },
];

const SEED_CITIES = [
  { id: 'marrakech', name_ar: 'مراكش', name_fr: 'Marrakech', price: 20 },
  { id: 'casablanca', name_ar: 'الدار البيضاء', name_fr: 'Casablanca', price: 35 },
  { id: 'rabat', name_ar: 'الرباط', name_fr: 'Rabat', price: 35 },
  { id: 'fes', name_ar: 'فاس', name_fr: 'Fès', price: 35 },
  { id: 'tangier', name_ar: 'طنجة', name_fr: 'Tanger', price: 35 },
  { id: 'agadir', name_ar: 'أكادير', name_fr: 'Agadir', price: 35 },
  { id: 'meknes', name_ar: 'مكناس', name_fr: 'Meknès', price: 35 },
  { id: 'oujda', name_ar: 'وجدة', name_fr: 'Oujda', price: 35 },
  { id: 'kenitra', name_ar: 'القنيطرة', name_fr: 'Kénitra', price: 35 },
  { id: 'tetouan', name_ar: 'تطوان', name_fr: 'Tétouan', price: 35 },
  { id: 'safi', name_ar: 'آسفي', name_fr: 'Safi', price: 35 },
  { id: 'el-jadida', name_ar: 'الجديدة', name_fr: 'El Jadida', price: 35 },
  { id: 'essaouira', name_ar: 'الصويرة', name_fr: 'Essaouira', price: 35 },
  { id: 'beni-mellal', name_ar: 'بني ملال', name_fr: 'Béni Mellal', price: 35 },
  { id: 'ouarzazate', name_ar: 'ورزازات', name_fr: 'Ouarzazate', price: 35 },
  { id: 'nador', name_ar: 'الناظور', name_fr: 'Nador', price: 35 },
  { id: 'autre', name_ar: 'مدينة أخرى', name_fr: 'Autre ville', price: 35 },
];

window.PRODUCTS = SEED_PRODUCTS.slice();
window.CATEGORIES = SEED_CATEGORIES.slice();
window.CITIES = SEED_CITIES.slice();

window.FLM_DATA_READY = (async function loadStoreData() {
  try {
    const catSnap = await db.collection('categories').where('active', '==', true).orderBy('display_order').get();
    if (!catSnap.empty) {
      window.CATEGORIES = catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {}

  try {
    const prodSnap = await db.collection('products').where('active', '==', true).orderBy('display_order').get();
    if (!prodSnap.empty) {
      window.PRODUCTS = prodSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {}

  return { products: window.PRODUCTS, categories: window.CATEGORIES };
})();

function getProductById(id) {
  return window.PRODUCTS.find((p) => p.id === id);
}

function getProductBySlug(slug) {
  return window.PRODUCTS.find((p) => p.slug === slug);
}

function getCategoryById(id) {
  return window.CATEGORIES.find((c) => c.id === id);
}

function getCityById(id) {
  return window.CITIES.find((c) => c.id === id);
}
