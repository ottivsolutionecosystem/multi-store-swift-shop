
import { StoreSettingsRepository } from '@/repositories/StoreSettingsRepository';
import { Database } from '@/integrations/supabase/types';

type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
type StoreSettingsInsert = Database['public']['Tables']['store_settings']['Insert'];
type StoreSettingsUpdate = Database['public']['Tables']['store_settings']['Update'];

export class StoreSettingsService {
  constructor(private storeSettingsRepository: StoreSettingsRepository) {}

  async getStoreSettings(): Promise<StoreSettings | null> {
    return this.storeSettingsRepository.findByStoreId();
  }

  async getStoreSettingsWithDefaults(): Promise<StoreSettings> {
    const settings = await this.storeSettingsRepository.findByStoreId();
    
    if (settings) {
      return settings;
    }

    // Criar configurações padrão se não existirem
    const defaultSettings = {
      primary_color: '#3b82f6',
      secondary_color: '#6b7280',
      price_color: '#16a34a',
      show_category: true,
      show_description: true,
      show_stock_quantity: true,
      show_price: true,
      show_promotion_badge: true,
      contact_info: {},
      shipping_settings: {},
      payment_settings: {},
    };

    return this.storeSettingsRepository.create(defaultSettings);
  }

  async updateStoreSettings(settings: StoreSettingsUpdate): Promise<StoreSettings> {
    // Validações
    if (settings.primary_color && !this.isValidHexColor(settings.primary_color)) {
      throw new Error('Primary color must be a valid hex color');
    }

    if (settings.secondary_color && !this.isValidHexColor(settings.secondary_color)) {
      throw new Error('Secondary color must be a valid hex color');
    }

    if (settings.price_color && !this.isValidHexColor(settings.price_color)) {
      throw new Error('Price color must be a valid hex color');
    }

    return this.storeSettingsRepository.update(settings);
  }

  async upsertStoreSettings(settings: Omit<StoreSettingsInsert, 'store_id'>): Promise<StoreSettings> {
    return this.storeSettingsRepository.upsert(settings);
  }

  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}
