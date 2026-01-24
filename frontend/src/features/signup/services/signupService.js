import authService from '@/services/authService';

export const signupService = {
  signup: async (userData) => {
    return await authService.signup(userData);
  },
};

export default signupService;
