
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useCart } from '@/contexts/CartContext';
import { signOut } from '@/lib/auth';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, profile } = useAuth();
  const { store } = useTenant();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              {store?.name || 'E-commerce'}
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {/* Cart Button */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Minha Conta
                  </Button>
                </Link>
                
                {profile?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
