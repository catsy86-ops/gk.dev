# GK.dev — Portfolio & Inżynieria Oprogramowania High-Performance

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.4-f43f5e?logo=framer&logoColor=white)](https://motion.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-10b981)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **GK.dev** to nowoczesna, wysoce responsywna platforma portfolio inżyniera Fullstack / Architekta Chmurowego (Grzegorz). Stworzona z naciskiem na bezkompromisową wydajność, responsywność, dostępność (WCAG 2.1 AA), mikrointerakcje dźwiękowo-haptyczne oraz interaktywne narzędzia inżynieryjne.

---

## 📑 Spis Treści
1. [Główne Funkcjonalności & Moduły](#-główne-funkcjonalności--moduły)
2. [Architektura & Stack Technologiczny](#-architektura--stack-technologiczny)
3. [Interaktywne Narzędzia & Modale](#-interaktywne-narzędzia--modale)
4. [Dźwięk & Haptyka (Tactile UX)](#-dźwięk--haptyka-tactile-ux)
5. [Dostępność, Motywy & i18n](#-dostępność-motywy--i18n)
6. [Struktura Projektu](#-struktura-projektu)
7. [Dostępne Komendy & Skrypty](#-dostępne-komendy--skrypty)
8. [Standardy Jakościowe & Testowanie (Quality Gate)](#-standardy-jakościowe--testowanie-quality-gate)

---

## 🚀 Główne Funkcjonalności & Moduły

- **Górne Menu Nawigacyjne ([`Navbar.tsx`](src/components/Navbar.tsx))**:
  - Płynne śledzenie aktywnej sekcji (`useActiveSection`).
  - Narzędzia użytkownika: Wyszukiwarka (`Cmd+K`), Asystent AI, Strefa Klienta, Przełącznik Motywów / Kolorów Akcentu, Dźwięków, Języka (PL/EN) oraz Przycisk Logowania Clerk.
  - Dropdowny dla Umiejętności i Projektów oraz pełny arkusz mobilny.
- **Hero Section ([`HeroSection.tsx`](src/components/HeroSection.tsx))**:
  - Nowoczesna typografia `Geist` + `Instrument Serif`.
  - Pływające badge zaufania (*High Performance Architecture*, *React 19 & Next.js 15*).
  - Pasek technologii (Tech Marquee) z logotypami.
  - Interaktywny terminal kodu ([`HeroCodeTerminal.tsx`](src/components/HeroCodeTerminal.tsx)) z przełączanymi zakładkami (*Stack, Architektura, API, Metryki, Konfiguracja*).
- **Sekcja O mnie ([`AboutSection.tsx`](src/components/AboutSection.tsx))**:
  - Oś czasu z doświadczeniem komercyjnym i edukacją.
  - Holograficzne karty ze statystykami i odznaką aktywności GitHub.
- **Sekcja Umiejętności ([`SkillsSection.tsx`](src/components/SkillsSection.tsx))**:
  - **Tech Radar**: Wizualizacja radaru technologii (Adopt, Trial, Assess, Hold).
  - **Architecture Simulator**: Symulator skalowania ruchu, obciążenia CPU/RAM i buforowania Edge Cache.
  - **Database Benchmark Lab**: Porównanie opóźnień (PostgreSQL, Redis, ClickHouse, DynamoDB).
- **Portfolio Projektów ([`ProjectsSection.tsx`](src/components/ProjectsSection.tsx))**:
  - Filtrowanie według kategorii (*SaaS, E-Commerce, Mobile, Web*).
  - Karty projektów z metrykami inżynieryjnymi, tagami i podglądem w modalu.
- **Baza Wiedzy & Artykuły ([`ArticlesSection.tsx`](src/components/ArticlesSection.tsx))**:
  - Wyszukiwarka i filtry kategorii.
  - Modalny czytnik artykułów ([`ArticleReaderModal.tsx`](src/components/ArticleReaderModal.tsx)) z podświetlaniem składni i kopiowaniem kodu.
  - Możliwość dodawania artykułów do zakładek w Strefie Klienta.
- **Opinie & Rekomendacje ([`ReviewsSection.tsx`](src/components/ReviewsSection.tsx))**:
  - Referencje od klientów z mierzalnymi wynikami biznesowymi.
- **Sekcja Kontakt ([`ContactSection.tsx`](src/components/ContactSection.tsx))**:
  - Wybór tematów rozmowy (*SaaS, MVP, Refaktoryzacja, Konsultacja*).
  - Sanityzacja danych przeciw XSS oraz walidacja regex RFC 5322.
  - Szybkie narzędzia: Kalkulator Wyceny oraz Generator RFP B2B.
- **Stopka ([`Footer.tsx`](src/components/Footer.tsx))**:
  - Zegar czasu rzeczywistego dla Szczecina (CET).
  - Status dostępności do nowych zleceń.
  - Płynny powrót na górę strony z animacją spring i dźwiękiem chime.

---

## 🛠 Architektura & Stack Technologiczny

| Kategoria | Technologia | Zastosowanie |
|---|---|---|
| **Core Framework** | React 18.3 + TypeScript 5.6 | Deklaratywny interfejs, ścisłe typowanie (`strict: true`) |
| **Budowanie & Bundling** | Vite 5.4 | Ultra-szybki HMR, Rollup code-splitting na chunki (`vendor-react`, `vendor-motion`, `vendor-radix`) |
| **Style & UI** | Tailwind CSS 3.4 + Radix UI | Klasy narzędziowe, system tokenów HSL w `src/index.css`, bezstylowe prymitywy A11y |
| **Animacje** | Motion (`motion/react`) | Płynne wejścia, layout animations, spring physics, gesty dotykowe |
| **Grafika 3D** | Three.js + React Three Fiber / Drei | Lazy-loaded trójwymiarowe elementy tła i matryce |
| **Autoryzacja** | Clerk React (`@clerk/clerk-react`) | Bezpieczne logowanie, Strefa Klienta, zarządzanie profilem |
| **Wielojęzyczność** | Własny silnik i18n (`src/lib/i18n.tsx`) | 100% symetryczny słownik PL / EN z natychmiastowym przełączaniem |
| **Testowanie** | Vitest + Testing Library + Playwright | 42 pakiety testów jednostkowych (101 testów) + testy E2E |

---

## 🪟 Interaktywne Narzędzia & Modale

Wszystkie okna dialogowe montowane są przez `createPortal(..., document.body)` i chronione przed layout shiftem za pomocą hooka `useScrollLock`:

1. **`BookingConsultationModal`**: Rezerwacja slotu 1:1, wybór tematu, terminu i automatyczny zapis.
2. **`AiAssistantDialog`**: Lokalny asystent AI (*GK AI Architect*) odpowiadający na pytania dotyczące stacku, stawek i dostępności.
3. **`ClientPortalModal`**: Strefa klienta przechowująca zapisane artykuły, zapytania ofertowe oraz rezerwacje.
4. **`CommandPalette` (`Cmd+K`)**: Szybka wyszukiwarka globalna ze skrótami klawiszowymi do wszystkich podstron i akcji.
5. **`ProjectEstimatorModal`**: 3-etapowy kalkulator estymacji budżetu i czasu realizacji projektu.
6. **`B2bProposalModal`**: Generator specyfikacji technicznej RFP z opcją wklejenia do wiadomości.
7. **`TerminalDialog`**: Interaktywny shell CLI z komendami (`help`, `skills`, `projects`, `contact`, `matrix`, `clear`).
8. **`ArticleReaderModal`**: Czytnik artykułów technicznych z blokami kodu i podziałem sekcji.
9. **`MobileQuickActions`**: Dolny wysuwany panel szybkiego kontaktu i udostępniania na urządzeniach mobilnych.

---

## 🔊 Dźwięk & Haptyka (Tactile UX)

- **Silnik Syntezy Dźwięku ([`src/lib/audio.ts`](src/lib/audio.ts))**:
  - Działa w oparciu o Web Audio API bez zewnętrznych plików MP3/WAV.
  - Dźwięki: `playClick`, `playPop`, `playChime`, `playSuccess`.
  - Możliwość wyciszenia jednym kliknięciem w menu głównym.
- **Silnik Wibracji Mobilnych ([`src/lib/haptics.ts`](src/lib/haptics.ts))**:
  - Wykorzystuje `navigator.vibrate` na Android/iOS.
  - Profile wibracji: `hapticLight`, `hapticMedium`, `hapticSuccess`, `hapticWarning`, `hapticError`, `hapticSelection`.

---

## 🌐 Dostępność, Motywy & i18n

- **WCAG 2.1 AA Compliance**:
  - Pełna nawigacja z klawiatury (`:focus-visible` ring).
  - Wyraźne atrybuty `role="dialog"`, `aria-modal="true"`, `aria-invalid` oraz `role="alert"` w formularzach.
  - Minimalny kontrast tekstu 4.5:1.
- **Wielojęzyczność (i18n)**:
  - W pełni zsynchronizowane słowniki PL i EN w [`src/lib/i18n-dictionary.ts`](src/lib/i18n-dictionary.ts).
- **Personalizacja Wyglądu**:
  - Tryb Ciemny / Jasny / Systemowy (`next-themes`).
  - Paleta 5 kolorów akcentu: Błękit (*Default Blue*), Szmaragd (*Emerald*), Fiolet (*Purple*), Bursztyn (*Amber*), Cyjan (*Cyan*).

---

## 📁 Struktura Projektu

```text
GK.dev/
├── .agents/skills/          # Autonomiczne umiejętności Gemini / AI Agents
├── e2e/                     # Testy End-to-End Playwright
├── public/                  # Statyczne zasoby (cv.pdf, favikony, manifest)
├── src/
│   ├── components/          # Główne sekcje strony i modale interaktywne
│   │   ├── ui/              # Komponenty bazowe shadcn/ui & tokeny designu
│   │   ├── Navbar.tsx       # Górne menu nawigacyjne
│   │   ├── HeroSection.tsx  # Główna sekcja powitalna
│   │   ├── AboutSection.tsx # Sekcja O mnie i doświadczenie
│   │   ├── SkillsSection.tsx# Tech Radar & Symulatory
│   │   ├── ProjectsSection.tsx # Portfolio projektów
│   │   ├── ArticlesSection.tsx # Baza wiedzy i artykuły
│   │   ├── ContactSection.tsx  # Formularz kontaktowy
│   │   └── Footer.tsx       # Stopka z zegarem CET i statusem
│   ├── hooks/               # Custom React hooks (useScrollLock, useMagnetic, useActiveSection)
│   ├── lib/                 # Logika pomocnicza (audio, haptics, validation, ai-engine, i18n)
│   ├── pages/               # Strony React Router (Index, NotFound)
│   ├── test/                # Zestaw 42 pakietów testowych Vitest
│   ├── App.tsx              # Główny kontener aplikacji z providerami
│   ├── index.css            # Zmienne kolorystyczne HSL & reguły bazowe Tailwind
│   └── main.tsx             # Punkt startowy aplikacji
├── skills.md                # Instrukcje obsługi Agent Skills
├── AGENTS.md                # Standardy architektoniczne dla AI agentów
├── vite.config.ts           # Konfiguracja Vite & optymalizacja chunków
└── package.json             # Zależności i skrypty npm
```

---

## ⌨️ Dostępne Komendy & Skrypty

```bash
# Uruchomienie lokalnego serwera deweloperskiego (port 8080)
npm run dev

# Kompilacja sprawdzająca TypeScript bez generowania plików
npx tsc --noEmit

# Statyczna analiza kodu ESLint (0 błędów i 0 ostrzeżeń)
npm run lint

# Uruchomienie kompletnego pakietu testów jednostkowych Vitest
npm run test

# Uruchomienie testów Vitest w trybie watch
npm run test:watch

# Uruchomienie testów End-to-End Playwright (Chromium)
npx playwright test

# Kompilacja produkcyjna Vite (generuje zoptymalizowany katalog dist/)
npm run build

# Podgląd zbudowanej aplikacji produkcyjnej
npm run preview
```

---

## 🏆 Standardy Jakościowe & Testowanie (Quality Gate)

Aplikacja podlega rygorystycznemu procesowi weryfikacji przed każdym wdrożeniem:

1. **TypeScript Compiler (`tsc --noEmit`)**: 0 błędów, egzekwowanie `noUnusedLocals` i `noUnusedParameters`.
2. **Linter (`eslint .`)**: 0 błędów, 0 ostrzeżeń.
3. **Vitest Unit & Integration Tests**: 42 pakiety testowe (101/101 testów zaliczonych).
4. **Vite Production Build**: Pomyślne wygenerowanie zoptymalizowanych chunków vendorów.

---

© 2026 **GK.dev** • Stworzone z pasją i rygorystycznym Clean Code w Szczecinie.
