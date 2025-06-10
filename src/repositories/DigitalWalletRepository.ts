
import { Database } from '@/integrations/supabase/types';
import { DigitalWalletCard } from '@/types/digital-wallet';
import { supabaseClient } from '@/lib/supabaseClient';

export class DigitalWalletRepository {
  async getDigitalWalletCardsByUserId(userId: string): Promise<DigitalWalletCard[]> {
    console.log('DigitalWalletRepository - getting digital wallet cards for user:', userId);

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('digital_wallet_cards')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('DigitalWalletRepository - error getting digital wallet cards:', error);
      throw error;
    }

    // Safe type conversion from Json to DigitalWalletCard[]
    const digitalWalletCardsData = profile?.digital_wallet_cards as unknown;
    const digitalWalletCards: DigitalWalletCard[] = Array.isArray(digitalWalletCardsData) ? digitalWalletCardsData as DigitalWalletCard[] : [];
    
    return digitalWalletCards.filter(card => card.isActive);
  }

  async updateDigitalWalletCards(userId: string, cards: DigitalWalletCard[]): Promise<void> {
    console.log('DigitalWalletRepository - updating digital wallet cards for user:', userId);

    // Convert to unknown first, then to Json for Supabase
    const cardsAsJson = cards as unknown as Database['public']['Tables']['profiles']['Update']['digital_wallet_cards'];

    const { error } = await supabaseClient
      .from('profiles')
      .update({ digital_wallet_cards: cardsAsJson })
      .eq('id', userId);

    if (error) {
      console.error('DigitalWalletRepository - error updating digital wallet cards:', error);
      throw error;
    }
  }
}
