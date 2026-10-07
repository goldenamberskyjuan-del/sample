// Admin Dashboard UI & Logic
import { state, escapeHtml, formatPhp, persistProducts, persistSettings, persistFaqs, persistQuotes, showToast } from './app.js';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_FAQS, INITIAL_QUOTES } from './initialData.js';

let editingProductId = null;
let editingFaqId = null;

export function initAdmin() {
  renderAdminOverview();
  renderAdminProducts();
  renderAdminQuotes();
  renderAdminContentForm();
  renderAdminFaqs();

  // Attach tab switching
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-pane').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const targetPaneId = tab.getAttribute('data-tab');
      const pane = document.getElementById(`admin-pane-${targetPaneId}`);
      if (pane) pane.style.display = 'block';
    };
  });
}

// 1. Dashboard Overview
export function renderAdminOverview() {
  const totalProds = state.products.length;
  const availProds = state.products.filter(p => p.availability === 'Available').length;
  const outOfStockProds = state.products.filter(p => p.availability === 'Out of Stock').length;
  const totalQuotes = state.quotes.length;

  const statTotalProds = document.getElementById('stat-total-prods');
  const statAvailProds = document.getElementById('stat-avail-prods');
  const statOutProds = document.getElementById('stat-out-prods');
  const statTotalQuotes = document.getElementById('stat-total-quotes');

  if (statTotalProds) statTotalProds.textContent = totalProds;
  if (statAvailProds) statAvailProds.textContent = availProds;
  if (statOutProds) statOutProds.textContent = outOfStockProds;
  if (statTotalQuotes) statTotalQuotes.textContent = totalQuotes;

  // Recent Quotes Table
  const recentTableBody = document.getElementById('admin-recent-quotes-tbody');
  if (!recentTableBody) return;

  const recent = state.quotes.slice(0, 5);
  if (recent.length === 0) {
    recentTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--slate-400); padding: 2rem;">No quotation requests recorded yet.</td></tr>`;
    return;
  }

  recentTableBody.innerHTML = recent.map(q => {
    const itemCount = q.items.reduce((s, i) => s + i.quantity, 0);
    const estSum = q.items.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0);
    const dateFormatted = new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <tr>
        <td><strong>${escapeHtml(q.refNumber)}</strong></td>
        <td>${escapeHtml(q.customerName)}<br><small style="color: var(--slate-500);">${escapeHtml(q.companyName || '')}</small></td>
        <td class="tabular">${itemCount} items (${formatPhp(estSum)})</td>
        <td>${dateFormatted}</td>
        <td><span class="status-badge" style="background: var(--slate-100); padding: 0.2rem 0.5rem; border-radius: 4px;">${escapeHtml(q.status)}</span></td>
        <td>
          <button class="btn btn-outline btn-sm admin-view-quote-btn" data-id="${q.id}">Inspect</button>
        </td>
      </tr>
    `;
  }).join('');

  recentTableBody.querySelectorAll('.admin-view-quote-btn').forEach(b => {
    b.onclick = () => openQuoteDetailModal(b.getAttribute('data-id'));
  });
}

// 2. Product Management
export function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.products.map(p => {
    const priceText = typeof p.price === 'number' ? formatPhp(p.price) : 'Request Price';
    return `
      <tr>
        <td style="width: 50px;">
          <img src="${p.image}" alt="" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--slate-200);"/>
        </td>
        <td>
          <strong>${escapeHtml(p.name)}</strong><br>
          <small style="color: var(--slate-500);">${escapeHtml(p.brand)} · ${escapeHtml(p.category)}</small>
        </td>
        <td>${escapeHtml(p.packaging)}</td>
        <td class="tabular">${escapeHtml(priceText)}</td>
        <td>
          <span style="font-size: 0.8125rem; font-weight: 600;">${escapeHtml(p.availability)}</span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-outline btn-sm admin-edit-prod-btn" data-id="${p.id}" style="margin-right: 0.25rem;">Edit</button>
          <button class="btn btn-outline btn-sm admin-delete-prod-btn" data-id="${p.id}" style="color: var(--danger); border-color: var(--slate-200);">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.admin-edit-prod-btn').forEach(b => {
    b.onclick = () => openEditProductModal(b.getAttribute('data-id'));
  });
  tbody.querySelectorAll('.admin-delete-prod-btn').forEach(b => {
    b.onclick = () => confirmDeleteProduct(b.getAttribute('data-id'));
  });
}

