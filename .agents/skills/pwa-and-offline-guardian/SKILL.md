---
name: pwa-and-offline-guardian
description: >-
  Audytuje i zarządza funkcjami Progressive Web App (PWA) w projekcie GK.dev.
  Weryfikuje Service Workera (public/sw.js), strategie pamięci podręcznej Cache Storage,
  plik manifestu (manifest.webmanifest), ikony aplikacji, prompt instalacji (PwaInstallPrompt)
  oraz działanie w trybie offline i zgodność z Google Lighthouse.
---

# PWA & Offline Guardian (`pwa-and-offline-guardian`)

Ten skill definiuje procedury weryfikacji i optymalizacji aplikacji **Progressive Web App (PWA)** w projekcie **GK.dev**.

---

## 1. Architektura PWA w GK.dev

1. **Rejestracja Service Workera (`src/hooks/use-pwa.ts`)**:
   * Rejestruje `/sw.js` wyłącznie w środowisku przeglądarki i poza testami jednostkowymi (`process.env.NODE_ENV !== "test"`).
   * Obsługuje zdarzenia `beforeinstallprompt` i przekazuje trigger instalacji do komponentu `PwaInstallPrompt.tsx`.
2. **Strategie Pamięci Podręcznej (`public/sw.js`)**:
   * **Cache-First / Stale-While-Revalidate**: Dla statycznych grafik SVG, czcionek i arkuszy stylów.
   * **Network-First**: Dla zapytań API (Supabase, Clerk) i dokumentu HTML strony głównej.
3. **Plik Manifestu (`public/manifest.webmanifest`)**:
   * Zgodny ze specyfikacją W3C Web App Manifest:
     * `name`: "GK.dev — Senior Full-Stack & AI Architect"
     * `short_name`: "GK.dev"
     * `display`: "standalone"
     * `start_url`: "/"
     * Ikony: `icon-192.svg` (192x192) oraz `icon-512.svg` (512x512 maskable).

---

## 2. Lista Kontrolna Audytu PWA

* [ ] Manifest jest prawidłowo podlinkowany w `<head>` pliku `index.html`.
* [ ] Service Worker nie blokuje przeładowań HMR w trybie deweloperskim.
* [ ] Komponent `PwaInstallPrompt` wyświetla się w sposób nieinwazyjny na urządzeniach mobilnych.
* [ ] Aplikacja poprawnie obsługuje `offline` event i informuje użytkownika o braku sieci.
