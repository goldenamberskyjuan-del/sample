// MediCare Supplies - Interactive Demo Application Engine
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_FAQS, INITIAL_QUOTES } from './initialData.js';

// --- State & Storage Helpers ---
const STORAGE_KEYS = {
  PRODUCTS: 'medicare_products_v1',
  SETTINGS: 'medicare_settings_v1',
  FAQS: 'medicare_faqs_v1',
  QUOTES: 'medicare_quotes_v1',
  CART: 'medicare_cart_v1',
  AUTH: 'medicare_admin_auth_v1'
};

function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error('Storage read error:', err);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('Storage write error:', err);
    showToast('Storage quota warning: Unable to save data locally.', 'error');
    return false;
  }
}

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatPhp(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Request Price';
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// --- App State ---
export const state = {
  products: getStorage(STORAGE_KEYS.PRODUCTS, null) || [...INITIAL_PRODUCTS],
  settings: getStorage(STORAGE_KEYS.SETTINGS, null) || { ...INITIAL_SETTINGS },
  faqs: getStorage(STORAGE_KEYS.FAQS, null) || [...INITIAL_FAQS],
  quotes: getStorage(STORAGE_KEYS.QUOTES, null) || [...INITIAL_QUOTES],
  cart: getStorage(STORAGE_KEYS.CART, []),
  isAdminLoggedIn: getStorage(STORAGE_KEYS.AUTH, false),
  currentView: 'public', // 'public' | 'admin'
  activeAdminTab: 'overview', // 'overview' | 'products' | 'quotes' | 'content'
  activeCategory: 'All',
  searchQuery: '',
  availabilityFilter: 'All'
};

// Seed storage initially if first time
if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
  setStorage(STORAGE_KEYS.PRODUCTS, state.products);
  setStorage(STORAGE_KEYS.SETTINGS, state.settings);
  setStorage(STORAGE_KEYS.FAQS, state.faqs);
  setStorage(STORAGE_KEYS.QUOTES, state.quotes);
}

// Toast notification helper
export function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.style.backgroundColor = 'var(--danger)';
  if (type === 'success') toast.style.backgroundColor = 'var(--teal-600)';
  
  toast.innerHTML = `<span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Save helpers
export function persistProducts() {
  setStorage(STORAGE_KEYS.PRODUCTS, state.products);
  renderCatalog();
  renderAdminProducts();
  renderAdminOverview();
}

export function persistSettings() {
  setStorage(STORAGE_KEYS.SETTINGS, state.settings);
  applySettingsToUI();
}

export function persistFaqs() {
  setStorage(STORAGE_KEYS.FAQS, state.faqs);
  renderFaqs();
  renderAdminFaqs();
}

export function persistQuotes() {
  setStorage(STORAGE_KEYS.QUOTES, state.quotes);
  renderAdminQuotes();
  renderAdminOverview();
}

export function persistCart() {
  setStorage(STORAGE_KEYS.CART, state.cart);
  updateCartBadge();
  renderCartDrawer();
}

// Apply settings to public UI
export function applySettingsToUI() {
  const { businessName, brandSubtitle, heroHeading, heroSubheading, aboutHeading, aboutText, deliveryText, paymentText, contactPhone, contactEmail, contactAddress, operatingHours, facebookUrl } = state.settings;

  // Header & Brand
  document.querySelectorAll('.brand-name-text').forEach(el => el.textContent = businessName);
  document.querySelectorAll('.brand-sub-text').forEach(el => el.textContent = brandSubtitle);
  
  // Hero
  const heroH1 = document.getElementById('hero-heading-text');
  if (heroH1) heroH1.textContent = heroHeading;
  const heroSub = document.getElementById('hero-subheading-text');
  if (heroSub) heroSub.textContent = heroSubheading;

  // About
  const aboutH = document.getElementById('about-heading-text');
  if (aboutH) aboutH.textContent = aboutHeading;
  const aboutP = document.getElementById('about-body-text');
  if (aboutP) aboutP.textContent = aboutText;

  // Delivery & Payment
  const delP = document.getElementById('delivery-info-text');
  if (delP) delP.textContent = deliveryText;
  const payP = document.getElementById('payment-info-text');
  if (payP) payP.textContent = paymentText;

  // Contact
  const phoneEl = document.getElementById('contact-phone-val');
  if (phoneEl) phoneEl.textContent = contactPhone;
  const emailEl = document.getElementById('contact-email-val');
  if (emailEl) emailEl.textContent = contactEmail;
  const addrEl = document.getElementById('contact-address-val');
  if (addrEl) addrEl.textContent = contactAddress;
  const hoursEl = document.getElementById('contact-hours-val');
  if (hoursEl) hoursEl.textContent = operatingHours;

  const fbLink = document.getElementById('footer-fb-link');
  if (fbLink) fbLink.href = facebookUrl || 'https://www.facebook.com/profile.php?id=61590781614230';
}

// Update Cart Badge
export function updateCartBadge() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-counter');
  badges.forEach(b => {
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Add Product to Quotation List
export function addToQuote(productId, qty = 1) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const existing = state.cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    state.cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      packaging: prod.packaging,
      image: prod.image,
      quantity: qty
    });
  }

  persistCart();
  showToast(`Added "${prod.name.substring(0, 24)}..." to quotation list`, 'success');
}

export function updateCartQuantity(productId, change) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.id !== productId);
  }
  persistCart();
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  persistCart();
  showToast('Item removed from quotation list');
}
