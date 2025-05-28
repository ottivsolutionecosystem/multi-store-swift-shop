
import { ManufacturerRepository } from '@/repositories/ManufacturerRepository';
import { Database } from '@/integrations/supabase/types';

type Manufacturer = Database['public']['Tables']['manufacturers']['Row'];
type ManufacturerInsert = Database['public']['Tables']['manufacturers']['Insert'];
type ManufacturerUpdate = Database['public']['Tables']['manufacturers']['Update'];

export class ManufacturerService {
  constructor(private manufacturerRepository: ManufacturerRepository) {}

  async getAllManufacturers(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.findAll();
  }

  async getManufacturerById(id: string): Promise<Manufacturer | null> {
    return this.manufacturerRepository.findById(id);
  }

  async createManufacturer(manufacturer: Omit<ManufacturerInsert, 'store_id'>): Promise<Manufacturer> {
    if (!manufacturer.name || manufacturer.name.trim() === '') {
      throw new Error('Manufacturer name is required');
    }

    return this.manufacturerRepository.create(manufacturer);
  }

  async updateManufacturer(id: string, manufacturer: ManufacturerUpdate): Promise<Manufacturer> {
    const existing = await this.manufacturerRepository.findById(id);
    if (!existing) {
      throw new Error('Manufacturer not found');
    }

    return this.manufacturerRepository.update(id, manufacturer);
  }

  async deleteManufacturer(id: string): Promise<void> {
    const existing = await this.manufacturerRepository.findById(id);
    if (!existing) {
      throw new Error('Manufacturer not found');
    }

    return this.manufacturerRepository.delete(id);
  }
}
