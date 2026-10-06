/**
 * ROYAL EYE SOLAR POWER - SUPABASE STORAGE ENGINE
 * ─────────────────────────────────────────────────
 * All inventory is stored in a Supabase PostgreSQL table.
 * Real-time updates are pushed via Supabase Realtime channels
 * so every open browser tab / device sees changes instantly.
 *
 * SETUP: Edit SUPABASE_URL and SUPABASE_ANON_KEY below with
 *        your own project credentials from https://supabase.com
 */

// ── Supabase credentials ────────────────────────────────────────────
// Replace these with YOUR project values from supabase.com dashboard
const SUPABASE_URL      = "https://ffbyqnxhdeafzahgaqxf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1xEblsxiuRXajEMGrbl-WQ_W70ZX3hB";
const TABLE_NAME        = "inventory";
// ───────────────────────────────────────────────────────────────────

// Detect if Supabase is not configured yet
const SUPABASE_CONFIGURED = (
  SUPABASE_URL  !== "https://YOUR_PROJECT_ID.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_ANON_PUBLIC_KEY"
);

// Lazy supabase client (created once)
let _supabaseClient = null;
function getSupabase() {
  if (_supabaseClient) return _supabaseClient;
  if (!SUPABASE_CONFIGURED) return null;
  _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabaseClient;
}

