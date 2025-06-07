
import { UserProfileManagementService } from './UserProfileManagementService';

export class StoreAccessService {
  private userProfileService: UserProfileManagementService;

  constructor() {
    this.userProfileService = new UserProfileManagementService();
  }

  async ensureUserStoreAssociation(storeId: string): Promise<void> {
    console.log('StoreAccessService - ensuring user store association for store:', storeId);
    
    try {
      const profile = await this.userProfileService.getCurrentUserProfile();
      if (!profile) {
        console.error('StoreAccessService - user profile not found for store association');
        throw new Error('User profile not found');
      }

      console.log('StoreAccessService - current profile:', { 
        id: profile.id, 
        role: profile.role, 
        store_id: profile.store_id 
      });

      if (profile.role === 'admin' && !profile.store_id) {
        console.log('StoreAccessService - associating admin user to store:', storeId);
        await this.userProfileService.updateProfile({ store_id: storeId });
        console.log('StoreAccessService - admin user successfully associated to store');
      }
    } catch (error) {
      console.error('StoreAccessService - error ensuring store association:', error);
      throw error;
    }
  }

  async validateStoreAccess(storeId: string): Promise<boolean> {
    console.log('StoreAccessService - validating store access for:', storeId);
    
    try {
      const profile = await this.userProfileService.getCurrentUserProfile();
      if (!profile) {
        console.log('StoreAccessService - no profile found, access denied');
        return false;
      }

      const hasAccess = profile.store_id === storeId;
      console.log('StoreAccessService - store access validation:', {
        userStoreId: profile.store_id,
        requestedStoreId: storeId,
        hasAccess
      });

      return hasAccess;
    } catch (error) {
      console.error('StoreAccessService - error validating store access:', error);
      return false;
    }
  }
}
