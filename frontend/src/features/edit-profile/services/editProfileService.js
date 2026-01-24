import authService from '@/services/authService';

export const editProfileService = {
  updateProfile: async (userData) => {
    // Implement profile update logic
    return await authService.updateProfile(userData);
  },
  getProfile: async () => {
    // Implement get profile logic
    return await authService.getProfile();
  },
};

export default editProfileService;