const StorageService = {
  _cache: null,

  // ── READ all products ──────────────────────────────────────────
  async getInventory() {
    if (this._cache) return this._cache;

    const sb = getSupabase();
    if (!sb) {
      // Supabase not configured — fall back to localStorage for local dev
      this._cache = this._loadLocalFallback();
      return this._cache;
    }

    try {
      const { data, error } = await sb
        .from(TABLE_NAME)
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // First run: seed default inventory
        this._cache = [...DEFAULT_INVENTORY];
        await this.saveInventory(this._cache);
      } else {
        // Map DB rows → product objects
        this._cache = data.map(row => ({
          id:         row.product_id,
          name:       row.name,
          category:   row.category,
          brand:      row.brand,
          dailyStock: row.daily_stock,
          price:      row.price,
          mrp:        row.mrp,
          date:       row.verified_date,
          badge:      row.badge,
          specs: {
            capacity:   row.spec_capacity,
            type:       row.spec_type,
            efficiency: row.spec_efficiency,
            warranty:   row.spec_warranty,
            voltage:    row.spec_voltage,
            highlights: row.spec_highlights
          },
          sort_order: row.sort_order
        }));
      }
    } catch (err) {
      console.error("Supabase getInventory error:", err);
      this._cache = this._loadLocalFallback();
    }

    return this._cache;
  },

  // ── SAVE / UPSERT full inventory list ─────────────────────────
  async saveInventory(products) {
    this._cache = products;

    const sb = getSupabase();
    if (!sb) {
      this._saveLocalFallback(products);
      return;
    }

    const rows = products.map((p, idx) => ({
      product_id:      p.id,
      name:            p.name,
      category:        p.category,
      brand:           p.brand,
      daily_stock:     p.dailyStock,
      price:           p.price,
      mrp:             p.mrp || null,
      verified_date:   p.date,
      badge:           p.badge || null,
      spec_capacity:   p.specs?.capacity   || null,
      spec_type:       p.specs?.type       || null,
      spec_efficiency: p.specs?.efficiency || null,
      spec_warranty:   p.specs?.warranty   || null,
      spec_voltage:    p.specs?.voltage    || null,
      spec_highlights: p.specs?.highlights || null,
      sort_order:      idx
    }));

    try {
      // First delete rows that no longer exist
      const currentIds = rows.map(r => r.product_id);
      await sb.from(TABLE_NAME).delete().not("product_id", "in", `(${currentIds.map(id => `"${id}"`).join(",")})`);
      // Upsert all rows
      const { error } = await sb.from(TABLE_NAME).upsert(rows, { onConflict: "product_id" });
      if (error) throw error;
    } catch (err) {
      console.error("Supabase saveInventory error:", err);
    }
  },

  // ── GET single product ─────────────────────────────────────────
  async getProduct(id) {
    const products = await this.getInventory();
    return products.find(p => p.id === id) || null;
  },

  // ── ADD new product ────────────────────────────────────────────
  async addProduct(productData) {
    const products = await this.getInventory();
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });

    const newProduct = {
      id:         "REP-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name:       productData.name.trim(),
      category:   productData.category,
      brand:      productData.brand.trim(),
      dailyStock: Math.max(0, parseInt(productData.dailyStock, 10) || 0),
      price:      Math.max(0, parseFloat(productData.price) || 0),
      mrp:        productData.mrp
                    ? Math.max(0, parseFloat(productData.mrp))
                    : Math.round((parseFloat(productData.price) || 0) * 1.25),
      date:       formattedDate,
      specs: {
        capacity:   productData.capacity   || "Standard Capacity",
        type:       productData.type       || "Commercial Solar Grade",
        efficiency: productData.efficiency || "High Efficiency",
        warranty:   productData.warranty   || "Standard Royal Eye Warranty",
        voltage:    productData.voltage    || "Standard System Voltage",
        highlights: productData.highlights || "Certified Solar Equipment"
      },
      badge: productData.badge || (parseInt(productData.dailyStock, 10) > 20 ? "In Stock" : "Standard")
    };

    products.unshift(newProduct);
    await this.saveInventory(products);
    return newProduct;
  },

  // ── UPDATE existing product ────────────────────────────────────
  async updateProduct(id, updatedFields) {
    const products = await this.getInventory();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });

    products[index] = {
      ...products[index],
      ...updatedFields,
      dailyStock: Math.max(0, parseInt(
        updatedFields.dailyStock !== undefined ? updatedFields.dailyStock : products[index].dailyStock, 10
      )),
      price: Math.max(0, parseFloat(
        updatedFields.price !== undefined ? updatedFields.price : products[index].price
      )),
      date: formattedDate
    };

    await this.saveInventory(products);
    return products[index];
  },

  // ── DELETE product ─────────────────────────────────────────────
  async deleteProduct(id) {
    const products = await this.getInventory();
    const filtered = products.filter(p => p.id !== id);

    const sb = getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from(TABLE_NAME).delete().eq("product_id", id);
        if (error) throw error;
        this._cache = filtered;
      } catch (err) {
        console.error("Supabase deleteProduct error:", err);
        await this.saveInventory(filtered);
      }
    } else {
      await this.saveInventory(filtered);
    }

    return filtered;
  },

  // ── RESET to defaults ──────────────────────────────────────────
  async resetToDefault() {
    this._cache = [...DEFAULT_INVENTORY];
    // Delete all then re-insert defaults
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from(TABLE_NAME).delete().neq("product_id", "____never____");
      } catch (e) { /* ignore */ }
    }
    await this.saveInventory(this._cache);
    return this._cache;
  },

  // ── KPI metrics ────────────────────────────────────────────────
  async getKpiMetrics() {
    const products = await this.getInventory();
    let totalStockUnits = 0, inStockModels = 0, lowStockModels = 0,
        outOfStockModels = 0, totalValue = 0;

    products.forEach(p => {
      const qty = parseInt(p.dailyStock, 10) || 0;
      totalStockUnits += qty;
      totalValue += qty * (parseFloat(p.price) || 0);
      if (qty === 0)      outOfStockModels++;
      else if (qty <= 5)  lowStockModels++;
      else                inStockModels++;
    });

    return { totalProducts: products.length, totalStockUnits, inStockModels, lowStockModels, outOfStockModels, totalValue };
  },

  // ── Cache control ──────────────────────────────────────────────
  invalidateCache() {
    this._cache = null;
  },

  // ── Subscribe to real-time changes ────────────────────────────
  subscribeRealtime(onChangeCallback) {
    const sb = getSupabase();
    if (!sb) return null;

    const channel = sb
      .channel("inventory-realtime")
      .on("postgres_changes", {
        event:  "*",
        schema: "public",
        table:  TABLE_NAME
      }, () => {
        this.invalidateCache();
        onChangeCallback();
      })
      .subscribe();

    return channel;
  },

  // ── Backup / restore ──────────────────────────────────────────
  async exportBackup() {
    const data = {
      company:    "Royal Eye Solar Power",
      rexBadge:   "Royal Eye Excellence",
      exportedAt: new Date().toISOString(),
      location:   "Edamuttam, Thrissur, Kerala",
      products:   await this.getInventory()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `royaleye-daily-stock-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importBackup(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : (parsed.products || []);
      if (!items || items.length === 0) throw new Error("No valid product data found in file.");
      await this.saveInventory(items);
      return { success: true, count: items.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ── localStorage fallback (when Supabase not yet configured) ──
  _loadLocalFallback() {
    try {
      const stored = localStorage.getItem("ROYAL_EYE_INVENTORY_V1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* ignore */ }
    return [...DEFAULT_INVENTORY];
  },

  _saveLocalFallback(products) {
    try {
      localStorage.setItem("ROYAL_EYE_INVENTORY_V1", JSON.stringify(products));
      localStorage.setItem("ROYAL_EYE_LAST_SYNC", new Date().toISOString());
    } catch (e) { /* ignore */ }
  }
};
