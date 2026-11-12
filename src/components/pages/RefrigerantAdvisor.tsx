import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SEOComponent from '../seo/SEOComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

type Recommendation = { refrigerant: string; fit: 'best' | 'good' | 'conditional'; safety_class: string; gwp: string; reasons: string[]; considerations: string[]; in_catalog: boolean };
type Advice = { summary: string; recommendations: Recommendation[]; cautions: string[]; standards: { code: string; title: string; relevance: string }[] };

const fitLabel = { best: 'Best fit', good: 'Good fit', conditional: 'Conditional' } as const;

export default function RefrigerantAdvisor() {
  const { user } = useAuth();
  const [form, setForm] = useState({ equipment: '', application: '', currentRefrigerant: '', region: '', details: '' });
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('refrigerant-advisor', { body: form });
      if (error) {
        let msg = 'The advisor could not complete this request.';
        try { const b = await (error as any).context?.json?.(); if (b?.error) msg = b.error; } catch { /* keep default */ }
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);
      setAdvice(data.advice);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOComponent
        title="Refrigerant Advisor for HVAC Contractors | Alper"
        description="Describe your HVAC/R equipment and application to get AI-assisted refrigerant recommendations with ASHRAE, UL and EPA standards references."
        canonicalUrl="/refrigerant-advisor"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Refrigerant Advisor', url: '/refrigerant-advisor' }]}
      />
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2"><Sparkles className="h-7 w-7 text-primary" />Refrigerant Advisor</h1>
        <p className="mt-3 text-muted-foreground">Describe your equipment and application. You'll get suggested refrigerants with safety class, GWP, and the standards that apply.</p>

        {!user ? (
          <Card className="mt-8"><CardContent className="p-6 space-y-3">
            <p className="text-foreground">Sign in with your contractor account to use the advisor.</p>
            <Button asChild><Link to="/auth?returnTo=/refrigerant-advisor">Sign in</Link></Button>
          </CardContent></Card>
        ) : (
          <Card className="mt-8">
            <CardContent className="p-6">
              <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2"><Label htmlFor="equipment">Equipment *</Label>
                  <Input id="equipment" required maxLength={300} value={form.equipment} onChange={set('equipment')} placeholder="e.g. 5-ton rooftop unit, scroll compressor, 2012" /></div>
                <div><Label htmlFor="application">Application *</Label>
                  <Input id="application" required maxLength={100} value={form.application} onChange={set('application')} placeholder="e.g. Commercial walk-in freezer" /></div>
                <div><Label htmlFor="current">Current refrigerant</Label>
                  <Input id="current" maxLength={60} value={form.currentRefrigerant} onChange={set('currentRefrigerant')} placeholder="e.g. R-22, R-404A" /></div>
                <div><Label htmlFor="region">Location</Label>
                  <Input id="region" maxLength={60} value={form.region} onChange={set('region')} placeholder="e.g. Texas, USA" /></div>
                <div className="md:col-span-2"><Label htmlFor="details">Other details</Label>
                  <Textarea id="details" maxLength={1500} rows={4} value={form.details} onChange={set('details')} placeholder="Temperatures, charge size, retrofit or new install, constraints…" /></div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={loading}>{loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Analyzing…</> : 'Get recommendations'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {error && <Alert variant="destructive" className="mt-6"><AlertDescription>{error}</AlertDescription></Alert>}

        {advice && (
          <div className="mt-8 space-y-6">
            <p className="text-foreground">{advice.summary}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {advice.recommendations.map((r) => (
                <Card key={r.refrigerant}>
                  <CardHeader className="pb-2"><CardTitle className="flex items-center justify-between gap-2 text-xl">{r.refrigerant}<Badge variant={r.fit === 'best' ? 'default' : 'secondary'}>{fitLabel[r.fit] ?? r.fit}</Badge></CardTitle>
                    <p className="text-sm text-muted-foreground">Safety class {r.safety_class} · GWP {r.gwp}</p></CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <ul className="list-disc pl-5 space-y-1">{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
                    {r.considerations.length > 0 && <ul className="list-disc pl-5 space-y-1 text-muted-foreground">{r.considerations.map((x) => <li key={x}>{x}</li>)}</ul>}
                    {r.in_catalog && <Button asChild size="sm" variant="outline"><Link to="/products">View in catalog</Link></Button>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {advice.cautions.length > 0 && (
              <Alert><AlertTriangle className="h-4 w-4" /><AlertDescription><ul className="list-disc pl-5 space-y-1">{advice.cautions.map((c) => <li key={c}>{c}</li>)}</ul></AlertDescription></Alert>
            )}
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="h-5 w-5" />Standards referenced</CardTitle></CardHeader>
              <CardContent><ul className="space-y-2 text-sm">{advice.standards.map((s) => <li key={s.code}><span className="font-semibold text-foreground">{s.code}</span> — {s.title}<span className="block text-muted-foreground">{s.relevance}</span></li>)}</ul></CardContent></Card>
            <p className="text-xs text-muted-foreground">AI-generated guidance for licensed professionals. Always verify against the equipment manufacturer's specifications and the current edition of each standard. EPA Section 608 certification is required to purchase and handle regulated refrigerants.</p>
          </div>
        )}
      </section>
    </div>
  );
}
