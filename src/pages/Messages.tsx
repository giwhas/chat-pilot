
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Filter, Phone, Clock, User } from 'lucide-react';
import { useApiQuery } from '@/hooks/useApi';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
}

export function Messages() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: messages, isLoading } = useApiQuery<WhatsAppMessage[]>(
    ['whatsapp-messages'],
    '/api/whatsapp/messages'
  );

  const filteredMessages = messages?.filter(message => 
    message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.includes(searchTerm)
  ) || [];

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/^\+/, '');
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">View all customer conversations</p>
        </div>
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{messages?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {new Set(messages?.map(m => m.from)).size || 0}
                </div>
                <div className="text-sm text-muted-foreground">Unique Customers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">1.2s</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Conversations</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMessages.length > 0 ? (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {formatPhoneNumber(message.from)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getTimeAgo(message.timestamp)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      WhatsApp
                    </Badge>
                  </div>
                  
                  <div className="pl-13">
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {message.text}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pl-13">
                    <div className="text-xs text-muted-foreground">
                      To: {formatPhoneNumber(message.to)}
                    </div>
                    <Button variant="ghost" size="sm">
                      View Conversation
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            <EmptyState
              title="No messages found"
              description="No messages match your search criteria."
              icon={<Search className="w-12 h-12" />}
            />
          ) : (
            <EmptyState
              title="No messages yet"
              description="Customer messages will appear here when they start chatting."
              icon={<MessageSquare className="w-12 h-12" />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
