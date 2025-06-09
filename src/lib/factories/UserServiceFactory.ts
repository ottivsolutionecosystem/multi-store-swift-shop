
import { UserRepository } from '@/repositories/UserRepository';
import { UserAddressRepository } from '@/repositories/UserAddressRepository';
import { UserService } from '@/services/UserService';
import { ProfileService } from '@/services/ProfileService';
import { StoreAccessService } from '@/services/StoreAccessService';
import { UserSessionService } from '@/services/UserSessionService';
import { UserProfileManagementService } from '@/services/UserProfileManagementService';
import { AuthenticationService } from '@/services/AuthenticationService';
import { UserAddressService } from '@/services/UserAddressService';

export function createUserServices(storeId: string) {
  console.log('Creating user services for storeId:', storeId);

  // Repositories - pass storeId where needed
  const userRepository = new UserRepository(storeId);
  const userAddressRepository = new UserAddressRepository(storeId);

  // Services - fix constructor arguments to match service expectations
  const userService = new UserService(userRepository);
  const profileService = new ProfileService(userRepository);
  const storeAccessService = new StoreAccessService();
  const userSessionService = new UserSessionService();
  const userProfileManagementService = new UserProfileManagementService();
  const authenticationService = new AuthenticationService();
  const userAddressService = new UserAddressService(userAddressRepository);

  return {
    userService,
    profileService,
    storeAccessService,
    userSessionService,
    userProfileManagementService,
    authenticationService,
    userAddressService,
  };
}
