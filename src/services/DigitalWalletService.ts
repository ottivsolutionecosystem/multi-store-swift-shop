
import { DigitalWalletCard, DigitalWalletCardFormData } from '@/types/digital-wallet';
import { UserSessionService } from './UserSessionService';
import { DigitalWalletRepository } from '@/repositories/DigitalWalletRepository';
import { DigitalWalletHelpers } from '@/lib/digitalWalletHelpers';

export class DigitalWalletService {
  private userSessionService: UserSessionService;
  private repository: DigitalWalletRepository;
  private readonly OPERATION_TIMEOUT = 10000; // 10 seconds

  constructor() {
    this.userSessionService = new UserSessionService();
    this.repository = new DigitalWalletRepository();
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number = this.OPERATION_TIMEOUT): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      )
    ]);
  }

  async getDigitalWalletCards(): Promise<DigitalWalletCard[]> {
    console.log('DigitalWalletService - getting digital wallet cards');
    
    try {
      const user = await this.withTimeout(this.userSessionService.getCurrentUser());
      if (!user) {
        console.log('DigitalWalletService - no authenticated user');
        return [];
      }

      const cards = await this.withTimeout(this.repository.getDigitalWalletCardsByUserId(user.id));
      console.log('DigitalWalletService - digital wallet cards loaded:', cards.length);
      
      return cards;
    } catch (error) {
      if (error instanceof Error && error.message === 'Operation timed out') {
        console.error('DigitalWalletService - timeout in getDigitalWalletCards');
        throw new Error('Operação demorou muito para responder. Tente novamente.');
      }
      console.error('DigitalWalletService - error in getDigitalWalletCards:', error);
      throw error;
    }
  }

  async addDigitalWalletCard(data: DigitalWalletCardFormData): Promise<DigitalWalletCard> {
    console.log('DigitalWalletService - adding digital wallet card');
    
    try {
      const user = await this.withTimeout(this.userSessionService.getCurrentUser());
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('DigitalWalletService - user authenticated, getting current cards');
      const currentCards = await this.withTimeout(this.getDigitalWalletCards());
      const newCard = DigitalWalletHelpers.createNewDigitalWalletCard(data);

      // If this is set as default, remove default from others
      let updatedCards = currentCards;
      if (data.isDefault) {
        updatedCards = DigitalWalletHelpers.removeDefaultFromOthers(currentCards, newCard.id);
      }

      updatedCards.push(newCard);

      console.log('DigitalWalletService - updating cards in repository');
      await this.withTimeout(this.repository.updateDigitalWalletCards(user.id, updatedCards));

      console.log('DigitalWalletService - digital wallet card added successfully');
      return newCard;
    } catch (error) {
      if (error instanceof Error && error.message === 'Operation timed out') {
        console.error('DigitalWalletService - timeout in addDigitalWalletCard');
        throw new Error('Operação demorou muito para responder. Tente novamente.');
      }
      console.error('DigitalWalletService - error in addDigitalWalletCard:', error);
      throw error;
    }
  }

  async updateDigitalWalletCard(cardId: string, data: Partial<DigitalWalletCardFormData>): Promise<DigitalWalletCard> {
    console.log('DigitalWalletService - updating digital wallet card:', cardId);
    
    try {
      const user = await this.withTimeout(this.userSessionService.getCurrentUser());
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const currentCards = await this.withTimeout(this.getDigitalWalletCards());
      const existingCard = DigitalWalletHelpers.findCardById(currentCards, cardId);
      
      if (!existingCard) {
        throw new Error('Cartão não encontrado');
      }

      // If setting as default, remove default from others
      let updatedCards = currentCards;
      if (data.isDefault) {
        updatedCards = DigitalWalletHelpers.removeDefaultFromOthers(currentCards, cardId);
      }

      // Update the specific card
      const updatedCard = DigitalWalletHelpers.updateDigitalWalletCardData(existingCard, data);
      const cardIndex = updatedCards.findIndex(card => card.id === cardId);
      updatedCards[cardIndex] = updatedCard;

      await this.withTimeout(this.repository.updateDigitalWalletCards(user.id, updatedCards));

      console.log('DigitalWalletService - digital wallet card updated successfully');
      return updatedCard;
    } catch (error) {
      if (error instanceof Error && error.message === 'Operation timed out') {
        console.error('DigitalWalletService - timeout in updateDigitalWalletCard');
        throw new Error('Operação demorou muito para responder. Tente novamente.');
      }
      console.error('DigitalWalletService - error in updateDigitalWalletCard:', error);
      throw error;
    }
  }

  async removeDigitalWalletCard(cardId: string): Promise<void> {
    console.log('DigitalWalletService - removing digital wallet card:', cardId);
    
    try {
      const user = await this.withTimeout(this.userSessionService.getCurrentUser());
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const currentCards = await this.withTimeout(this.getDigitalWalletCards());
      const updatedCards = DigitalWalletHelpers.removeCard(currentCards, cardId);

      await this.withTimeout(this.repository.updateDigitalWalletCards(user.id, updatedCards));

      console.log('DigitalWalletService - digital wallet card removed successfully');
    } catch (error) {
      if (error instanceof Error && error.message === 'Operation timed out') {
        console.error('DigitalWalletService - timeout in removeDigitalWalletCard');
        throw new Error('Operação demorou muito para responder. Tente novamente.');
      }
      console.error('DigitalWalletService - error in removeDigitalWalletCard:', error);
      throw error;
    }
  }

  async setDefaultDigitalWalletCard(cardId: string): Promise<void> {
    console.log('DigitalWalletService - setting default digital wallet card:', cardId);
    
    try {
      const user = await this.withTimeout(this.userSessionService.getCurrentUser());
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const currentCards = await this.withTimeout(this.getDigitalWalletCards());
      const updatedCards = DigitalWalletHelpers.setDefaultCard(currentCards, cardId);

      await this.withTimeout(this.repository.updateDigitalWalletCards(user.id, updatedCards));

      console.log('DigitalWalletService - default digital wallet card set successfully');
    } catch (error) {
      if (error instanceof Error && error.message === 'Operation timed out') {
        console.error('DigitalWalletService - timeout in setDefaultDigitalWalletCard');
        throw new Error('Operação demorou muito para responder. Tente novamente.');
      }
      console.error('DigitalWalletService - error in setDefaultDigitalWalletCard:', error);
      throw error;
    }
  }
}
