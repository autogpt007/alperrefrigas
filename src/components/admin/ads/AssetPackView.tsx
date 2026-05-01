import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import type { AdPack, ComplianceReport, ComplianceIssue } from "@/lib/adsCompliance";
import { LIMITS } from "@/lib/adsCompliance";
import { ComplianceBadge } from "./ComplianceBadge";
import {
  exportPackJSON,
  exportRSACsv,
  exportKeywordsCsv,
  exportNegativesCsv,
  exportExtensionsCsv,
} from "@/lib/adsExport";

const copy = (s: string) => {
  navigator.clipboard.writeText(s).then(() => toast.success("Copied"));
};

const charBadge = (s: string, max: number) => {
  const len = (s ?? "").length;
  const over = len > max;
  return (
    <Badge variant="outline" className={`text-xs ${over ? "border-red-500 text-red-300" : "border-slate-500 text-slate-300"}`}>
      {len}/{max}
    </Badge>
  );
};

const issuesFor = (issues: ComplianceIssue[], prefix: string) =>
  issues.filter((i) => i.field.startsWith(prefix));

export const AssetPackView: React.FC<{
  pack: AdPack;
  report: ComplianceReport;
  campaignName: string;
}> = ({ pack, report, campaignName }) => {
  const safeName = (campaignName || "campaign").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
  const blocked = report.summary.blocked;
  const warnings = report.summary.warning;
  const overall: "pass" | "warning" | "blocked" =
    blocked > 0 ? "blocked" : warnings > 0 ? "warning" : "pass";

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-white flex items-center gap-3">
              Generated Asset Pack
              <ComplianceBadge level={overall} label={`${blocked} blocked · ${warnings} warnings`} />
            </CardTitle>
            <CardDescription>Review every field, copy what you need, or export for Google Ads Editor.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => exportPackJSON(pack, safeName)}>
              <FileJson className="h-4 w-4 mr-1" /> JSON
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportRSACsv(pack, safeName)}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> RSA CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportExtensionsCsv(pack, safeName)}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> Extensions
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportKeywordsCsv(pack, safeName)}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> Keywords
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportNegativesCsv(pack, safeName)}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> Negatives
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="strategy">
          <TabsList className="bg-slate-700/50 flex-wrap h-auto">
            <TabsTrigger value="strategy">Campaign strategy</TabsTrigger>
            <TabsTrigger value="rsa">RSA Headlines & Descriptions</TabsTrigger>
            <TabsTrigger value="ext">Sitelinks · Callouts · Snippets</TabsTrigger>
            <TabsTrigger value="kw">Keywords & Negatives</TabsTrigger>
            <TabsTrigger value="seo">SEO Landing-page Meta</TabsTrigger>
            <TabsTrigger value="compliance">Compliance report</TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-3 mt-4">
            <div className="grid md:grid-cols-2 gap-3 text-gray-200">
              <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                <div className="text-xs text-gray-400 mb-1">Suggested campaign names</div>
                <ul className="list-disc list-inside text-sm">
                  {pack.campaignNames?.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                <div className="text-xs text-gray-400 mb-1">Recommended campaign type</div>
                <div className="font-semibold">{pack.campaignTypeRecommendation?.type}</div>
                <div className="text-xs text-gray-400 mt-1">{pack.campaignTypeRecommendation?.rationale}</div>
              </div>
              <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                <div className="text-xs text-gray-400 mb-1">Bid strategy</div>
                <div className="font-semibold">{pack.bidStrategy?.strategy}</div>
                <div className="text-xs text-gray-400 mt-1">{pack.bidStrategy?.rationale}</div>
              </div>
              <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                <div className="text-xs text-gray-400 mb-1">Daily budget guidance</div>
                <div className="font-semibold">
                  {pack.budgetGuidance ? `${pack.budgetGuidance.currency} ${pack.budgetGuidance.dailyMin}–${pack.budgetGuidance.dailyMax}/day` : "—"}
                </div>
              </div>
              <div className="p-3 rounded bg-slate-900/50 border border-slate-700 md:col-span-2">
                <div className="text-xs text-gray-400 mb-1">Geo targeting</div>
                <div className="text-sm">{pack.geoTargeting?.join(" · ")}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rsa" className="space-y-6 mt-4">
            {pack.adGroups?.map((g, gi) => (
              <div key={gi} className="border border-slate-700 rounded p-3 bg-slate-900/40">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <div>
                    <div className="text-white font-semibold">{g.name}</div>
                    <div className="text-xs text-gray-400">{g.theme} · {g.intentStage} · {g.finalUrl}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Headlines (15 × ≤{LIMITS.headline})</div>
                    {g.headlines?.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-200 py-0.5">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copy(h)}><Copy className="h-3 w-3" /></Button>
                        <span className="flex-1 truncate">{h}</span>
                        {charBadge(h, LIMITS.headline)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Descriptions (4 × ≤{LIMITS.description})</div>
                    {g.descriptions?.map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-200 py-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 mt-0.5" onClick={() => copy(d)}><Copy className="h-3 w-3" /></Button>
                        <span className="flex-1">{d}</span>
                        {charBadge(d, LIMITS.description)}
                      </div>
                    ))}
                    <div className="text-xs text-gray-400 mt-3 mb-1">Display paths (2 × ≤{LIMITS.path})</div>
                    <div className="flex gap-2">
                      {g.paths?.map((p, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm text-gray-200">
                          /{p} {charBadge(p, LIMITS.path)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="ext" className="space-y-6 mt-4">
            {pack.adGroups?.map((g, gi) => (
              <div key={gi} className="border border-slate-700 rounded p-3 bg-slate-900/40">
                <div className="text-white font-semibold mb-2">{g.name}</div>
                <div className="text-xs text-gray-400 mb-1">Sitelinks</div>
                <div className="space-y-1">
                  {g.sitelinks?.map((s, i) => (
                    <div key={i} className="text-sm text-gray-200 p-2 rounded bg-slate-800/60">
                      <div className="flex items-center gap-2"><strong>{s.text}</strong>{charBadge(s.text, LIMITS.sitelinkText)}</div>
                      <div className="text-gray-400">{s.desc1} {charBadge(s.desc1, LIMITS.sitelinkDesc)}</div>
                      <div className="text-gray-400">{s.desc2} {charBadge(s.desc2, LIMITS.sitelinkDesc)}</div>
                      <div className="text-xs text-cyan-400">{s.url}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-3 mb-1">Callouts</div>
                <div className="flex flex-wrap gap-1">
                  {g.callouts?.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-gray-200">{c} <span className="ml-1 opacity-60">{c.length}/{LIMITS.callout}</span></Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-3 mb-1">Structured snippets</div>
                {g.snippets?.map((s, i) => (
                  <div key={i} className="text-sm text-gray-200">
                    <strong>{s.header}:</strong> {s.values?.join(", ")}
                  </div>
                ))}
                <div className="text-xs text-gray-400 mt-3 mb-1">Promotions</div>
                {g.promotions?.map((p, i) => (
                  <div key={i} className="text-sm text-gray-200">
                    {p.occasion ? `${p.occasion} · ` : ""}{p.item} — {p.discountType === "PERCENT" ? `${p.discountValue}% off` : `$${p.discountValue} off`}
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="kw" className="space-y-6 mt-4">
            {pack.adGroups?.map((g, gi) => (
              <div key={gi} className="border border-slate-700 rounded p-3 bg-slate-900/40">
                <div className="text-white font-semibold mb-2">{g.name}</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Keywords</div>
                    {g.keywords?.map((k, i) => (
                      <div key={i} className="text-sm text-gray-200 flex items-center gap-2">
                        <Badge variant="outline">{k.match}</Badge>
                        <span className="flex-1">{k.keyword}</span>
                        <span className="text-xs text-gray-400">{k.intent}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Negative keywords</div>
                    {g.negatives?.map((n, i) => (
                      <div key={i} className="text-sm text-gray-200">
                        <span className="text-red-300">−</span> {n.keyword} <span className="text-xs text-gray-400">({n.reason})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 mt-4">
            {pack.adGroups?.map((g, gi) => (
              <div key={gi} className="border border-slate-700 rounded p-3 bg-slate-900/40">
                <div className="text-white font-semibold mb-2">{g.name} → {g.finalUrl}</div>
                <div className="text-sm text-gray-200 space-y-1">
                  <div><strong>H1:</strong> {g.seo?.h1}</div>
                  <div><strong>Meta title:</strong> {g.seo?.metaTitle} {charBadge(g.seo?.metaTitle || "", LIMITS.metaTitle)}</div>
                  <div><strong>Meta description:</strong> {g.seo?.metaDescription} {charBadge(g.seo?.metaDescription || "", LIMITS.metaDesc)}</div>
                  <div><strong>Schema.org type:</strong> {g.seo?.schemaType}</div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="compliance" className="mt-4">
            <div className="text-sm text-gray-300 mb-2">
              <strong>{report.summary.blocked}</strong> blocked · <strong>{report.summary.warning}</strong> warnings
            </div>
            {report.issues.length === 0 ? (
              <div className="text-green-300">All assets passed validation.</div>
            ) : (
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {report.issues.map((i, idx) => (
                  <div key={idx} className="text-sm text-gray-200 flex items-start gap-2 p-2 rounded bg-slate-900/40">
                    <ComplianceBadge level={i.level} />
                    <span className="flex-1"><span className="text-cyan-300">{i.field}</span> — {i.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
