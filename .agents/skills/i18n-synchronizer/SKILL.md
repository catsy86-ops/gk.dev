---
name: i18n-synchronizer
description: Weryfikuje pełną symetrię kluczy tłumaczeń pomiędzy językiem polskim i angielskim w słowniku i18n oraz wykrywa nieprzetłumaczone teksty w komponentach.
---

# i18n Synchronizer & Translation Quality Guide

Użyj tej umiejętności przy dodawaniu nowych sekcji, modalów lub zmianie tekstów w interfejsie GK.dev.

## Zasady Architektury i18n

1. **Plik Słownika**:
   - Wszystkie tłumaczenia znajdują się w `src/lib/i18n-dictionary.ts`.
   - Każdy klucz w obiekcie `Translations` MUSI posiadać odpowiednik w obu językach (`pl` i `en`).

2. **Użycie w Komponentach**:
   ```tsx
   import { useI18n } from "@/lib/i18n";

   const MyComponent = () => {
     const { t, lang } = useI18n();
     return <h1>{t.skills.title}</h1>;
   };
   ```

3. **Weryfikacja**:
   - Uruchom `npm run test` aby upewnić się, że test `src/test/i18n.test.tsx` przechodzi bezbłędnie.
