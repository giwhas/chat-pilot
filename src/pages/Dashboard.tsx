
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  MessageSquare, 
  Bot, 
  Activity,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export function Dashboard() {
  const { 
    whatsapp, 
    messages, 
    aiSettings, 
    isLoading, 
    error,
    fetchStatus,
    fetchMessages,
    fetchAISettings
  } = useDashboardStore();

  useEffect(() => {
    fetchStatus();
    fetchMessages();
    fetchAISettings();
  }, [fetchStatus, fetchMessages, fetchAISettings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'status-connected';
      case 'qr_needed':
        return 'status-pending';
      case 'disconnected':
        return 'status-disconnected';
      default:
        return 'status-disconnected';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'qr_needed':
        return 'QR Code Required';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Error loading dashboard"
          description={error}
          action={{
            label: 'Retry',
            onClick: () => {
              fetchStatus();
              fetchMessages();
              fetchAISettings();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your WhatsApp AI customer service</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary animate-pulse-slow" />
          <span className="text-sm text-muted-foreground">Live monitoring</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Status</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(whatsapp.status)}>
                {getStatusText(whatsapp.status)}
              </Badge>
            </div>
            {whatsapp.lastConnected && (
              <p className="text-xs text-muted-foreground mt-2">
                Last connected: {new Date(whatsapp.lastConnected).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Provider</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {aiSettings?.providers.find(p => p.isActive)?.name || 'Not configured'}
            </div>
            <p className="text-xs text-muted-foreground">
              {aiSettings?.defaultModel || 'No model selected'}
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Section */}
      {whatsapp.status === 'qr_needed' && (
        <Card className="dashboard-card border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-warning">QR Code Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Scan this QR code with your WhatsApp to connect your account.
                </p>
                <Button 
                  onClick={fetchStatus}
                  variant="outline"
                  size="sm"
                >
                  Refresh Status
                </Button>
              </div>
              {whatsapp.qrCode && (
                <div className="p-4 bg-white rounded-lg border">
                  <img 
                    src={whatsapp.qrCode} 
                    alt="WhatsApp QR Code"
                    className="w-48 h-48"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Recent Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading text="Loading messages..." />
            ) : messages.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.slice(0, 10).map((message) => (
                  <div key={message.id} className="border-l-2 border-primary/20 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">{message.from}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {message.message.length > 100 
                        ? message.message.substring(0, 100) + '...'
                        : message.message
                      }
                    </p>
                    {message.response && (
                      <div className="bg-primary/5 p-2 rounded text-xs">
                        <strong>AI Response:</strong> {message.response.length > 80 
                          ? message.response.substring(0, 80) + '...'
                          : message.response
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No messages yet"
                description="Messages will appear here when customers start chatting."
                icon={<MessageSquare className="w-12 h-12" />}
              />
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>AI Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <span className="font-semibold text-success">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Response Time</span>
                <span className="font-semibold">1.2s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Messages Processed</span>
                <span className="font-semibold">{messages.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Provider</span>
                <span className="font-semibold text-primary">
                  {aiSettings?.providers.find(p => p.isActive)?.name || 'None'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
