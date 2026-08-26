import React, { ReactNode } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n";

// Fallback demo publishable key for local dev if .env is missing
const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_Z3VpZGluZy1nYXJmaXNoLTczLmNsZXJrLmFjY291bnRzLmRldiQ";

interface ClerkAuthProviderProps {
  children: ReactNode;
}

export const ClerkAuthProvider: React.FC<ClerkAuthProviderProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const { lang } = useI18n();
  const isDark = resolvedTheme === "dark";

  // Appearance customization matching the portfolio design system tokens
  const appearance = {
    variables: {
      colorPrimary: "hsl(221, 83%, 53%)",
      colorBackground: isDark ? "hsl(224, 71%, 4%)" : "hsl(0, 0%, 100%)",
      colorText: isDark ? "hsl(210, 40%, 98%)" : "hsl(222.2, 84%, 4.9%)",
      colorTextSecondary: isDark ? "hsl(215, 20.2%, 65.1%)" : "hsl(215.4, 16.3%, 46.9%)",
      colorInputBackground: isDark ? "hsl(222, 47%, 7%)" : "hsl(210, 40%, 96.1%)",
      colorInputText: isDark ? "hsl(210, 40%, 98%)" : "hsl(222.2, 84%, 4.9%)",
      borderRadius: "1rem",
      fontFamily: "Geist, system-ui, sans-serif",
    },
    elements: {
      card: "rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl",
      formButtonPrimary:
        "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/30 transition-all active:scale-95",
      headerTitle: "font-black tracking-tight text-foreground",
      headerSubtitle: "text-muted-foreground",
      socialButtonsBlockButton:
        "rounded-2xl border border-border/80 bg-secondary/80 hover:bg-secondary text-foreground transition-all",
      userButtonAvatarBox: "h-8 w-8 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-background shadow-md",
      userButtonPopoverCard: "rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl",
    },
  };

  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY.trim() === "") {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={appearance}
      localization={
        lang === "pl"
          ? {
              signIn: {
                start: {
                  title: "Zaloguj się do GK.dev",
                  subtitle: "Dostęp do strefy klienta, briefów i zakładek",
                },
              },
            }
          : undefined
      }
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkAuthProvider;
