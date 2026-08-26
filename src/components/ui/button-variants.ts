import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold font-['Geist'] tracking-tight overflow-hidden select-none transition-all duration-300 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.6)] hover:scale-[1.03] border border-white/20",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:scale-[1.02]",
        outline:
          "border border-border/80 bg-background/80 backdrop-blur-md text-foreground hover:bg-card hover:text-primary hover:border-primary/40 hover:scale-[1.02] shadow-sm",
        secondary:
          "bg-secondary/90 text-secondary-foreground shadow-sm hover:bg-secondary hover:text-primary hover:border-primary/30 hover:scale-[1.02]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:underline",
        glow:
          "bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_45px_rgba(59,130,246,0.7)] hover:scale-[1.04] border border-white/30",
        glass:
          "border border-border/80 bg-card/60 backdrop-blur-2xl text-foreground shadow-md hover:bg-card/90 hover:border-primary/40 hover:text-primary hover:scale-[1.02]",
      },
      size: {
        default: "px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold",
        sm: "px-3.5 py-1 text-xs font-medium",
        lg: "px-5.5 sm:px-6.5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold",
        icon: "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
