# Reguły Architektoniczne & Stack Technologiczny

1. **Routing i Entry Point**:
   - `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`.
   - Single-page portfolio z React Router v6 (`/` i `*` 404).

2. **Biblioteka Animacji**:
   - ZAWSZE importuj z `motion/react` (importowanie z `framer-motion` jest zabronione).

3. **Stylizacja i Design Tokens**:
   - Wszystkie kolory motywu to zmienne CSS HSL zdefiniowane w `src/index.css` (`--primary`, `--background`, `--foreground`, `--card`, `--border`, `--secondary`).
   - Tailwind CSS v3 z pluginami `tailwindcss-animate` i `@tailwindcss/typography`.

4. **Autentykacja**:
   - Używaj `@clerk/clerk-react` opakowanego w `@/components/auth/ClerkAuthProvider.tsx`.

5. **Wielojęzyczność (i18n)**:
   - System i18n bez zewnętrznych zależności w `@/lib/i18n.ts` i `@/components/I18nProvider.tsx`.
