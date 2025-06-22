
import { CepService } from '@/services/CepService';
import { BrasilApiCepProvider } from '@/providers/BrasilApiCepProvider';

export class CepServiceFactory {
  private static instance: CepService | null = null;

  static create(): CepService {
    if (!this.instance) {
      console.log('CepServiceFactory - Creating new CepService instance');
      const provider = new BrasilApiCepProvider();
      this.instance = new CepService(provider);
    }
    return this.instance;
  }

  static reset(): void {
    this.instance = null;
  }
}
