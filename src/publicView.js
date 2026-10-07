// Public Website UI Rendering & Event Handling
import { state, escapeHtml, formatPhp, addToQuote, updateCartQuantity, removeFromCart, persistQuotes, persistCart, showToast } from './app.js';

export function renderCatalog() {
  const container = document.getElementById('products-grid-container');
  if (!container) return;

  const query = state.searchQuery.toLowerCase().trim();
  const category = state.activeCategory;
  const avail = state.availabilityFilter;

  const filtered = state.products.filter(p => {
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);

    const matchesCat = category === 'All' || p.category === category;
    const matchesAvail = avail === 'All' || p.availability === avail;

    return matchesSearch && matchesCat && matchesAvail;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: white; border-radius: 0.75rem; border: 1px solid var(--slate-200);">
        <p style="font-weight: 600; color: var(--navy-900); font-size: 1.125rem; margin-bottom: 0.5rem;">No medical supplies found</p>
        <p style="color: var(--slate-500); font-size: 0.875rem; margin-bottom: 1.25rem;">Try adjusting your search terms or category filter.</p>
        <button id="reset-catalog-filters-btn" class="btn btn-outline btn-sm">Reset Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-catalog-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.searchQuery = '';
        state.activeCategory = 'All';
        state.availabilityFilter = 'All';
        const searchInput = document.getElementById('catalog-search-input');
        if (searchInput) searchInput.value = '';
        const catSelect = document.getElementById('catalog-category-select');
        if (catSelect) catSelect.value = 'All';
        const availSelect = document.getElementById('catalog-avail-select');
        if (availSelect) availSelect.value = 'All';
        updateCategoryCardsActiveState();
        renderCatalog();
      });
    }
    return;
  }

  container.innerHTML = filtered.map(prod => {
    let statusClass = 'status-available';
    if (prod.availability === 'Out of Stock') statusClass = 'status-out-of-stock';
    if (prod.availability === 'Pre-order') statusClass = 'status-pre-order';

    const priceText = typeof prod.price === 'number' ? formatPhp(prod.price) : 'Request Price';

    return `
      <div class="product-card" data-product-id="${prod.id}">
        <div class="product-img-box">
          <img src="${prod.image}" alt="${escapeHtml(prod.name)}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'><rect width=\\'400\\' height=\\'300\\' fill=\\'%23f1f5f9\\'/><text x=\\'200\\' y=\\'150\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%2394a3b8\\' text-anchor=\\'middle\\'>Image Not Available</text></svg>'"/>
        </div>
        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-category-text">${escapeHtml(prod.category)}</span>
            <span class="status-badge ${statusClass}">● ${escapeHtml(prod.availability)}</span>
          </div>
          <h3 class="product-title" title="${escapeHtml(prod.name)}">${escapeHtml(prod.name)}</h3>
          <div class="product-brand">${escapeHtml(prod.brand)}</div>
          <p class="product-desc">${escapeHtml(prod.description)}</p>
          <div class="product-footer">
            <div class="price-row">
              <div>
                <div class="product-price tabular">${escapeHtml(priceText)}</div>
                <div class="price-demo-hint">Illustrative demo price</div>
              </div>
              <div class="product-unit">${escapeHtml(prod.packaging)}</div>
            </div>
            <div class="product-actions">
              <button class="btn btn-outline btn-sm view-details-btn" data-id="${prod.id}">Details</button>
              <button class="btn btn-teal btn-sm add-quote-btn" data-id="${prod.id}">+ Add to Quote</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card button handlers
  container.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductModal(btn.getAttribute('data-id'));
    });
  });

  container.querySelectorAll('.add-quote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToQuote(btn.getAttribute('data-id'), 1);
    });
  });

  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      openProductModal(card.getAttribute('data-product-id'));
    });
  });
}

export function updateCategoryCardsActiveState() {
  document.querySelectorAll('.category-card').forEach(card => {
    const catName = card.getAttribute('data-category');
    if (catName === state.activeCategory) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Product Details Modal
export function openProductModal(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('product-details-modal');
  const body = document.getElementById('product-modal-body');
  if (!modal || !body) return;

  let statusClass = 'status-available';
  if (prod.availability === 'Out of Stock') statusClass = 'status-out-of-stock';
  if (prod.availability === 'Pre-order') statusClass = 'status-pre-order';

  const priceFormatted = typeof prod.price === 'number' ? formatPhp(prod.price) : 'Request Price';

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem; align-items: start;">
      <div style="background: #f8fafc; border-radius: 0.5rem; border: 1px solid var(--slate-200); overflow: hidden; padding: 0.5rem; display: flex; align-items: center; justify-content: center;">
        <img src="${prod.image}" alt="${escapeHtml(prod.name)}" style="width: 100%; height: auto; max-height: 280px; object-fit: contain; border-radius: 0.375rem;"/>
      </div>
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--teal-600); text-transform: uppercase;">${escapeHtml(prod.category)}</span>
          <span class="status-badge ${statusClass}">● ${escapeHtml(prod.availability)}</span>
        </div>
        <h2 style="font-size: 1.375rem; margin-bottom: 0.25rem;">${escapeHtml(prod.name)}</h2>
        <div style="font-size: 0.875rem; color: var(--slate-500); margin-bottom: 1rem;">Brand: <strong style="color: var(--slate-700);">${escapeHtml(prod.brand)}</strong></div>

        <div style="background-color: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 0.5rem; padding: 0.875rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: baseline; justify-content: space-between;">
            <div>
              <div style="font-size: 1.375rem; font-weight: 800; color: var(--navy-900);" class="tabular">${escapeHtml(priceFormatted)}</div>
              <div style="font-size: 0.6875rem; color: var(--slate-400);">Sample illustrative pricing only</div>
            </div>
            <div style="font-size: 0.8125rem; color: var(--slate-600); text-align: right;">Unit / Packaging:<br><strong>${escapeHtml(prod.packaging)}</strong></div>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 0.875rem; color: var(--slate-700); margin-bottom: 0.375rem;">Description:</h4>
          <p style="font-size: 0.8125rem; color: var(--slate-600); line-height: 1.5;">${escapeHtml(prod.description)}</p>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.875rem; color: var(--slate-700); margin-bottom: 0.375rem;">Technical Specifications:</h4>
          <p style="font-size: 0.8125rem; color: var(--slate-600); background: #ffffff; border: 1px dashed var(--slate-200); padding: 0.625rem; border-radius: 0.375rem; line-height: 1.5;">${escapeHtml(prod.specs || 'Standard medical compliance specifications available upon quotation.')}</p>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; border-top: 1px solid var(--slate-200); padding-top: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label style="font-size: 0.8125rem; font-weight: 600; color: var(--slate-700);">Qty:</label>
            <input type="number" id="modal-product-qty" value="1" min="1" max="999" style="width: 4rem; padding: 0.375rem 0.5rem; border-radius: 0.375rem; border: 1px solid var(--slate-300); font-weight: 600; text-align: center;">
          </div>
          <button id="modal-add-to-quote-btn" class="btn btn-teal" style="flex: 1;">+ Add to Quotation List</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-add-to-quote-btn').onclick = () => {
    const qtyInput = document.getElementById('modal-product-qty');
    const quantity = parseInt(qtyInput.value, 10) || 1;
    addToQuote(prod.id, quantity);
    modal.classList.remove('open');
  };

  modal.classList.add('open');
}

// Quotation Drawer
export function renderCartDrawer() {
  const container = document.getElementById('drawer-items-list');
  const emptyState = document.getElementById('drawer-empty-state');
  const footer = document.getElementById('drawer-footer-actions');
  const totalCountEl = document.getElementById('drawer-total-count');
  const estTotalEl = document.getElementById('drawer-est-total');

  if (!container) return;

  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTotal = state.cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (totalCountEl) totalCountEl.textContent = totalCount;
  if (estTotalEl) estTotalEl.textContent = formatPhp(estimatedTotal);

  if (state.cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (container) container.innerHTML = '';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (footer) footer.style.display = 'block';

  container.innerHTML = state.cart.map(item => `
    <div class="quote-item-row">
      <img src="${item.image}" alt="${escapeHtml(item.name)}" class="quote-item-img"/>
      <div class="quote-item-info">
        <div class="quote-item-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
        <div class="quote-item-unit">${escapeHtml(item.packaging || '')} · <span class="tabular">${formatPhp(item.price)}</span></div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.375rem;">
          <div class="qty-stepper">
            <button class="qty-btn quote-minus-btn" data-id="${item.id}">−</button>
            <input type="text" readonly class="qty-input tabular" value="${item.quantity}">
            <button class="qty-btn quote-plus-btn" data-id="${item.id}">+</button>
          </div>
          <button class="btn btn-outline btn-sm quote-remove-btn" data-id="${item.id}" style="color: var(--danger); border-color: var(--slate-200); padding: 0.2rem 0.5rem; font-size: 0.75rem;">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.quote-minus-btn').forEach(b => {
    b.onclick = () => updateCartQuantity(b.getAttribute('data-id'), -1);
  });
  container.querySelectorAll('.quote-plus-btn').forEach(b => {
    b.onclick = () => updateCartQuantity(b.getAttribute('data-id'), 1);
  });
  container.querySelectorAll('.quote-remove-btn').forEach(b => {
    b.onclick = () => removeFromCart(b.getAttribute('data-id'));
  });
}