export function openAddProductModal() {
  editingProductId = null;
  const modal = document.getElementById('admin-product-modal');
  const title = document.getElementById('admin-product-modal-title');
  const form = document.getElementById('admin-product-form');
  if (!modal || !form) return;

  if (title) title.textContent = 'Add New Medical Product';
  form.reset();
  document.getElementById('prod-form-id').value = '';
  document.getElementById('prod-form-preview-img').src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f1f5f9"/></svg>';
  modal.classList.add('open');
}

export function openEditProductModal(id) {
  const prod = state.products.find(p => p.id === id);
  if (!prod) return;

  editingProductId = id;
  const modal = document.getElementById('admin-product-modal');
  const title = document.getElementById('admin-product-modal-title');
  if (!modal) return;

  if (title) title.textContent = 'Edit Medical Product';
  document.getElementById('prod-form-id').value = prod.id;
  document.getElementById('prod-form-name').value = prod.name;
  document.getElementById('prod-form-category').value = prod.category;
  document.getElementById('prod-form-brand').value = prod.brand;
  document.getElementById('prod-form-packaging').value = prod.packaging;
  document.getElementById('prod-form-price').value = prod.price || '';
  document.getElementById('prod-form-availability').value = prod.availability;
  document.getElementById('prod-form-desc').value = prod.description;
  document.getElementById('prod-form-specs').value = prod.specs || '';
  document.getElementById('prod-form-image-url').value = prod.image.startsWith('data:') ? '' : prod.image;
  document.getElementById('prod-form-preview-img').src = prod.image;

  modal.classList.add('open');
}

export function saveProductForm(e) {
  e.preventDefault();
  const id = document.getElementById('prod-form-id').value;
  const name = document.getElementById('prod-form-name').value.trim();
  const category = document.getElementById('prod-form-category').value;
  const brand = document.getElementById('prod-form-brand').value.trim();
  const packaging = document.getElementById('prod-form-packaging').value.trim();
  const priceVal = parseFloat(document.getElementById('prod-form-price').value);
  const availability = document.getElementById('prod-form-availability').value;
  const description = document.getElementById('prod-form-desc').value.trim();
  const specs = document.getElementById('prod-form-specs').value.trim();
  const previewImg = document.getElementById('prod-form-preview-img').src;

  if (!name || !category || !brand || !packaging) {
    showToast('Please fill out all mandatory product fields.', 'error');
    return;
  }

  const productData = {
    id: id || `med-${Date.now()}`,
    name,
    category,
    brand,
    packaging,
    price: isNaN(priceVal) ? null : priceVal,
    priceDisplay: isNaN(priceVal) ? 'Request Price' : formatPhp(priceVal),
    availability,
    description,
    specs,
    image: previewImg || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f1f5f9"/></svg>'
  };

  if (id) {
    // Update existing
    const idx = state.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      state.products[idx] = productData;
      showToast(`Updated product "${name}"`, 'success');
    }
  } else {
    // Add new
    state.products.unshift(productData);
    showToast(`Added product "${name}"`, 'success');
  }

  persistProducts();
  document.getElementById('admin-product-modal').classList.remove('open');
}

function confirmDeleteProduct(id) {
  const prod = state.products.find(p => p.id === id);
  if (!prod) return;

  if (confirm(`Are you sure you want to delete "${prod.name}" from the catalog? This will update the public website immediately.`)) {
    state.products = state.products.filter(p => p.id !== id);
    persistProducts();
    showToast(`Deleted "${prod.name}"`, 'info');
  }
}

