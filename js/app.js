/**
 * ROYAL EYE SOLAR POWER - MAIN APPLICATION CONTROLLER
 * Fully async: all inventory operations backed by Supabase.
 * Real-time sync via Supabase Realtime — every open device
 * sees changes the moment they are saved.
 */

const AppState = {
  activeCategory:    "all",
  searchQuery:       "",
  selectedBrand:     "all",
  inStockOnly:       false,
  sortBy:            "dailyStock",
  sortAsc:           false,
  editingProductId:  null,
  activeShareProduct: null
};

const CATEGORIES = [
  { id: "all",             label: "All Solar Products",    icon: "⚡" },
  { id: "panels",          label: "Solar Panels",          icon: "☀️" },
  { id: "inverter",        label: "Inverters",             icon: "🔌" },
  { id: "water-heater",    label: "Solar Water Heaters",   icon: "♨️" },
  { id: "battery",         label: "Solar Batteries",       icon: "🔋" },
  { id: "lithium-battery", label: "Lithium Batteries",     icon: "⚡" }
];

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

// ── App Bootstrap ─────────────────────────────────────────────────
async function initApp() {
  showLoadingOverlay(true);
  try {
    await refreshUI();
    bindEvents();
    connectRealtime();
    showConfigBanner();
  } finally {
    showLoadingOverlay(false);
  }
}

// ── Supabase Realtime subscription ───────────────────────────────
function connectRealtime() {
  StorageService.subscribeRealtime(async () => {
    // Another device made a change — refresh silently
    await refreshUI();
    AgentTools.showToast("📡 Live data updated from another device", "info");
  });
}

// ── Config banner (shown when Supabase not yet set up) ────────────
function showConfigBanner() {
  if (typeof SUPABASE_CONFIGURED !== "undefined" && !SUPABASE_CONFIGURED) {
    const banner = document.getElementById("config-banner");
    if (banner) banner.style.display = "flex";
  }
}

// ── Loading overlay ───────────────────────────────────────────────
function showLoadingOverlay(show) {
  let overlay = document.getElementById("loading-overlay");
  if (!overlay) return;
  overlay.style.display = show ? "flex" : "none";
}

// ── Category Tabs ─────────────────────────────────────────────────
async function renderCategoryTabs() {
  const container = document.getElementById("category-tabs");
  if (!container) return;

  const products = await StorageService.getInventory();

  container.innerHTML = CATEGORIES.map(cat => {
    const count = cat.id === "all"
      ? products.length
      : products.filter(p => p.category === cat.id).length;
    const isActive = AppState.activeCategory === cat.id ? "active" : "";
    return `
      <button class="category-tab ${isActive}" data-category="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
        <span class="tab-badge">${count}</span>
      </button>
    `;
  }).join("");

  container.querySelectorAll(".category-tab").forEach(tab => {
    tab.addEventListener("click", async () => {
      AppState.activeCategory = tab.dataset.category;
      await renderCategoryTabs();
      await renderProductsTable();
    });
  });
}

// ── Brand Filter Dropdown ─────────────────────────────────────────
async function populateBrandFilter() {
  const select = document.getElementById("brand-filter");
  if (!select) return;

  const products = await StorageService.getInventory();
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();

  select.innerHTML = `
    <option value="all">All Brands &amp; Partners</option>
    ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
  `;
  select.value = AppState.selectedBrand;
}

