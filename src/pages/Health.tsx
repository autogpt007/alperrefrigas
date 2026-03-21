import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEOComponent from '@/components/seo/SEOComponent';

interface HealthData {
  postgres_version: string;
  current_timestamp: string;
  latest_migration: string;
}

const Health = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHealthData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('get_db_health');

      if (rpcError) throw rpcError;

      const row = (Array.isArray(data) ? data[0] : data) as Partial<HealthData> | null;
      if (!row || typeof row !== 'object') {
        throw new Error('Invalid health response');
      }

      setHealthData({
        postgres_version: row.postgres_version ?? 'Unknown',
        current_timestamp: row.current_timestamp ?? new Date().toISOString(),
        latest_migration: row.latest_migration ?? 'N/A',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch health data';
      console.error('Error fetching health data:', err);
      setError(message);
      toast({
        title: 'Error',
        description: 'Failed to fetch health data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHealthData();
  }, []);

  const formatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString();

  const extractPostgresVersion = (versionString: string) => {
    const match = versionString.match(/PostgreSQL ([\d.]+)/);
    return match ? match[1] : 'Unknown';
  };

  const isHealthy = Boolean(healthData) && !error;

  return (
    <>
      <SEOComponent
        title="System Health Status - Database & Infrastructure Monitoring"
        description="Real-time system health monitoring for database connectivity, performance metrics, and infrastructure status."
        keywords="system health, database monitoring, infrastructure status, postgres health"
        canonicalUrl="/health"
        robotsContent="noindex, nofollow"
      />

      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-3 flex items-center justify-center gap-3 text-4xl font-bold text-foreground">
              <Database className="h-8 w-8 text-primary" />
              System Health
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring of database connectivity and system status
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Overall Status</CardTitle>
                  <CardDescription>Current backend service health</CardDescription>
                </div>
                <Badge variant={isHealthy ? 'default' : 'destructive'}>
                  {loading ? 'Checking...' : isHealthy ? 'Healthy' : 'Issue Detected'}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isHealthy ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {error ?? 'All checks passed.'}
                </div>
                <Button onClick={() => void fetchHealthData()} disabled={loading} variant="outline">
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>PostgreSQL Version</CardDescription>
                </CardHeader>
                <CardContent className="font-semibold text-foreground">
                  {healthData ? extractPostgresVersion(healthData.postgres_version) : '—'}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Server Time
                  </CardDescription>
                </CardHeader>
                <CardContent className="font-semibold text-foreground">
                  {healthData ? formatTimestamp(healthData.current_timestamp) : '—'}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Latest Migration</CardDescription>
                </CardHeader>
                <CardContent className="font-semibold text-foreground">
                  {healthData?.latest_migration ?? '—'}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Health;