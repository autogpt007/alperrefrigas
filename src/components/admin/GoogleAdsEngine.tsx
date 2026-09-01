import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { GoalStep, initialGoal, type GoalState } from "./ads/GoalStep";
import { BriefStep, initialBrief, type BriefState } from "./ads/BriefStep";
import { AssetPackView } from "./ads/AssetPackView";
import { CampaignHistory } from "./ads/CampaignHistory";
import { validateAdPack, withBaseNegatives, type AdPack, type ComplianceReport } from "@/lib/adsCompliance";

const GoogleAdsEngine: React.FC = () => {
  const [goal, setGoal] = useState<GoalState>(initialGoal);
  const [brief, setBrief] = useState<BriefState>(initialBrief);
  const [model, setModel] = useState<"google/gemini-3-flash-preview" | "openai/gpt-5">("google/gemini-3-flash-preview");
  const [generating, setGenerating] = useState(false);
  const [pack, setPack] = useState<AdPack | null>(null);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const generate = async () => {
    if (!goal.campaignName.trim()) {
      toast.error("Give the campaign a name first");
      return;
    }
    if (!brief.productName.trim()) {
      toast.error("Enter the product or service to advertise");
      return;
    }
    setGenerating(true);
    setPack(null);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-google-ads", {
        body: { goal, brief, model },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const generatedPack: AdPack = data.pack;
      // Always enforce the campaign-level negative keyword list from the keyword plan.
      if (Array.isArray((generatedPack as any)?.adGroups)) {
        (generatedPack as any).adGroups = (generatedPack as any).adGroups.map((g: any) => ({
          ...g,
          negatives: withBaseNegatives(g?.negatives || []),
        }));
      }
      const localReport = validateAdPack(generatedPack, { productType: brief.productType });
      // Merge server-side report if present
      const finalReport: ComplianceReport = data.report
        ? {
            issues: [...(data.report.issues || []), ...localReport.issues],
            summary: {
              pass: 0,
              warning: (data.report.summary?.warning || 0) + localReport.summary.warning,
              blocked: (data.report.summary?.blocked || 0) + localReport.summary.blocked,
            },
          }
        : localReport;

      setPack(generatedPack);
      setReport(finalReport);

      // Save to DB
      const { data: userRes } = await supabase.auth.getUser();
      const created_by = userRes.user?.id;
      if (created_by) {
        const { data: camp, error: cErr } = await supabase
          .from("ad_campaigns")
          .insert({
            created_by,
            name: goal.campaignName,
            goal: goal.primaryGoal,
            brief_json: { goal, brief, model } as any,
            product_type: brief.productType,
            status: finalReport.summary.blocked > 0 ? "needs_review" : "ready",
          })
          .select()
          .single();
        if (!cErr && camp) {
          setCampaignId(camp.id);
          await supabase.from("ad_generations").insert({
            campaign_id: camp.id,
            prompt_payload: { goal, brief } as any,
            ai_response: generatedPack as any,
            compliance_report: finalReport as any,
            model,
          });
          setHistoryKey((k) => k + 1);
        }
      }
      toast.success("Asset pack generated");
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (/429/.test(msg)) toast.error("Rate limited — please retry shortly");
      else if (/402/.test(msg)) toast.error("AI credits exhausted — top up in Settings → Workspace → Usage");
      else toast.error(`Generation failed: ${msg}`);
    } finally {
      setGenerating(false);
    }
  };

  const loadCampaign = async (id: string) => {
    const { data: gen } = await supabase
      .from("ad_generations")
      .select("ai_response,compliance_report,model")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data: camp } = await supabase
      .from("ad_campaigns")
      .select("name,brief_json")
      .eq("id", id)
      .maybeSingle();
    if (camp?.brief_json) {
      const b = camp.brief_json as any;
      if (b.goal) setGoal(b.goal);
      if (b.brief) setBrief(b.brief);
    }
    if (gen?.ai_response) {
      setPack(gen.ai_response as unknown as AdPack);
      setReport((gen.compliance_report as unknown as ComplianceReport) || { issues: [], summary: { pass: 0, warning: 0, blocked: 0 } });
      setCampaignId(id);
      toast.success(`Loaded "${camp?.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Google Ads Engine</h1>
          <p className="text-gray-400">AI-generated, fully compliant Google Ads asset packs (RSA, extensions, keywords, SEO).</p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <Label className="text-gray-300 text-xs">AI model</Label>
            <Select value={model} onValueChange={(v) => setModel(v as typeof model)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="google/gemini-3-flash-preview">Fast (Gemini 3 Flash)</SelectItem>
                <SelectItem value="openai/gpt-5">Highest quality (GPT-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={generating} className="bg-gradient-to-r from-cyan-500 to-blue-500">
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate asset pack
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GoalStep value={goal} onChange={setGoal} />
          <BriefStep value={brief} onChange={setBrief} />
          {pack && report && <AssetPackView pack={pack} report={report} campaignName={goal.campaignName} />}
        </div>
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">How this works</CardTitle>
              <CardDescription>
                The engine validates every asset against Google Ads editorial limits and your project's refrigerant/B2B rules.
                Refrigerant briefs require EPA 608 / B2B language; air-conditioner briefs omit those disclaimers.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-gray-400 space-y-2">
              <div>• 15 headlines, 4 descriptions, 2 paths per ad group</div>
              <div>• 6 sitelinks, 8 callouts, 2 structured snippets, 4 promotions</div>
              <div>• Keywords with match types + 30+ negatives</div>
              <div>• Landing-page H1, meta title, meta description per ad group</div>
              <div>• CSV exports formatted for Google Ads Editor</div>
            </CardContent>
          </Card>
          <CampaignHistory refreshKey={historyKey} onLoad={loadCampaign} />
        </div>
      </div>
    </div>
  );
};

export default GoogleAdsEngine;
