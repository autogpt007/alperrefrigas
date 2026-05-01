import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface CampaignRow {
  id: string;
  name: string;
  goal: string | null;
  product_type: string | null;
  status: string;
  created_at: string;
}

export const CampaignHistory: React.FC<{
  refreshKey: number;
  onLoad: (id: string) => void;
}> = ({ refreshKey, onLoad }) => {
  const [rows, setRows] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ad_campaigns")
      .select("id,name,goal,product_type,status,created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) toast.error("Failed to load history");
    else setRows((data as CampaignRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [refreshKey]);

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign and all its assets?")) return;
    const { error } = await supabase.from("ad_campaigns").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted"); load(); }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader><CardTitle className="text-white">Campaign history</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-gray-400 text-sm">No saved campaigns yet.</div>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center gap-2 p-2 rounded bg-slate-900/40">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
                    <Badge variant="outline">{r.product_type || "—"}</Badge>
                    <span>{r.goal}</span>
                    <span>{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => onLoad(r.id)}><FolderOpen className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" onClick={() => remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
