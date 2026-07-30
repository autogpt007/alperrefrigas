import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, FileText, Mail, Download, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import InvoiceForm, { type GeneratedDocumentRow } from './InvoiceForm';
import InvoiceEmailDialog from './InvoiceEmailDialog';

const InvoicesManager = () => {
  const [tab, setTab] = useState<'invoice' | 'quote'>('invoice');
  const [rows, setRows] = useState<GeneratedDocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GeneratedDocumentRow | null>(null);
  const [emailDoc, setEmailDoc] = useState<GeneratedDocumentRow | null>(null);
  const [deleting, setDeleting] = useState<GeneratedDocumentRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('document_type', tab)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) toast.error(`Failed to load documents: ${error.message}`);
    setRows((data as any) || []);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.document_number, r.buyer_name, r.buyer_company, r.buyer_email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const handleDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from('generated_documents').delete().eq('id', deleting.id);
    if (error) toast.error(`Delete failed: ${error.message}`);
    else {
      toast.success('Document deleted');
      load();
    }
    setDeleting(null);
  };

  const label = tab === 'invoice' ? 'Invoice' : 'Quote';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Quotes &amp; Invoices
            </CardTitle>
            <CardDescription>
              Create branded PDF quotes and invoices with bank wire or Zelle payment details, then email them to buyers.
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> New {label.toLowerCase()}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={tab} onValueChange={(v) => setTab(v as 'invoice' | 'quote')}>
              <TabsList>
                <TabsTrigger value="invoice">Invoices</TabsTrigger>
                <TabsTrigger value="quote">Quotes</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search by number, buyer, company or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No {label.toLowerCase()}s found. Create your first one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.document_number}</TableCell>
                      <TableCell>
                        <div className="text-sm">{row.buyer_company || row.buyer_name}</div>
                        <div className="text-xs text-muted-foreground">{row.buyer_email}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.currency} {Number(row.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {row.payment_method === 'zelle'
                            ? 'Zelle'
                            : row.payment_method === 'bank-wire'
                            ? 'Bank wire'
                            : 'Other'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download PDF"
                          disabled={!row.pdf_url}
                          onClick={() => row.pdf_url && window.open(row.pdf_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Email to buyer" onClick={() => setEmailDoc(row)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          onClick={() => {
                            setEditing(row);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleting(row)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${editing.document_number}` : `New ${label.toLowerCase()}`}
            </DialogTitle>
          </DialogHeader>
          {formOpen && (
            <InvoiceForm
              key={editing?.id || 'new'}
              documentType={tab}
              initialData={editing || undefined}
              onComplete={() => {
                setFormOpen(false);
                setEditing(null);
                load();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <InvoiceEmailDialog
        open={!!emailDoc}
        onOpenChange={(o) => !o && setEmailDoc(null)}
        document={emailDoc}
        onSent={load}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.document_number}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoicesManager;
