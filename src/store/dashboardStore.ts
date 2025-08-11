
import { create } from 'zustand';
import { WhatsAppState, ChatMessage, AISettings } from '@/types';
import { apiClient } from '@/lib/apiClient';
import { API_CONFIG, POLLING_INTERVAL } from '@/config/api';

interface DashboardState {
  whatsapp: WhatsAppState;
  messages: ChatMessage[];
  aiSettings: AISettings | null;
  isLoading: boolean;
  error: string | null;
  pollingInterval: NodeJS.Timeout | null;
}

interface DashboardActions {
  fetchStatus: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  fetchAISettings: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
  // State
  whatsapp: {
    status: 'disconnected'
  },
  messages: [],
  aiSettings: null,
  isLoading: false,
  error: null,
  pollingInterval: null,

  // Actions
  fetchStatus: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.STATUS);
      const whatsappData = response.data.data;
      
      set(state => ({
        whatsapp: { ...state.whatsapp, ...whatsappData }
      }));
      
      // If QR needed, fetch QR code
      if (whatsappData.status === 'qr_needed') {
        const qrResponse = await apiClient.get(API_CONFIG.ENDPOINTS.QR);
        set(state => ({
          whatsapp: { ...state.whatsapp, qrCode: qrResponse.data.data.qrCode }
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch status' });
    }
  },

  fetchMessages: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.MESSAGES);
      set({ messages: response.data.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch messages' });
    }
  },

  fetchAISettings: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.API_SETTINGS);
      set({ aiSettings: response.data.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch AI settings' });
    }
  },

  startPolling: () => {
    const { pollingInterval, fetchMessages, fetchStatus } = get();
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    const interval = setInterval(() => {
      fetchMessages();
      fetchStatus();
    }, POLLING_INTERVAL);
    
    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}));
