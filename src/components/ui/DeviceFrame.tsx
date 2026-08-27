import { ReactNode } from "react";
import { Laptop, Smartphone } from "lucide-react";

interface DeviceFrameProps {
  children: ReactNode;
  variant?: "macbook" | "iphone";
  title?: string;
  className?: string;
}

export const DeviceFrame = ({
  children,
  variant = "macbook",
  title = "GK.dev Cloud Node",
  className = "",
}: DeviceFrameProps) => {
  if (variant === "iphone") {
    return (
      <div
        className={`relative mx-auto w-full max-w-[280px] sm:max-w-[300px] rounded-[44px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-black border-4 border-slate-700 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] select-none ${className}`}
      >
        {/* iPhone Speaker & Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black border border-slate-800 flex items-center justify-between px-2.5 z-30 shadow-md">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-900/90 ring-1 ring-slate-800 flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-blue-950/60" />
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Bezel & Display Window */}
        <div className="relative rounded-[34px] overflow-hidden bg-black aspect-[9/19.5] border border-slate-800/80 shadow-inner flex flex-col pt-6">
          {/* Glass Glare Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none z-20" />
          <div className="relative z-10 flex-1 overflow-hidden">{children}</div>
        </div>

        {/* Home Bottom Bar */}
        <div className="w-28 h-1 rounded-full bg-slate-600/60 mx-auto mt-2.5" />
      </div>
    );
  }

  // MacBook Pro Variant
  return (
    <div className={`relative mx-auto w-full rounded-2xl bg-gradient-to-b from-slate-900 to-black p-2 sm:p-3 border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] select-none ${className}`}>
      {/* Top MacBook Notch Bar */}
      <div className="flex items-center justify-between px-2 pb-2 text-[10px] text-slate-400 font-mono border-b border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer shadow-xs" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer shadow-xs" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer shadow-xs" />
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 font-bold truncate max-w-[200px]">
          <Laptop className="h-3 w-3 text-primary" />
          <span className="truncate">{title}</span>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
      </div>

      {/* Screen Display Area */}
      <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800/80 aspect-[16/10] sm:aspect-[16/9] shadow-inner mt-2">
        {/* Subtle Screen Specular Glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none z-20" />
        <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* MacBook Bottom Aluminum Lip */}
      <div className="w-20 h-1 rounded-b-md bg-slate-700/60 mx-auto mt-2" />
    </div>
  );
};
