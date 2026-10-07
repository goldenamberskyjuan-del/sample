// Application Main Entry Point
import { state, applySettingsToUI, updateCartBadge } from './app.js';
import { renderCatalog, updateCategoryCardsActiveState, renderCartDrawer, handleQuotationSubmit, renderFaqs } from './publicView.js';
import { initAdmin, openAddProductModal, saveProductForm, saveAdminContent, openAddFaqModal, saveFaqForm, resetDemoData } from './adminView.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize public UI
  applySettingsToUI();
  renderCatalog();
  renderFaqs();
  updateCartBadge();
  renderCartDrawer();

  // Navigation Links smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        // Close mobile drawer if open
        const mobileDrawer = document.getElementById('mobile-nav-drawer');
        if (mobileDrawer) mobileDrawer.classList.remove('open');
      }
    });
  });

  // Category Cards Click Handlers
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      state.activeCategory = category;
      const catSelect = document.getElementById('catalog-category-select');
      if (catSelect) catSelect.value = category;
      updateCategoryCardsActiveState();
      renderCatalog();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Search Input Handler
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Category Select Handler
  const catSelect = document.getElementById('catalog-category-select');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      state.activeCategory = e.target.value;
      updateCategoryCardsActiveState();
      renderCatalog();
    });
  }

  // Availability Select Handler
  const availSelect = document.getElementById('catalog-avail-select');
  if (availSelect) {
    availSelect.addEventListener('change', (e) => {
      state.availabilityFilter = e.target.value;
      renderCatalog();
    });
  }

  // Quotation Drawer Toggles
  const drawer = document.getElementById('quote-drawer-panel');
  const drawerOverlay = document.getElementById('quote-drawer-overlay');
  const openDrawerBtns = document.querySelectorAll('.open-quote-drawer-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  function openDrawer() {
    renderCartDrawer();
    drawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
  }
  function closeDrawer() {
    drawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
  }

  openDrawerBtns.forEach(b => b.addEventListener('click', openDrawer));
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  // Quote Checkout Modal Toggles
  const checkoutModal = document.getElementById('quote-checkout-modal');
  const openCheckoutBtn = document.getElementById('proceed-to-quote-form-btn');
  const closeCheckoutBtn = document.getElementById('close-checkout-modal-btn');
  const quoteForm = document.getElementById('quotation-request-form');

  openCheckoutBtn?.addEventListener('click', () => {
    closeDrawer();
    checkoutModal?.classList.add('open');
  });
  closeCheckoutBtn?.addEventListener('click', () => {
    checkoutModal?.classList.remove('open');
  });
  quoteForm?.addEventListener('submit', handleQuotationSubmit);

  // Close Confirmation Modal
  const confirmModal = document.getElementById('quote-confirm-modal');
  document.getElementById('close-confirm-modal-btn')?.addEventListener('click', () => {
    confirmModal?.classList.remove('open');
  });

  // Product Details Modal Close
  const productModal = document.getElementById('product-details-modal');
  document.getElementById('close-product-modal-btn')?.addEventListener('click', () => {
    productModal?.classList.remove('open');
  });

  // Admin Modals Close
  document.getElementById('close-admin-prod-modal-btn')?.addEventListener('click', () => {
    document.getElementById('admin-product-modal')?.classList.remove('open');
  });
  document.getElementById('close-admin-quote-modal-btn')?.addEventListener('click', () => {
    document.getElementById('admin-quote-detail-modal')?.classList.remove('open');
  });
  document.getElementById('close-admin-faq-modal-btn')?.addEventListener('click', () => {
    document.getElementById('admin-faq-modal')?.classList.remove('open');
  });
  document.getElementById('close-login-modal-btn')?.addEventListener('click', () => {
    document.getElementById('admin-login-modal')?.classList.remove('open');
  });

  // Global ESC key listener to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      closeDrawer();
    }
  });

  // Modal Backdrop click to close
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  // Admin View Switching & Login
  const publicView = document.getElementById('public-website-view');
  const adminView = document.getElementById('admin-dashboard-view');
  const loginModal = document.getElementById('admin-login-modal');

  function showAdminDashboard() {
    publicView.classList.add('hidden');
    adminView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initAdmin();
  }

  function showPublicWebsite() {
    adminView.classList.remove('active');
    publicView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.admin-demo-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.isAdminLoggedIn) {
        showAdminDashboard();
      } else {
        loginModal?.classList.add('open');
      }
    });
  });

  // Admin Login Credentials Autofill
  document.getElementById('autofill-login-btn')?.addEventListener('click', () => {
    document.getElementById('admin-email-input').value = 'admin@demo.com';
    document.getElementById('admin-pass-input').value = 'Admin123!';
  });

  // Admin Login Submit
  document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email-input').value.trim();
    const pass = document.getElementById('admin-pass-input').value.trim();

    if (email === 'admin@demo.com' && pass === 'Admin123!') {
      state.isAdminLoggedIn = true;
      localStorage.setItem('medicare_admin_auth_v1', JSON.stringify(true));
      loginModal?.classList.remove('open');
      showAdminDashboard();
    } else {
      const errEl = document.getElementById('login-error-msg');
      if (errEl) {
        errEl.textContent = 'Invalid demo credentials. Use admin@demo.com / Admin123!';
        errEl.style.display = 'block';
      }
    }
  });

  // Admin Header Controls
  document.getElementById('admin-view-site-btn')?.addEventListener('click', showPublicWebsite);
  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    state.isAdminLoggedIn = false;
    localStorage.removeItem('medicare_admin_auth_v1');
    showPublicWebsite();
  });
  document.getElementById('admin-reset-demo-btn')?.addEventListener('click', resetDemoData);

  // Admin Add Product Button & Form
  document.getElementById('admin-add-product-btn')?.addEventListener('click', openAddProductModal);
  document.getElementById('admin-product-form')?.addEventListener('submit', saveProductForm);

  // Admin Image Upload & Compression
  const fileInput = document.getElementById('prod-form-image-file');
  const urlInput = document.getElementById('prod-form-image-url');
  const previewImg = document.getElementById('prod-form-preview-img');

  urlInput?.addEventListener('input', (e) => {
    if (e.target.value.trim()) {
      previewImg.src = e.target.value.trim();
    }
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Downscale image to max 400x400 to conserve localStorage space safely
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        previewImg.src = compressedDataUrl;
        urlInput.value = '';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Admin Content Form
  document.getElementById('admin-content-form')?.addEventListener('submit', saveAdminContent);

  // Admin FAQ Form
  document.getElementById('admin-add-faq-btn')?.addEventListener('click', openAddFaqModal);
  document.getElementById('admin-faq-form')?.addEventListener('submit', saveFaqForm);

  // Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.toggle('open');
  });
  closeMobileMenuBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.remove('open');
  });
});
