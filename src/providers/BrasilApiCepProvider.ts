
import { CepProvider } from '@/interfaces/CepProvider';
import { CepResponse, BrasilApiCepResponse, brasilApiCepResponseSchema } from '@/types/cep';

export class BrasilApiCepProvider implements CepProvider {
  readonly name = 'brasil-api';
  private readonly baseUrl = 'https://brasilapi.com.br/api/cep/v2';
  private readonly timeout = 5000; // 5 segundos

  async lookup(cep: string): Promise<CepResponse> {
    if (!this.isValidCep(cep)) {
      throw new Error('CEP inválido');
    }

    const cleanCep = this.cleanCep(cep);
    const url = `${this.baseUrl}/${cleanCep}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CEP não encontrado');
        }
        throw new Error(`Erro na consulta: ${response.status}`);
      }

      const data = await response.json();
      
      // Validar resposta da API
      const validatedData = brasilApiCepResponseSchema.parse(data);
      
      return this.mapToCepResponse(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout na consulta do CEP');
        }
        throw error;
      }
      throw new Error('Erro desconhecido na consulta do CEP');
    }
  }

  isValidCep(cep: string): boolean {
    const cleanCep = this.cleanCep(cep);
    return /^\d{8}$/.test(cleanCep);
  }

  private cleanCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  private mapToCepResponse(data: BrasilApiCepResponse): CepResponse {
    return {
      cep: data.cep,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      service: data.service,
      location: data.location,
    };
  }
}
