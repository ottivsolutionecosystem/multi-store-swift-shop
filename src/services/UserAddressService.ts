
import { UserAddressRepository } from '@/repositories/UserAddressRepository';
import { UserAddress, UserAddressFormData } from '@/types/user-address';

export class UserAddressService {
  constructor(private userAddressRepository: UserAddressRepository) {}

  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    console.log('UserAddressService - Getting addresses for user:', userId);
    return this.userAddressRepository.findAllByUser(userId);
  }

  async createAddress(address: UserAddressFormData, userId: string): Promise<UserAddress> {
    console.log('UserAddressService - Creating address for user:', userId);
    return this.userAddressRepository.create(address, userId);
  }

  async updateAddress(id: string, address: Partial<UserAddressFormData>, userId: string): Promise<UserAddress> {
    console.log('UserAddressService - Updating address:', id);
    return this.userAddressRepository.update(id, address, userId);
  }

  async deleteAddress(id: string, userId: string): Promise<void> {
    console.log('UserAddressService - Deleting address:', id);
    return this.userAddressRepository.delete(id, userId);
  }

  async getDefaultAddress(userId: string): Promise<UserAddress | null> {
    console.log('UserAddressService - Getting default address for user:', userId);
    return this.userAddressRepository.getDefault(userId);
  }

  async setDefaultAddress(id: string, userId: string): Promise<UserAddress> {
    console.log('UserAddressService - Setting default address:', id);
    return this.userAddressRepository.update(id, { is_default: true }, userId);
  }
}
