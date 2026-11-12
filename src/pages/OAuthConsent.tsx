import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type OAuthResult = { data: any; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const scopeLabel = (s: string) =>
  s === "openid" ? "Confirm who you are" : s === "email" ? "Share your email address" : s === "profile" ? "Share your basic profile" : `Additional permission requested: ${s}`;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!authorizationId) return setError("This connection link is missing its authorization details.");
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          const next = window.location.pathname + window.location.search;
          window.location.href = "/auth?returnTo=" + encodeURIComponent(next);
          return;
        }
        setEmail(sess.session.user.email ?? null);
        const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) return setError(error.message);
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) { window.location.href = immediate; return; }
        setDetails(data);
      } catch (e: any) {
        if (active) setError(e?.message || "This connection request has expired or is invalid.");
      }
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve ? await oauth().approveAuthorization(authorizationId) : await oauth().denyAuthorization(authorizationId);
      if (error) { setBusy(false); return setError(error.message); }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) { setBusy(false); return setError("No redirect was returned. Please try connecting again."); }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message || (approve ? "Approval failed." : "Cancelling failed."));
    }
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "This app";
  const scopes: string[] = String(details?.scope ?? details?.scopes ?? "").split(/[\s,]+/).filter(Boolean);
  const redirectUri = details?.redirect_uri ?? details?.client?.redirect_uri;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        {error ? (
          <CardContent className="p-6 space-y-2">
            <h1 className="text-lg font-semibold text-foreground">Could not load this connection request</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        ) : !details ? (
          <CardContent className="p-6 flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</CardContent>
        ) : (
          <>
            <CardHeader><CardTitle>Connect {clientName} to Alper Refrigerants</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              {email && <p className="text-muted-foreground">Signed in as <span className="font-medium text-foreground">{email}</span></p>}
              <p>{clientName} will be able to search the catalog and view your orders and quote requests while you are signed in.</p>
              {redirectUri && <p className="text-muted-foreground break-all">Returns to: {redirectUri}</p>}
              {scopes.length > 0 && <ul className="list-disc pl-5 space-y-1">{scopes.map((s) => <li key={s}>{scopeLabel(s)}</li>)}</ul>}
              <p className="text-muted-foreground">This does not bypass this app's permissions or backend policies.</p>
              <div className="flex gap-2 pt-2">
                <Button disabled={busy} onClick={() => decide(true)} className="flex-1">Approve</Button>
                <Button disabled={busy} variant="outline" onClick={() => decide(false)} className="flex-1">Cancel connection</Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}
