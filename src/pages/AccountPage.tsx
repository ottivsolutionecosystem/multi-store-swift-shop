
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Conta</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Seus dados pessoais e informações da conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                
                {profile?.full_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                    <p className="text-gray-900">{profile.full_name}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Conta</label>
                  <p className="text-gray-900 capitalize">{profile?.role || 'user'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
              <CardDescription>
                Histórico dos seus pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Funcionalidade de pedidos será implementada em breve.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
