
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Search, UserCheck, UserX } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
}

export function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: users, isLoading } = useApiQuery<AdminUser[]>(
    ['admin-users'],
    '/api/admin/users'
  );

  const updateStatusMutation = useApiMutation<{ message: string }>(
    (data: { userId: string; status: 'active' | 'suspended' }) => 
      `/api/admin/users/${data.userId}/status`,
    'PUT'
  );

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    updateStatusMutation.mutate(
      { userId, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `User status updated to ${newStatus}`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update user status",
            variant: "destructive",
          });
        }
      }
    );
  };

  const usersData = users as AdminUser[] || [];
  
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading text="Loading admin panel..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users and system settings</p>
        </div>
        <Shield className="w-8 h-8 text-primary" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{usersData.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {usersData.filter(u => u.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserX className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">
                  {usersData.filter(u => u.status === 'suspended').length}
                </div>
                <div className="text-sm text-muted-foreground">Suspended</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {usersData.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                    
                    <div className="flex items-center space-x-1">
                      {user.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          disabled={updateStatusMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'active')}
                          disabled={updateStatusMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : usersData && usersData.length > 0 ? (
            <EmptyState
              title="No users found"
              description="No users match your search criteria."
              icon={<Search className="w-12 h-12" />}
            />
          ) : (
            <EmptyState
              title="No users"
              description="No users have been registered yet."
              icon={<Users className="w-12 h-12" />}
            />
          )}
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <div className="text-sm font-medium">Export Users</div>
              <div className="text-xs text-muted-foreground">Download user list as CSV</div>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <div className="text-sm font-medium">System Logs</div>
              <div className="text-xs text-muted-foreground">View application logs</div>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <div className="text-sm font-medium">Backup Data</div>
              <div className="text-xs text-muted-foreground">Create system backup</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
