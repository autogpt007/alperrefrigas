import { useState } from 'react';
import { Loader2, Mail, Paperclip } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { sendInvoiceEmail } from '@/lib/sendInvoiceEmail';
import type { GeneratedDocumentRow } from './InvoiceForm';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: GeneratedDocumentRow | null;
  onSent?: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InvoiceEmailDialog = ({ open, onOpenChange, document: doc, onSent }: Props) => {
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState(false);

  const effectiveRecipient = touched ? recipient : doc?.buyer_email || '';
  const valid = EMAIL_RE.test(effectiveRecipient.trim());
  const label = doc?.document_type === 'quote' ? 'Quotation' : 'Invoice';

  const handleSend = async () => {
    if (!doc || !valid) return;
    if (!doc.pdf_path && !doc.pdf_url) {
      toast.error('No PDF on file — re-save the document first.');
      return;
    }
    setSending(true);
    try {
      await sendInvoiceEmail({
        documentId: doc.id,
        recipientEmail: effectiveRecipient.trim(),
      });
      toast.success(`${label} PDF emailed to ${effectiveRecipient.trim()}`);
      onSent?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(`Send failed: ${e.message || 'unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Send {label.toLowerCase()} to buyer
          </DialogTitle>
          <DialogDescription>
            The buyer receives a branded email with a secure download link to the PDF.
          </DialogDescription>
        </DialogHeader>

        {doc && (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div className="font-medium">{doc.document_number}</div>
              <div className="text-muted-foreground">
                {doc.buyer_company || doc.buyer_name} · {doc.currency} {Number(doc.total).toFixed(2)}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invoice-recipient">Recipient email</Label>
              <Input
                id="invoice-recipient"
                type="email"
                value={effectiveRecipient}
                onChange={(e) => {
                  setTouched(true);
                  setRecipient(e.target.value);
                }}
                placeholder="buyer@example.com"
              />
              {!valid && effectiveRecipient.length > 0 && (
                <p className="text-xs text-destructive">Enter a valid email address.</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" />
              {doc.pdf_url ? (
                <Badge variant="secondary">Secure PDF download link included</Badge>
              ) : (
                <Badge variant="destructive">No PDF on file</Badge>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || !valid || !doc?.pdf_url} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceEmailDialog;
