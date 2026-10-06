/**
 * ROYAL EYE SOLAR POWER - AGENT MARKETING TOOLS
 * Provides 1-click WhatsApp quote generator, clipboard copiers,
 * printable daily stock reports, and notification toasts.
 */

const AgentTools = {
  /**
   * Generates a professionally formatted marketing pitch & price quotation
   * tailored for Royal Eye agents to send to clients on WhatsApp.
   */
  generateWhatsAppPitch(product) {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(product.price);

    const formattedMrp = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(product.mrp);

    const savings = product.mrp > product.price 
      ? `\n💰 *Special Agent Offer:* Save ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.mrp - product.price)} OFF MRP!`
      : "";

    const stockNotice = product.dailyStock > 0 
      ? `🟢 *Live Daily Stock:* ${product.dailyStock} Units Available Ready For Dispatch`
      : `🔴 *Stock Alert:* Available on Priority Booking`;

    const specs = product.specs || {};

    const text = `☀️ *ROYAL EYE SOLAR POWER*
⚡ *REX - Royal Eye Excellence*
_Powering Your Future With The Sun_
📍 Edamuttam, Thrissur, Kerala - 680568

━━━━━━━━━━━━━━━━━━━━
🏷️ *PRODUCT QUOTATION & SPECIFICATIONS*
━━━━━━━━━━━━━━━━━━━━
📦 *Item:* ${product.name}
🏷️ *Brand:* ${product.brand}
📊 *Category:* ${product.category.toUpperCase().replace("-", " ")}
💵 *Offer Price:* *${formattedPrice}* (incl. GST)
🔖 *MRP:* ~${formattedMrp}~${savings}
${stockNotice}

⚙️ *KEY SPECIFICATIONS:*
• *Capacity / Power:* ${specs.capacity || "N/A"}
• *Technology:* ${specs.type || "N/A"}
• *Efficiency / Output:* ${specs.efficiency || "High Performance"}
• *Official Warranty:* ${specs.warranty || "Standard Brand Warranty"}
• *Voltage / Specs:* ${specs.voltage || "Standard"}
${specs.highlights ? `• *Highlights:* ${specs.highlights}` : ""}

🌟 *WHY CHOOSE ROYAL EYE SOLAR?*
✅ Authorized Dealer for Waaree, Vikram, Adani & Microtek
✅ Clean Energy & Lower Electricity Bills
✅ Residential, Commercial & Industrial Solar
✅ Sales | Installation | Kerala Govt. & KSEB Approvals | AMC

📞 *CONTACT SALES & BOOKING:*
📱 +91 98466 53834
📱 +91 80758 73679
📱 +91 7034022603
🏢 Royal Eye Solar Power, Edamuttam, Thrissur
🌐 Daily Stock Verified: ${product.date}`;

    return text;
  },

  /**
   * Launch WhatsApp with pre-filled quote text
   */
  sendWhatsAppQuote(product, clientPhone = "") {
    const message = this.generateWhatsAppPitch(product);
    const encoded = encodeURIComponent(message);
    const cleanPhone = clientPhone ? clientPhone.replace(/[^0-9]/g, "") : "";
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    
    window.open(url, "_blank");
    this.showToast("WhatsApp quote ready!", "success");
  },

  /**
   * Copy marketing quote directly to clipboard
   */
  async copyQuoteToClipboard(product) {
    const text = this.generateWhatsAppPitch(product);
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("✓ Quote copied to clipboard! Paste directly into WhatsApp/SMS.", "success");
      return true;
    } catch (err) {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.showToast("✓ Quote copied to clipboard!", "success");
      return true;
    }
  },

  /**
   * Printable / PDF Daily Stock Sheet
   */
  printDailyStockSheet(products) {
    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) {
      alert("Please allow popups to print the Daily Stock Sheet.");
      return;
    }

    const rows = products.map((p, idx) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${p.name}<br><small style="color: #666;">${p.brand} | ${p.specs?.capacity || ""}</small></td>
        <td style="padding: 8px; border: 1px solid #ddd; text-transform: uppercase;">${p.category.replace("-", " ")}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; font-size: 15px; color: ${p.dailyStock === 0 ? '#d32f2f' : (p.dailyStock <= 5 ? '#f57c00' : '#2e7d32')};">
          ${p.dailyStock} units
        </td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${p.price.toLocaleString("en-IN")}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${p.date}</td>
      </tr>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Royal Eye Solar Power - Daily Stock Sheet (${today})</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #111; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff1e27; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #000; }
          .title span { color: #ff1e27; }
          .subtitle { font-size: 13px; color: #555; }
          .meta { text-align: right; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th { background: #1a1a22; color: #fff; padding: 10px 8px; border: 1px solid #333; text-align: left; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; display: flex; justify-content: space-between; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">ROYAL <span>EYE</span> SOLAR POWER</div>
            <div class="subtitle">REX - Royal Eye Excellence | Edamuttam, Thrissur, Kerala</div>
            <div class="subtitle">Phone: +91 98466 53834 / +91 80758 73679 / +91 7034022603</div>
          </div>
          <div class="meta">
            <h3 style="margin: 0; color: #ff1e27;">DAILY AGENT STOCK SHEET</h3>
            <div><strong>Date:</strong> ${today}</div>
            <div><strong>Total Items:</strong> ${products.length} Models</div>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <button onclick="window.print()" style="background: #ff1e27; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Product Name & Specification</th>
              <th style="width: 130px;">Category</th>
              <th style="width: 110px; text-align: center;">Daily Stock</th>
              <th style="width: 110px; text-align: right;">Price (₹)</th>
              <th style="width: 110px; text-align: center;">Verified Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          <div>* Confidential: Prepared for Royal Eye Marketing & Field Sales Team.</div>
          <div>Page Generated: ${new Date().toLocaleTimeString("en-IN")}</div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  },

  /**
   * Displays modern toast alert on bottom right
   */
  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `
      <div class="toast-indicator"></div>
      <div class="toast-body">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  /**
   * Main Excel export entry point supporting XLS and CSV formats
   */
  exportToExcel(products, options = {}) {
    if (!products || products.length === 0) {
      this.showToast("No products available to export.", "warning");
      return;
    }

    const {
      format = "xls", // 'xls' or 'csv'
      filename = "",
      includeSpecs = true,
      includePricing = true,
      includeStock = true,
      includeWarranty = true,
      includeValuation = true
    } = options;

    const dateStr = new Date().toISOString().slice(0, 10);
    const defaultName = `RoyalEye_Solar_Inventory_${dateStr}`;
    const cleanFilename = (filename || defaultName).replace(/[^a-zA-Z0-9_\-]/g, "_");

    if (format === "csv") {
      this.exportToCSV(products, `${cleanFilename}.csv`, {
        includeSpecs,
        includePricing,
        includeStock,
        includeWarranty,
        includeValuation
      });
    } else {
      this.exportToSpreadsheetML(products, `${cleanFilename}.xls`, {
        includeSpecs,
        includePricing,
        includeStock,
        includeWarranty,
        includeValuation
      });
    }
  },

  /**
   * Generate RFC-4180 CSV with UTF-8 BOM (instant compatibility with Excel & Sheets)
   */
  exportToCSV(products, filename, opts) {
    const headers = ["SL No", "Product ID", "Product Name", "Category", "Partner Brand"];
    if (opts.includeStock) headers.push("Daily Stock (Units)", "Stock Status");
    if (opts.includePricing) headers.push("Offer Price (₹)", "Standard MRP (₹)", "Agent Margin / Discount (₹)");
    if (opts.includeValuation) headers.push("Total Stock Value (₹)");
    if (opts.includeSpecs) headers.push("Capacity / Rating", "Technology / Cell Type", "Efficiency / Output");
    if (opts.includeWarranty) headers.push("Warranty", "System Voltage", "Highlights & Approvals");
    headers.push("Verified Date");

    const escape = (val) => {
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = [headers.map(escape).join(",")];
    let totalStock = 0;
    let totalValue = 0;

    products.forEach((p, idx) => {
      const stock = Number(p.dailyStock) || 0;
      const price = Number(p.price) || 0;
      const mrp = Number(p.mrp) || Math.round(price * 1.25);
      const margin = Math.max(0, mrp - price);
      const stockVal = stock * price;
      totalStock += stock;
      totalValue += stockVal;

      const specs = p.specs || {};
      const status = stock === 0 ? "Out of Stock" : (stock <= 5 ? "Low Stock" : "In Stock");

      const row = [
        (idx + 1).toString(),
        p.id || "",
        p.name || "",
        (p.category || "").replace("-", " ").toUpperCase(),
        p.brand || ""
      ];

      if (opts.includeStock) {
        row.push(stock.toString(), status);
      }
      if (opts.includePricing) {
        row.push(price.toString(), mrp.toString(), margin.toString());
      }
      if (opts.includeValuation) {
        row.push(stockVal.toString());
      }
      if (opts.includeSpecs) {
        row.push(specs.capacity || "", specs.type || "", specs.efficiency || "");
      }
      if (opts.includeWarranty) {
        row.push(specs.warranty || "", specs.voltage || "", specs.highlights || "");
      }
      row.push(p.date || "");

      rows.push(row.map(escape).join(","));
    });

    if (opts.includeValuation) {
      const summaryRow = ["TOTALS", `Total Models: ${products.length}`, "", "", ""];
      if (opts.includeStock) summaryRow.push(totalStock.toString(), "");
      if (opts.includePricing) summaryRow.push("", "", "");
      if (opts.includeValuation) summaryRow.push(totalValue.toString());
      if (opts.includeSpecs) summaryRow.push("", "", "");
      if (opts.includeWarranty) summaryRow.push("", "", "");
      summaryRow.push("");
      rows.push(summaryRow.map(escape).join(","));
    }

    // Prepend UTF-8 BOM (\uFEFF) so Excel directly recognizes encoding & Rupee symbol
    const csvContent = "\uFEFF" + rows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    this.triggerDownload(blob, filename);
    this.showToast(`✓ Exported ${products.length} products to Excel CSV (${filename})`, "success");
  },

  /**
   * Generate Microsoft Excel XML Spreadsheet (.xls)
   * Opens natively in Excel with rich colors, column formatting and currency data types
   */
  exportToSpreadsheetML(products, filename, opts) {
    const escapeXML = (str) => {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    let totalStock = 0;
    let totalValue = 0;

    // Header column configurations
    const cols = [
      { name: "SL", width: 40, align: "Center" },
      { name: "Product ID", width: 90, align: "Center" },
      { name: "Product Name & Model", width: 220, align: "Left" },
      { name: "Category", width: 110, align: "Center" },
      { name: "Partner Brand", width: 100, align: "Center" }
    ];

    if (opts.includeStock) {
      cols.push(
        { name: "Daily Stock", width: 80, align: "Number" },
        { name: "Stock Status", width: 100, align: "Center" }
      );
    }
    if (opts.includePricing) {
      cols.push(
        { name: "Offer Price (₹)", width: 100, align: "Currency" },
        { name: "Standard MRP (₹)", width: 100, align: "Currency" },
        { name: "Agent Margin (₹)", width: 100, align: "Currency" }
      );
    }
    if (opts.includeValuation) {
      cols.push({ name: "Stock Value (₹)", width: 110, align: "Currency" });
    }
    if (opts.includeSpecs) {
      cols.push(
        { name: "Capacity / Rating", width: 120, align: "Center" },
        { name: "Technology / Cell Type", width: 140, align: "Left" },
        { name: "Efficiency / Output", width: 110, align: "Center" }
      );
    }
    if (opts.includeWarranty) {
      cols.push(
        { name: "Warranty", width: 140, align: "Left" },
        { name: "System Voltage", width: 100, align: "Center" },
        { name: "Technical Highlights", width: 240, align: "Left" }
      );
    }
    cols.push({ name: "Verified Date", width: 95, align: "Center" });

    // Build data rows
    const dataRowsXML = products.map((p, idx) => {
      const stock = Number(p.dailyStock) || 0;
      const price = Number(p.price) || 0;
      const mrp = Number(p.mrp) || Math.round(price * 1.25);
      const margin = Math.max(0, mrp - price);
      const stockVal = stock * price;
      totalStock += stock;
      totalValue += stockVal;

      const specs = p.specs || {};
      let stockStyle = "CellStockGood";
      let stockStatus = "In Stock";
      if (stock === 0) {
        stockStyle = "CellStockOut";
        stockStatus = "Out of Stock";
      } else if (stock <= 5) {
        stockStyle = "CellStockLow";
        stockStatus = "Low Stock";
      }

      let cells = `
        <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML(p.id)}</Data></Cell>
        <Cell ss:StyleID="CellBold"><Data ss:Type="String">${escapeXML(p.name)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML((p.category || "").replace("-", " ").toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML(p.brand)}</Data></Cell>
      `;

      if (opts.includeStock) {
        cells += `
          <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${stock}</Data></Cell>
          <Cell ss:StyleID="${stockStyle}"><Data ss:Type="String">${escapeXML(stockStatus)}</Data></Cell>
        `;
      }
      if (opts.includePricing) {
        cells += `
          <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${price}</Data></Cell>
          <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${mrp}</Data></Cell>
          <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${margin}</Data></Cell>
        `;
      }
      if (opts.includeValuation) {
        cells += `
          <Cell ss:StyleID="CellCurrency"><Data ss:Type="Number">${stockVal}</Data></Cell>
        `;
      }
      if (opts.includeSpecs) {
        cells += `
          <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML(specs.capacity || "N/A")}</Data></Cell>
          <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXML(specs.type || "N/A")}</Data></Cell>
          <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML(specs.efficiency || "N/A")}</Data></Cell>
        `;
      }
      if (opts.includeWarranty) {
        cells += `
          <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXML(specs.warranty || "Standard")}</Data></Cell>
          <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML(specs.voltage || "Standard")}</Data></Cell>
          <Cell ss:StyleID="CellText"><Data ss:Type="String">${escapeXML(specs.highlights || "")}</Data></Cell>
        `;
      }
      cells += `
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXML(p.date || "")}</Data></Cell>
      `;

      return `<Row ss:Height="22">${cells}</Row>`;
    }).join("");

    // Build Totals row
    let totalsRowXML = "";
    if (opts.includeValuation) {
      let totalCells = `
        <Cell ss:StyleID="TotalLabel"><Data ss:Type="String">TOTALS</Data></Cell>
        <Cell ss:StyleID="TotalLabel"><Data ss:Type="String">${products.length} Models</Data></Cell>
        <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
        <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
        <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
      `;

      if (opts.includeStock) {
        totalCells += `
          <Cell ss:StyleID="TotalNumber"><Data ss:Type="Number">${totalStock}</Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
        `;
      }
      if (opts.includePricing) {
        totalCells += `
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
        `;
      }
      if (opts.includeValuation) {
        totalCells += `
          <Cell ss:StyleID="TotalValue"><Data ss:Type="Number">${totalValue}</Data></Cell>
        `;
      }
      if (opts.includeSpecs) {
        totalCells += `
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
        `;
      }
      if (opts.includeWarranty) {
        totalCells += `
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
          <Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>
        `;
      }
      totalCells += `<Cell ss:StyleID="TotalLabel"><Data ss:Type="String"></Data></Cell>`;
      totalsRowXML = `<Row ss:Height="24">${totalCells}</Row>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>Royal Eye Solar Power</Author>
  <Company>Royal Eye Solar Power (Edamuttam, Thrissur)</Company>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#107C41"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="HeaderSub">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#555555"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="ColHeader">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#107C41" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0B532A"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0B532A"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0B532A"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0B532A"/>
   </Borders>
  </Style>
  <Style ss:ID="CellText">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellBold">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNumber">
   <NumberFormat ss:Format="#,##0"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCurrency">
   <NumberFormat ss:Format="&quot;₹&quot;#,##0"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellStockGood">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0E6251"/>
   <Interior ss:Color="#D4EFDF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellStockLow">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#7D6608"/>
   <Interior ss:Color="#FCF3CF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CellStockOut">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#78281F"/>
   <Interior ss:Color="#FADBD8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalLabel">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#107C41"/>
   <Interior ss:Color="#E8F5E9" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#107C41"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#107C41"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalValue">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#000000"/>
   <Interior ss:Color="#E8F5E9" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="&quot;₹&quot;#,##0"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#107C41"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#107C41"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalNumber">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#000000"/>
   <Interior ss:Color="#E8F5E9" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#107C41"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#107C41"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Solar Stock &amp; Pricing">
  <Table>
   ${cols.map(c => `<Column ss:Width="${c.width}"/>`).join("")}
   <Row ss:Height="26">
    <Cell ss:MergeAcross="${cols.length - 1}" ss:StyleID="HeaderTitle">
     <Data ss:Type="String">ROYAL EYE SOLAR POWER - DAILY AGENT STOCK &amp; PRICE SHEET</Data>
    </Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="${cols.length - 1}" ss:StyleID="HeaderSub">
     <Data ss:Type="String">Edamuttam, Thrissur, Kerala | Hotline: +91 98466 53834 / +91 80758 73679 | Generated: ${new Date().toLocaleString("en-IN")}</Data>
    </Cell>
   </Row>
   <Row ss:Height="8"></Row>
   <Row ss:Height="26">
    ${cols.map(c => `<Cell ss:StyleID="ColHeader"><Data ss:Type="String">${escapeXML(c.name)}</Data></Cell>`).join("")}
   </Row>
   ${dataRowsXML}
   ${totalsRowXML}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    this.triggerDownload(blob, filename);
    this.showToast(`✓ Exported ${products.length} products to Excel Workbook (${filename})`, "success");
  },

  /**
   * Safe file download trigger using Object URL
   */
  triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 600);
  }
};

