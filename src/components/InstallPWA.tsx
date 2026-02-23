import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    if ((window as any).navigator?.standalone) {
      setIsInstalled(true);
      return;
    }
    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-install-dismissed', '1');
  };

  if (!showBanner || isInstalled || !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 flex items-center gap-4 p-4 rounded-2xl shadow-xl border border-border bg-card animate-in slide-in-from-bottom-4"
      role="banner"
    >
      <img
        src="/logo-app.png"
        alt="Gestão Igreja"
        className="h-14 w-14 rounded-xl object-contain shrink-0 bg-primary/10"
        style={{ filter: 'brightness(0)' }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">Instalar App</p>
        <p className="text-sm text-muted-foreground">Use Gestão Igreja como app no celular ou PC</p>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <Button size="sm" onClick={handleInstall} className="gap-2">
          <Download className="h-4 w-4" />
          Instalar
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss} aria-label="Fechar">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
