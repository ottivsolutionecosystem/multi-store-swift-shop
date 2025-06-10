
import { DigitalWalletCard, DigitalWalletCardFormData } from '@/types/digital-wallet';
import { UserSessionService } from './UserSessionService';
import { DigitalWalletRepository } from '@/repositories/DigitalWalletRepository';
import { DigitalWalletHelpers } from '@/lib/digitalWalletHelpers';

export class DigitalWalletService {
  private userSessionService: UserSessionService;
  private repository: DigitalWalletRepository;

  constructor() {
    this.userSessionService = new UserSessionService();
    this.repository = new DigitalWalletRepository();
  }

  async getDigitalWalletCards(): Promise<DigitalWalletCard[]> {
    console.log('DigitalWalletService - getting digital wallet cards');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        console.log('DigitalWalletService - no authenticated user');
        return [];
      }

      const cards = await this.repository.getDigitalWalletCardsByUserId(user.id);
      console.log('DigitalWalletService - digital wallet cards loaded:', cards.length);
      
      return cards;
    } catch (error) {
      console.error('DigitalWalletService - error in getDigitalWalletCards:', error);
      throw error;
    }
  }

  async addDigitalWalletCard(data: DigitalWalletCardFormData): Promise<DigitalWalletCard> {
    console.log('DigitalWalletService - adding digital wallet card');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentCards = await this.getDigitalWalletCards();
      const newCard = DigitalWalletHelpers.createNewDigitalWalletCard(data);

      // If this is set as default, remove default from others
      let updatedCards = currentCards;
      if (data.isDefault) {
        updatedCards = DigitalWalletHelpers.removeDefaultFromOthers(currentCards, newCard.id);
      }

      updatedCards.push(newCard);

      await this.repository.updateDigitalWalletCards(user.id, updatedCards);

      console.log('DigitalWalletService - digital wallet card added successfully');
      return newCard;
    } catch (error) {
      console.error('DigitalWalletService - error in addDigitalWalletCard:', error);
      throw error;
    }
  }

  async updateDigitalWalletCard(cardId: string, data: Partial<DigitalWalletCardFormData>): Promise<DigitalWalletCard> {
    console.log('DigitalWalletService - updating digital wallet card:', cardId);
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentCards = await this.getDigitalWalletCards();
      const existingCard = DigitalWalletHelpers.findCardById(currentCards, cardId);
      
      if (!existingCard) {
        throw new Error('Digital wallet card not found');
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

      await this.repository.updateDigitalWalletCards(user.id, updatedCards);

      console.log('DigitalWalletService - digital wallet card updated successfully');
      return updatedCard;
    } catch (error) {
      console.error('DigitalWalletService - error in updateDigitalWalletCard:', error);
      throw error;
    }
  }

  async removeDigitalWalletCard(cardId: string): Promise<void> {
    console.log('DigitalWalletService - removing digital wallet card:', cardId);
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentCards = await this.getDigitalWalletCards();
      const updatedCards = DigitalWalletHelpers.removeCard(currentCards, cardId);

      await this.repository.updateDigitalWalletCards(user.id, updatedCards);

      console.log('DigitalWalletService - digital wallet card removed successfully');
    } catch (error) {
      console.error('DigitalWalletService - error in removeDigitalWalletCard:', error);
      throw error;
    }
  }

  async setDefaultDigitalWalletCard(cardId: string): Promise<void> {
    console.log('DigitalWalletService - setting default digital wallet card:', cardId);
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentCards = await this.getDigitalWalletCards();
      const updatedCards = DigitalWalletHelpers.setDefaultCard(currentCards, cardId);

      await this.repository.updateDigitalWalletCards(user.id, updatedCards);

      console.log('DigitalWalletService - default digital wallet card set successfully');
    } catch (error) {
      console.error('DigitalWalletService - error in setDefaultDigitalWalletCard:', error);
      throw error;
    }
  }
}