// Submit Quotation Request
export function handleQuotationSubmit(e) {
  e.preventDefault();

  if (state.cart.length === 0) {
    showToast('Please add at least one product to your quotation list.', 'error');
    return;
  }

  const name = document.getElementById('quote-cust-name').value.trim();
  const company = document.getElementById('quote-cust-company').value.trim();
  const email = document.getElementById('quote-cust-email').value.trim();
  const phone = document.getElementById('quote-cust-phone').value.trim();
  const address = document.getElementById('quote-cust-address').value.trim();
  const notes = document.getElementById('quote-cust-notes').value.trim();

  if (!name || !email || !phone || !address) {
    showToast('Please complete all required fields (Name, Email, Phone, Delivery Address).', 'error');
    return;
  }

  // Generate Reference Number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const refNumber = `QT-2026-${randomSuffix}`;

  const newQuote = {
    id: `qt-${Date.now()}`,
    refNumber,
    customerName: name,
    companyName: company || 'Individual / Household',
    email,
    phone,
    deliveryAddress: address,
    notes,
    items: state.cart.map(item => ({
      id: item.id,
      name: item.name,
      unitPrice: item.price,
      quantity: item.quantity,
      packaging: item.packaging
    })),
    status: 'New',
    internalNotes: 'Received via online quotation demo request.',
    createdAt: new Date().toISOString()
  };

  // Save to quotes collection
  state.quotes.unshift(newQuote);
  persistQuotes();

  // Clear cart
  state.cart = [];
  persistCart();

  // Close form modal / drawer
  const checkoutModal = document.getElementById('quote-checkout-modal');
  if (checkoutModal) checkoutModal.classList.remove('open');
  const drawer = document.getElementById('quote-drawer-panel');
  const drawerOverlay = document.getElementById('quote-drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (drawerOverlay) drawerOverlay.classList.remove('open');

  // Reset form
  e.target.reset();

  // Show confirmation modal
  showQuotationConfirmationModal(refNumber, newQuote);
}

function showQuotationConfirmationModal(refNumber, quoteData) {
  const modal = document.getElementById('quote-confirm-modal');
  const refEl = document.getElementById('confirm-ref-number');
  const detailsEl = document.getElementById('confirm-details-box');
  if (!modal) return;

  if (refEl) refEl.textContent = refNumber;
  if (detailsEl) {
    const itemsSummary = quoteData.items.map(i => `${escapeHtml(i.name)} (x${i.quantity})`).join(', ');
    detailsEl.innerHTML = `
      <p style="margin-bottom: 0.375rem;"><strong>Customer:</strong> ${escapeHtml(quoteData.customerName)} ${quoteData.companyName ? `(${escapeHtml(quoteData.companyName)})` : ''}</p>
      <p style="margin-bottom: 0.375rem;"><strong>Email:</strong> ${escapeHtml(quoteData.email)} · <strong>Phone:</strong> ${escapeHtml(quoteData.phone)}</p>
      <p style="margin-bottom: 0.375rem;"><strong>Destination:</strong> ${escapeHtml(quoteData.deliveryAddress)}</p>
      <p style="margin-bottom: 0.375rem;"><strong>Requested Items:</strong> ${itemsSummary}</p>
    `;
  }

  modal.classList.add('open');
}

// Render FAQs
export function renderFaqs() {
  const container = document.getElementById('faq-accordion-container');
  if (!container) return;

  container.innerHTML = state.faqs.map((faq, idx) => `
    <div class="faq-item ${idx === 0 ? 'open' : ''}">
      <button class="faq-question">
        <span>${escapeHtml(faq.question)}</span>
        <span class="faq-toggle-icon">${idx === 0 ? '−' : '+'}</span>
      </button>
      <div class="faq-answer">
        ${escapeHtml(faq.answer)}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.faq-question').forEach(btn => {
    btn.onclick = () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open');
      const icon = item.querySelector('.faq-toggle-icon');
      if (icon) icon.textContent = isOpen ? '+' : '−';
    };
  });
}
