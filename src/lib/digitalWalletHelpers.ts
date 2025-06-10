
import { DigitalWalletCard, DigitalWalletCardFormData } from '@/types/digital-wallet';

export class DigitalWalletHelpers {
  static createNewDigitalWalletCard(data: DigitalWalletCardFormData): DigitalWalletCard {
    return {
      id: crypto.randomUUID(),
      type: data.type,
      provider: data.provider,
      lastFourDigits: data.cardNumber ? data.cardNumber.slice(-4) : '',
      cardholderName: data.cardholderName,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      isDefault: data.isDefault,
      isActive: true,
      consentGiven: true,
      consentDate: new Date().toISOString(),
      dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      createdAt: new Date().toISOString()
    };
  }

  static updateDigitalWalletCardData(
    existingCard: DigitalWalletCard, 
    updateData: Partial<DigitalWalletCardFormData>
  ): DigitalWalletCard {
    return {
      ...existingCard,
      ...updateData,
      lastFourDigits: updateData.cardNumber ? 
        updateData.cardNumber.slice(-4) : 
        existingCard.lastFourDigits
    };
  }

  static setDefaultCard(cards: DigitalWalletCard[], targetCardId: string): DigitalWalletCard[] {
    return cards.map(card => ({
      ...card,
      isDefault: card.id === targetCardId
    }));
  }

  static removeDefaultFromOthers(cards: DigitalWalletCard[], exceptCardId: string): DigitalWalletCard[] {
    return cards.map(card => ({
      ...card,
      isDefault: card.id === exceptCardId ? card.isDefault : false
    }));
  }

  static removeCard(cards: DigitalWalletCard[], cardId: string): DigitalWalletCard[] {
    return cards.filter(card => card.id !== cardId);
  }

  static findCardById(cards: DigitalWalletCard[], cardId: string): DigitalWalletCard | undefined {
    return cards.find(card => card.id === cardId);
  }
}
