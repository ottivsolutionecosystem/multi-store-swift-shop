
export interface CheckoutStep {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
}

export interface GuestUser {
  full_name: string;
  email: string;
  phone: string;
}

export interface CheckoutState {
  step: number;
  user: GuestUser | null;
  delivery_address: any;
  shipping_method: string;
  shipping_price: number;
  notes: string;
}

export type CheckoutAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_USER'; payload: GuestUser | null }
  | { type: 'SET_DELIVERY_ADDRESS'; payload: any }
  | { type: 'SET_SHIPPING_METHOD'; payload: { methodId: string; price: number } }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'RESET_CHECKOUT' };
