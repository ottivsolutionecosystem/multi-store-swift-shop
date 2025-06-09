
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyCartState } from '@/components/cart/EmptyCartState';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartTotals } from '@/components/cart/CartTotals';
import { IdentificationStep } from '@/components/checkout/IdentificationStep';
import { GuestUser } from '@/types/checkout';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [showIdentification, setShowIdentification] = useState(false);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);

  const handleGuestContinue = (guestData: GuestUser) => {
    setGuestUser(guestData);
    setShowIdentification(false);
  };

  const handleCheckout = () => {
    if (user || guestUser) {
      // Se usuário está logado ou já forneceu dados como convidado, ir para checkout
      window.location.href = '/checkout';
    } else {
      // Mostrar opções de identificação
      setShowIdentification(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <EmptyCartState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrinho de Compras</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos no Carrinho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumo e Checkout */}
          <div className="lg:col-span-1 space-y-6">
            {/* Totais */}
            <Card>
              <CardContent className="p-6">
                <CartTotals total={total} />
              </CardContent>
            </Card>

            {/* Status do Usuário */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">✓ Logado como</p>
                      <p className="text-green-700">{user.email}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      O endereço de entrega será carregado dos seus dados cadastrais. 
                      Você poderá alterá-lo na próxima etapa se necessário.
                    </p>
                  </div>
                ) : guestUser ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">✓ Continuando como convidado</p>
                      <p className="text-blue-700">{guestUser.full_name}</p>
                      <p className="text-blue-700">{guestUser.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setGuestUser(null)}
                    >
                      Alterar informações
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Para finalizar a compra, você precisa se identificar.
                    </p>
                    <Button 
                      onClick={() => setShowIdentification(true)} 
                      className="w-full"
                    >
                      Identificar-se
                    </Button>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="space-y-2 pt-4 border-t">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    disabled={!user && !guestUser}
                  >
                    Finalizar Compra
                  </Button>
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Identificação */}
        {showIdentification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Como deseja continuar?</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowIdentification(false)}
                  className="absolute top-4 right-4"
                >
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <IdentificationStep
                  onGuestContinue={handleGuestContinue}
                  onNext={() => setShowIdentification(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
