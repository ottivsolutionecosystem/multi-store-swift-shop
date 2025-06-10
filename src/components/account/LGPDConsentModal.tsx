
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface LGPDConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consentGiven: boolean;
  setConsentGiven: (consent: boolean) => void;
  onContinue: () => void;
}

export function LGPDConsentModal({
  open,
  onOpenChange,
  consentGiven,
  setConsentGiven,
  onContinue
}: LGPDConsentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Consentimento LGPD</span>
          </DialogTitle>
          <DialogDescription>
            Para salvar seu cartão na carteira digital, precisamos do seu consentimento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Como protegemos seus dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Dados coletados:</strong> Apenas os últimos 4 dígitos do cartão, nome do portador e validade.</p>
                <p><strong>Finalidade:</strong> Facilitar futuras compras com checkout mais rápido.</p>
                <p><strong>Armazenamento:</strong> Dados criptografados e seguros em nossos servidores.</p>
                <p><strong>Retenção:</strong> Mantemos os dados por 1 ano ou até você solicitar a remoção.</p>
                <p><strong>Seus direitos:</strong> Você pode acessar, corrigir ou excluir seus dados a qualquer momento.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
            />
            <Label htmlFor="consent" className="text-sm">
              Eu concordo com o tratamento dos meus dados conforme descrito acima e autorizo 
              o armazenamento seguro das informações do meu cartão na carteira digital.
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={onContinue}
              disabled={!consentGiven}
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
