
import { CepResponse } from '@/types/cep';

export interface CepProvider {
  /**
   * Busca informações de um CEP
   * @param cep CEP formatado (apenas números)
   * @returns Promise com dados do endereço
   */
  lookup(cep: string): Promise<CepResponse>;
  
  /**
   * Valida se o CEP está no formato correto
   * @param cep CEP a ser validado
   * @returns true se válido
   */
  isValidCep(cep: string): boolean;
  
  /**
   * Nome do provedor para identificação
   */
  readonly name: string;
}
