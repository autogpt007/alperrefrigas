import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, FileDown, Loader2, Save, RefreshCw, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { generateInvoicePDF, buildPaymentNotes, type InvoiceItem } from '@/lib/invoice-pdf';
import { uploadInvoicePdf } from '@/lib/uploadInvoicePdf';

export interface GeneratedDocumentRow {
  id: string;
  document_type: string;
  document_number: string;
  order_id: string | null;
  buyer_name: string;
  buyer_company: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  buyer_country: string | null;
  buyer_address: string | null;
  ship_to_address: string | null;
  items: any;
  subtotal: number;
  discount_percent: number | null;
  shipping_cost: number | null;
  tax_amount: number | null;
  total: number;
  amount_paid: number | null;
  currency: string;
  notes: string | null;
  payment_terms: string | null;
  payment_method: string | null;
  validity_days: number | null;
  po_number: string | null;
  due_date: string | null;
  pdf_url: string | null;
  created_at?: string;
}

interface Props {
  documentType: 'quote' | 'invoice';
  initialData?: GeneratedDocumentRow;
  onComplete: () => void;
}

interface BankAccount {
  id: string;
  label: string;
  beneficiary: string;
  bankName: string;
  routing: string;
  account: string;
  swift: string;
  address: string;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'];
const PAYMENT_METHODS = [
  { value: 'bank-wire', label: 'Bank Wire / ACH Transfer' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'other', label: 'Other / Discuss with sales' },
];

const emptyBankAccount = (): BankAccount => ({
  id: crypto.randomUUID(),
  label: '',
  beneficiary: '',
  bankName: '',
  routing: '',
  account: '',
  swift: '',
  address: '',
});

const generateDocNumber = (documentType: 'quote' | 'invoice') => {
  const prefix = documentType === 'invoice' ? 'INV' : 'QUO';
  const d = new Date();
  const ym = `${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
  return `${prefix}-${ym}-${rand}`;
};

const generatePoNumber = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `PO-${ymd}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
};

const addBusinessDays = (start: Date, days: number) => {
  const d = new Date(start);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
};

const formatAddress = (addr: any): string => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  return [addr.address || addr.street || addr.line1, addr.city, addr.state, addr.zip || addr.postal_code, addr.country]
    .filter(Boolean)
    .join(', ');
};

