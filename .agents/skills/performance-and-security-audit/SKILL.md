---
name: performance-and-security-audit
description: Przeprowadza zaawansowany audyt wydajności (Core Web Vitals, INP, LCP) oraz bezpieczeństwa (Clerk Auth, CSP, nagłówki bezpieczeństwa).
---

# Performance & Security Audit Guide

Użyj tej umiejętności do analizy wydajności frontendu oraz zabezpieczeń aplikacji GK.dev.

## Obszary Audytu

### 1. Core Web Vitals
- **INP (Interaction to Next Paint)**: Sub-50ms responsywność. Unikaj ciężkich operacji synchronicznych na głównym wątku. Używaj `startTransition` lub Web Workerów.
- **LCP (Largest Contentful Paint)**: Sub-0.8s ładowanie hero elementu. Używaj `fetchpriority="high"` i dynamicznego ładowania sekcji Three.js.
- **CLS (Cumulative Layout Shift)**: Zero przesunięć layoutu (rezerwuj wysokość kontenerów, skeleton loading dla komponentów lazy).

### 2. Bezpieczeństwo i Autentykacja (Clerk)
- Sprawdź ochronę tras i komponentów za pomocą `<SignedIn>` / `<SignedOut>`.
- Upewnij się, że klucze produkcyjne Clerk (`VITE_CLERK_PUBLISHABLE_KEY`) są ładowane ze zmiennych środowiskowych.
- Weryfikuj brak wycieków danych w konsoli przeglądarki.
