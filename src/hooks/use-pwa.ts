import { useState, useEffect, useCallback } from "react";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight } from "@/lib/haptics";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwa() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [hasUpdate, setHasUpdate] = useState(false);

  // Register service worker and listen for events
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running as installed standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - navigator.standalone is iOS Safari specific
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    // Online / Offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      soundEngine.playChime();
    };
    const handleOffline = () => {
      setIsOnline(false);
      soundEngine.playPop(300, 0.05);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for PWA beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      soundEngine.playChime();
      hapticMedium();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Register service worker if supported
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setHasUpdate(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn("[PWA] Service Worker registration failed:", error);
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return false;
    }

    soundEngine.playClick();
    hapticMedium();
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    } else {
      hapticLight();
      return false;
    }
  }, [deferredPrompt]);

  const applyUpdate = useCallback(() => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    hasUpdate,
    promptInstall,
    applyUpdate,
  };
}
