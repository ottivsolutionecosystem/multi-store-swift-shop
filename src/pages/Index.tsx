
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';

const Index = () => {
  const { store, loading: storeLoading } = useTenant();
  const { user, loading: authLoading } = useAuth();

  console.log('Index page - Store:', store);
  console.log('Index page - Store loading:', storeLoading);
  console.log('Index page - User:', user);
  console.log('Index page - Auth loading:', authLoading);

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Carregando loja...</h2>
          <p className="text-gray-600">Detectando configurações do domínio</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">Erro na Configuração</h1>
          <p className="text-xl text-gray-600 mb-4">
            Não foi possível carregar a configuração da loja para este domínio.
          </p>
          <p className="text-gray-500">
            Domínio atual: {window.location?.host || 'desconhecido'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo à {store.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sua loja online está funcionando perfeitamente!
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Informações da Loja</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>ID:</strong> {store.id}</p>
              <p><strong>Nome:</strong> {store.name}</p>
              <p><strong>Domínio:</strong> {store.domain}</p>
              {store.custom_domain && (
                <p><strong>Domínio Personalizado:</strong> {store.custom_domain}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">🛍️ Catálogo</h3>
            <p className="text-gray-600">Explore nossos produtos</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">👤 Conta</h3>
            <p className="text-gray-600">
              {user ? 'Gerencie sua conta' : 'Faça login ou cadastre-se'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">📞 Suporte</h3>
            <p className="text-gray-600">Entre em contato conosco</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
