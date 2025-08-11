
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Save, RotateCcw } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

interface BotSettings {
  promptTemplate: string;
  language: string;
}

const languages = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Bahasa Malaysia' },
  { value: 'zh', label: '中文' },
  { value: 'ar', label: 'العربية' }
];

const defaultPrompt = `You are a helpful customer service assistant. Please respond politely and professionally to customer inquiries.

Guidelines:
- Always greet customers warmly
- Listen to their concerns carefully
- Provide clear and helpful information
- If you cannot help, offer to connect them with a human agent
- Keep responses concise but complete
- Maintain a friendly and professional tone

Remember to personalize your responses based on the customer's needs and context.`;

export function BotSettings() {
  const [formData, setFormData] = useState<BotSettings>({
    promptTemplate: '',
    language: 'id'
  });

  const { data: settings, isLoading } = useApiQuery<BotSettings>(
    ['bot-settings'],
    '/api/settings/bot',
    {
      onSuccess: (data: BotSettings) => {
        setFormData(data);
      }
    }
  );

  const saveMutation = useApiMutation<{ message: string }, BotSettings>(
    '/api/settings/bot',
    'POST'
  );

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData({
      promptTemplate: defaultPrompt,
      language: 'id'
    });
  };

  const hasChanges = settings && (
    formData.promptTemplate !== settings.promptTemplate ||
    formData.language !== settings.language
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading text="Loading bot settings..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bot Settings</h1>
          <p className="text-muted-foreground">Configure your AI bot behavior and responses</p>
        </div>
        <Bot className="w-8 h-8 text-primary" />
      </div>

      {/* Prompt Template */}
      <Card>
        <CardHeader>
          <CardTitle>AI Prompt Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your AI prompt template..."
              value={formData.promptTemplate}
              onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              This prompt will guide how your AI responds to customer messages. Be specific about tone, 
              style, and any business rules.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Localization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              The primary language for AI responses. The bot will try to match the customer's language 
              when possible.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Customer Service</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Professional customer service with escalation options
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFormData({ ...formData, promptTemplate: defaultPrompt })}
              >
                Use Template
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sales Assistant</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Focused on product information and sales conversion
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFormData({ 
                  ...formData, 
                  promptTemplate: `You are a knowledgeable sales assistant. Help customers find the right products and guide them through the purchasing process.

Guidelines:
- Understand customer needs before recommending products
- Provide detailed product information
- Answer pricing and availability questions
- Guide customers to complete purchases
- Handle objections professionally
- Create urgency when appropriate

Always be helpful and focus on providing value to the customer.`
                })}
              >
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline"
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Default</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-sm text-muted-foreground">You have unsaved changes</span>
          )}
          <Button 
            onClick={handleSave}
            disabled={saveMutation.isPending || !hasChanges}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
