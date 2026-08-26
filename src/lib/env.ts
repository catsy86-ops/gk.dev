/**
 * GK.dev Scentralizowany Moduł Konfiguracji Środowiskowej
 * Obsługuje wieloźródłowe wykrywanie zmiennych (Vite / Next / Vercel),
 * walidację kluczy Clerk i Supabase oraz diagnostykę połączeń.
 */

// Domyślny aktywny klucz deweloperski powiązany z instancją Clerk
export const DEFAULT_CLERK_TEST_KEY =
  "pk_test_Ymxlc3NlZC1iYXNpbGlzay0zMi5jbGVyay5hY2NvdW50cy5kZXYk";

// Domyślna konfiguracja instancji Supabase
export const DEFAULT_SUPABASE_URL = "https://ehzdoloonkhesmhjdvbp.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY =
  "sb_publishable_wrbsh-Ndr22hOfUy6-ubPg_tJkUl2RI";

/**
 * Bezpiecznie dekoduje domenę instancji Clerk z klucza publishable (base64)
 */
export function decodeClerkDomain(publishableKey?: string | null): string | null {
  if (!publishableKey || typeof publishableKey !== "string") return null;
  try {
    const parts = publishableKey.split("_");
    if (parts.length < 3) return null;
    const base64Payload = parts[2];
    if (typeof atob === "function") {
      const decoded = atob(base64Payload);
      return decoded.replace(/\$$/, "");
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Sprawdza poprawność formatu klucza Clerk Publishable Key (pk_test_... / pk_live_...)
 */
export function isValidClerkKey(key?: string | null): boolean {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  if (!trimmed.startsWith("pk_test_") && !trimmed.startsWith("pk_live_")) {
    return false;
  }
  const parts = trimmed.split("_");
  return parts.length >= 3 && parts[2].length > 10;
}

/**
 * Bezpiecznie odczytuje zmienną ze wszystkich możliwych aliasów środowiskowych
 */
function getEnvVar(...aliases: (string | undefined)[]): string {
  for (const alias of aliases) {
    if (alias && typeof alias === "string" && alias.trim().length > 0) {
      return alias.trim();
    }
  }
  return "";
}

// Pobieranie klucza Clerk z priorytetami
const resolvedClerkKey = getEnvVar(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  import.meta.env.CLERK_PUBLISHABLE_KEY,
  DEFAULT_CLERK_TEST_KEY
);

// Pobieranie danych Supabase z priorytetami
const resolvedSupabaseUrl = getEnvVar(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_URL,
  DEFAULT_SUPABASE_URL
);

const resolvedSupabaseAnonKey = getEnvVar(
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  import.meta.env.SUPABASE_ANON_KEY,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  DEFAULT_SUPABASE_ANON_KEY
);

const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : "";
const isVercel =
  hostname.endsWith(".vercel.app") ||
  Boolean(import.meta.env.VERCEL) ||
  hostname.includes("gkdevi");

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === "development";
const isProduction = import.meta.env.PROD || import.meta.env.MODE === "production";

export const ENV = {
  mode: import.meta.env.MODE,
  isDev: isDevelopment,
  isProd: isProduction,
  isVercel,
  isBrowser,

  clerk: {
    publishableKey: resolvedClerkKey,
    isValid: isValidClerkKey(resolvedClerkKey),
    isConfigured: Boolean(resolvedClerkKey && isValidClerkKey(resolvedClerkKey)),
    domain: decodeClerkDomain(resolvedClerkKey),
    isLiveKey: resolvedClerkKey.startsWith("pk_live_"),
    isTestKey: resolvedClerkKey.startsWith("pk_test_"),
  },

  supabase: {
    url: resolvedSupabaseUrl,
    anonKey: resolvedSupabaseAnonKey,
    isConfigured: Boolean(
      resolvedSupabaseUrl &&
        resolvedSupabaseAnonKey &&
        !resolvedSupabaseAnonKey.includes("dummy_anon_key")
    ),
  },

  /**
   * Zwraca bezpieczny raport diagnostyczny bez ujawniania sekretów
   */
  getDiagnostics() {
    return {
      environment: {
        mode: import.meta.env.MODE,
        isVercel,
        hostname: isBrowser ? hostname : "server/node",
      },
      clerk: {
        configured: Boolean(resolvedClerkKey),
        validFormat: isValidClerkKey(resolvedClerkKey),
        keyType: resolvedClerkKey.startsWith("pk_live_")
          ? "LIVE (Production)"
          : resolvedClerkKey.startsWith("pk_test_")
          ? "TEST (Development)"
          : "UNKNOWN",
        instanceDomain: decodeClerkDomain(resolvedClerkKey) || "unknown",
        keyPrefix: resolvedClerkKey.slice(0, 12) + "...",
      },
      supabase: {
        url: resolvedSupabaseUrl,
        configured: Boolean(
          resolvedSupabaseUrl &&
            resolvedSupabaseAnonKey &&
            !resolvedSupabaseAnonKey.includes("dummy_anon_key")
        ),
        keyPrefix: resolvedSupabaseAnonKey.slice(0, 10) + "...",
      },
    };
  },
};

/**
 * Loguje status diagnostyki w konsoli deweloperskiej
 */
export function logEnvDiagnostics(): void {
  if (typeof window === "undefined") return;
  const diag = ENV.getDiagnostics();
  if (ENV.isDev || window.location.search.includes("debug=env")) {
    console.info(
      "%c[GK.dev Environment Diagnostics]",
      "color: #3b82f6; font-weight: bold;",
      diag
    );
  }
}
