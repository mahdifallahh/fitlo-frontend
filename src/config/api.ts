export const API_BASE_URL = "http://localhost:3000";
//export const API_BASE_URL = 'https://nest-ttxkob.chbk.app';

export const API_ENDPOINTS = {
  auth: {
    checkPhone: `${API_BASE_URL}/auth/check-phone`,
    login: `${API_BASE_URL}/auth/login`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    sendOtp: `${API_BASE_URL}/auth/send-otp`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
  },

  users: {
    me: `${API_BASE_URL}/users/me`,
    students: `${API_BASE_URL}/users/students`,
    uploadProfile: `${API_BASE_URL}/users/upload-profile`,
    requestPremium: `${API_BASE_URL}/users/request-premium`,
    public: (phone: string) => `${API_BASE_URL}/users/public/${phone}`,
  },

  categories: `${API_BASE_URL}/categories`,

  exercises: {
    all: `${API_BASE_URL}/exercises`,
    share: `${API_BASE_URL}/exercises/share`,
    validateShare: (shareId: string) => `${API_BASE_URL}/exercises/share/${shareId}/validate`,
    getSharedExercises: (shareId: string) => `${API_BASE_URL}/exercises/share/${shareId}`,
    shareForAll:`${API_BASE_URL}/exercises/shared-exercises/toggle-share`
  },

  programs: `${API_BASE_URL}/programs`,

  admin: {
    coaches: `${API_BASE_URL}/admin/coaches`,
    premiumRequests: `${API_BASE_URL}/admin/premium-requests`,
  },

  uploads: {
    profiles: `${API_BASE_URL}/uploads/profiles`,
    gifs: `${API_BASE_URL}/uploads/gifs`,
    receipts: `${API_BASE_URL}/uploads/receipts`,
  },
} as const;
export const getUploadUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
