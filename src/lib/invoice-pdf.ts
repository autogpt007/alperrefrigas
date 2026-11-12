import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SITE_DOMAIN } from "@/config/site";

/** A single line on a quote / invoice. Detail rows are notes, not billable. */
export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  /** Detail rows render as full-width notes and are excluded from the subtotal. */
  isDetail?: boolean;
}

export interface BankDetails {
  beneficiary?: string;
  bankName?: string;
  routing?: string;
  account?: string;
  swift?: string;
  address?: string;
}

export interface ZelleDetails {
  recipient?: string;
  handle?: string;
}

export interface InvoiceBranding {
  logoUrl?: string | null;
  signatureUrl?: string | null;
  signatureName?: string | null;
  signatureTitle?: string | null;
}

export interface InvoiceDocument {
  documentType: "quote" | "invoice";
  documentNumber: string;
  issueDate?: Date;
  dueDate?: string | null;
  poNumber?: string | null;
  validityDays?: number | null;

  buyerName: string;
  buyerCompany?: string | null;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerAddress?: string | null;
  buyerCountry?: string | null;
  shipToAddress?: string | null;

  items: InvoiceItem[];
  currency: string;
  discountPercent?: number;
  shippingCost?: number;
  taxAmount?: number;
  amountPaid?: number;

  notes?: string | null;
  paymentTerms?: string | null;
  paymentMethod?: string | null;

  branding?: InvoiceBranding;
}

export const COMPANY = {
  name: "Alper Chemical Group LLC",
  tradeName: "Alper Refrigerants",
  address1: "382 NE 191st St",
  address2: "Miami, FL 33179, United States",
  phone: "+1 682-215-2974",
  email: "sales@alperrefrigerants.com",
  get website() {
    return SITE_DOMAIN;
  },
};

const BRAND = {
  navy: [15, 23, 42] as [number, number, number],
  cyan: [8, 145, 178] as [number, number, number],
  slate: [100, 116, 139] as [number, number, number],
  line: [226, 232, 240] as [number, number, number],
  softBg: [248, 250, 252] as [number, number, number],
};

