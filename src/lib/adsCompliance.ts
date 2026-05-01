// Google Ads + project compliance validator (shared client/server logic shape).
// Keep this file pure (no React, no Supabase) so it can be mirrored in edge fn.

export type ComplianceLevel = "pass" | "warning" | "blocked";

export interface ComplianceIssue {
  field: string;
  level: ComplianceLevel;
  reason: string;
}

export const LIMITS = {
  headline: 30,
  description: 90,
  path: 15,
  sitelinkText: 25,
  sitelinkDesc: 35,
  callout: 25,
  snippetValue: 25,
  promoItem: 20,
  metaTitle: 60,
  metaDesc: 155,
} as const;

const PROHIBITED_SUPERLATIVES = [
  /\bcheapest\b/i,
  /\bbest in the world\b/i,
  /\bguaranteed (?:result|delivery|approval)\b/i,
  /\b#1\b/i,
  /\bno\.\s*1\b/i,
];

const PHONE_RE = /(?:\+?\d[\s\-().]?){7,}/;

function countAllCapsWords(s: string): number {
  return (s.match(/\b[A-Z]{3,}\b/g) || []).filter(
    (w) => !["EPA", "DOT", "USA", "FAQ", "B2B", "HVAC", "HFO", "HFC"].includes(w),
  ).length;
}

function exclamationCount(s: string): number {
  return (s.match(/!/g) || []).length;
}

export function validateText(
  text: string,
  field: string,
  maxLen: number,
  opts: { allowExclamation?: boolean; allowPhone?: boolean } = {},
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];
  const t = (text ?? "").trim();
  if (!t) {
    issues.push({ field, level: "blocked", reason: "Empty value" });
    return issues;
  }
  if (t.length > maxLen) {
    issues.push({
      field,
      level: "blocked",
      reason: `${t.length} chars — exceeds ${maxLen}`,
    });
  }
  if (/[!?.]{2,}/.test(t)) {
    issues.push({ field, level: "warning", reason: "Excessive punctuation" });
  }
  if (!opts.allowExclamation && exclamationCount(t) > 1) {
    issues.push({ field, level: "blocked", reason: "More than one '!' not allowed" });
  }
  if (countAllCapsWords(t) > 1) {
    issues.push({
      field,
      level: "warning",
      reason: "Excessive capitalization (>1 ALL-CAPS word)",
    });
  }
  if (!opts.allowPhone && PHONE_RE.test(t)) {
    issues.push({ field, level: "blocked", reason: "Phone numbers not allowed in this field" });
  }
  for (const re of PROHIBITED_SUPERLATIVES) {
    if (re.test(t)) {
      issues.push({
        field,
        level: "warning",
        reason: `Unsubstantiated superlative: ${re.source}`,
      });
    }
  }
  return issues;
}

export interface AdPack {
  campaignNames?: string[];
  campaignTypeRecommendation?: { type: string; rationale: string };
  geoTargeting?: string[];
  bidStrategy?: { strategy: string; rationale: string };
  budgetGuidance?: { dailyMin: number; dailyMax: number; currency: string };
  adGroups?: Array<{
    name: string;
    theme: string;
    intentStage: "TOFU" | "MOFU" | "BOTM";
    finalUrl: string;
    headlines: string[];
    descriptions: string[];
    paths: [string, string];
    sitelinks: Array<{ text: string; desc1: string; desc2: string; url: string }>;
    callouts: string[];
    snippets: Array<{ header: string; values: string[] }>;
    promotions: Array<{
      occasion?: string;
      item: string;
      discountType: "PERCENT" | "MONETARY";
      discountValue: number;
    }>;
    keywords: Array<{ keyword: string; match: "BROAD" | "PHRASE" | "EXACT"; intent: string }>;
    negatives: Array<{ keyword: string; reason: string }>;
    seo: { h1: string; metaTitle: string; metaDescription: string; schemaType: string };
  }>;
  imageAssetPrompts?: string[];
  leadFormAssets?: Array<{ headline: string; cta: string }>;
}

export interface ComplianceReport {
  issues: ComplianceIssue[];
  summary: { pass: number; warning: number; blocked: number };
}

export function validateAdPack(
  pack: AdPack,
  context: { productType?: "refrigerant" | "air_conditioner" | string },
): ComplianceReport {
  const issues: ComplianceIssue[] = [];
  const isRefrigerant = context.productType === "refrigerant";

  (pack.adGroups || []).forEach((g, gi) => {
    const prefix = `adGroups[${gi}] "${g.name}"`;
    g.headlines?.forEach((h, i) =>
      issues.push(...validateText(h, `${prefix}.headlines[${i}]`, LIMITS.headline)),
    );
    g.descriptions?.forEach((d, i) =>
      issues.push(...validateText(d, `${prefix}.descriptions[${i}]`, LIMITS.description, { allowExclamation: true })),
    );
    g.paths?.forEach((p, i) =>
      issues.push(...validateText(p, `${prefix}.paths[${i}]`, LIMITS.path)),
    );
    g.sitelinks?.forEach((s, i) => {
      issues.push(...validateText(s.text, `${prefix}.sitelinks[${i}].text`, LIMITS.sitelinkText));
      issues.push(...validateText(s.desc1, `${prefix}.sitelinks[${i}].desc1`, LIMITS.sitelinkDesc, { allowExclamation: true }));
      issues.push(...validateText(s.desc2, `${prefix}.sitelinks[${i}].desc2`, LIMITS.sitelinkDesc, { allowExclamation: true }));
    });
    g.callouts?.forEach((c, i) =>
      issues.push(...validateText(c, `${prefix}.callouts[${i}]`, LIMITS.callout)),
    );
    g.snippets?.forEach((s, i) => {
      s.values?.forEach((v, j) =>
        issues.push(...validateText(v, `${prefix}.snippets[${i}].values[${j}]`, LIMITS.snippetValue)),
      );
    });
    if (g.seo) {
      issues.push(...validateText(g.seo.metaTitle, `${prefix}.seo.metaTitle`, LIMITS.metaTitle, { allowExclamation: true }));
      issues.push(...validateText(g.seo.metaDescription, `${prefix}.seo.metaDescription`, LIMITS.metaDesc, { allowExclamation: true }));
    }

    // Industry-specific
    if (isRefrigerant) {
      const allCopy = [
        ...(g.headlines || []),
        ...(g.descriptions || []),
        ...(g.callouts || []),
      ].join(" ").toLowerCase();
      const hasCert = /(epa\s*608|epa-?certified|certified buyer|b2b|wholesale|licensed)/i.test(allCopy);
      if (!hasCert) {
        issues.push({
          field: `${prefix}`,
          level: "warning",
          reason: "Refrigerant ad group missing EPA 608 / B2B / certified-buyer language",
        });
      }
      if (/(diy|home use|consumer|household)/i.test(allCopy)) {
        issues.push({
          field: `${prefix}`,
          level: "blocked",
          reason: "Refrigerant copy must not target consumers (B2B only)",
        });
      }
    } else if (context.productType === "air_conditioner") {
      const allCopy = [...(g.headlines || []), ...(g.descriptions || [])].join(" ");
      if (/(epa\s*608|dot hazmat|f-?gas)/i.test(allCopy)) {
        issues.push({
          field: `${prefix}`,
          level: "warning",
          reason: "Air conditioner ads should omit refrigerant disclaimers",
        });
      }
    }
  });

  const summary = issues.reduce(
    (acc, i) => ({ ...acc, [i.level]: acc[i.level] + 1 }),
    { pass: 0, warning: 0, blocked: 0 } as Record<ComplianceLevel, number>,
  );
  return { issues, summary };
}
