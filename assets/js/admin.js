const ADMIN_EMAIL = 'babayarmohamedamine4@gmail.com';

let adminProducts = [];
let adminCategories = [];
let adminOrders = [];
let currentOrderFilter = '';

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatOrderDate(order) {
  if (order.created_at && typeof order.created_at.toDate === 'function') {
    return order.created_at.toDate().toLocaleDateString(getLocale() === 'ar' ? 'ar-MA' : 'fr-MA', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }
  return '—';
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-shell').classList.remove('active');
}

function showShell() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-shell').classList.add('active');
}

function switchView(view) {
  document.querySelectorAll('.adm-view').forEach((el) => el.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.querySelectorAll('.adm-nav-link[data-view]').forEach((el) => {
    el.classList.toggle('active', el.dataset.view === view);
  });
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function categoryOptionsHtml() {
  return adminCategories.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name_fr)}</option>`).join('');
}

function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  tbody.innerHTML = adminProducts.map((p) => {
    const category = adminCategories.find((c) => c.id === p.category_id);
    return `<tr>
      <td><img src="${escapeHtml(p.image)}" alt=""></td>
      <td>${escapeHtml(p.name_fr)}</td>
      <td>${escapeHtml(category ? category.name_fr : p.category_id)}</td>
      <td>${Number(p.price).toFixed(2)} DH</td>
      <td>${p.stock}</td>
      <td><span class="adm-badge ${p.active ? 'on' : 'off'}">${p.active ? t('admin.form.active') : ''}</span></td>
      <td class="row-actions">
        <button class="adm-btn adm-btn-outline" data-edit-product="${p.id}">${t('admin.form.edit')}</button>
        <button class="adm-btn adm-btn-danger" data-delete-product="${p.id}">${t('admin.form.delete')}</button>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('[data-edit-product]').forEach((btn) => {
    btn.addEventListener('click', () => openProductModal(btn.dataset.editProduct));
  });
  tbody.querySelectorAll('[data-delete-product]').forEach((btn) => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.deleteProduct));
  });
}

function renderCategoriesTable() {
  const tbody = document.getElementById('categories-tbody');
  tbody.innerHTML = adminCategories.map((c) => `<tr>
    <td><img src="${escapeHtml(c.image)}" alt=""></td>
    <td>${escapeHtml(c.name_fr)}</td>
    <td>${escapeHtml(String(c.display_order))}</td>
    <td><span class="adm-badge ${c.active ? 'on' : 'off'}">${c.active ? t('admin.form.active') : ''}</span></td>
    <td class="row-actions">
      <button class="adm-btn adm-btn-outline" data-edit-category="${c.id}">${t('admin.form.edit')}</button>
      <button class="adm-btn adm-btn-danger" data-delete-category="${c.id}">${t('admin.form.delete')}</button>
    </td>
  </tr>`).join('');

  tbody.querySelectorAll('[data-edit-category]').forEach((btn) => {
    btn.addEventListener('click', () => openCategoryModal(btn.dataset.editCategory));
  });
  tbody.querySelectorAll('[data-delete-category]').forEach((btn) => {
    btn.addEventListener('click', () => deleteCategory(btn.dataset.deleteCategory));
  });
}

async function loadAdminData() {
  const catSnap = await db.collection('categories').orderBy('display_order').get();
  adminCategories = catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const prodSnap = await db.collection('products').orderBy('display_order').get();
  adminProducts = prodSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  document.getElementById('p-category').innerHTML = categoryOptionsHtml();
  renderProductsTable();
  renderCategoriesTable();
  await loadOrders();
}

function orderStatusLabel(status) {
  return t(`order.status.${status}`) || status;
}

function renderOrderFilters() {
  const statuses = ['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const bar = document.getElementById('orders-filters');
  bar.innerHTML = statuses.map((s) => {
    const label = s === '' ? t('admin.orders.filterAll') : orderStatusLabel(s);
    return `<button type="button" class="adm-filter-chip ${currentOrderFilter === s ? 'active' : ''}" data-status-filter="${s}">${label}</button>`;
  }).join('');
  bar.querySelectorAll('[data-status-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentOrderFilter = btn.dataset.statusFilter;
      renderOrderFilters();
      renderOrdersTable();
    });
  });
}

