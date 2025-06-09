
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TenantProvider } from '@/contexts/TenantContext';
import { CartProvider } from '@/contexts/CartContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Pages
import Index from '@/pages/Index';
import StorePage from '@/pages/StorePage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';
import AdminPage from '@/pages/AdminPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import NotFound from '@/pages/NotFound';

// Admin Pages
import ProductsPage from '@/pages/admin/ProductsPage';
import ProductFormPage from '@/pages/admin/ProductFormPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import CategoryFormPage from '@/pages/admin/CategoryFormPage';
import PromotionsPage from '@/pages/admin/PromotionsPage';
import PromotionFormPage from '@/pages/admin/PromotionFormPage';
import OrdersPage from '@/pages/admin/OrdersPage';
import StoreSettingsPage from '@/pages/admin/StoreSettingsPage';
import LogisticsPage from '@/pages/admin/LogisticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TenantProvider>
              <AuthProvider>
                <CartProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/products" element={<ProductsPage />} />
                    <Route path="/admin/products/new" element={<ProductFormPage />} />
                    <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
                    <Route path="/admin/categories" element={<CategoriesPage />} />
                    <Route path="/admin/categories/new" element={<CategoryFormPage />} />
                    <Route path="/admin/categories/:id/edit" element={<CategoryFormPage />} />
                    <Route path="/admin/promotions" element={<PromotionsPage />} />
                    <Route path="/admin/promotions/new" element={<PromotionFormPage />} />
                    <Route path="/admin/promotions/:id/edit" element={<PromotionFormPage />} />
                    <Route path="/admin/orders" element={<OrdersPage />} />
                    <Route path="/admin/settings" element={<StoreSettingsPage />} />
                    <Route path="/admin/logistics" element={<LogisticsPage />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CartProvider>
              </AuthProvider>
            </TenantProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
