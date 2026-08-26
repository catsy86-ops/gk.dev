import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff, Wifi, Check } from "lucide-react";

export const OfflineNetworkIndicator = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-semibold px-4 py-1.5 shadow-lg flex items-center justify-center gap-2 text-center"
        >
          <WifiOff className="h-3.5 w-3.5 animate-pulse" />
          <span>Tryb offline — pełna zawartość strony i GKinAmp działają z pamięci PWA!</span>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold px-4 py-1.5 shadow-lg flex items-center justify-center gap-2 text-center"
        >
          <Wifi className="h-3.5 w-3.5" />
          <span>Połączenie z siecią zostało przywrócone!</span>
          <Check className="h-3 w-3 text-emerald-200" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNetworkIndicator;