// ── Event Bindings ────────────────────────────────────────────────
function bindEvents() {
  // Search
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", async (e) => {
      AppState.searchQuery = e.target.value.trim().toLowerCase();
      await renderProductsTable();
    });
  }

  // Brand Filter
  const brandFilter = document.getElementById("brand-filter");
  if (brandFilter) {
    brandFilter.addEventListener("change", async (e) => {
      AppState.selectedBrand = e.target.value;
      await renderProductsTable();
    });
  }

  // In-Stock Toggle
  const stockToggle = document.getElementById("toggle-instock");
  if (stockToggle) {
    stockToggle.addEventListener("click", async () => {
      AppState.inStockOnly = !AppState.inStockOnly;
      stockToggle.classList.toggle("active", AppState.inStockOnly);
      stockToggle.innerHTML = AppState.inStockOnly
        ? `<span>✓</span> In Stock Only`
        : `<span>○</span> In Stock Only`;
      await renderProductsTable();
    });
  }

  // Add Product
  const btnAddProduct = document.getElementById("btn-add-product");
  if (btnAddProduct) {
    btnAddProduct.addEventListener("click", () => openProductModal());
  }

  // Export Excel (toolbar)
  const btnExportExcel = document.getElementById("btn-export-excel");
  if (btnExportExcel) {
    btnExportExcel.addEventListener("click", () => openExportModal());
  }

  // Export Excel (footer)
  const btnFooterExcel = document.getElementById("btn-footer-export-excel");
  if (btnFooterExcel) {
    btnFooterExcel.addEventListener("click", () => openExportModal());
  }

  // Quick CSV
  const btnQuickCsv = document.getElementById("btn-quick-csv");
  if (btnQuickCsv) {
    btnQuickCsv.addEventListener("click", async () => {
      const filtered = await getFilteredProducts();
      const dateStr = new Date().toISOString().slice(0, 10);
      AgentTools.exportToCSV(filtered, `RoyalEye_QuickStock_${dateStr}.csv`, {
        includeSpecs: true, includePricing: true, includeStock: true,
        includeWarranty: true, includeValuation: true
      });
    });
  }

  // Print Report
  const btnPrintReport = document.getElementById("btn-print-report");
  if (btnPrintReport) {
    btnPrintReport.addEventListener("click", async () => {
      const filtered = await getFilteredProducts();
      AgentTools.printDailyStockSheet(filtered);
    });
  }

  // Export Modal Confirm
  const btnConfirmExport = document.getElementById("btn-confirm-export");
  if (btnConfirmExport) {
    btnConfirmExport.addEventListener("click", handleExecuteExport);
  }

  // Export modal radio/input changes
  document.querySelectorAll('input[name="export-scope"]').forEach(r => {
    r.addEventListener("change", () => updateExportModalPreview());
  });
  document.querySelectorAll('input[name="export-format"]').forEach(r => {
    r.addEventListener("change", () => updateExportModalPreview());
  });
  const exportFilenameInput = document.getElementById("export-filename");
  if (exportFilenameInput) {
    exportFilenameInput.addEventListener("input", () => updateExportModalPreview());
  }

  // Backup export
  const btnExport = document.getElementById("btn-export-backup");
  if (btnExport) {
    btnExport.addEventListener("click", async () => {
      await StorageService.exportBackup();
      AgentTools.showToast("✓ Catalog backup downloaded.", "success");
    });
  }

  // Reset catalog
  const btnReset = document.getElementById("btn-reset-default");
  if (btnReset) {
    btnReset.addEventListener("click", async () => {
      if (confirm("Reset catalog back to official Royal Eye seed inventory? Any custom items will be replaced.")) {
        showLoadingOverlay(true);
        await StorageService.resetToDefault();
        await refreshUI();
        showLoadingOverlay(false);
        AgentTools.showToast("Catalog reset to factory default.", "info");
      }
    });
  }

  // Product form submit
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", handleProductFormSubmit);
  }

  // Close modals
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", closeAllModals);
  });
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // Table sorting
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", async () => {
      const sortField = th.dataset.sort;
      if (AppState.sortBy === sortField) {
        AppState.sortAsc = !AppState.sortAsc;
      } else {
        AppState.sortBy = sortField;
        AppState.sortAsc = true;
      }
      await renderProductsTable();
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const searchEl = document.getElementById("search-input");
    if ((e.key === "/" || (e.ctrlKey && e.key === "k")) && document.activeElement !== searchEl) {
      e.preventDefault();
      searchEl?.focus();
    }
    if (e.key === "Escape") closeAllModals();
  });

  // Logout
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("ROYAL_EYE_AGENT_AUTH");
      window.location.replace("login.html");
    });
  }
}

// ── Filter + Sort Products ────────────────────────────────────────
async function getFilteredProducts() {
  let products = await StorageService.getInventory();

  if (AppState.activeCategory !== "all") {
    products = products.filter(p => p.category === AppState.activeCategory);
  }
  if (AppState.selectedBrand !== "all") {
    products = products.filter(p => p.brand === AppState.selectedBrand);
  }
  if (AppState.inStockOnly) {
    products = products.filter(p => p.dailyStock > 0);
  }
  if (AppState.searchQuery) {
    const q = AppState.searchQuery;
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.specs?.capacity   && p.specs.capacity.toLowerCase().includes(q)) ||
      (p.specs?.type       && p.specs.type.toLowerCase().includes(q)) ||
      (p.specs?.highlights && p.specs.highlights.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    );
  }

  products.sort((a, b) => {
    let valA = a[AppState.sortBy];
    let valB = b[AppState.sortBy];
    if (AppState.sortBy === "price" || AppState.sortBy === "dailyStock") {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else {
      valA = String(valA || "").toLowerCase();
      valB = String(valB || "").toLowerCase();
    }
    if (valA < valB) return AppState.sortAsc ? -1 : 1;
    if (valA > valB) return AppState.sortAsc ? 1 : -1;
    return 0;
  });

  return products;
}

