
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputMask } from '@/components/ui/input-mask';
import { useAuth } from '@/contexts/AuthContext';
import { GuestUser } from '@/types/checkout';

interface IdentificationStepProps {
  onGuestContinue: (guestData: GuestUser) => void;
  onNext: () => void;
}

export function IdentificationStep({ onGuestContinue, onNext }: IdentificationStepProps) {
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'choose' | 'login' | 'register' | 'guest'>('choose');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', fullName: '' });
  const [guestData, setGuestData] = useState<GuestUser>({ full_name: '', email: '', phone: '' });

  React.useEffect(() => {
    if (user) {
      onNext();
    }
  }, [user, onNext]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(registerData.email, registerData.password, registerData.fullName);
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuestContinue(guestData);
    onNext();
  };

  if (user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-green-600">✓ Logado como {user.email}</p>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'choose') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Como deseja continuar?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setMode('login')}
          >
            Já tenho conta - Fazer Login
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setMode('guest')}
          >
            Continuar como Convidado
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setMode('register')}
          >
            Criar Nova Conta
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'login') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode('choose')}>
                Voltar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'register') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={registerData.fullName}
                onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Conta'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode('choose')}>
                Voltar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'guest') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continuar como Convidado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={guestData.full_name}
                onChange={(e) => setGuestData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={guestData.email}
                onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <InputMask
                mask="phone"
                id="phone"
                value={guestData.phone}
                onChange={(e) => setGuestData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Continuar</Button>
              <Button type="button" variant="outline" onClick={() => setMode('choose')}>
                Voltar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}
