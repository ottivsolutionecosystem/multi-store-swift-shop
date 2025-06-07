
// Exemplo de como migrar console.log para o novo sistema
// Este arquivo serve como referência para a migração gradual

import { logger, createLogger } from './index';

// ANTES (usando console):
// console.log('UserService - getting current user with smart cache');
// console.error('UserService - error updating profile:', error);
// console.warn('UserService - cache miss, fetching from database');

// DEPOIS (usando novo sistema):
const userServiceLogger = createLogger({ component: 'UserService' });

// Para logs informativos
await userServiceLogger.info('Getting current user with smart cache');

// Para erros
await userServiceLogger.error('Error updating profile', error, { action: 'updateProfile' });

// Para warnings
await userServiceLogger.warn('Cache miss, fetching from database', { cache: 'user' });

// Para debug (só aparece em desenvolvimento)
await userServiceLogger.debug('Cache hit for user', { userId: 'user123' });

// Para logs com contexto específico
const contextLogger = userServiceLogger.child({ storeId: 'store123', userId: 'user456' });
await contextLogger.info('User action completed', { action: 'purchase' });

// Exemplos de migration helpers (para facilitar a transição)
export const migrateConsole = {
  log: (message: string, ...args: any[]) => logger.info(message, { originalArgs: args }),
  error: (message: string, error?: any, ...args: any[]) => 
    logger.error(message, error instanceof Error ? error : new Error(String(error)), { originalArgs: args }),
  warn: (message: string, ...args: any[]) => logger.warn(message, { originalArgs: args }),
  debug: (message: string, ...args: any[]) => logger.debug(message, { originalArgs: args }),
  info: (message: string, ...args: any[]) => logger.info(message, { originalArgs: args }),
};

// Para usar durante a migração gradual:
// const console = migrateConsole; // sobrescreve temporariamente
