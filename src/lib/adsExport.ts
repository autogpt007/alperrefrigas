import type { AdPack } from "./adsCompliance";

function csvEscape(v: string | number | undefined | null): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadBlob(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPackJSON(pack: AdPack, name: string) {
  downloadBlob(`${name}.json`, JSON.stringify(pack, null, 2), "application/json");
}

export function exportRSACsv(pack: AdPack, name: string) {
  const header = ["Ad Group", "Final URL", ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`), "Path 1", "Path 2"];
  const rows: string[][] = [header];
  (pack.adGroups || []).forEach((g) => {
    rows.push([
      g.name,
      g.finalUrl,
      ...Array.from({ length: 15 }, (_, i) => g.headlines?.[i] || ""),
      ...Array.from({ length: 4 }, (_, i) => g.descriptions?.[i] || ""),
      g.paths?.[0] || "",
      g.paths?.[1] || "",
    ]);
  });
  downloadBlob(`${name}-rsa.csv`, rows.map((r) => r.map(csvEscape).join(",")).join("\n"));
}

export function exportKeywordsCsv(pack: AdPack, name: string) {
  const rows: string[][] = [["Ad Group", "Keyword", "Match Type", "Intent"]];
  (pack.adGroups || []).forEach((g) =>
    g.keywords?.forEach((k) => rows.push([g.name, k.keyword, k.match, k.intent])),
  );
  downloadBlob(`${name}-keywords.csv`, rows.map((r) => r.map(csvEscape).join(",")).join("\n"));
}

export function exportNegativesCsv(pack: AdPack, name: string) {
  const rows: string[][] = [["Ad Group", "Negative Keyword", "Reason"]];
  (pack.adGroups || []).forEach((g) =>
    g.negatives?.forEach((n) => rows.push([g.name, n.keyword, n.reason])),
  );
  downloadBlob(`${name}-negatives.csv`, rows.map((r) => r.map(csvEscape).join(",")).join("\n"));
}

export function exportExtensionsCsv(pack: AdPack, name: string) {
  const rows: string[][] = [["Ad Group", "Type", "Text/Header", "Detail 1", "Detail 2", "URL"]];
  (pack.adGroups || []).forEach((g) => {
    g.sitelinks?.forEach((s) => rows.push([g.name, "Sitelink", s.text, s.desc1, s.desc2, s.url]));
    g.callouts?.forEach((c) => rows.push([g.name, "Callout", c, "", "", ""]));
    g.snippets?.forEach((s) => rows.push([g.name, "Snippet", s.header, s.values.join(" | "), "", ""]));
  });
  downloadBlob(`${name}-extensions.csv`, rows.map((r) => r.map(csvEscape).join(",")).join("\n"));
}
