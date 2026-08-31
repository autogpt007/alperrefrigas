import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Boxes, Search, Loader2, AlertTriangle, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const LOW_STOCK_THRESHOLD = 10;
const PAGE_SIZE = 20;

interface InventoryRow {
  id: string;
  name: string;
  sku: string | null;
  product_type: string;
  price: number;
  stock_quantity: number | null;
  availability: string | null;
}

const InventoryManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, { stock?: string; availability?: string }>>({});

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, product_type, price, stock_quantity, availability')
        .order('name');
      if (error) throw error;
      return (data || []) as InventoryRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      id,
      stock,
      availability,
    }: {
      id: string;
      stock: number | null;
      availability: string;
    }) => {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: stock, availability })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      toast.success('Inventory updated');
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[vars.id];
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (e: Error) => toast.error(`Update failed: ${e.message}`),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (typeFilter !== 'all' && p.product_type !== typeFilter) return false;
      const stock = p.stock_quantity ?? 0;
      if (stockFilter === 'low' && stock >= LOW_STOCK_THRESHOLD) return false;
      if (stockFilter === 'out' && stock > 0) return false;
      if (q && ![p.name, p.sku].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [products, search, typeFilter, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const summary = useMemo(() => {
    const lowStock = products.filter(
      (p) => (p.stock_quantity ?? 0) > 0 && (p.stock_quantity ?? 0) < LOW_STOCK_THRESHOLD
    ).length;
    const outOfStock = products.filter((p) => (p.stock_quantity ?? 0) === 0).length;
    const stockValue = products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (p.stock_quantity ?? 0),
      0
    );
    return { lowStock, outOfStock, stockValue, total: products.length };
  }, [products]);

  const money = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Products tracked', value: String(summary.total) },
          { label: 'Low stock', value: String(summary.lowStock) },
          { label: 'Out of stock', value: String(summary.outOfStock) },
          { label: 'Stock value', value: money(summary.stockValue) },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5" /> Inventory
          </CardTitle>
          <CardDescription>
            Adjust stock counts and availability. Changes apply to the live storefront immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search product or SKU"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="refrigerant">Refrigerants</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
                <SelectItem value="air_conditioner">Air conditioners</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stock levels</SelectItem>
                <SelectItem value="low">Low stock</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No products found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Unit price</TableHead>
                      <TableHead className="w-[120px]">Stock</TableHead>
                      <TableHead className="w-[170px]">Availability</TableHead>
                      <TableHead className="text-right">Save</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((p) => {
                      const draft = drafts[p.id] || {};
                      const stockValue = draft.stock ?? String(p.stock_quantity ?? 0);
                      const availability = draft.availability ?? p.availability ?? 'in_stock';
                      const dirty = draft.stock !== undefined || draft.availability !== undefined;
                      const low = Number(stockValue) < LOW_STOCK_THRESHOLD;
                      return (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.sku || 'No SKU'}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{p.product_type.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {money(Number(p.price) || 0)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                value={stockValue}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [p.id]: { ...prev[p.id], stock: e.target.value },
                                  }))
                                }
                                className="h-8 w-20"
                              />
                              {low && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={availability}
                              onValueChange={(v) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [p.id]: { ...prev[p.id], availability: v },
                                }))
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_stock">In stock</SelectItem>
                                <SelectItem value="limited">Limited</SelectItem>
                                <SelectItem value="out_of_stock">Out of stock</SelectItem>
                                <SelectItem value="preorder">Pre-order</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={dirty ? 'default' : 'ghost'}
                              disabled={!dirty || saveMutation.isPending}
                              onClick={() =>
                                saveMutation.mutate({
                                  id: p.id,
                                  stock: stockValue === '' ? null : Number(stockValue),
                                  availability,
                                })
                              }
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {currentPage * PAGE_SIZE + 1}–
                  {Math.min(filtered.length, currentPage * PAGE_SIZE + PAGE_SIZE)} of {filtered.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
