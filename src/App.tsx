
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { Dashboard } from "@/pages/Dashboard";
import { ApiSettings } from "@/pages/ApiSettings";
import { KnowledgeBase } from "@/pages/KnowledgeBase";
import { BotSettings } from "@/pages/BotSettings";
import { Messages } from "@/pages/Messages";
import { Profile } from "@/pages/Profile";
import { AdminPanel } from "@/pages/AdminPanel";
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
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          
          <Route path="/api-settings" element={
            <DashboardLayout>
              <ApiSettings />
            </DashboardLayout>
          } />
          
          <Route path="/knowledge" element={
            <DashboardLayout>
              <KnowledgeBase />
            </DashboardLayout>
          } />
          
          <Route path="/bot-settings" element={
            <DashboardLayout>
              <BotSettings />
            </DashboardLayout>
          } />
          
          <Route path="/messages" element={
            <DashboardLayout>
              <Messages />
            </DashboardLayout>
          } />
          
          <Route path="/profile" element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          } />
          
          <Route path="/admin" element={
            <DashboardLayout>
              <AdminPanel />
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