// ── KPI Dashboard ─────────────────────────────────────────────────
async function renderKpiMetrics() {
  const stats = await StorageService.getKpiMetrics();

  const elTotalUnits  = document.getElementById("kpi-total-units");
  const elInStock     = document.getElementById("kpi-in-stock");
  const elLowStock    = document.getElementById("kpi-low-stock");
  const elModelsCount = document.getElementById("kpi-models-count");

  if (elTotalUnits)  elTotalUnits.textContent  = stats.totalStockUnits.toLocaleString("en-IN");
  if (elInStock)     elInStock.textContent      = stats.inStockModels;
  if (elLowStock)    elLowStock.textContent     = stats.lowStockModels;
  if (elModelsCount) elModelsCount.textContent  = stats.totalProducts;
}

// ── Products Table ────────────────────────────────────────────────
async function renderProductsTable() {
  const tbody        = document.getElementById("products-tbody");
  const emptyState   = document.getElementById("empty-state");
  const countDisplay = document.getElementById("visible-count");
  if (!tbody) return;

  const products = await getFilteredProducts();
  if (countDisplay) countDisplay.textContent = `Showing ${products.length} Products`;

  if (products.length === 0) {
    tbody.innerHTML = "";
    if (emptyState) emptyState.style.display = "flex";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = products.map(p => {
    let statusBadgeClass = "badge-in-stock";
    let statusLabel = "In Stock";
    if (p.dailyStock === 0) {
      statusBadgeClass = "badge-out-of-stock";
      statusLabel = "Out of Stock";
    } else if (p.dailyStock <= 5) {
      statusBadgeClass = "badge-low-stock";
      statusLabel = "Low Stock";
    }

    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0
    }).format(p.price);

    const formattedMrp = p.mrp ? new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0
    }).format(p.mrp) : "";

    const categoryIconMap = {
      "panels":          "☀️ Panel",
      "inverter":        "🔌 Inverter",
      "water-heater":    "♨️ Heater",
      "battery":         "🔋 Battery",
      "lithium-battery": "⚡ Lithium"
    };
    const categoryText = categoryIconMap[p.category] || p.category;

    return `
      <tr data-id="${p.id}">
        <td data-label="Product">
          <div class="product-title-group">
            <div class="product-name">
              ${p.name}
              ${p.badge ? `<span class="product-badge-pill">${p.badge}</span>` : ""}
            </div>
            <div class="product-specs-sub">
              <span><strong>Capacity:</strong> ${p.specs?.capacity || "N/A"}</span>
              <span>•</span>
              <span><strong>Type:</strong> ${p.specs?.type || "Standard"}</span>
              <span>•</span>
              <span><strong>Warranty:</strong> ${p.specs?.warranty || "Official"}</span>
            </div>
          </div>
        </td>
        <td data-label="Category">
          <span style="font-weight: 600; color: #e2e2ec;">${categoryText}</span>
        </td>
        <td data-label="Brand">
          <span class="brand-pill">${p.brand}</span>
        </td>
        <td data-label="Daily Stock">
          <div class="stock-cell-group">
            <span class="stock-count-number" style="color: ${p.dailyStock === 0 ? "#ff334b" : (p.dailyStock <= 5 ? "#ffab00" : "#00e676")};">
              ${p.dailyStock}
            </span>
            <span class="stock-badge ${statusBadgeClass}">${statusLabel}</span>
          </div>
        </td>
        <td data-label="Price">
          <div>
            <div class="price-tag">${formattedPrice}</div>
            ${formattedMrp ? `<div class="price-mrp">MRP ${formattedMrp}</div>` : ""}
          </div>
        </td>
        <td data-label="Verified Date">
          <span class="date-pill">${p.date}</span>
        </td>
        <td data-label="Actions" class="actions-cell">
          <button class="icon-action-btn btn-wa" title="Send WhatsApp Quote to Client" onclick="handleWhatsAppShare('${p.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>
          <button class="icon-action-btn" title="Copy Marketing Pitch to Clipboard" onclick="handleCopyPitch('${p.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="icon-action-btn btn-edit" title="Update Daily Stock &amp; Price" onclick="openProductModal('${p.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="icon-action-btn btn-delete" title="Delete Product" onclick="handleDeleteProduct('${p.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ── WhatsApp Share ────────────────────────────────────────────────
async function handleWhatsAppShare(productId) {
  const product = await StorageService.getProduct(productId);
  if (!product) return;

  AppState.activeShareProduct = product;
  const modal       = document.getElementById("modal-whatsapp");
  const previewBox  = document.getElementById("wa-quote-preview");
  const btnDirectSend = document.getElementById("wa-btn-direct");
  const btnCopy     = document.getElementById("wa-btn-copy");

  const pitchText = AgentTools.generateWhatsAppPitch(product);
  if (previewBox) previewBox.textContent = pitchText;

  if (btnDirectSend) {
    btnDirectSend.onclick = () => {
      const clientPhone = document.getElementById("wa-client-phone")?.value || "";
      AgentTools.sendWhatsAppQuote(product, clientPhone);
      closeAllModals();
    };
  }
  if (btnCopy) {
    btnCopy.onclick = () => {
      AgentTools.copyQuoteToClipboard(product);
      closeAllModals();
    };
  }
  if (modal) modal.classList.add("active");
}

// ── Quick copy pitch from table ───────────────────────────────────
async function handleCopyPitch(productId) {
  const product = await StorageService.getProduct(productId);
  if (product) AgentTools.copyQuoteToClipboard(product);
}

// ── Open Add / Edit Modal ─────────────────────────────────────────
async function openProductModal(productId = null) {
  AppState.editingProductId = productId;
  const modal      = document.getElementById("modal-product-form");
  const modalTitle = document.getElementById("product-modal-title");
  const form       = document.getElementById("product-form");
  if (!modal || !form) return;

  form.reset();

  if (productId) {
    const product = await StorageService.getProduct(productId);
    if (!product) return;
    if (modalTitle) modalTitle.innerHTML = `<span>✏️</span> Edit Product &amp; Daily Stock`;
    document.getElementById("prod-name").value      = product.name;
    document.getElementById("prod-category").value  = product.category;
    document.getElementById("prod-brand").value     = product.brand;
    document.getElementById("prod-stock").value     = product.dailyStock;
    document.getElementById("prod-price").value     = product.price;
    document.getElementById("prod-mrp").value       = product.mrp || Math.round(product.price * 1.25);
    document.getElementById("prod-capacity").value  = product.specs?.capacity  || "";
    document.getElementById("prod-type").value      = product.specs?.type      || "";
    document.getElementById("prod-warranty").value  = product.specs?.warranty  || "";
    document.getElementById("prod-badge").value     = product.badge            || "";
    document.getElementById("prod-highlights").value = product.specs?.highlights || "";
  } else {
    if (modalTitle) modalTitle.innerHTML = `<span>➕</span> Add New Solar Product`;
    document.getElementById("prod-category").value = AppState.activeCategory !== "all" ? AppState.activeCategory : "panels";
    document.getElementById("prod-stock").value    = 10;
  }

  modal.classList.add("active");
}

// ── Form Submit ───────────────────────────────────────────────────
async function handleProductFormSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Saving…"; }

  const data = {
    name:       document.getElementById("prod-name").value.trim(),
    category:   document.getElementById("prod-category").value,
    brand:      document.getElementById("prod-brand").value.trim(),
    dailyStock: parseInt(document.getElementById("prod-stock").value, 10),
    price:      parseFloat(document.getElementById("prod-price").value),
    mrp:        parseFloat(document.getElementById("prod-mrp").value),
    capacity:   document.getElementById("prod-capacity").value.trim(),
    type:       document.getElementById("prod-type").value.trim(),
    warranty:   document.getElementById("prod-warranty").value.trim(),
    badge:      document.getElementById("prod-badge").value.trim(),
    highlights: document.getElementById("prod-highlights").value.trim()
  };

  try {
    if (AppState.editingProductId) {
      await StorageService.updateProduct(AppState.editingProductId, {
        name: data.name, category: data.category, brand: data.brand,
        dailyStock: data.dailyStock, price: data.price, mrp: data.mrp, badge: data.badge,
        specs: { capacity: data.capacity, type: data.type, warranty: data.warranty, highlights: data.highlights }
      });
      AgentTools.showToast(`✓ Updated ${data.name} (Stock: ${data.dailyStock})`, "success");
    } else {
      await StorageService.addProduct(data);
      AgentTools.showToast(`✓ Added ${data.name} to Daily Catalog`, "success");
    }
    closeAllModals();
    await refreshUI();
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Save Product"; }
  }
}

// ── Delete Product ────────────────────────────────────────────────
async function handleDeleteProduct(productId) {
  const product = await StorageService.getProduct(productId);
  if (!product) return;
  if (confirm(`Are you sure you want to remove "${product.name}" from inventory?`)) {
    await StorageService.deleteProduct(productId);
    AgentTools.showToast("Product removed from catalog.", "info");
    await refreshUI();
  }
}

// ── Close All Modals ──────────────────────────────────────────────
function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
  AppState.editingProductId  = null;
  AppState.activeShareProduct = null;
}

// ── Full UI Refresh ───────────────────────────────────────────────
async function refreshUI() {
  await renderKpiMetrics();
  await renderCategoryTabs();
  await populateBrandFilter();
  await renderProductsTable();
}

// ── Export Modal ──────────────────────────────────────────────────
async function openExportModal() {
  const modal = document.getElementById("modal-export-excel");
  if (!modal) return;

  const filtered = await getFilteredProducts();
  const all      = await StorageService.getInventory();

  const badgeFiltered = document.getElementById("badge-filtered-count");
  if (badgeFiltered) badgeFiltered.textContent = `${filtered.length} items`;
  const badgeAll = document.getElementById("badge-all-count");
  if (badgeAll) badgeAll.textContent = `${all.length} items`;

  const descFiltered = document.getElementById("export-count-filtered");
  if (descFiltered) {
    const isFiltered = AppState.activeCategory !== "all" || AppState.selectedBrand !== "all" || AppState.inStockOnly || AppState.searchQuery;
    descFiltered.textContent = isFiltered ? "Currently filtered search & category items" : "All current catalog items";
  }

  await updateExportModalPreview();
  modal.classList.add("active");
}

async function updateExportModalPreview() {
  const scopeVal   = document.querySelector('input[name="export-scope"]:checked')?.value || "filtered";
  const formatVal  = document.querySelector('input[name="export-format"]:checked')?.value || "xls";
  const customName = document.getElementById("export-filename")?.value.trim();

  const scopeCardFiltered = document.getElementById("scope-card-filtered");
  const scopeCardAll      = document.getElementById("scope-card-all");
  if (scopeCardFiltered) scopeCardFiltered.classList.toggle("active", scopeVal === "filtered");
  if (scopeCardAll)      scopeCardAll.classList.toggle("active",      scopeVal === "all");

  const formatCardXls = document.getElementById("format-card-xls");
  const formatCardCsv = document.getElementById("format-card-csv");
  if (formatCardXls) formatCardXls.classList.toggle("active", formatVal === "xls");
  if (formatCardCsv) formatCardCsv.classList.toggle("active", formatVal === "csv");

  const filtered = await getFilteredProducts();
  const all      = await StorageService.getInventory();
  const targetCount = scopeVal === "filtered" ? filtered.length : all.length;

  const dateStr  = new Date().toISOString().slice(0, 10);
  const baseName = customName || `RoyalEye_Solar_Inventory_${dateStr}`;
  const ext      = formatVal === "csv" ? ".csv" : ".xls";

  const previewFilename = document.getElementById("export-preview-filename");
  if (previewFilename) previewFilename.textContent = `${baseName}${ext}`;

  const previewCount = document.getElementById("export-preview-count");
  if (previewCount) previewCount.textContent = `${targetCount} products`;

  const btnExportText = document.getElementById("btn-export-text");
  if (btnExportText) btnExportText.textContent = formatVal === "csv" ? "Download CSV File" : "Download Excel (.xls)";
}

async function handleExecuteExport() {
  const scopeVal   = document.querySelector('input[name="export-scope"]:checked')?.value || "filtered";
  const formatVal  = document.querySelector('input[name="export-format"]:checked')?.value || "xls";
  const customName = document.getElementById("export-filename")?.value.trim();

  const products = scopeVal === "filtered"
    ? await getFilteredProducts()
    : await StorageService.getInventory();

  const options = {
    format:           formatVal,
    filename:         customName || "",
    includeStock:     document.getElementById("col-stock")?.checked     ?? true,
    includePricing:   document.getElementById("col-pricing")?.checked   ?? true,
    includeSpecs:     document.getElementById("col-specs")?.checked     ?? true,
    includeWarranty:  document.getElementById("col-warranty")?.checked  ?? true,
    includeValuation: document.getElementById("col-valuation")?.checked ?? true
  };

  AgentTools.exportToExcel(products, options);
  closeAllModals();
}
