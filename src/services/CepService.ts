
import { CepProvider } from '@/interfaces/CepProvider';
import { CepResponse } from '@/types/cep';

export class CepService {
  private cache = new Map<string, CepResponse>();
  private readonly maxRetries = 2;

  constructor(private cepProvider: CepProvider) {}

  async lookup(cep: string): Promise<CepResponse> {
    const cleanCep = this.cleanCep(cep);
    
    if (!this.cepProvider.isValidCep(cleanCep)) {
      throw new Error('CEP inválido');
    }

    // Verificar cache primeiro
    const cached = this.cache.get(cleanCep);
    if (cached) {
      console.log('CepService - Cache hit for CEP:', cleanCep);
      return cached;
    }

    // Buscar com retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`CepService - Attempt ${attempt} for CEP:`, cleanCep);
        const result = await this.cepProvider.lookup(cleanCep);
        
        // Salvar no cache
        this.cache.set(cleanCep, result);
        console.log('CepService - CEP found and cached:', cleanCep);
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Erro desconhecido');
        console.warn(`CepService - Attempt ${attempt} failed:`, lastError.message);
        
        // Se não for o último attempt, aguardar um pouco antes de tentar novamente
        if (attempt < this.maxRetries) {
          await this.delay(1000 * attempt); // Delay progressivo
        }
      }
    }

    throw lastError || new Error('Falha na consulta do CEP após múltiplas tentativas');
  }

  clearCache(): void {
    this.cache.clear();
    console.log('CepService - Cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  private cleanCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
