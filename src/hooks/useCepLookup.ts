
import { useState, useCallback } from 'react';
import { CepLookupState, CepResponse } from '@/types/cep';
import { CepServiceFactory } from '@/lib/factories/CepServiceFactory';

export function useCepLookup() {
  const [state, setState] = useState<CepLookupState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const lookup = useCallback(async (cep: string): Promise<CepResponse | null> => {
    if (!cep || cep.length < 8) {
      return null;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      console.log('useCepLookup - Starting lookup for CEP:', cep);
      const cepService = CepServiceFactory.create();
      const result = await cepService.lookup(cep);
      
      setState({
        isLoading: false,
        error: null,
        data: result,
      });

      console.log('useCepLookup - Lookup successful:', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na consulta do CEP';
      console.error('useCepLookup - Lookup failed:', errorMessage);
      
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
      });

      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    ...state,
    lookup,
    clearError,
    reset,
  };
}
