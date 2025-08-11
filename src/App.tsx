
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Login } from "@/pages/auth/Login";
import { Dashboard } from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/reset-password" element={<Login />} />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          
          {/* Placeholder for other dashboard routes */}
          <Route path="/api-settings" element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">API Settings</h1>
                <p className="text-muted-foreground">Configure your AI providers and models.</p>
              </div>
            </DashboardLayout>
          } />
          
          <Route path="/knowledge" element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Knowledge Base</h1>
                <p className="text-muted-foreground">Manage your knowledge documents.</p>
              </div>
            </DashboardLayout>
          } />
          
          <Route path="/bot-settings" element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Bot Settings</h1>
                <p className="text-muted-foreground">Configure your AI bot behavior.</p>
              </div>
            </DashboardLayout>
          } />
          
          <Route path="/messages" element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-muted-foreground">View all customer conversations.</p>
              </div>
            </DashboardLayout>
          } />
          
          <Route path="/profile" element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account settings.</p>
              </div>
            </DashboardLayout>
          } />
          
          <Route path="/admin" element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-muted-foreground">Manage users and system settings.</p>
              </div>
            </DashboardLayout>
          } />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
