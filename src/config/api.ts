export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    checkPhone: `${API_BASE_URL}/auth/check-phone`,
    login: `${API_BASE_URL}/auth/login`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    sendOtp: `${API_BASE_URL}/auth/send-otp`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
  },

  // User endpoints
  users: {
    me: `${API_BASE_URL}/users/me`,
    students: `${API_BASE_URL}/users/students`,
    uploadProfile: `${API_BASE_URL}/users/upload-profile`,
    requestPremium: `${API_BASE_URL}/users/request-premium`,
    public: (phone: string) => `${API_BASE_URL}/users/public/${phone}`,
  },

  // Category endpoints
  categories: `${API_BASE_URL}/categories`,

  // Exercise endpoints
  exercises: `${API_BASE_URL}/exercises`,

  // Program endpoints
  programs: `${API_BASE_URL}/programs`,

  // Admin endpoints
  admin: {
    coaches: `${API_BASE_URL}/admin/coaches`,
    premiumRequests: `${API_BASE_URL}/admin/premium-requests`,
  },

  // Upload paths
  uploads: {
    profiles: `${API_BASE_URL}/uploads/profiles`,
    gifs: `${API_BASE_URL}/uploads/gifs`,
    receipts: `${API_BASE_URL}/uploads/receipts`,
  },
} as const;

// Helper function to get full URL for uploaded files
export const getUploadUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}; 