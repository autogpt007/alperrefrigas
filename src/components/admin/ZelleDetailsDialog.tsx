import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STORE_KEY = 'admin-zelle-defaults';

interface Props {
  order: { id: string; order_number: string; customer_email: string } | null;
  onClose: () => void;
}

const ZelleDetailsDialog = ({ order, onClose }: Props) => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; } })();
  const [zelleName, setZelleName] = useState<string>(saved.zelleName || '');
  const [zelleContact, setZelleContact] = useState<string>(saved.zelleContact || '');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const to = recipient || order?.customer_email || '';

  const send = async () => {
    if (!order) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke('send-zelle-details', {
      body: { orderId: order.id, recipientEmail: to, zelleName, zelleContact, note: note || undefined },
    });
    setSending(false);
    const msg = error?.message || (data as any)?.error;
    if (msg) {
      toast({ title: 'Could not send', description: typeof msg === 'string' ? msg : 'Check the fields and try again.', variant: 'destructive' });
      return;
    }
    localStorage.setItem(STORE_KEY, JSON.stringify({ zelleName, zelleContact }));
    toast({ title: 'Zelle details sent', description: `Emailed to ${to}` });
    onClose();
  };

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Zelle details · #{order?.order_number}</DialogTitle>
          <DialogDescription>Emails this buyer only. Zelle stays off the store, checkout and PDF invoices.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Zelle name</Label><Input value={zelleName} onChange={(e) => setZelleName(e.target.value)} placeholder="Alper Chemical Group" /></div>
          <div><Label>Zelle email or phone number</Label><Input value={zelleContact} onChange={(e) => setZelleContact(e.target.value)} placeholder="payments@... or 786-..." /></div>
          <div><Label>Send to</Label><Input type="email" value={to} onChange={(e) => setRecipient(e.target.value)} /></div>
          <div><Label>Note (optional)</Label><Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={send} disabled={sending || !zelleName.trim() || zelleContact.trim().length < 3 || !to}>
            {sending ? 'Sending…' : 'Send email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ZelleDetailsDialog;
