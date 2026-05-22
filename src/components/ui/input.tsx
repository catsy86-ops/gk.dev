import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)] focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        default: "border-border focus:border-foreground/20",
        error: "border-destructive",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const textareaVariants = cva(
  "w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground/60 outline-none resize-none transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)] focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        default: "border-border focus:border-foreground/20",
        error: "border-destructive",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea, inputVariants, textareaVariants };
