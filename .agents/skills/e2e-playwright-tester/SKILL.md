---
name: e2e-playwright-tester
description: Automatycznie uruchamia i tworzy testy End-to-End w Playwright sprawdzające kluczowe scenariusze użytkownika (formularze, nawigacja, czytnik artykułów, strefa klienta).
---

# Playwright E2E Testing Standard

Użyj tej umiejętności do uruchamiania i pisania testów integracyjnych End-to-End w środowisku Chromium.

## Uruchamianie Testów E2E

```bash
npx playwright test
```

### Tryb UI i Debugowania
```bash
npx playwright test --ui
npx playwright test --debug
```

## Kluczowe Ścieżki Testowe (Test Scenarios)
1. **Nawigacja i Responsywność**:
   - Płynne przewijanie do sekcji (`#o-mnie`, `#umiejetnosci`, `#artykuly`, `#kontakt`).
   - Otwieranie Command Palette (`Cmd+K` lub przycisk wyszukiwania).
2. **Strefa Klienta i Zakładki**:
   - Kliknięcie ikony zakładki w sekcji Artykułów dodaje wpis do Strefy Klienta.
3. **Rezerwacja Konsultacji**:
   - Otwarcie modalu `BookingConsultationModal`, wybór slotu i wysłanie formularza.
4. **Symulatory i Interaktywne Narzędzia**:
   - Przełączanie zakładek w `SkillsSection` (Radar ⇄ Symulator ⇄ Benchmark).
