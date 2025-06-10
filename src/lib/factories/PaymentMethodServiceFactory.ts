
import { PaymentMethodService } from '@/services/PaymentMethodService';

export class PaymentMethodServiceFactory {
  static create(): PaymentMethodService {
    return new PaymentMethodService();
  }
}