const InvoiceForm = ({ documentType, initialData, onComplete }: Props) => {
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const [documentNumber] = useState(initialData?.document_number || generateDocNumber(documentType));
  const [orderId, setOrderId] = useState(initialData?.order_id || '');
  const [orderPickerOpen, setOrderPickerOpen] = useState(false);
  const [orderOptions, setOrderOptions] = useState<Array<{ id: string; label: string; sub: string }>>([]);

  const [buyer, setBuyer] = useState({
    name: initialData?.buyer_name || '',
    company: initialData?.buyer_company || '',
    email: initialData?.buyer_email || '',
    phone: initialData?.buyer_phone || '',
    country: initialData?.buyer_country || 'United States',
    address: initialData?.buyer_address || '',
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    Array.isArray(initialData?.items) && initialData!.items.length
      ? (initialData!.items as InvoiceItem[])
      : [{ description: '', quantity: 1, unit: 'cyl', unitPrice: 0 }]
  );

  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [discountPercent, setDiscountPercent] = useState(Number(initialData?.discount_percent ?? 0));
  const [shippingCost, setShippingCost] = useState(Number(initialData?.shipping_cost ?? 0));
  const [taxAmount, setTaxAmount] = useState(Number(initialData?.tax_amount ?? 0));
  const [amountPaid, setAmountPaid] = useState(Number(initialData?.amount_paid ?? 0));
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method || 'bank-wire');
  const [paymentTerms, setPaymentTerms] = useState(initialData?.payment_terms || 'Due upon receipt');
  const [validityDays, setValidityDays] = useState(Number(initialData?.validity_days ?? 30));
  const [shipToAddress, setShipToAddress] = useState(initialData?.ship_to_address || '');
  const [poNumber, setPoNumber] = useState(initialData?.po_number || '');
  const [dueDate, setDueDate] = useState(initialData?.due_date || '');

  const notesAutoRef = useRef(!initialData?.notes);

  const [zelle, setZelle] = useState({ recipient: '', handle: '' });
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [branding, setBranding] = useState({
    logoUrl: '',
    signatureUrl: '',
    signatureName: 'Alper Chemical Group LLC',
    signatureTitle: 'Authorized Representative',
  });

  // ---------- load settings ----------
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'invoice_bank_accounts',
          'invoice_zelle_recipient',
          'invoice_zelle_handle',
          'invoice_logo_url',
          'invoice_signature_url',
          'invoice_signature_name',
          'invoice_signature_title',
          'logo_url',
        ]);
      const map = new Map<string, string>();
      (data || []).forEach((r: any) => map.set(r.setting_key, r.setting_value || ''));

      let accounts: BankAccount[] = [];
      try {
        const parsed = JSON.parse(map.get('invoice_bank_accounts') || '[]');
        if (Array.isArray(parsed)) accounts = parsed.map((a: any) => ({ ...emptyBankAccount(), ...a }));
      } catch {
        accounts = [];
      }
      setBankAccounts(accounts);
      if (accounts.length) setSelectedBankId((prev) => prev || accounts[0].id);

      setZelle({
        recipient: map.get('invoice_zelle_recipient') || '',
        handle: map.get('invoice_zelle_handle') || '',
      });
      setBranding({
        logoUrl: map.get('invoice_logo_url') || map.get('logo_url') || '',
        signatureUrl: map.get('invoice_signature_url') || '',
        signatureName: map.get('invoice_signature_name') || 'Alper Chemical Group LLC',
        signatureTitle: map.get('invoice_signature_title') || 'Authorized Representative',
      });
    })();
  }, []);

  // ---------- defaults for new documents ----------
  useEffect(() => {
    if (!initialData) {
      if (!poNumber) setPoNumber(generatePoNumber());
      if (!dueDate) setDueDate(addBusinessDays(new Date(), 3));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- order picker ----------
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, customer_email, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      setOrderOptions(
        (data || []).map((o: any) => ({
          id: o.id,
          label: `${o.order_number || `#${o.id.slice(0, 8).toUpperCase()}`} — ${o.customer_name || 'Customer'}`,
          sub: `${new Date(o.created_at).toLocaleDateString()} · USD ${Number(o.total_amount || 0).toFixed(2)} · ${o.status || 'pending'} · ${o.customer_email || ''}`,
        }))
      );
    })();
  }, []);

  const subtotal = useMemo(
    () => items.filter((i) => !i.isDetail).reduce((s, i) => s + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0),
    [items]
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount + Number(shippingCost || 0) + Number(taxAmount || 0);
  const balanceDue = Math.max(0, total - Number(amountPaid || 0));

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number | boolean) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  // ---------- payment notes ----------
  const regenerateNotes = (silent = false) => {
    const account = bankAccounts.find((a) => a.id === selectedBankId) || bankAccounts[0];
    const generated = buildPaymentNotes({
      paymentMethod,
      orderNumber: documentNumber,
      bank: account,
      zelle,
    });
    setNotes(generated);
    notesAutoRef.current = true;
    if (!silent) toast.success('Payment instructions regenerated');
  };

  useEffect(() => {
    if (!notes || notesAutoRef.current) regenerateNotes(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, selectedBankId, bankAccounts, zelle]);

  // ---------- settings persistence ----------
  const saveSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' });
    if (error) throw error;
  };

  const persistBankAccounts = async (next: BankAccount[]) => {
    setSavingSettings(true);
    try {
      await saveSetting('invoice_bank_accounts', JSON.stringify(next));
      setBankAccounts(next);
      toast.success('Bank accounts saved');
    } catch (e: any) {
      toast.error(`Failed to save bank accounts: ${e.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const persistZelle = async () => {
    setSavingSettings(true);
    try {
      await saveSetting('invoice_zelle_recipient', zelle.recipient);
      await saveSetting('invoice_zelle_handle', zelle.handle);
      toast.success('Zelle details saved');
    } catch (e: any) {
      toast.error(`Failed to save Zelle details: ${e.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const persistBranding = async (patch: Partial<typeof branding>) => {
    const next = { ...branding, ...patch };
    setBranding(next);
    try {
      await saveSetting('invoice_logo_url', next.logoUrl);
      await saveSetting('invoice_signature_url', next.signatureUrl);
      await saveSetting('invoice_signature_name', next.signatureName);
      await saveSetting('invoice_signature_title', next.signatureTitle);
      toast.success('Invoice branding saved');
    } catch (e: any) {
      toast.error(`Failed to save branding: ${e.message}`);
    }
  };

  // ---------- import from order ----------
  const importFromOrder = async (id: string) => {
    setOrderId(id);
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .maybeSingle();
    if (error || !order) {
      toast.error('Could not load that order');
      return;
    }
    setBuyer((b) => ({
      ...b,
      name: order.customer_name || b.name,
      email: order.customer_email || b.email,
      phone: (order as any).phone || b.phone,
      address: formatAddress(order.shipping_address) || b.address,
    }));
    setShipToAddress(formatAddress(order.shipping_address));
    const lines = (order as any).order_items || [];
    if (lines.length) {
      setItems(
        lines.map((li: any) => ({
          description: [li.product_name, li.packaging].filter(Boolean).join(' — '),
          quantity: Number(li.quantity || 1),
          unit: 'cyl',
          unitPrice: Number(li.price || 0),
        }))
      );
    }
    setShippingCost(Number(order.shipping_cost || 0));
    setTaxAmount(Number(order.tax_amount || 0));
    toast.success('Order imported');
  };

  // ---------- PDF ----------
  const buildDoc = () => ({
    documentType,
    documentNumber,
    dueDate: documentType === 'invoice' ? dueDate : null,
    poNumber,
    validityDays,
    buyerName: buyer.name,
    buyerCompany: buyer.company,
    buyerEmail: buyer.email,
    buyerPhone: buyer.phone,
    buyerAddress: buyer.address,
    buyerCountry: buyer.country,
    shipToAddress,
    items,
    currency,
    discountPercent,
    shippingCost,
    taxAmount,
    amountPaid,
    notes,
    paymentTerms,
    paymentMethod,
    branding: {
      logoUrl: branding.logoUrl || null,
      signatureUrl: branding.signatureUrl || null,
      signatureName: branding.signatureName,
      signatureTitle: branding.signatureTitle,
    },
  });

  const handlePreview = async () => {
    if (!buyer.name.trim()) {
      toast.error('Buyer name is required');
      return;
    }
    setPreviewing(true);
    try {
      const blob = await generateInvoicePDF(buildDoc());
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (e: any) {
      toast.error(`Preview failed: ${e.message}`);
    } finally {
      setPreviewing(false);
    }
  };

  const handleSave = async () => {
    if (!buyer.name.trim()) {
      toast.error('Buyer name is required');
      return;
    }
    if (!items.some((i) => !i.isDetail && i.description.trim())) {
      toast.error('Add at least one line item');
      return;
    }
    setSaving(true);
    try {
      const blob = await generateInvoicePDF(buildDoc());
      const { path, signedUrl } = await uploadInvoicePdf(blob, documentNumber);

      const payload = {
        document_type: documentType,
        document_number: documentNumber,
        order_id: orderId || null,
        buyer_name: buyer.name,
        buyer_company: buyer.company || null,
        buyer_email: buyer.email || null,
        buyer_phone: buyer.phone || null,
        buyer_country: buyer.country || null,
        buyer_address: buyer.address || null,
        ship_to_address: shipToAddress || null,
        items: items as any,
        subtotal,
        discount_percent: discountPercent,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total,
        amount_paid: amountPaid,
        currency,
        notes,
        payment_terms: paymentTerms,
        payment_method: paymentMethod,
        validity_days: validityDays,
        po_number: poNumber || null,
        due_date: documentType === 'invoice' && dueDate ? dueDate : null,
        pdf_url: signedUrl,
        pdf_path: path,
      };

      const { error } = initialData
        ? await supabase.from('generated_documents').update(payload).eq('id', initialData.id)
        : await supabase.from('generated_documents').insert(payload);
      if (error) throw error;

      toast.success(`${documentType === 'invoice' ? 'Invoice' : 'Quote'} ${documentNumber} saved`);
      onComplete();
    } catch (e: any) {
      toast.error(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const selectedOrder = orderOptions.find((o) => o.id === orderId);

  return (
    <div className="space-y-6">
      {/* Header meta */}
      <Card>
        <CardHeader>
          <CardTitle>{documentType === 'invoice' ? 'Invoice' : 'Quotation'} details</CardTitle>
          <CardDescription>Document number {documentNumber}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5 md:col-span-3">
            <Label>Import from order (optional)</Label>
            <Popover open={orderPickerOpen} onOpenChange={setOrderPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedOrder ? selectedOrder.label : 'Select an order…'}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[520px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search orders…" />
                  <CommandList>
                    <CommandEmpty>No orders found.</CommandEmpty>
                    <CommandGroup>
                      {orderOptions.map((o) => (
                        <CommandItem
                          key={o.id}
                          value={`${o.label} ${o.sub}`}
                          onSelect={() => {
                            setOrderPickerOpen(false);
                            importFromOrder(o.id);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', orderId === o.id ? 'opacity-100' : 'opacity-0')} />
                          <div>
                            <div className="text-sm font-medium">{o.label}</div>
                            <div className="text-xs text-muted-foreground">{o.sub}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label>PO number</Label>
            <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          </div>
          {documentType === 'invoice' ? (
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>Valid for (days)</Label>
              <Input
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buyer */}
      <Card>
        <CardHeader><CardTitle>Bill to</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Contact name *</Label>
            <Input value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Input value={buyer.company} onChange={(e) => setBuyer({ ...buyer, company: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Billing address</Label>
            <Textarea rows={2} value={buyer.address} onChange={(e) => setBuyer({ ...buyer, address: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Ship to address</Label>
            <Textarea rows={2} value={shipToAddress} onChange={(e) => setShipToAddress(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input value={buyer.country} onChange={(e) => setBuyer({ ...buyer, country: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Line items</CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setItems((p) => [...p, { description: '', quantity: 0, unit: '', unitPrice: 0, isDetail: true }])}
            >
              Add note row
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setItems((p) => [...p, { description: '', quantity: 1, unit: 'cyl', unitPrice: 0 }])}
            >
              <Plus className="h-4 w-4 mr-1" /> Add item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <Input
                className="col-span-12 md:col-span-5"
                placeholder={item.isDetail ? 'Note / detail line' : 'Description'}
                value={item.description}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
              />
              {!item.isDetail && (
                <>
                  <Input
                    className="col-span-3 md:col-span-2"
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                  />
                  <Input
                    className="col-span-3 md:col-span-1"
                    placeholder="unit"
                    value={item.unit}
                    onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                  />
                  <Input
                    className="col-span-4 md:col-span-2"
                    type="number"
                    step="0.01"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                  />
                  <div className="col-span-1 text-right text-sm tabular-nums hidden md:block">
                    {(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                  </div>
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="col-span-1"
                onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader><CardTitle>Totals</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Discount %</Label>
            <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Shipping</Label>
            <Input type="number" step="0.01" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tax</Label>
            <Input type="number" step="0.01" value={taxAmount} onChange={(e) => setTaxAmount(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Amount paid</Label>
            <Input type="number" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} />
          </div>
          <div className="md:col-span-4 rounded-md border bg-muted/40 p-4 text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>{currency} {subtotal.toFixed(2)}</span></div>
            {discountPercent > 0 && (
              <div className="flex justify-between"><span>Discount</span><span>- {currency} {discountAmount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{currency} {total.toFixed(2)}</span></div>
            {amountPaid > 0 && (
              <div className="flex justify-between font-semibold"><span>Balance due</span><span>{currency} {balanceDue.toFixed(2)}</span></div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment details</CardTitle>
          <CardDescription>
            Bank wire and Zelle details entered here are saved for reuse and printed on the PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Payment method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment terms</Label>
              <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </div>
          </div>

          {/* Bank accounts */}
          <div className="rounded-md border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Bank wire accounts</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingAccount(emptyBankAccount())}>
                <Plus className="h-4 w-4 mr-1" /> Add account
              </Button>
            </div>

            {bankAccounts.length === 0 && !editingAccount && (
              <p className="text-sm text-muted-foreground">No bank accounts saved yet.</p>
            )}

            {bankAccounts.map((acct) => (
              <label
                key={acct.id}
                className={cn(
                  'flex items-start gap-3 rounded-md border p-3 cursor-pointer',
                  selectedBankId === acct.id && 'border-primary bg-muted/40'
                )}
              >
                <input
                  type="radio"
                  className="mt-1"
                  checked={selectedBankId === acct.id}
                  onChange={() => setSelectedBankId(acct.id)}
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium">{acct.label || acct.bankName || 'Account'}</div>
                  <div className="text-muted-foreground text-xs">
                    {[acct.beneficiary, acct.bankName, acct.account && `•••• ${acct.account.slice(-4)}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingAccount(acct)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => persistBankAccounts(bankAccounts.filter((a) => a.id !== acct.id))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </label>
            ))}

            {editingAccount && (
              <div className="grid gap-3 md:grid-cols-2 rounded-md border bg-muted/30 p-3">
                {([
                  ['label', 'Label (internal)'],
                  ['beneficiary', 'Beneficiary name'],
                  ['bankName', 'Bank name'],
                  ['routing', 'Routing / ABA'],
                  ['account', 'Account number'],
                  ['swift', 'SWIFT / BIC'],
                  ['address', 'Bank address'],
                ] as Array<[keyof BankAccount, string]>).map(([field, label]) => (
                  <div key={field} className="space-y-1.5">
                    <Label>{label}</Label>
                    <Input
                      value={(editingAccount[field] as string) || ''}
                      onChange={(e) => setEditingAccount({ ...editingAccount, [field]: e.target.value })}
                    />
                  </div>
                ))}
                <div className="md:col-span-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={savingSettings}
                    onClick={async () => {
                      const exists = bankAccounts.some((a) => a.id === editingAccount.id);
                      const next = exists
                        ? bankAccounts.map((a) => (a.id === editingAccount.id ? editingAccount : a))
                        : [...bankAccounts, editingAccount];
                      await persistBankAccounts(next);
                      setSelectedBankId(editingAccount.id);
                      setEditingAccount(null);
                    }}
                  >
                    <Save className="h-4 w-4 mr-1" /> Save account
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditingAccount(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Zelle */}
          <div className="rounded-md border p-4 space-y-3">
            <h4 className="font-medium text-sm">Zelle details</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Recipient name</Label>
                <Input value={zelle.recipient} onChange={(e) => setZelle({ ...zelle, recipient: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Zelle email or phone</Label>
                <Input value={zelle.handle} onChange={(e) => setZelle({ ...zelle, handle: e.target.value })} />
              </div>
            </div>
            <Button type="button" size="sm" variant="outline" disabled={savingSettings} onClick={persistZelle}>
              <Save className="h-4 w-4 mr-1" /> Save Zelle details
            </Button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Payment instructions printed on the PDF</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => regenerateNotes()}>
                <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
              </Button>
            </div>
            <Textarea
              rows={7}
              value={notes}
              onChange={(e) => {
                notesAutoRef.current = false;
                setNotes(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding &amp; signature</CardTitle>
          <CardDescription>Used on every generated quote and invoice PDF.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ImageUpload
            label="Invoice logo"
            bucket="images"
            folder="invoice-branding"
            currentImage={branding.logoUrl}
            onImageUploaded={(url) => persistBranding({ logoUrl: url })}
            onImageRemoved={() => persistBranding({ logoUrl: '' })}
          />
          <ImageUpload
            label="Authorized signature (transparent PNG)"
            bucket="images"
            folder="invoice-branding"
            currentImage={branding.signatureUrl}
            onImageUploaded={(url) => persistBranding({ signatureUrl: url })}
            onImageRemoved={() => persistBranding({ signatureUrl: '' })}
          />
          <div className="space-y-1.5">
            <Label>Signatory name</Label>
            <Input
              value={branding.signatureName}
              onChange={(e) => setBranding({ ...branding, signatureName: e.target.value })}
              onBlur={() => persistBranding({})}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Signatory title</Label>
            <Input
              value={branding.signatureTitle}
              onChange={(e) => setBranding({ ...branding, signatureTitle: e.target.value })}
              onBlur={() => persistBranding({})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button type="button" variant="outline" onClick={handlePreview} disabled={previewing}>
          {previewing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileDown className="h-4 w-4 mr-1" />}
          Preview PDF
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          Save &amp; generate PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