function renderOrdersTable() {
  const list = currentOrderFilter ? adminOrders.filter((o) => o.status === currentOrderFilter) : adminOrders;
  const tbody = document.getElementById('orders-tbody');
  const table = document.getElementById('orders-table');
  const emptyEl = document.getElementById('orders-empty');

  if (list.length === 0) {
    table.hidden = true;
    emptyEl.hidden = false;
    tbody.innerHTML = '';
    return;
  }
  table.hidden = false;
  emptyEl.hidden = true;

  tbody.innerHTML = list.map((o) => `<tr>
    <td>${escapeHtml(o.customer_name)}</td>
    <td>${escapeHtml(o.customer_phone)}</td>
    <td>${escapeHtml(o.city_name || o.city_id)}</td>
    <td>${formatOrderDate(o)}</td>
    <td>${Number(o.total || 0).toFixed(2)} DH</td>
    <td><span class="adm-badge status-${o.status}">${orderStatusLabel(o.status)}</span></td>
    <td class="row-actions">
      <button class="adm-btn adm-btn-outline" data-view-order="${o.id}">${t('admin.orders.viewDetails')}</button>
    </td>
  </tr>`).join('');

  tbody.querySelectorAll('[data-view-order]').forEach((btn) => {
    btn.addEventListener('click', () => openOrderModal(btn.dataset.viewOrder));
  });
}

async function loadOrders() {
  try {
    const snap = await db.collection('orders').orderBy('created_at', 'desc').get();
    adminOrders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('FLAMIORA admin: échec du chargement des commandes.', e);
    adminOrders = [];
  }
  renderOrderFilters();
  renderOrdersTable();
}

function openOrderModal(id) {
  const order = adminOrders.find((o) => o.id === id);
  if (!order) return;

  document.getElementById('order-id').value = order.id;
  document.getElementById('order-status-select').value = order.status || 'pending';

  const itemsHtml = (order.items || []).map((it) => {
    const name = escapeHtml(getLocale() === 'ar' ? (it.name_ar || it.name_fr) : (it.name_fr || it.name_ar));
    return `<li><span>${name} × ${Number(it.qty) || 0}</span><span>${(Number(it.price) * Number(it.qty)).toFixed(2)} DH</span></li>`;
  }).join('');

  document.getElementById('order-detail-body').innerHTML = `
    <div class="row"><span>${t('admin.orders.customer')}</span><span>${escapeHtml(order.customer_name)}</span></div>
    <div class="row"><span>${t('admin.orders.phone')}</span><span>${escapeHtml(order.customer_phone)}</span></div>
    <div class="row"><span>${t('admin.orders.city')}</span><span>${escapeHtml(order.city_name || order.city_id)}</span></div>
    <div class="row"><span>${t('admin.orders.address')}</span><span>${escapeHtml(order.address)}</span></div>
    ${order.notes ? `<div class="row"><span>${t('admin.orders.notes')}</span><span>${escapeHtml(order.notes)}</span></div>` : ''}
    <div class="row"><span>${t('admin.orders.date')}</span><span>${formatOrderDate(order)}</span></div>
    <div>
      <div class="row" style="border-bottom:none;padding-bottom:0;"><span>${t('admin.orders.items')}</span><span></span></div>
      <ul class="items-list">${itemsHtml}</ul>
    </div>
    <div class="row" style="border-bottom:none;font-weight:700;"><span>${t('admin.orders.total')}</span><span>${Number(order.total || 0).toFixed(2)} DH</span></div>
  `;

  openModal('order-modal');
}

async function saveOrderStatus() {
  const id = document.getElementById('order-id').value;
  const status = document.getElementById('order-status-select').value;
  await db.collection('orders').doc(id).update({ status });
  closeModal('order-modal');
  await loadOrders();
}

async function deleteOrder() {
  if (!confirm(t('admin.orders.confirmDelete'))) return;
  const id = document.getElementById('order-id').value;
  await db.collection('orders').doc(id).delete();
  closeModal('order-modal');
  await loadOrders();
}

function openProductModal(id) {
  const form = document.getElementById('product-form');
  form.reset();
  document.getElementById('p-category').innerHTML = categoryOptionsHtml();

  if (id) {
    const p = adminProducts.find((x) => x.id === id);
    document.getElementById('product-modal-title').textContent = t('admin.form.edit');
    document.getElementById('product-id').value = p.id;
    document.getElementById('p-name-ar').value = p.name_ar || '';
    document.getElementById('p-name-fr').value = p.name_fr || '';
    document.getElementById('p-short-ar').value = p.short_ar || '';
    document.getElementById('p-short-fr').value = p.short_fr || '';
    document.getElementById('p-desc-ar').value = p.desc_ar || '';
    document.getElementById('p-desc-fr').value = p.desc_fr || '';
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-compare-at').value = p.compare_at || '';
    document.getElementById('p-category').value = p.category_id;
    document.getElementById('p-stock').value = p.stock;
    document.getElementById('p-image').value = p.image || '';
    document.getElementById('p-slug').value = p.slug || '';
    document.getElementById('p-display-order').value = p.display_order || 0;
    document.getElementById('p-featured').checked = !!p.featured;
    document.getElementById('p-active').checked = !!p.active;
  } else {
    document.getElementById('product-modal-title').textContent = t('admin.products.add');
    document.getElementById('product-id').value = '';
    document.getElementById('p-active').checked = true;
  }

  openModal('product-modal');
}

