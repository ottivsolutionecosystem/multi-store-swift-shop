
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { CartSummary } from '@/components/checkout/CartSummary';
import { IdentificationStep } from '@/components/checkout/IdentificationStep';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { FinalStep } from '@/components/checkout/FinalStep';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/hooks/useCheckout';
import { CheckoutStep } from '@/types/checkout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const steps: CheckoutStep[] = [
  { id: '1', title: 'Resumo', completed: false, current: false },
  { id: '2', title: 'Identificação', completed: false, current: false },
  { id: '3', title: 'Entrega', completed: false, current: false },
  { id: '4', title: 'Finalização', completed: false, current: false },
];

export default function CheckoutPage() {
  const { items } = useCart();
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

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const currentSteps = steps.map((step, index) => ({
    ...step,
    completed: index + 1 < checkoutState.step,
    current: index + 1 === checkoutState.step,
  }));

  const handleIdentificationComplete = (guestData?: any) => {
    if (guestData) {
      setUser(guestData);
    }
    nextStep();
  };

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

  if (items.length === 0) {
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
                  <Link to="/">
                    <Button variant="outline">Continuar Comprando</Button>
                  </Link>
                  <Button onClick={nextStep}>
                    Continuar para Identificação
                  </Button>
                </div>
              </div>
            )}

            {checkoutState.step === 2 && (
              <IdentificationStep
                onGuestContinue={setUser}
                onNext={() => handleIdentificationComplete()}
              />
            )}

            {checkoutState.step === 3 && (
              <ShippingStep
                guestUser={checkoutState.user}
                onShippingSelect={handleShippingComplete}
                onAddressSelect={setDeliveryAddress}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}

            {checkoutState.step === 4 && (
              <FinalStep
                checkoutState={checkoutState}
                onPrevious={previousStep}
                onOrderComplete={handleOrderComplete}
              />
            )}
          </div>

          {/* Sidebar - Summary for steps 2+ */}
          {checkoutState.step > 1 && (
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
