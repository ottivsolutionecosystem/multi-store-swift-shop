
import { UserRepository } from '@/repositories/UserRepository';
import { UserAddressRepository } from '@/repositories/UserAddressRepository';
import { UserService } from '@/services/UserService';
import { ProfileService } from '@/services/ProfileService';
import { StoreAccessService } from '@/services/StoreAccessService';
import { UserSessionService } from '@/services/UserSessionService';
import { UserProfileManagementService } from '@/services/UserProfileManagementService';
import { AuthenticationService } from '@/services/AuthenticationService';
import { UserAddressService } from '@/services/UserAddressService';

export function createUserServices() {
  console.log('Creating user services');

  // Repositories (user services don't need storeId)
  const userRepository = new UserRepository();
  const userAddressRepository = new UserAddressRepository();

  // Services
  const userService = new UserService(userRepository);
  const profileService = new ProfileService(userRepository);
  const storeAccessService = new StoreAccessService(userRepository);
  const userSessionService = new UserSessionService();
  const userProfileManagementService = new UserProfileManagementService(userRepository);
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
