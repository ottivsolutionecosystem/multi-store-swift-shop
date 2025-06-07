
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { AuthenticationService } from '@/services/AuthenticationService';
import { UserSessionService } from '@/services/UserSessionService';
import { UserProfileManagementService } from '@/services/UserProfileManagementService';
import { StoreAccessService } from '@/services/StoreAccessService';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class UserRepository {
  private storeId: string;
  private authService: AuthenticationService;
  private sessionService: UserSessionService;
  private profileService: UserProfileManagementService;
  private storeAccessService: StoreAccessService;

  constructor(storeId: string) {
    this.storeId = storeId;
    this.authService = new AuthenticationService();
    this.sessionService = new UserSessionService();
    this.profileService = new UserProfileManagementService();
    this.storeAccessService = new StoreAccessService();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.sessionService.getCurrentUser();
  }

  async getCurrentUserProfile(): Promise<Profile | null> {
    return this.profileService.getCurrentUserProfile();
  }

  async updateProfile(updates: ProfileUpdate): Promise<Profile> {
    return this.profileService.updateProfile(updates);
  }

  async ensureUserStoreAssociation(storeId: string): Promise<void> {
    return this.storeAccessService.ensureUserStoreAssociation(storeId);
  }

  async validateStoreAccess(storeId: string): Promise<boolean> {
    return this.storeAccessService.validateStoreAccess(storeId);
  }

  async signIn(email: string, password: string) {
    return this.authService.signIn(email, password);
  }

  async signUp(email: string, password: string, fullName?: string) {
    return this.authService.signUp(email, password, fullName);
  }

  async signOut() {
    return this.authService.signOut();
  }
}
