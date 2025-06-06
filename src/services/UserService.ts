import { UserRepository } from '@/repositories/UserRepository';
import { UserCache } from '@/lib/userCache';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

export class UserService {
  private userRepository: UserRepository;

  constructor(storeId: string) {
    this.userRepository = new UserRepository(storeId);
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('UserService - getting current user');
    
    // Try cache first
    const cached = UserCache.get();
    if (cached && cached.user) {
      console.log('UserService - returning cached user');
      return cached.user;
    }

    // Fetch from repository if not cached
    const user = await this.userRepository.getCurrentUser();
    
    // Update cache with user data (keep existing profile if any)
    if (user) {
      const existingProfile = cached?.profile || null;
      UserCache.set(user, existingProfile);
    }
    
    return user;
  }

  async getCurrentUserProfile(forceRefresh: boolean = false): Promise<Profile | null> {
    console.log('UserService - getting current user profile, forceRefresh:', forceRefresh);
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = UserCache.get();
      if (cached && cached.profile) {
        console.log('UserService - returning cached profile');
        return cached.profile;
      }
    }

    // Fetch from repository
    const profile = await this.userRepository.getCurrentUserProfile();
    
    // Update cache
    if (profile) {
      const user = await this.getCurrentUser();
      UserCache.set(user, profile);
    }
    
    return profile;
  }

  async updateProfile(updates: any): Promise<Profile> {
    console.log('UserService - updating profile');
    const updatedProfile = await this.userRepository.updateProfile(updates);
    
    // Update cache with new profile data
    UserCache.updateProfile(updatedProfile);
    
    return updatedProfile;
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
    const result = await this.userRepository.signIn(email, password);
    // Clear cache on new login
    UserCache.clear();
    return result;
  }

  async signUp(email: string, password: string, fullName?: string) {
    const result = await this.userRepository.signUp(email, password, fullName);
    // Clear cache on new signup
    UserCache.clear();
    return result;
  }

  async signOut() {
    await this.userRepository.signOut();
    // Clear cache on logout
    UserCache.clear();
  }

  clearCache(): void {
    UserCache.clear();
  }
}
