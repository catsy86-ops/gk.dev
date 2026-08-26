---
name: quality-gate
description: Uruchamia kompletny audyt jakościowy kodu (ESLint, Vitest, TypeScript, Vite Production Build) i generuje raport weryfikacji.
---

# Quality Gate & Deployment Verification Workflow

Użyj tej umiejętności przed zatwierdzeniem zmian, wdrożeniem produkcyjnym lub po większym refactoringu aplikacji GK.dev.

## Procedura Krok po Kroku

### 1. Weryfikacja Lintera (ESLint & Fast Refresh)
```bash
npm run lint
```
- Upewnij się, że wynik zwraca **0 błędów i 0 ostrzeżeń**.
- Zwróć szczególną uwagę na regułę `react-refresh/only-export-components` – nie eksportuj stałych ani funkcji pomocniczych z plików komponentów `.tsx`.

### 2. Testy Jednostkowe & Regresyjne (Vitest)
```bash
npm run test
```
- Upewnij się, że wszystkie pliki testowe (`src/test/*.test.{ts,tsx}`) przechodzą w 100%.
- Sprawdź, czy mocki w `src/test/setup.ts` (Canvas 2D, Clerk React, matchMedia, IntersectionObserver) nie zgłaszają błędów na strumieniu `stderr`.

### 3. Kompilacja Produkcyjna & Bundle Size Analysis (Vite & Rollup)
```bash
npm run build
```
- Sprawdź, czy kompilacja TypeScript nie zgłasza nieużywanych zmiennych (`noUnusedLocals: true`, `noUnusedParameters: true`).
- Zweryfikuj podział na chunki (`vendor-react`, `vendor-motion`, `vendor-radix`, `index`).