const money = (value: number, currency: string) =>
  `${currency} ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const isWire = (method?: string | null) => {
  const m = (method || "").toLowerCase();
  return m.includes("bank") || m.includes("wire") || m.includes("ach");
};
const isZelle = (method?: string | null) => (method || "").toLowerCase().includes("zelle");

/**
 * Builds the human-readable payment instruction block printed on the PDF.
 * Only the details for the selected payment method are included.
 */
export const buildPaymentNotes = (opts: {
  paymentMethod?: string | null;
  orderNumber?: string;
  bank?: BankDetails;
  zelle?: ZelleDetails;
}): string => {
  const lines: string[] = [];
  const ref = opts.orderNumber ? ` (reference ${opts.orderNumber})` : "";

  if (isWire(opts.paymentMethod)) {
    const b = opts.bank || {};
    lines.push(`Payment by bank wire / ACH transfer${ref}:`);
    if (b.beneficiary) lines.push(`Beneficiary: ${b.beneficiary}`);
    if (b.bankName) lines.push(`Bank: ${b.bankName}`);
    if (b.routing) lines.push(`Routing (ABA): ${b.routing}`);
    if (b.account) lines.push(`Account Number: ${b.account}`);
    if (b.swift) lines.push(`SWIFT / BIC: ${b.swift}`);
    if (b.address) lines.push(`Bank Address: ${b.address}`);
    lines.push("Please include the document number on the wire reference.");
  } else if (isZelle(opts.paymentMethod)) {
    const z = opts.zelle || {};
    lines.push(`Payment by Zelle${ref}:`);
    if (z.recipient) lines.push(`Recipient: ${z.recipient}`);
    if (z.handle) lines.push(`Zelle Email / Phone: ${z.handle}`);
    lines.push("Please include the document number in the Zelle memo.");
  } else {
    lines.push(
      `Payment instructions will be confirmed by our sales team${ref}. Contact ${COMPANY.email}.`
    );
  }

  return lines.join("\n");
};

/** Loads an image URL into a data URL so jsPDF can embed it. */
const loadImage = async (
  url: string
): Promise<{ dataUrl: string; width: number; height: number; format: string } | null> => {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    const format = blob.type.includes("png") ? "PNG" : blob.type.includes("webp") ? "WEBP" : "JPEG";
    return { dataUrl, ...dims, format };
  } catch {
    return null;
  }
};

/**
 * Renders a branded Alper Refrigerants quote or invoice.
 * Returns the PDF as a Blob so callers can upload and/or download it.
 */
export const generateInvoicePDF = async (doc: InvoiceDocument): Promise<Blob> => {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const M = 40;
  const currency = doc.currency || "USD";
  const issueDate = doc.issueDate || new Date();
  const title = doc.documentType === "invoice" ? "INVOICE" : "QUOTATION";

  // ---------- Header band ----------
  pdf.setFillColor(...BRAND.navy);
  pdf.rect(0, 0, pageW, 96, "F");

  let headerTextX = M;
  const logo = doc.branding?.logoUrl ? await loadImage(doc.branding.logoUrl) : null;
  if (logo) {
    const h = 44;
    const w = Math.min(150, (logo.width / logo.height) * h);
    pdf.addImage(logo.dataUrl, logo.format, M, 26, w, h, undefined, "FAST");
    headerTextX = M + w + 14;
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(COMPANY.tradeName, headerTextX, 44);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(203, 213, 225);
  pdf.text(
    [`${COMPANY.address1}, ${COMPANY.address2}`, `${COMPANY.phone}  •  ${COMPANY.email}`, COMPANY.website],
    headerTextX,
    58
  );

  pdf.setTextColor(34, 211, 238);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(title, pageW - M, 46, { align: "right" });
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text(doc.documentNumber, pageW - M, 62, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(203, 213, 225);
  pdf.text(issueDate.toLocaleDateString("en-US", { dateStyle: "medium" }), pageW - M, 76, {
    align: "right",
  });

  // ---------- Parties ----------
  let y = 128;
  const colW = (pageW - M * 2 - 20) / 2;

  const block = (x: number, heading: string, lines: string[]) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...BRAND.cyan);
    pdf.text(heading.toUpperCase(), x, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...BRAND.navy);
    pdf.text(lines.filter(Boolean), x, y + 14, { maxWidth: colW });
  };

  const billTo = [
    doc.buyerCompany || doc.buyerName,
    doc.buyerCompany ? doc.buyerName : "",
    doc.buyerAddress || "",
    doc.buyerCountry || "",
    doc.buyerEmail || "",
    doc.buyerPhone || "",
  ].filter(Boolean) as string[];

  const meta: string[] = [];
  if (doc.poNumber) meta.push(`PO Number: ${doc.poNumber}`);
  if (doc.documentType === "invoice" && doc.dueDate) meta.push(`Due Date: ${doc.dueDate}`);
  if (doc.documentType === "quote" && doc.validityDays)
    meta.push(`Valid For: ${doc.validityDays} days`);
  if (doc.paymentTerms) meta.push(`Terms: ${doc.paymentTerms}`);
  if (doc.shipToAddress) meta.push(`Ship To: ${doc.shipToAddress}`);

  block(M, "Bill To", billTo);
  block(M + colW + 20, "Document Details", meta.length ? meta : ["—"]);

  const partyHeight = Math.max(billTo.length, Math.max(meta.length, 1)) * 12 + 30;
  y += partyHeight;

  // ---------- Items table ----------
  const billable = doc.items.filter((i) => !i.isDetail);
  const subtotal = billable.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0);
  const discountAmount = subtotal * (Number(doc.discountPercent || 0) / 100);
  const total =
    subtotal - discountAmount + Number(doc.shippingCost || 0) + Number(doc.taxAmount || 0);
  const balanceDue = Math.max(0, total - Number(doc.amountPaid || 0));

  autoTable(pdf, {
    startY: y,
    margin: { left: M, right: M },
    head: [["Description", "Qty", "Unit", "Unit Price", "Amount"]],
    body: doc.items.map((it) =>
      it.isDetail
        ? [{ content: it.description, colSpan: 5, styles: { fontStyle: "italic" as const, textColor: BRAND.slate } }]
        : [
            it.description,
            String(it.quantity ?? 0),
            it.unit || "",
            money(it.unitPrice, currency),
            money(Number(it.quantity || 0) * Number(it.unitPrice || 0), currency),
          ]
    ),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6, lineColor: BRAND.line, lineWidth: 0.5 },
    headStyles: { fillColor: BRAND.navy, textColor: [255, 255, 255], fontSize: 8.5, halign: "left" },
    alternateRowStyles: { fillColor: BRAND.softBg },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 44, halign: "right" },
      2: { cellWidth: 48 },
      3: { cellWidth: 80, halign: "right" },
      4: { cellWidth: 90, halign: "right" },
    },
  });

  y = (pdf as any).lastAutoTable.finalY + 18;

  // ---------- Totals ----------
  const totalsX = pageW - M - 240;
  const rows: Array<[string, string, boolean?]> = [["Subtotal", money(subtotal, currency)]];
  if (doc.discountPercent) rows.push([`Discount (${doc.discountPercent}%)`, `- ${money(discountAmount, currency)}`]);
  if (doc.shippingCost) rows.push(["Shipping", money(Number(doc.shippingCost), currency)]);
  if (doc.taxAmount) rows.push(["Tax", money(Number(doc.taxAmount), currency)]);
  rows.push([doc.documentType === "invoice" ? "Total" : "Quoted Total", money(total, currency), true]);
  if (doc.amountPaid) {
    rows.push(["Amount Paid", `- ${money(Number(doc.amountPaid), currency)}`]);
    rows.push(["Balance Due", money(balanceDue, currency), true]);
  }

  rows.forEach(([label, value, strong]) => {
    if (strong) {
      pdf.setFillColor(...BRAND.softBg);
      pdf.rect(totalsX, y - 10, 240, 20, "F");
    }
    pdf.setFont("helvetica", strong ? "bold" : "normal");
    pdf.setFontSize(strong ? 11 : 9.5);
    pdf.setTextColor(...(strong ? BRAND.navy : BRAND.slate));
    pdf.text(label, totalsX + 8, y + 3);
    pdf.setTextColor(...BRAND.navy);
    pdf.text(value, pageW - M - 8, y + 3, { align: "right" });
    y += strong ? 24 : 16;
  });

  // ---------- Payment instructions ----------
  if (doc.notes) {
    if (y > pageH - 220) {
      pdf.addPage();
      y = M;
    }
    y += 12;
    pdf.setDrawColor(...BRAND.line);
    pdf.setFillColor(...BRAND.softBg);
    const noteLines = pdf.splitTextToSize(doc.notes, pageW - M * 2 - 24);
    const boxH = noteLines.length * 12 + 34;
    pdf.roundedRect(M, y, pageW - M * 2, boxH, 4, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...BRAND.cyan);
    pdf.text("PAYMENT INSTRUCTIONS", M + 12, y + 16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...BRAND.navy);
    pdf.text(noteLines, M + 12, y + 30);
    y += boxH + 20;
  }

  // ---------- Signature ----------
  if (y > pageH - 130) {
    pdf.addPage();
    y = M;
  }
  const sigX = pageW - M - 200;
  const signature = doc.branding?.signatureUrl ? await loadImage(doc.branding.signatureUrl) : null;
  if (signature) {
    const h = 40;
    const w = Math.min(180, (signature.width / signature.height) * h);
    pdf.addImage(signature.dataUrl, signature.format, sigX, y, w, h, undefined, "FAST");
  } else {
    pdf.setFont("times", "italic");
    pdf.setFontSize(20);
    pdf.setTextColor(...BRAND.navy);
    pdf.text(doc.branding?.signatureName || COMPANY.tradeName, sigX, y + 30);
  }
  y += 50;
  pdf.setDrawColor(...BRAND.slate);
  pdf.line(sigX, y, sigX + 190, y);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...BRAND.navy);
  pdf.text(doc.branding?.signatureName || COMPANY.name, sigX, y + 14);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...BRAND.slate);
  pdf.text(doc.branding?.signatureTitle || "Authorized Representative", sigX, y + 26);

  // ---------- Footer on every page ----------
  const pages = pdf.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(...BRAND.line);
    pdf.line(M, pageH - 48, pageW - M, pageH - 48);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...BRAND.slate);
    pdf.text(
      `${COMPANY.name} • ${COMPANY.address1}, ${COMPANY.address2} • ${COMPANY.phone} • ${COMPANY.email}`,
      M,
      pageH - 34
    );
    pdf.text(
      doc.documentType === "invoice"
        ? "Refrigerants are sold to certified professionals only (EPA 608 / Section 608 compliance required)."
        : "Quoted prices are subject to stock availability and confirmation at time of order.",
      M,
      pageH - 24
    );
    pdf.text(`Page ${p} of ${pages}`, pageW - M, pageH - 24, { align: "right" });
  }

  return pdf.output("blob");
};
