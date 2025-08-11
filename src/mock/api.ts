
// Mock API responses for development
export const mockApiResponses = {
  // Auth endpoints
  'POST /api/auth/login': {
    token: 'mock-jwt-token-12345',
    user: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' }
  },
  
  'POST /api/auth/register': {
    message: 'success'
  },
  
  'POST /api/auth/reset-password': {
    message: 'reset link sent'
  },
  
  'GET /api/auth/me': {
    id: '1',
    name: 'John Doe', 
    email: 'john@example.com',
    role: 'admin'
  },

  // WhatsApp endpoints
  'GET /api/whatsapp/status': {
    status: 'qr',
    qrImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
  
  'GET /api/whatsapp/messages': [
    { id: '1', from: '+6281234567890', to: '+6281234567891', text: 'Hello, I need help', timestamp: '2024-01-01T10:00:00Z' },
    { id: '2', from: '+6281234567892', to: '+6281234567891', text: 'What are your business hours?', timestamp: '2024-01-01T11:00:00Z' },
    { id: '3', from: '+6281234567893', to: '+6281234567891', text: 'Can you help me with pricing?', timestamp: '2024-01-01T12:00:00Z' }
  ],

  // API Settings endpoints
  'GET /api/settings/api': [
    { provider: 'gemini', apiKey: 'mock-gemini-key', priority: 1 },
    { provider: 'openai', apiKey: 'mock-openai-key', priority: 2 }
  ],
  
  'POST /api/settings/api': {
    message: 'saved'
  },

  // Knowledge Base endpoints
  'GET /api/knowledge/list': [
    { id: '1', fileName: 'company-policy.pdf', size: 2048576, uploadedAt: '2024-01-01T10:00:00Z' },
    { id: '2', fileName: 'faq.txt', size: 51200, uploadedAt: '2024-01-01T11:00:00Z' },
    { id: '3', fileName: 'pricing.csv', size: 10240, uploadedAt: '2024-01-01T12:00:00Z' }
  ],
  
  'POST /api/knowledge/upload': {
    id: '4',
    fileName: 'new-document.pdf'
  },
  
  'DELETE /api/knowledge/:id': {
    message: 'deleted'
  },

  // Bot Settings endpoints
  'GET /api/settings/bot': {
    promptTemplate: 'You are a helpful customer service assistant. Please respond politely and professionally to customer inquiries.',
    language: 'id'
  },
  
  'POST /api/settings/bot': {
    message: 'saved'
  },

  // Profile endpoints
  'GET /api/user/profile': {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  },
  
  'PUT /api/user/profile': {
    message: 'updated'
  },
  
  'PUT /api/user/change-password': {
    message: 'password updated'
  },

  // Admin endpoints
  'GET /api/admin/users': [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'suspended' }
  ],
  
  'PUT /api/admin/users/:id/status': {
    message: 'status updated'
  }
};

// Mock API delay simulation
export const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));