// 3. Quotation Requests
export function renderAdminQuotes() {
  const tbody = document.getElementById('admin-quotes-tbody');
  if (!tbody) return;

  if (state.quotes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--slate-400); padding: 3rem;">No quotation requests submitted yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.quotes.map(q => {
    const itemCount = q.items.reduce((s, i) => s + i.quantity, 0);
    const estSum = q.items.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0);
    const dateFormatted = new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    let statusStyle = 'background: #f1f5f9; color: #475569;';
    if (q.status === 'New') statusStyle = 'background: #ccfbf1; color: #0f766e; font-weight: 700;';
    if (q.status === 'Quoted') statusStyle = 'background: #e0f2fe; color: #0369a1;';
    if (q.status === 'Completed') statusStyle = 'background: #dcfce7; color: #15803d;';
    if (q.status === 'Cancelled') statusStyle = 'background: #fee2e2; color: #b91c1c;';

    return `
      <tr>
        <td><strong>${escapeHtml(q.refNumber)}</strong></td>
        <td>
          <strong>${escapeHtml(q.customerName)}</strong><br>
          <small style="color: var(--slate-500);">${escapeHtml(q.companyName || 'Household')}</small>
        </td>
        <td>
          <small>${escapeHtml(q.email)}<br>${escapeHtml(q.phone)}</small>
        </td>
        <td class="tabular">${itemCount} items<br><small style="color: var(--slate-500);">${formatPhp(estSum)}</small></td>
        <td><small>${dateFormatted}</small></td>
        <td>
          <span style="font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; ${statusStyle}">${escapeHtml(q.status)}</span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-outline btn-sm admin-quote-inspect-btn" data-id="${q.id}" style="margin-right: 0.25rem;">Details</button>
          <button class="btn btn-outline btn-sm admin-quote-del-btn" data-id="${q.id}" style="color: var(--danger); border-color: var(--slate-200);">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.admin-quote-inspect-btn').forEach(b => {
    b.onclick = () => openQuoteDetailModal(b.getAttribute('data-id'));
  });
  tbody.querySelectorAll('.admin-quote-del-btn').forEach(b => {
    b.onclick = () => confirmDeleteQuote(b.getAttribute('data-id'));
  });
}

function openQuoteDetailModal(id) {
  const q = state.quotes.find(item => item.id === id);
  if (!q) return;

  const modal = document.getElementById('admin-quote-detail-modal');
  const body = document.getElementById('admin-quote-detail-body');
  if (!modal || !body) return;

  const dateFormatted = new Date(q.createdAt).toLocaleString('en-US');
  const itemsTable = q.items.map(it => `
    <tr>
      <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--slate-100);">${escapeHtml(it.name)}</td>
      <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--slate-100);">${escapeHtml(it.packaging || '')}</td>
      <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--slate-100); text-align: center;" class="tabular">${it.quantity}</td>
      <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--slate-100); text-align: right;" class="tabular">${formatPhp(it.unitPrice)}</td>
      <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--slate-100); text-align: right; font-weight: 700;" class="tabular">${formatPhp((it.unitPrice || 0) * it.quantity)}</td>
    </tr>
  `).join('');

  const estTotal = q.items.reduce((s, it) => s + (it.unitPrice || 0) * it.quantity, 0);

  body.innerHTML = `
    <div style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--slate-200); padding-bottom: 0.75rem;">
      <div>
        <h3 style="font-size: 1.25rem;">Reference: ${escapeHtml(q.refNumber)}</h3>
        <small style="color: var(--slate-500);">Submitted on ${dateFormatted}</small>
      </div>
      <div>
        <label style="font-size: 0.8125rem; font-weight: 600; margin-right: 0.5rem;">Status:</label>
        <select id="quote-modal-status-select" class="form-select" style="width: auto; display: inline-block;">
          <option value="New" ${q.status === 'New' ? 'selected' : ''}>New</option>
          <option value="Contacted" ${q.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="Quoted" ${q.status === 'Quoted' ? 'selected' : ''}>Quoted</option>
          <option value="Completed" ${q.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="Cancelled" ${q.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; background: var(--slate-50); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--slate-200);">
      <div>
        <div style="font-size: 0.75rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Customer Information</div>
        <div style="font-weight: 700; margin-top: 0.25rem;">${escapeHtml(q.customerName)}</div>
        <div style="font-size: 0.8125rem; color: var(--slate-600);">${escapeHtml(q.companyName || 'Household')}</div>
        <div style="font-size: 0.8125rem; color: var(--slate-600); margin-top: 0.25rem;">Email: <a href="mailto:${escapeHtml(q.email)}" style="color: var(--teal-600);">${escapeHtml(q.email)}</a></div>
        <div style="font-size: 0.8125rem; color: var(--slate-600);">Phone: ${escapeHtml(q.phone)}</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Delivery Address & Notes</div>
        <div style="font-size: 0.8125rem; color: var(--slate-700); margin-top: 0.25rem;">${escapeHtml(q.deliveryAddress)}</div>
        ${q.notes ? `<div style="font-size: 0.8125rem; color: var(--slate-500); margin-top: 0.5rem; font-style: italic;">Customer Note: "${escapeHtml(q.notes)}"</div>` : ''}
      </div>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 0.875rem; margin-bottom: 0.5rem;">Requested Medical Items</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem;">
        <thead>
          <tr style="background: var(--slate-100); text-align: left;">
            <th style="padding: 0.5rem 0.75rem;">Item</th>
            <th style="padding: 0.5rem 0.75rem;">Packaging</th>
            <th style="padding: 0.5rem 0.75rem; text-align: center;">Qty</th>
            <th style="padding: 0.5rem 0.75rem; text-align: right;">Unit Price</th>
            <th style="padding: 0.5rem 0.75rem; text-align: right;">Estimated Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTable}
          <tr style="background: var(--slate-50); font-weight: 700;">
            <td colspan="4" style="padding: 0.75rem; text-align: right;">Estimated Total:</td>
            <td style="padding: 0.75rem; text-align: right;" class="tabular">${formatPhp(estTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <label class="form-label">Internal Office Notes / Pricing Log:</label>
      <textarea id="quote-modal-internal-notes" class="form-textarea" rows="2">${escapeHtml(q.internalNotes || '')}</textarea>
    </div>
  `;

  document.getElementById('admin-save-quote-changes-btn').onclick = () => {
    const newStatus = document.getElementById('quote-modal-status-select').value;
    const internalNotes = document.getElementById('quote-modal-internal-notes').value.trim();

    q.status = newStatus;
    q.internalNotes = internalNotes;
    persistQuotes();
    showToast(`Quotation ${q.refNumber} updated.`, 'success');
    modal.classList.remove('open');
  };

  modal.classList.add('open');
}

function confirmDeleteQuote(id) {
  const q = state.quotes.find(item => item.id === id);
  if (!q) return;

  if (confirm(`Delete quotation request ${q.refNumber} from customer "${q.customerName}"?`)) {
    state.quotes = state.quotes.filter(item => item.id !== id);
    persistQuotes();
    showToast(`Deleted request ${q.refNumber}`, 'info');
  }
}

// 4. Website Content & FAQs
export function renderAdminContentForm() {
  const form = document.getElementById('admin-content-form');
  if (!form) return;

  document.getElementById('content-form-biz-name').value = state.settings.businessName || '';
  document.getElementById('content-form-hero-title').value = state.settings.heroHeading || '';
  document.getElementById('content-form-hero-sub').value = state.settings.heroSubheading || '';
  document.getElementById('content-form-about-head').value = state.settings.aboutHeading || '';
  document.getElementById('content-form-about-body').value = state.settings.aboutText || '';
  document.getElementById('content-form-delivery').value = state.settings.deliveryText || '';
  document.getElementById('content-form-payment').value = state.settings.paymentText || '';
  document.getElementById('content-form-phone').value = state.settings.contactPhone || '';
  document.getElementById('content-form-email').value = state.settings.contactEmail || '';
  document.getElementById('content-form-addr').value = state.settings.contactAddress || '';
  document.getElementById('content-form-hours').value = state.settings.operatingHours || '';
  document.getElementById('content-form-fb').value = state.settings.facebookUrl || '';
}

export function saveAdminContent(e) {
  e.preventDefault();
  state.settings.businessName = document.getElementById('content-form-biz-name').value.trim();
  state.settings.heroHeading = document.getElementById('content-form-hero-title').value.trim();
  state.settings.heroSubheading = document.getElementById('content-form-hero-sub').value.trim();
  state.settings.aboutHeading = document.getElementById('content-form-about-head').value.trim();
  state.settings.aboutText = document.getElementById('content-form-about-body').value.trim();
  state.settings.deliveryText = document.getElementById('content-form-delivery').value.trim();
  state.settings.paymentText = document.getElementById('content-form-payment').value.trim();
  state.settings.contactPhone = document.getElementById('content-form-phone').value.trim();
  state.settings.contactEmail = document.getElementById('content-form-email').value.trim();
  state.settings.contactAddress = document.getElementById('content-form-addr').value.trim();
  state.settings.operatingHours = document.getElementById('content-form-hours').value.trim();
  state.settings.facebookUrl = document.getElementById('content-form-fb').value.trim();

  persistSettings();
  showToast('Website content updated! Changes are live on the public site.', 'success');
}

export function renderAdminFaqs() {
  const container = document.getElementById('admin-faqs-list');
  if (!container) return;

  container.innerHTML = state.faqs.map(f => `
    <div style="background: white; border: 1px solid var(--slate-200); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
      <div>
        <strong style="display: block; font-size: 0.9375rem; color: var(--navy-900); margin-bottom: 0.25rem;">${escapeHtml(f.question)}</strong>
        <p style="font-size: 0.8125rem; color: var(--slate-600); margin: 0;">${escapeHtml(f.answer)}</p>
      </div>
      <div style="white-space: nowrap;">
        <button class="btn btn-outline btn-sm admin-edit-faq-btn" data-id="${f.id}" style="margin-right: 0.25rem;">Edit</button>
        <button class="btn btn-outline btn-sm admin-del-faq-btn" data-id="${f.id}" style="color: var(--danger); border-color: var(--slate-200);">Delete</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.admin-edit-faq-btn').forEach(b => {
    b.onclick = () => openEditFaqModal(b.getAttribute('data-id'));
  });
  container.querySelectorAll('.admin-del-faq-btn').forEach(b => {
    b.onclick = () => confirmDeleteFaq(b.getAttribute('data-id'));
  });
}

