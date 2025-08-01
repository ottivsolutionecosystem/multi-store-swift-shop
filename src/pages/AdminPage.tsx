
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Tag, ShoppingCart, ArrowRight, Percent, Settings, ClipboardList, Truck } from 'lucide-react';

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

  const handleCategoriesClick = () => {
    console.log('Navegando para categorias...');
    navigate('/admin/categories');
  };

  const handleProductsClick = () => {
    console.log('Navegando para produtos...');
    navigate('/admin/products');
  };

  const handlePromotionsClick = () => {
    console.log('Navegando para promoções...');
    navigate('/admin/promotions');
  };

  const handleStoreSettingsClick = () => {
    console.log('Navegando para configurações...');
    navigate('/admin/store-settings');
  };

  const handleOrdersClick = () => {
    console.log('Navegando para pedidos...');
    navigate('/admin/orders');
  };

  const handleLogisticsClick = () => {
    console.log('Navegando para logística...');
    navigate('/admin/logistics');
  };

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
                onClick={handleProductsClick}
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
                onClick={handleCategoriesClick}
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
                onClick={handlePromotionsClick}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                Gerenciar Promoções
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                Logística
              </CardTitle>
              <CardDescription>
                Gerenciar métodos de frete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configurar frete expresso e APIs de entrega.
              </p>
              <Button 
                onClick={handleLogisticsClick}
                className="w-full flex items-center justify-center gap-2"
              >
                Gerenciar Logística
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                Configurações
              </CardTitle>
              <CardDescription>
                Configurações da loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Personalizar cores, layout e configurações da loja.
              </p>
              <Button 
                onClick={handleStoreSettingsClick}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                Configurar Loja
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-cyan-600" />
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
                onClick={handleOrdersClick}
                className="w-full flex items-center justify-center gap-2"
              >
                Gerenciar Pedidos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
