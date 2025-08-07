import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  event_type: 'login_attempt' | 'admin_action' | 'payment_attempt' | 'data_access' | 'api_call';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

const SecurityAuditLog = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast({
        title: "Error loading security events",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logSecurityEvent = async (eventData: Omit<SecurityEvent, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .insert([eventData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || 
      event.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip_address?.includes(searchTerm) ||
      event.event_type.includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || event.event_type === filterType;
    const matchesRisk = filterRisk === 'all' || event.risk_level === filterRisk;
    
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          Security Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search by email, IP, or event type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="login_attempt">Login Attempts</SelectItem>
              <SelectItem value="admin_action">Admin Actions</SelectItem>
              <SelectItem value="payment_attempt">Payment Attempts</SelectItem>
              <SelectItem value="data_access">Data Access</SelectItem>
              <SelectItem value="api_call">API Calls</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-40">
              <SelectValue placeholder="Risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading security events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No security events found</div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getRiskBadgeColor(event.risk_level)}>
                        {getRiskIcon(event.risk_level)}
                        {event.risk_level.toUpperCase()}
                      </Badge>
                      <span className="text-white font-medium capitalize">
                        {event.event_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      {event.user_email && (
                        <div>User: {event.user_email}</div>
                      )}
                      {event.ip_address && (
                        <div>IP: {event.ip_address}</div>
                      )}
                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="text-gray-400">
                          Details: {JSON.stringify(event.details, null, 1)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Button 
          onClick={fetchSecurityEvents}
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          Refresh Events
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;