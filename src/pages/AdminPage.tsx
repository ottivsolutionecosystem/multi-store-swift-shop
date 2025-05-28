
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                Gerenciar produtos da loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Adicionar, editar e remover produtos do catálogo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>
                Gerenciar categorias de produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organizar produtos em categorias.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos</CardTitle>
              <CardDescription>
                Visualizar e gerenciar pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhar status dos pedidos dos clientes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
