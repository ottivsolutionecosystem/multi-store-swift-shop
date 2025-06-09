
import { useReducer } from 'react';
import { CheckoutState, CheckoutAction } from '@/types/checkout';

const initialState: CheckoutState = {
  step: 1,
  user: null,
  delivery_address: null,
  shipping_method: '',
  shipping_price: 0,
  notes: '',
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_DELIVERY_ADDRESS':
      return { ...state, delivery_address: action.payload };
    case 'SET_SHIPPING_METHOD':
      return { 
        ...state, 
        shipping_method: action.payload.methodId,
        shipping_price: action.payload.price
      };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'RESET_CHECKOUT':
      return initialState;
    default:
      return state;
  }
}

export function useCheckout() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const nextStep = () => {
    if (state.step < 4) {
      dispatch({ type: 'SET_STEP', payload: state.step + 1 });
    }
  };

  const previousStep = () => {
    if (state.step > 1) {
      dispatch({ type: 'SET_STEP', payload: state.step - 1 });
    }
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setUser = (user: any) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setDeliveryAddress = (address: any) => {
    dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: address });
  };

  const setShippingMethod = (methodId: string, price: number) => {
    dispatch({ type: 'SET_SHIPPING_METHOD', payload: { methodId, price } });
  };

  const setNotes = (notes: string) => {
    dispatch({ type: 'SET_NOTES', payload: notes });
  };

  const reset = () => {
    dispatch({ type: 'RESET_CHECKOUT' });
  };

  return {
    state,
    nextStep,
    previousStep,
    setStep,
    setUser,
    setDeliveryAddress,
    setShippingMethod,
    setNotes,
    reset,
  };
}
