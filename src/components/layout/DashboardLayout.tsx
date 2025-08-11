
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const { startPolling, stopPolling } = useDashboardStore();

  useEffect(() => {
    if (isAuthenticated) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isAuthenticated, startPolling, stopPolling]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
