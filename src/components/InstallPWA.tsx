import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("pwa-dismissed")) return;

    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-dismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 flex items-center gap-4 p-4 rounded-2xl shadow-xl border bg-white animate-in slide-in-from-bottom-4">
      <img
        src="/logo-app-v3.png"
        alt="Gestão Igreja"
        className="h-14 w-14 rounded-xl object-contain shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-black">Instalar App</p>
        <p className="text-sm text-gray-500">
          Use Gestão Igreja como app no celular ou PC
        </p>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <Button size="sm" onClick={handleInstall} className="gap-2">
          <Download className="h-4 w-4" />
          Instalar
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
