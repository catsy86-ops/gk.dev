---
name: component-architect
description: Tworzy nowe komponenty interfejsu zgodne ze standardami projektowymi GK.dev (Tailwind, motion/react, tokens HSL, i18n, sound, haptics, testy Vitest).
---

# Component Architect & Design System Standard

Użyj tej umiejętności przy tworzeniu lub modyfikacji komponentów UI w aplikacji GK.dev.

## Standardy Tworzenia Komponentów

1. **Animacje**:
   - ZAWSZE importuj z `motion/react` (NIGDY z `framer-motion`).
   - Używaj sprężynowych przejść: `transition={{ type: "spring", stiffness: 350, damping: 30 }}`.

2. **Dźwięk i Haptyka**:
   - Dla akcji klikalnych wywołuj `soundEngine.playPop(...)` lub `soundEngine.playClick()` z `@/lib/audio`.
   - Dla urządzeń dotykowych wywołuj `hapticLight()` lub `hapticSelection()` z `@/lib/haptics`.

3. **Wielojęzyczność (i18n)**:
   - Używaj hooka `useI18n()` z `@/lib/i18n` i dodawaj klucze do słownika w `@/lib/i18n-dictionary.ts`.

4. **Dostępność cyfrowa (A11y)**:
   - Dodawaj `aria-label`, `role`, `aria-expanded` dla przycisków interaktywnych.
   - Pamiętaj o widocznych stanach `focus-visible:ring-2 focus-visible:ring-primary`.

5. **Testy jednostkowe**:
   - Każdy nowy komponent MUSI posiadać odpowiadający plik testowy w `src/test/[ComponentName].test.tsx`.
