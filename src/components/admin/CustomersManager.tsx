import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, Loader2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface AdminOrder {
  id: string;
  order_number?: string | null;
  customer_name: string;
  customer_email: string;
  phone?: string | null;
  status?: string | null;
  total_amount: number;
  created_at?: string | null;
  user_id?: string | null;
}

interface CustomerRow {
  email: string;
  name: string;
  phone?: string | null;
  orders: number;
  totalSpend: number;
  lastOrderAt?: string | null;
  registered: boolean;
}

const PAGE_SIZE = 20;

/**
 * Customer overview derived from orders (the secure edge function is the only
 * admin-side read path for order contact data) plus registered profiles.
 */
const CustomersManager = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-customers-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { action: 'list' },
      });
      if (error) throw error;
      return (data || []) as AdminOrder[];
    },
  });

  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['admin-customers-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const customers = useMemo<CustomerRow[]>(() => {
    const map = new Map<string, CustomerRow>();

    for (const p of profiles) {
      const email = (p.email || '').toLowerCase();
      if (!email) continue;
      map.set(email, {
        email,
        name: p.full_name || email,
        orders: 0,
        totalSpend: 0,
        registered: true,
      });
    }

    for (const o of orders) {
      const email = (o.customer_email || '').toLowerCase();
      if (!email) continue;
      const existing = map.get(email);
      const amount = Number(o.total_amount) || 0;
      if (existing) {
        existing.orders += 1;
        existing.totalSpend += amount;
        existing.phone = existing.phone || o.phone;
        if (o.customer_name) existing.name = existing.name || o.customer_name;
        if (!existing.lastOrderAt || (o.created_at && o.created_at > existing.lastOrderAt)) {
          existing.lastOrderAt = o.created_at || existing.lastOrderAt;
        }
      } else {
        map.set(email, {
          email,
          name: o.customer_name || email,
          phone: o.phone,
          orders: 1,
          totalSpend: amount,
          lastOrderAt: o.created_at,
          registered: !!o.user_id,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders, profiles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.email, c.name, c.phone].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const loading = ordersLoading || profilesLoading;

  const money = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Customers
          </CardTitle>
          <CardDescription>
            Everyone who has registered an account or placed an order, with lifetime order value.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search name, email or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No customers found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Lifetime value</TableHead>
                      <TableHead>Last order</TableHead>
                      <TableHead>Account</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((c) => (
                      <TableRow key={c.email}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {c.email}
                          </div>
                          {c.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {c.phone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{c.orders}</TableCell>
                        <TableCell className="text-right tabular-nums">{money(c.totalSpend)}</TableCell>
                        <TableCell className="text-sm">
                          {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={c.registered ? 'default' : 'secondary'}>
                            {c.registered ? 'Registered' : 'Guest'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default CustomersManager;
