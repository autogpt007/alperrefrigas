import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ComplianceLevel } from "@/lib/adsCompliance";

export const ComplianceBadge: React.FC<{ level: ComplianceLevel; label?: string }> = ({ level, label }) => {
  const map = {
    pass: { Icon: CheckCircle2, cls: "bg-green-500/20 text-green-300 border-green-500/30", text: "Compliant" },
    warning: { Icon: AlertTriangle, cls: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30", text: "Warning" },
    blocked: { Icon: XCircle, cls: "bg-red-500/20 text-red-300 border-red-500/30", text: "Blocked" },
  } as const;
  const { Icon, cls, text } = map[level];
  return (
    <Badge variant="outline" className={`${cls} gap-1`}>
      <Icon className="h-3 w-3" />
      {label ?? text}
    </Badge>
  );
};
