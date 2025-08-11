
// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// WhatsApp Status Types
export type WhatsAppStatus = 'connected' | 'qr_needed' | 'disconnected';

export interface WhatsAppState {
  status: WhatsAppStatus;
  qrCode?: string;
  lastConnected?: string;
}

// Message Types
export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  response?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  aiProvider?: string;
  aiModel?: string;
}

// AI Provider Types
export interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  models: string[];
  isActive: boolean;
  priority: number;
}

export interface AISettings {
  providers: AIProvider[];
  defaultModel: string;
  failoverEnabled: boolean;
}

// Knowledge Base Types
export interface KnowledgeDocument {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
}

// Bot Settings Types
export interface BotSettings {
  promptTemplate: string;
  language: string;
  responseTime: number;
  isActive: boolean;
}

// Admin Types
export interface UserStats {
  userId: string;
  userName: string;
  messagesCount: number;
  apiCallsCount: number;
  lastActive: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordForm {
  email: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Component Props Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface EmptyState {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
