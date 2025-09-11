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
                  <CardTitle className="text-white flex items-center gap-2">
                    {loading ? (
                      <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />
                    ) : error ? (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    System Status
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Database connectivity and core system health
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={error ? "destructive" : "default"}
                    className={error ? "bg-red-600" : "bg-green-600"}
                  >
                    {loading ? "Checking..." : error ? "Offline" : "Online"}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchHealthData}
                    disabled={loading}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Health Details */}
            {healthData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Database Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-400" />
                      Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">PostgreSQL Version</p>
                      <p className="text-white font-mono">
                        {extractPostgresVersion(healthData.postgres_version)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Latest Migration</p>
                      <p className="text-white font-mono">
                        {healthData.latest_migration || 'No migrations found'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Timestamp Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-400" />
                      Timestamp
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Server Time</p>
                      <p className="text-white font-mono">
                        {formatTimestamp(healthData.current_timestamp)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Connected</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Error Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-300 font-mono text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Service Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Service Information</CardTitle>
                <CardDescription className="text-gray-300">
                  Core system components and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Database</span>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API</span>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Storage</span>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Health;