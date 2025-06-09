
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { CartSummary } from '@/components/checkout/CartSummary';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { FinalStep } from '@/components/checkout/FinalStep';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/hooks/useCheckout';
import { CheckoutStep } from '@/types/checkout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const steps: CheckoutStep[] = [
  { id: '1', title: 'Resumo', completed: false, current: false },
  { id: '2', title: 'Entrega', completed: false, current: false },
  { id: '3', title: 'Finalização', completed: false, current: false },
];

export default function CheckoutPage() {
  const { items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    state: checkoutState,
    nextStep,
    previousStep,
    setUser,
    setDeliveryAddress,
    setShippingMethod,
    reset
  } = useCheckout();

  // Redirect if cart is empty or user is not identified
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    } else if (!user && !checkoutState.user) {
      navigate('/cart');
    }
  }, [items, user, checkoutState.user, navigate]);

  // Auto-set user if logged in
  React.useEffect(() => {
    if (user && !checkoutState.user) {
      setUser({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      });
    }
  }, [user, checkoutState.user, setUser]);

  const currentSteps = steps.map((step, index) => ({
    ...step,
    completed: index + 1 < checkoutState.step,
    current: index + 1 === checkoutState.step,
  }));

  const handleShippingComplete = (methodId: string, price: number, address?: any) => {
    setShippingMethod(methodId, price);
    if (address) {
      setDeliveryAddress(address);
    }
  };

  const handleOrderComplete = () => {
    reset();
    navigate('/', { 
      replace: true,
      state: { message: 'Pedido realizado com sucesso!' }
    });
  };

  if (items.length === 0 || (!user && !checkoutState.user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Finalizar Compra</h1>
          <CheckoutSteps steps={currentSteps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {checkoutState.step === 1 && (
              <div className="space-y-6">
                <CartSummary />
                <div className="flex justify-between">
                  <Link to="/cart">
                    <Button variant="outline">Voltar ao Carrinho</Button>
                  </Link>
                  <Button onClick={nextStep}>
                    Continuar para Entrega
                  </Button>
                </div>
              </div>
            )}

            {checkoutState.step === 2 && (
              <ShippingStep
                guestUser={checkoutState.user}
                onShippingSelect={handleShippingComplete}
                onAddressSelect={setDeliveryAddress}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}

            {checkoutState.step === 3 && (
              <FinalStep
                checkoutState={checkoutState}
                onPrevious={previousStep}
                onOrderComplete={handleOrderComplete}
              />
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
            
            {/* User Info */}
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-2">Informações do Cliente</h3>
                {user ? (
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Usuário:</strong> {user.email}</p>
                    {user.user_metadata?.full_name && (
                      <p className="text-sm"><strong>Nome:</strong> {user.user_metadata.full_name}</p>
                    )}
                  </div>
                ) : checkoutState.user ? (
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Nome:</strong> {checkoutState.user.full_name}</p>
                    <p className="text-sm"><strong>Email:</strong> {checkoutState.user.email}</p>
                    <p className="text-sm"><strong>Telefone:</strong> {checkoutState.user.phone}</p>
                    <p className="text-xs text-gray-500">Convidado</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
