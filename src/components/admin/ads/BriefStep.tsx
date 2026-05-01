import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface BriefState {
  productName: string;
  productType: "refrigerant" | "air_conditioner" | "accessory" | "service";
  audience: string;
  geography: string;
  usps: string;
  offer: string;
  tone: string;
  bannedTerms: string;
  freeText: string;
}

export const initialBrief: BriefState = {
  productName: "",
  productType: "refrigerant",
  audience: "HVAC contractors and EPA 608-certified technicians",
  geography: "United States",
  usps: "",
  offer: "",
  tone: "professional",
  bannedTerms: "",
  freeText: "",
};

export const BriefStep: React.FC<{ value: BriefState; onChange: (v: BriefState) => void }> = ({ value, onChange }) => {
  const set = <K extends keyof BriefState>(k: K, v: BriefState[K]) => onChange({ ...value, [k]: v });
  return (
    <Card className="bg-slate-800/50 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white">Step 2 — Product, audience & compliance brief</CardTitle>
        <CardDescription>Refrigerant briefs auto-enforce EPA 608 / DOT HazMat / B2B-only language. Air conditioner briefs omit those.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Product / service</Label>
            <Input
              value={value.productName}
              onChange={(e) => set("productName", e.target.value)}
              placeholder="e.g. R-454B refrigerant pallets"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Product type (drives compliance rules)</Label>
            <Select value={value.productType} onValueChange={(v) => set("productType", v as BriefState["productType"])}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="refrigerant">Refrigerant (EPA + B2B enforced)</SelectItem>
                <SelectItem value="air_conditioner">Air conditioner</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Target audience</Label>
            <Input
              value={value.audience}
              onChange={(e) => set("audience", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Geography</Label>
            <Input
              value={value.geography}
              onChange={(e) => set("geography", e.target.value)}
              placeholder="e.g. United States, Puerto Rico"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Tone</Label>
            <Select value={value.tone} onValueChange={(v) => set("tone", v)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Offer / promotion (optional)</Label>
            <Input
              value={value.offer}
              onChange={(e) => set("offer", e.target.value)}
              placeholder="e.g. Free shipping over $5,000"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Unique selling points (one per line)</Label>
          <Textarea
            value={value.usps}
            onChange={(e) => set("usps", e.target.value)}
            rows={3}
            placeholder={"EPA-certified buyers only\nDOT HazMat-compliant shipping\nBulk pallet pricing"}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Do-not-say list (terms to avoid)</Label>
          <Input
            value={value.bannedTerms}
            onChange={(e) => set("bannedTerms", e.target.value)}
            placeholder="e.g. cheapest, guaranteed, competitor names"
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Additional context</Label>
          <Textarea
            value={value.freeText}
            onChange={(e) => set("freeText", e.target.value)}
            rows={3}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
};
