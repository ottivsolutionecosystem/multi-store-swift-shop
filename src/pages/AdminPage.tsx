
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Tag, ShoppingCart, ArrowRight, Percent } from 'lucide-react';

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
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Produtos
              </CardTitle>
              <CardDescription>
                Gerenciar produtos da loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Adicionar, editar e remover produtos do catálogo com imagens.
              </p>
              <Button 
                onClick={() => navigate('/admin/products')}
                className="w-full flex items-center justify-center gap-2"
              >
                Gerenciar Produtos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-green-600" />
                Categorias
              </CardTitle>
              <CardDescription>
                Gerenciar categorias de produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Organizar produtos em categorias com imagens ilustrativas.
              </p>
              <Button 
                onClick={() => navigate('/admin/categories')}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                Gerenciar Categorias
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-orange-600" />
                Promoções
              </CardTitle>
              <CardDescription>
                Gerenciar promoções e descontos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Criar e gerenciar promoções para impulsionar vendas.
              </p>
              <Button 
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                disabled
              >
                Em Breve
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Pedidos
              </CardTitle>
              <CardDescription>
                Visualizar e gerenciar pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Acompanhar status dos pedidos dos clientes.
              </p>
              <Button 
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                disabled
              >
                Em Breve
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
