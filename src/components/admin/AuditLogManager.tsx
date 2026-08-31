import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

interface AuditRow {
  id: string;
  admin_email: string | null;
  action: string;
  resource_type: string;
  resource_label: string | null;
  new_value: unknown;
  created_at: string;
}

const AuditLogManager = () => {
  const [search, setSearch] = useState('');

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-audit-log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('id, admin_email, action, resource_type, resource_label, new_value, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data || []) as AuditRow[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.admin_email, r.action, r.resource_type, r.resource_label]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" /> Audit log
          </CardTitle>
          <CardDescription>
            Read-only record of admin actions. Entries are written server-side and cannot be edited or
            deleted from the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search admin, action or resource"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No admin activity recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(r.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{r.admin_email || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{r.resource_label || '—'}</div>
                        <div className="text-xs text-muted-foreground">{r.resource_type}</div>
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate text-xs text-muted-foreground">
                        {r.new_value ? JSON.stringify(r.new_value) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogManager;
