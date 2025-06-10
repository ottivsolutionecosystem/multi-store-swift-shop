
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { StoreSettingsForm } from '@/components/admin/store-settings/StoreSettingsForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StoreSettingsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { storeId, loading: tenantLoading } = useTenant();
  const navigate = useNavigate();

  console.log('StoreSettingsPage - authLoading:', authLoading, 'tenantLoading:', tenantLoading, 'storeId:', storeId);

  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, authLoading, navigate]);

  // Loading state
  if (authLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user || profile?.role !== 'admin') {
    return null;
  }

  // Store ID missing
  if (!storeId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as informações da loja. Verifique se a loja está configurada corretamente.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
        </div>

        <StoreSettingsForm />
      </main>
    </div>
  );
}