function openCategoryModal(id) {
  const form = document.getElementById('category-form');
  form.reset();

  if (id) {
    const c = adminCategories.find((x) => x.id === id);
    document.getElementById('category-modal-title').textContent = t('admin.form.edit');
    document.getElementById('category-id').value = c.id;
    document.getElementById('c-name-ar').value = c.name_ar || '';
    document.getElementById('c-name-fr').value = c.name_fr || '';
    document.getElementById('c-image').value = c.image || '';
    document.getElementById('c-slug').value = c.slug || '';
    document.getElementById('c-display-order').value = c.display_order || 0;
    document.getElementById('c-active').checked = !!c.active;
  } else {
    document.getElementById('category-modal-title').textContent = t('admin.categories.add');
    document.getElementById('category-id').value = '';
    document.getElementById('c-active').checked = true;
  }

  openModal('category-modal');
}

async function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('product-id').value;

  const data = {
    name_ar: document.getElementById('p-name-ar').value.trim(),
    name_fr: document.getElementById('p-name-fr').value.trim(),
    short_ar: document.getElementById('p-short-ar').value.trim(),
    short_fr: document.getElementById('p-short-fr').value.trim(),
    desc_ar: document.getElementById('p-desc-ar').value.trim(),
    desc_fr: document.getElementById('p-desc-fr').value.trim(),
    price: parseFloat(document.getElementById('p-price').value) || 0,
    compare_at: document.getElementById('p-compare-at').value ? parseFloat(document.getElementById('p-compare-at').value) : null,
    category_id: document.getElementById('p-category').value,
    stock: parseInt(document.getElementById('p-stock').value, 10) || 0,
    image: document.getElementById('p-image').value.trim(),
    slug: document.getElementById('p-slug').value.trim(),
    display_order: parseInt(document.getElementById('p-display-order').value, 10) || 0,
    featured: document.getElementById('p-featured').checked,
    active: document.getElementById('p-active').checked,
  };

  if (id) {
    await db.collection('products').doc(id).update(data);
  } else {
    await db.collection('products').add(data);
  }

  closeModal('product-modal');
  await loadAdminData();
}

async function saveCategory(e) {
  e.preventDefault();
  const id = document.getElementById('category-id').value;

  const data = {
    name_ar: document.getElementById('c-name-ar').value.trim(),
    name_fr: document.getElementById('c-name-fr').value.trim(),
    image: document.getElementById('c-image').value.trim(),
    slug: document.getElementById('c-slug').value.trim(),
    display_order: parseInt(document.getElementById('c-display-order').value, 10) || 0,
    active: document.getElementById('c-active').checked,
  };

  if (id) {
    await db.collection('categories').doc(id).update(data);
  } else {
    await db.collection('categories').add(data);
  }

  closeModal('category-modal');
  await loadAdminData();
}

async function deleteProduct(id) {
  if (!confirm(t('admin.form.confirmDelete'))) return;
  await db.collection('products').doc(id).delete();
  await loadAdminData();
}

async function deleteCategory(id) {
  if (!confirm(t('admin.form.confirmDelete'))) return;
  await db.collection('categories').doc(id).delete();
  await loadAdminData();
}

document.addEventListener('DOMContentLoaded', () => {
  applyLocale();

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      errorEl.textContent = t('admin.login.error');
    }
  });

  document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
  });

  document.querySelectorAll('.adm-nav-link[data-view]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  document.getElementById('add-product-btn').addEventListener('click', () => openProductModal(null));
  document.getElementById('add-category-btn').addEventListener('click', () => openCategoryModal(null));

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  document.getElementById('product-form').addEventListener('submit', saveProduct);
  document.getElementById('category-form').addEventListener('submit', saveCategory);
  document.getElementById('order-save-btn').addEventListener('click', saveOrderStatus);
  document.getElementById('order-delete-btn').addEventListener('click', deleteOrder);

  auth.onAuthStateChanged((user) => {
    if (user && user.email === ADMIN_EMAIL && user.emailVerified) {
      showShell();
      loadAdminData();
    } else if (user) {
      // Authenticated but not the store owner's verified account — this account
      // has no rights under the Firestore rules, so don't leave a broken shell visible.
      auth.signOut();
      document.getElementById('login-error').textContent = t('admin.login.accessDenied');
    } else {
      showLogin();
    }
  });
});
