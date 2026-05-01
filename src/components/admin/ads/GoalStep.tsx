import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface GoalState {
  primaryGoal: string;
  conversionAction: string;
  successMetric: string;
  timeHorizon: string;
  budgetTier: string;
  campaignName: string;
  freeText: string;
}

export const initialGoal: GoalState = {
  primaryGoal: "leads",
  conversionAction: "form",
  successMetric: "cpl",
  timeHorizon: "always_on",
  budgetTier: "medium",
  campaignName: "",
  freeText: "",
};

export const GoalStep: React.FC<{ value: GoalState; onChange: (v: GoalState) => void }> = ({ value, onChange }) => {
  const set = <K extends keyof GoalState>(k: K, v: GoalState[K]) => onChange({ ...value, [k]: v });
  return (
    <Card className="bg-slate-800/50 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white">Step 1 — What do you want to achieve?</CardTitle>
        <CardDescription>Answer in plain language. The AI uses this to shape strategy, tone, and asset volume.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Campaign name</Label>
            <Input
              value={value.campaignName}
              onChange={(e) => set("campaignName", e.target.value)}
              placeholder="e.g. R-454B Wholesale Q2"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Primary goal</Label>
            <Select value={value.primaryGoal} onValueChange={(v) => set("primaryGoal", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="leads">Generate B2B leads</SelectItem>
                <SelectItem value="sales">Drive online sales</SelectItem>
                <SelectItem value="quotes">Quote / RFQ requests</SelectItem>
                <SelectItem value="wholesale">Wholesale inquiries</SelectItem>
                <SelectItem value="awareness">Brand awareness</SelectItem>
                <SelectItem value="reengagement">Re-engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Desired conversion action</Label>
            <Select value={value.conversionAction} onValueChange={(v) => set("conversionAction", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="form">Contact / lead form</SelectItem>
                <SelectItem value="call">Phone call</SelectItem>
                <SelectItem value="checkout">Checkout / purchase</SelectItem>
                <SelectItem value="rfq">Request a quote</SelectItem>
                <SelectItem value="signup">Account signup</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Success metric</Label>
            <Select value={value.successMetric} onValueChange={(v) => set("successMetric", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cpl">Cost per lead (CPL)</SelectItem>
                <SelectItem value="roas">Return on ad spend (ROAS)</SelectItem>
                <SelectItem value="ctr">Click-through rate (CTR)</SelectItem>
                <SelectItem value="conv">Total conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Time horizon</Label>
            <Select value={value.timeHorizon} onValueChange={(v) => set("timeHorizon", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="always_on">Always-on</SelectItem>
                <SelectItem value="seasonal">Seasonal push</SelectItem>
                <SelectItem value="launch">Product launch</SelectItem>
                <SelectItem value="event">Event / promotion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Budget tier</Label>
            <Select value={value.budgetTier} onValueChange={(v) => set("budgetTier", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (under $50/day)</SelectItem>
                <SelectItem value="medium">Medium ($50–$300/day)</SelectItem>
                <SelectItem value="large">Large ($300+/day)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Anything else we should know?</Label>
          <Textarea
            value={value.freeText}
            onChange={(e) => set("freeText", e.target.value)}
            rows={3}
            placeholder="Goals, hard requirements, brand voice notes, competitive context…"
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
};
