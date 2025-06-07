
import { UserRepository } from '@/repositories/UserRepository';
import { SmartUserCache } from '@/lib/smartUserCache';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

export class UserService {
  private userRepository: UserRepository;

  constructor(storeId: string) {
    this.userRepository = new UserRepository(storeId);
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('UserService - getting current user with smart cache');
    return this.userRepository.getCurrentUser();
  }

  async getCurrentUserProfile(forceRefresh: boolean = false): Promise<Profile | null> {
    console.log('UserService - getting current user profile, forceRefresh:', forceRefresh);
    
    if (forceRefresh) {
      // If force refresh, get user and invalidate their cache first
      const user = await this.getCurrentUser();
      if (user) {
        await SmartUserCache.invalidateUser(user.id);
      }
    }
    
    return this.userRepository.getCurrentUserProfile();
  }

  async updateProfile(updates: any): Promise<Profile> {
    console.log('UserService - updating profile');
    return this.userRepository.updateProfile(updates);
  }

  async ensureUserStoreAssociation(storeId: string): Promise<void> {
    await this.userRepository.ensureUserStoreAssociation(storeId);
    // Force refresh profile after association
    await this.getCurrentUserProfile(true);
  }

  async validateStoreAccess(storeId: string): Promise<boolean> {
    return this.userRepository.validateStoreAccess(storeId);
  }

  async signIn(email: string, password: string) {
    return this.userRepository.signIn(email, password);
  }

  async signUp(email: string, password: string, fullName?: string) {
    return this.userRepository.signUp(email, password, fullName);
  }

  async signOut() {
    return this.userRepository.signOut();
  }

  clearCache(): void {
    console.log('UserService - clearing cache');
    SmartUserCache.clearAll();
  }

  getCacheStats() {
    return SmartUserCache.getCacheStats();
  }
}
