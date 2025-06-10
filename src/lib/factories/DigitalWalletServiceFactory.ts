
import { DigitalWalletService } from '@/services/DigitalWalletService';

export class DigitalWalletServiceFactory {
  static create(): DigitalWalletService {
    return new DigitalWalletService();
  }
}
