---
name: vercel-deployment-manager
description: >-
  Zarządza wdrożeniami na platformie Vercel dla projektu GK.dev. Konfiguruje
  i weryfikuje vercel.json, nagłówki bezpieczeństwa (CSP, HSTS, X-Frame-Options),
  reguły rewrites dla Single Page Application (SPA), reguły cachowania assetów
  oraz weryfikuje stan zmiennych środowiskowych i certyfikaty domenowe.
---

# Vercel Deployment Manager (`vercel-deployment-manager`)

Ten skill definiuje procedury weryfikacji, konfiguracji i optymalizacji wdrożeń na platformie **Vercel** dla projektu **GK.dev** (Vite + React + Clerk + Supabase).

---

## 1. Struktura Konfiguracji `vercel.json`

Dla projektów SPA w Vite, `vercel.json` musi zapewniać:
1. **Reguły Rewrites dla SPA Routing**: Wszystkie trasy klienta (`/`, `/sign-in`, `/sign-up`, `/projekty`) muszą być przekierowywane na `/index.html` bez generowania błędu 404.
2. **Nagłówki Bezpieczeństwa (Security Headers)**:
   * `Content-Security-Policy` (zezwolenie na Clerk `clerk.accounts.dev`, Supabase `supabase.co`, Google Fonts, WebGL blob).
   * `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   * `X-Content-Type-Options: nosniff`
   * `X-Frame-Options: SAMEORIGIN`
   * `Referrer-Policy: strict-origin-when-cross-origin`
3. **Cachowanie Assetów Statycznych**:
   * Assety z hashami (`/assets/*`): `Cache-Control: public, max-age=31536000, immutable`.
   * `index.html` oraz `sw.js`: `Cache-Control: no-cache, no-store, must-revalidate`.

---

## 2. Weryfikacja Zmiennych Środowiskowych

Przed i po każdym wdrożeniu na Vercel upewnij się, że w sekcji *Settings -> Environment Variables* skonfigurowane są:
* `VITE_CLERK_PUBLISHABLE_KEY`
* `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* `SUPABASE_ANON_KEY`

---

## 3. Procedura Diagnostyki Błędów Builda

1. Sprawdź logi kompilacji za pomocą Vercel CLI lub MCP:
   ```bash
   npx vercel logs
   ```
2. Jeśli występuje błąd TypeScript podczas `vite build`:
   * Uruchom lokalnie `npx tsc --noEmit` oraz `npm run lint`.
   * Upewnij się, że nie ma nieużywanych parametrów ani zmiennych lokalnych (`noUnusedLocals`, `noUnusedParameters`).
3. Po publikacji przetestuj nagłówki odpowiedzi:
   ```bash
   curl -I https://gkdevi.vercel.app/
   ```
