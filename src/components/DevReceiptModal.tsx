import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Receipt, X, Download, Share2, Sparkles, Check, Printer } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticMedium, hapticLight, hapticSuccess } from "@/lib/haptics";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { toast } from "@/hooks/use-toast";
import { useAchievements } from "@/hooks/use-achievements";

interface DevReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevReceiptModal = ({ isOpen, onClose }: DevReceiptModalProps) => {
  useScrollLock(isOpen);
  const { unlock } = useAchievements();
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || typeof document === "undefined") return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = now.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const receiptItems = [
    { item: "React 19 + Next.js 15 (SSR)", qty: "1000h", price: "99.99 XP" },
    { item: "TypeScript Strict Type Safety", qty: "850h", price: "85.00 XP" },
    { item: "Node.js + PostgreSQL + Prisma", qty: "600h", price: "75.50 XP" },
    { item: "Motion + WebGL Three.js 60FPS", qty: "400h", price: "60.00 XP" },
    { item: "Clerk Auth + Supabase Realtime", qty: "300h", price: "45.00 XP" },
    { item: "Vitest TDD + E2E Playwright", qty: "250h", price: "40.00 XP" },
    { item: "Kawy & Energetyki (Kofeina)", qty: "820x", price: "0.00 PLN" },
    { item: "Pasja & Samodzielna Nauka", qty: "100%", price: "FREE" },
  ];

  const handlePrint = () => {
    soundEngine.playChime();
    hapticSuccess();
    unlock("explorer");
    window.print();
  };

  const handleShare = async () => {
    soundEngine.playPop(850, 0.03);
    hapticLight();
    const shareText = `🧾 Oficjalny Paragon Inżynierski GK.dev | Grzegorz - Mid Fullstack Developer (React/TS/Node). Zobacz portfolio: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Paragon Inżynierski • GK.dev",
          text: shareText,
          url: window.location.origin,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Skopiowano paragon!",
        description: "Tekst paragonu zapisano do schowka.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            soundEngine.playClick();
            onClose();
          }}
        />

        {/* Receipt Wrapper */}
        <motion.div
          ref={receiptRef}
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 40 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="relative w-full max-w-sm bg-[#faf8f5] text-neutral-900 font-mono rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-10 overflow-hidden border border-neutral-300 pointer-events-auto select-none my-auto"
        >
          {/* Jagged / Zigzag Receipt Top Header */}
          <div className="h-3 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 border-b border-dashed border-neutral-300" />

          {/* Action Bar */}
          <div className="flex items-center justify-between px-4 pt-3 print:hidden">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-bold">
              <Receipt className="h-4 w-4 text-emerald-600" />
              <span>PARAGON FISKALNY</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleShare}
                className="h-7 w-7 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Udostępnij"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="h-7 w-7 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Drukuj paragon"
              >
                <Printer className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-7 w-7 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer ml-1"
                title="Zamknij"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-5 text-[11px] leading-tight space-y-3">
            {/* Store Brand Header */}
            <div className="text-center space-y-1 border-b border-dashed border-neutral-400 pb-3">
              <p className="font-extrabold text-sm tracking-wider">GK.DEV SOFTWARE LAB</p>
              <p className="text-[10px] text-neutral-600">GRZEGORZ — MID FULLSTACK DEV</p>
              <p className="text-[9px] text-neutral-500">SZCZECIN, POLAND • NIP: PL-REACT-19</p>
              <p className="text-[9px] text-neutral-500 font-mono">DATA: {dateStr} {timeStr}</p>
            </div>

            {/* Receipt Items Table */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between font-bold text-neutral-700 text-[10px] border-b border-neutral-300 pb-1">
                <span>NAZWA POZYCJI</span>
                <span>ILOŚĆ / WARTOŚĆ</span>
              </div>
              {receiptItems.map((row, idx) => (
                <div key={idx} className="flex justify-between items-start text-[10.5px]">
                  <span className="truncate pr-2 max-w-[190px]">{row.item}</span>
                  <span className="font-bold shrink-0">{row.price}</span>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="border-t border-b border-dashed border-neutral-400 py-2 space-y-1">
              <div className="flex justify-between font-extrabold text-xs">
                <span>SUMA PLN:</span>
                <span>0.00 PLN</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-emerald-700">
                <span>SUMA DOŚWIADCZENIA:</span>
                <span>2500+ GODZIN</span>
              </div>
              <div className="flex justify-between text-[9.5px] text-neutral-500">
                <span>RODZAJ PŁATNOŚCI:</span>
                <span>KOD & PASJA</span>
              </div>
            </div>

            {/* Barcode & Signature */}
            <div className="text-center pt-2 space-y-2">
              <div className="flex justify-center items-center gap-0.5 h-10 w-full overflow-hidden opacity-85 px-4">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{
                      width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`,
                      marginRight: `${(i % 4 === 0 ? 2 : 1)}px`,
                    }}
                  />
                ))}
              </div>
              <p className="text-[9px] tracking-widest text-neutral-500 font-mono">
                * 2026-GK-DEV-FULLSTACK-SAMOUK *
              </p>
              <p className="text-[10px] font-bold text-neutral-800">
                DZIĘKUJEMY ZA WIZYTĘ I ZAPRASZAMY DO WSPÓŁPRACY!
              </p>
            </div>
          </div>

          {/* Jagged Bottom Cut */}
          <div className="h-3 w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 border-t border-dashed border-neutral-300" />
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default DevReceiptModal;
