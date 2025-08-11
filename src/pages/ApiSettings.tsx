
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings, Key, AlertTriangle } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

interface ApiProvider {
  provider: 'gemini' | 'openai' | 'qrog';
  apiKey: string;
  priority: number;
}

export function ApiSettings() {
  const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({});

  const { data: providers, isLoading, error } = useApiQuery<ApiProvider[]>(
    ['api-settings'],
    '/api/settings/api'
  );

  const saveSettingsMutation = useApiMutation<{ message: string }, ApiProvider[]>(
    '/api/settings/api',
    'POST'
  );

  const handleAddProvider = () => {
    if (!newProvider.provider || !newProvider.apiKey) return;
    
    const updatedProviders = [
      ...(providers || []),
      {
        ...newProvider as ApiProvider,
        priority: (providers?.length || 0) + 1
      }
    ];
    
    saveSettingsMutation.mutate(updatedProviders);
    setNewProvider({});
  };

  const handleRemoveProvider = (index: number) => {
    if (!providers) return;
    
    const updatedProviders = providers.filter((_, i) => i !== index);
    saveSettingsMutation.mutate(updatedProviders);
  };

  const handleUpdatePriority = (index: number, newPriority: number) => {
    if (!providers) return;
    
    const updatedProviders = [...providers];
    updatedProviders[index].priority = newPriority;
    saveSettingsMutation.mutate(updatedProviders);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading text="Loading API settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Error loading API settings"
          description="Failed to load your API configuration. Please try again."
          icon={<AlertTriangle className="w-12 h-12" />}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
          <p className="text-muted-foreground">Configure your AI providers and failover settings</p>
        </div>
        <Settings className="w-8 h-8 text-primary" />
      </div>

      {/* Current Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>AI Providers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {providers && providers.length > 0 ? (
            <div className="space-y-4">
              {providers.map((provider, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="capitalize">
                      {provider.provider}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">API Key:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {provider.apiKey.substring(0, 8)}...
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Priority:</span>
                      <Select
                        value={provider.priority.toString()}
                        onValueChange={(value) => handleUpdatePriority(index, parseInt(value))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProvider(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No providers configured"
              description="Add your first AI provider to get started with automated responses."
              icon={<Key className="w-12 h-12" />}
            />
          )}
        </CardContent>
      </Card>

      {/* Add New Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={newProvider.provider || ''}
                onValueChange={(value: 'gemini' | 'openai' | 'qrog') => 
                  setNewProvider({ ...newProvider, provider: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="qrog">Qrog AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter API key"
                value={newProvider.apiKey || ''}
                onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddProvider}
            disabled={!newProvider.provider || !newProvider.apiKey || saveSettingsMutation.isPending}
            className="w-full md:w-auto"
          >
            {saveSettingsMutation.isPending ? 'Adding...' : 'Add Provider'}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Failover Configuration</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Providers will be used in priority order (1 = highest priority). If the primary provider fails, 
                the system will automatically try the next available provider.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
