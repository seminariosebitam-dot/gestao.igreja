import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { churchesService } from '@/services/churches.service';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Bloqueia o uso do sistema quando a igreja está inadimplente ou suspensa.
 * SuperAdmin e rotas públicas não passam por este componente.
 */
export function SubscriptionBlock({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<{ status: string; blocked: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'superadmin') {
      setStatus({ status: 'ativa', blocked: false });
      setLoading(false);
      return;
    }
    churchesService.getMyChurchSubscriptionStatus().then((s) => {
      setStatus(s);
      setLoading(false);
    });
  }, [user?.id, user?.role]);

  if (loading || !status?.blocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/30">
      <div className="max-w-md w-full bg-card border border-destructive/30 rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Serviço temporariamente suspenso</h1>
        <p className="text-muted-foreground text-sm mb-6">
          A mensalidade da sua igreja está em atraso. O acesso foi interrompido até a regularização do pagamento.
        </p>
        <div className="space-y-2 text-left text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
          <p>• Vencimento: dia <strong>10</strong> de cada mês</p>
          <p>• Suspensão automática: dia <strong>15</strong> se não houver pagamento</p>
          <p>• Após o pagamento, o sistema retorna automaticamente</p>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Entre em contato com o administrador da plataforma para regularizar.
        </p>
      </div>
    </div>
  );
}
