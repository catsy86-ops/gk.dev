# Standardy Czystego Kodu & Lintera

1. **Rygorystyczny TypeScript**:
   - `noUnusedLocals: true` i `noUnusedParameters: true` są włączone w `tsconfig.json` – nieużywane zmienne powodują błąd kompilacji.
   - `strict: true` i `noImplicitAny: true` są wymagane.

2. **Zgodność z Vite React Fast Refresh**:
   - Pliki `.tsx` mogą eksportować WYŁĄCZNIE komponenty Reacta.
   - Wszystkie stałe, konfiguracje, interfejsy i funkcje walidacji/pomocnicze muszą być eksportowane z dedykowanych plików `.ts` (np. `src/lib/validation.ts`, `src/lib/theme.ts`, `src/components/ui/*-variants.ts`).

3. **Zero Ostrzeżeń Lintera**:
   - `npm run lint` musi zawsze zwracać `0 problems (0 errors, 0 warnings)`.
