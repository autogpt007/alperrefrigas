import React, { useState, useEffect } from 'react';
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
      const { data, error } = await supabase.rpc('get_db_health');
      
      if (error) throw error;
      
      setHealthData(data as unknown as HealthData);
    } catch (err: any) {
      console.error('Error fetching health data:', err);
      setError(err.message || 'Failed to fetch health data');
      toast({
        title: "Error",
        description: "Failed to fetch health data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const extractPostgresVersion = (versionString: string) => {
    const match = versionString.match(/PostgreSQL ([\d.]+)/);
    return match ? match[1] : 'Unknown';
  };

  return (
    <>
      <SEOComponent
        title="System Health Status - Database & Infrastructure Monitoring"
        description="Real-time system health monitoring for database connectivity, performance metrics, and infrastructure status."
        keywords="system health, database monitoring, infrastructure status, postgres health"
        canonicalUrl="/health"
        noIndex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Database className="h-8 w-8 text-cyan-400" />
              System Health
            </h1>
            <p className="text-gray-300 text-lg">
              Real-time monitoring of database connectivity and system status
            </p>
          </div>

          <div className="space-y-6">
            {/* Overall Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <Ca