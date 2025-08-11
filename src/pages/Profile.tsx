
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { Loading } from '@/components/ui/loading';
import { useAuthStore } from '@/store/authStore';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Profile() {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState<UserProfile>({
    id: '',
    name: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { data: profile, isLoading } = useApiQuery<UserProfile>(
    ['user-profile'],
    '/api/user/profile'
  );

  const updateProfileMutation = useApiMutation<{ message: string }, Omit<UserProfile, 'id'>>(
    '/api/user/profile',
    'PUT'
  );

  const changePasswordMutation = useApiMutation<{ message: string }, Omit<PasswordChange, 'confirmPassword'>>(
    '/api/user/change-password',
    'PUT'
  );

  React.useEffect(() => {
    if (profile) {
      setProfileData({
        id: profile.id || '',
        name: profile.name || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate({
      name: profileData.name,
      email: profileData.email
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    });

    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const hasProfileChanges = profile && (
    profileData.name !== profile.name ||
    profileData.email !== profile.email
  );

  const isPasswordValid = passwordData.oldPassword && 
    passwordData.newPassword && 
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword &&
    passwordData.newPassword.length >= 6;

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and security</p>
        </div>
        <User className="w-8 h-8 text-primary" />
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>Account ID: {user?.id || profileData.id}</span>
            </div>
            
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending || !hasProfileChanges}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old-password">Current Password</Label>
              <Input
                id="old-password"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Password must be at least 6 characters long
            </div>
            
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending || !isPasswordValid}
              className="flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <div className="font-medium capitalize">{user?.role || 'User'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Account Status:</span>
              <div className="font-medium text-green-600">Active</div>
            </div>
            <div>
              <span className="text-muted-foreground">Member Since:</span>
              <div className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
