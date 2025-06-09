
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { UserAddress, UserAddressFormData } from '@/types/user-address';

type UserAddressInsert = Database['public']['Tables']['user_addresses']['Insert'];
type UserAddressUpdate = Database['public']['Tables']['user_addresses']['Update'];

export class UserAddressRepository {
  constructor(private storeId: string) {}

  async findAllByUser(userId: string): Promise<UserAddress[]> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as UserAddress[];
  }

  async findById(id: string, userId: string): Promise<UserAddress | null> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as UserAddress;
  }

  async create(address: UserAddressFormData, userId: string): Promise<UserAddress> {
    const addressData: UserAddressInsert = {
      name: address.name,
      street: address.street,
      number: address.number,
      complement: address.complement || null,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_default: address.is_default,
      user_id: userId,
    };

    // If this is set as default, unset all other defaults for this user
    if (address.is_default) {
      await this.unsetAllDefaults(userId);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert(addressData)
      .select()
      .single();

    if (error) throw error;
    return data as UserAddress;
  }

  async update(id: string, address: Partial<UserAddressFormData>, userId: string): Promise<UserAddress> {
    // If this is being set as default, unset all other defaults for this user
    if (address.is_default) {
      await this.unsetAllDefaults(userId);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .update(address)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserAddress;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getDefault(userId: string): Promise<UserAddress | null> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    if (error) return null;
    return data as UserAddress;
  }

  private async unsetAllDefaults(userId: string): Promise<void> {
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true);
  }
}