export function openAddFaqModal() {
  editingFaqId = null;
  const modal = document.getElementById('admin-faq-modal');
  const title = document.getElementById('admin-faq-modal-title');
  const form = document.getElementById('admin-faq-form');
  if (!modal || !form) return;

  if (title) title.textContent = 'Add FAQ Entry';
  form.reset();
  document.getElementById('faq-form-id').value = '';
  modal.classList.add('open');
}

export function openEditFaqModal(id) {
  const faq = state.faqs.find(f => f.id === id);
  if (!faq) return;

  editingFaqId = id;
  const modal = document.getElementById('admin-faq-modal');
  const title = document.getElementById('admin-faq-modal-title');
  if (!modal) return;

  if (title) title.textContent = 'Edit FAQ Entry';
  document.getElementById('faq-form-id').value = faq.id;
  document.getElementById('faq-form-question').value = faq.question;
  document.getElementById('faq-form-answer').value = faq.answer;
  modal.classList.add('open');
}

export function saveFaqForm(e) {
  e.preventDefault();
  const id = document.getElementById('faq-form-id').value;
  const question = document.getElementById('faq-form-question').value.trim();
  const answer = document.getElementById('faq-form-answer').value.trim();

  if (!question || !answer) {
    showToast('Please provide both question and answer text.', 'error');
    return;
  }

  if (id) {
    const idx = state.faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      state.faqs[idx] = { id, question, answer };
      showToast('FAQ updated.', 'success');
    }
  } else {
    state.faqs.push({
      id: `faq-${Date.now()}`,
      question,
      answer
    });
    showToast('FAQ added.', 'success');
  }

  persistFaqs();
  document.getElementById('admin-faq-modal').classList.remove('open');
}

function confirmDeleteFaq(id) {
  const f = state.faqs.find(item => item.id === id);
  if (!f) return;

  if (confirm(`Delete FAQ: "${f.question}"?`)) {
    state.faqs = state.faqs.filter(item => item.id !== id);
    persistFaqs();
    showToast('FAQ deleted.', 'info');
  }
}

// 5. Demo Controls: Reset Demo Data
export function resetDemoData() {
  if (confirm('Are you sure you want to restore the initial demo data? This will reset all products, content, FAQs, and quotation requests to their default state.')) {
    state.products = [...INITIAL_PRODUCTS];
    state.settings = { ...INITIAL_SETTINGS };
    state.faqs = [...INITIAL_FAQS];
    state.quotes = [...INITIAL_QUOTES];
    state.cart = [];

    persistProducts();
    persistSettings();
    persistFaqs();
    persistQuotes();
    renderAdminContentForm();
    showToast('Demo data successfully restored to factory defaults.', 'success');
  }
}
