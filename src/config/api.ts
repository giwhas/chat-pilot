
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com' 
    : 'http://localhost:3001',
  
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    RESET_PASSWORD: '/api/auth/reset-password',
    
    // Dashboard
    STATUS: '/api/status',
    QR: '/api/qr',
    MESSAGES: '/api/messages',
    
    // API Settings
    API_SETTINGS: '/api/settings/api',
    
    // Knowledge Base
    KNOWLEDGE_UPLOAD: '/api/knowledge/upload',
    KNOWLEDGE_LIST: '/api/knowledge/list',
    KNOWLEDGE_DELETE: '/api/knowledge/delete',
    
    // Bot Settings
    BOT_PROMPT: '/api/settings/prompt',
    BOT_SETTINGS: '/api/settings/bot',
    
    // User
    USER_PROFILE: '/api/user/profile',
    USER_PASSWORD: '/api/user/password',
    
    // Admin
    ADMIN_USERS: '/api/admin/users',
    ADMIN_USER_STATUS: '/api/admin/user',
    ADMIN_STATS: '/api/admin/stats'
  },
  
  WEBSOCKET_URL: process.env.NODE_ENV === 'production' 
    ? 'wss://ws.yourdomain.com' 
    : 'ws://localhost:3001'
};

export const API_TIMEOUT = 10000;
export const POLLING_INTERVAL = 3000;
