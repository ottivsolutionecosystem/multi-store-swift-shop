
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { PromotionForm } from '@/components/admin/promotions/PromotionForm';

export default function PromotionFormPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleBack = () => {
    navigate('/admin/promotions');
  };

  const handleSuccess = () => {
    navigate('/admin/promotions');
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Promoção' : 'Nova Promoção'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Modifique os detalhes da promoção' : 'Crie uma nova promoção para sua loja'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Promoção</CardTitle>
            <CardDescription>
              Configure os detalhes da sua promoção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PromotionForm promotionId={id} onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
