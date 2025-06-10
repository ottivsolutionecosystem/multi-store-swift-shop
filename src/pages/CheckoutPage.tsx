
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { EnhancedCartSummary } from '@/components/checkout/EnhancedCartSummary';
import { CartStep } from '@/components/checkout/CartStep';
import { IdentificationStep } from '@/components/checkout/IdentificationStep';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { FinalStep } from '@/components/checkout/FinalStep';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/hooks/useCheckout';
import { CheckoutStep, GuestUser } from '@/types/checkout';
import { ShippingCalculation } from '@/types/shipping';

const steps: CheckoutStep[] = [
  { id: '1', title: 'Carrinho', completed: false, current: false },
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

  const handleIdentificationComplete = (guestData?: GuestUser) => {
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

  const handleShippingCalculated = (calculations: ShippingCalculation[]) => {
    // Auto-select first method if available
    if (calculations.length > 0) {
      setShippingMethod(calculations[0].method_id, calculations[0].price);
    }
  };

  const handleShippingMethodSelected = (methodId: string, price: number) => {
    setShippingMethod(methodId, price);
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {checkoutState.step === 1 && (
              <CartStep
                items={items}
                shippingPrice={checkoutState.shipping_price}
                onShippingCalculated={handleShippingCalculated}
                onShippingMethodSelected={handleShippingMethodSelected}
                onNext={nextStep}
              />
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
              <EnhancedCartSummary 
                allowEditing={false}
                showShippingCalculator={false}
                shippingPrice={checkoutState.shipping_price}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
