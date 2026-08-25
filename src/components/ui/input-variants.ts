import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-transparent outline-none transition-all duration-300 focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.2),0_0_20px_-5px_hsl(var(--primary)/0.15)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        default: "border-border/60 focus:border-primary/40 hover:border-border",
        error: "border-destructive focus:shadow-[0_0_0_4px_hsl(var(--destructive)/0.15)] focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export const textareaVariants = cva(
  "w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-transparent outline-none resize-none transition-all duration-300 focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.2),0_0_20px_-5px_hsl(var(--primary)/0.15)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        default: "border-border/60 focus:border-primary/40 hover:border-border",
        error: "border-destructive focus:shadow-[0_0_0_4px_hsl(var(--destructive)/0.15)] focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);
