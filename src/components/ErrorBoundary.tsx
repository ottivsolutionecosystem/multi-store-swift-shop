
import * as Sentry from '@sentry/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryFallbackProps {
  error: Error;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

const ErrorBoundaryFallback = ({ error, resetError }: ErrorBoundaryFallbackProps) => {
  const errorMessage = error.message || 'Unknown error occurred';
  const errorStack = error.stack || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Oops! Algo deu errado</CardTitle>
          <CardDescription>
            Ocorreu um erro inesperado. Nossa equipe foi notificada automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-gray-50 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600">
                {errorMessage}
                {errorStack}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1">
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Voltar ao início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export the Sentry ErrorBoundary with our custom fallback
export const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: ErrorBoundaryFallback,
    beforeCapture: (scope, error, errorInfo: any) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', {
        componentStack: typeof errorInfo === 'string' ? errorInfo : errorInfo?.componentStack || 'unknown',
        errorBoundary: true
      });
    }
  }
);
