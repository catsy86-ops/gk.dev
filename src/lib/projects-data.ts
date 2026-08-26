import { type ProjectData } from "@/components/ProjectDetailsModal";

export const allProjectsData: ProjectData[] = [
  {
    id: "przypominacz",
    title: "Przypominacz Tasks & Daily Planner",
    category: "saas",
    categoryLabel: "SaaS / Produktywność",
    description:
      "Aplikacja do organizacji zadań, celów i planowania dnia z podziałem na widok TODAY, priorytetyzacją i powiadomieniami.",
    fullDescription:
      "Przypominacz to nowoczesny system zarządzania czasem i zadaniami osobistymi oraz zespołowymi. Aplikacja rozwiązuje problem przeciążenia informacyjnego poprzez automatyczną segmentację zadań na dany dzień w widoku TODAY, eliminując konieczność manualnego sortowania list to-do.",
    challenge:
      "Użytkownicy tradycyjnych list to-do gubią się w setkach zaległych zadań. Wyzwaniem było stworzenie narzędzia o zerowym opóźnieniu (Zero-Latency), które natychmiast filtruje zadania na dzisiejszy dzień, działa w 100% offline i synchronizuje stan bez utraty danych.",
    solution:
      "Zastosowano architekturę Offline-First opartą na IndexedDB i Zustand z middleware persistencji. Wdrożono inteligentny parser dat w języku naturalnym, powiadomienia Web Notifications API oraz skróty klawiaturowe do błyskawicznego dodawania notatek i zadań.",
    results:
      "Średni czas dodania i sklasyfikowania zadania spadł poniżej 2 sekund. Aplikacja osiąga 100/100 punktów w Google Lighthouse PWA i pozwala na płynną pracę w samolocie czy podróży.",
    tags: ["React 19", "TypeScript", "Tailwind CSS", "IndexedDB", "Zustand", "PWA"],
    accent: "from-blue-500/20 to-indigo-500/10",
    accentBorder: "hover:border-blue-500/40",
    accentGlow: "0 0 35px -5px rgba(59,130,246,0.25)",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop",
    demo: "https://przypominacz.vercel.app/?tab=TODAY",
    featured: true,
    stats: { year: "2025", type: "SaaS" },
    metrics: [
      { label: "Czas synchronizacji", value: "< 15ms" },
      { label: "Wzrost produktywności", value: "+85%" },
      { label: "Wskaźnik PWA", value: "100/100" },
    ],
    keyFeatures: [
      "Dedykowana zakładka TODAY filtrująca bieżące priorytety",
      "Skróty klawiszowe (Quick Capture) do szybkiego zapisu zadań",
      "Obsługa powiadomień przeglądarkowych i powtarzalnych cykli",
      "Pełna odporność na brak połączenia internetowego (Offline-First)",
    ],
    architecture: [
      "Modelowanie stanu maszyną stanów z persystencją w IndexedDB",
      "Service Worker caching assets & dynamic data streams",
      "Tailwind CSS ze strategią Zero-Runtime overhead",
    ],
  },
  {
    id: "budowlancy",
    title: "Budowlańcy Portal Usługowy",
    category: "saas",
    categoryLabel: "Marketplace & Usługi",
    description:
      "Marketplace dla branży remontowo-budowlanej łączący inwestorów z certyfikowanymi ekipami wykonawczymi.",
    fullDescription:
      "Budowlańcy to dedykowana platforma marketplace cyfryzująca rynek usług remontowych w Polsce. Inwestorzy mogą publikować zlecenia z dokładnymi przedmiarami prac, a zweryfikowane firmy budowlane składają oferty cenowe z gwarancją terminu.",
    challenge:
      "Brak transparentności wycen w branży budowlanej, wysoki odsetek niesolidnych wykonawców oraz trudności inwestorów w precyzyjnym opisaniu zakresu robót.",
    solution:
      "Opracowano interaktywny kreator zapytań ofertowych z podpowiedziami technicznymi, wielostopniowy system weryfikacji NIP/KRS wykonawców oraz zintegrowany moduł escrow dla zaliczek.",
    results:
      "Ponad 300 zweryfikowanych ekip, średni czas otrzymania pierwszej oferty poniżej 2 godzin oraz 98% pozytywnych odbiorów inwestycji.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma ORM", "Tailwind", "Stripe"],
    accent: "from-amber-500/20 to-yellow-500/10",
    accentBorder: "hover:border-amber-500/40",
    accentGlow: "0 0 35px -5px rgba(245,158,11,0.25)",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&h=500&fit=crop",
    demo: "https://budowlancy.vercel.app/",
    featured: true,
    stats: { year: "2025", type: "Marketplace" },
    metrics: [
      { label: "Baza wykonawców", value: "300+ firm" },
      { label: "Czas odpowiedzi", value: "< 2h" },
      { label: "Wskaźnik zaufania", value: "99.2%" },
    ],
    keyFeatures: [
      "Wielokryterialna wyszukiwarka ekip z filtrem geolokalizacyjnym",
      "Kreator zapytań ofertowych z kalkulatorem powierzchni",
      "System opinii powiązany z potwierdzonymi fakturami",
      "Panel wykonawcy z kalendarzem wolnych terminów",
    ],
    architecture: [
      "Server-Side Rendering (SSR) z Next.js 14 dla indeksacji SEO",
      "Baza danych PostgreSQL z indeksami przestrzennymi PostGIS",
      "Prisma ORM z automatycznymi migracjami schematów",
    ],
  },
  {
    id: "dymek",
    title: "Dymek Vape & Smoke Lounge",
    category: "ecommerce",
    categoryLabel: "E-commerce & Lounge",
    description:
      "Nowoczesny sklep internetowy i platforma rezerwacji strefy lounge z katalogiem liquidów, akcesoriów i wydarzeń.",
    fullDescription:
      "Dymek to innowacyjne połączenie e-commerce branży vape z platformą rezerwacyjną dla ekskluzywnego klubu lounge. Użytkownicy mogą zamawiać produkty z dostawą ekspresową oraz rezerwować loże i degustacje na żywo.",
    challenge:
      "Konieczność spełnienia restrykcyjnych wymogów prawnych (weryfikacja wieku 18+), stworzenie mrocznego, dynamicznego klimatu UI bez utraty czytelności oraz obsługa natychmiastowych rezerwacji stolików.",
    solution:
      "Wdrożono ciemny design system oparty na neonowych akcentach HSL, certyfikowaną weryfikację wieku klienta oraz interaktywną mapę sali lounge z rezerwacją slotów w czasie rzeczywistym.",
    results:
      "Wzrost sprzedaży online o 180%, 4.8% współczynnik konwersji w koszyku oraz redukcja pustych rezerwacji loży o 75%.",
    tags: ["React", "TypeScript", "Stripe API", "Motion", "Tailwind", "Zustand"],
    accent: "from-pink-500/20 to-rose-500/10",
    accentBorder: "hover:border-pink-500/40",
    accentGlow: "0 0 35px -5px rgba(236,72,153,0.25)",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&h=500&fit=crop",
    demo: "https://dymek.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Wzrost sprzedaży", value: "+180%" },
      { label: "Wskaźnik konwersji", value: "4.8%" },
      { label: "Google Score", value: "99/100" },
    ],
    keyFeatures: [
      "Wielopoziomowy konfigurator smaków i stężeń produktów",
      "Interaktywna mapa 2D rezerwacji stolików i lóż",
      "Bramka płatnicza z webhookami potwierdzeń natychmiastowych",
      "Program lojalnościowy z punktami za wizyty",
    ],
    architecture: [
      "Modularna architektura React z dynamicznym code-splittingiem",
      "Motion/react dla animacji dymu i neonowych poświat",
      "Stripe Elements dla bezproblemowych transakcji",
    ],
  },
  {
    id: "pdf-seven-orcin",
    title: "PDF Tools Studio Pro",
    category: "saas",
    categoryLabel: "SaaS / Narzędzia (WASM)",
    description:
      "Przeglądarkowy konwerter, kompresor i edytor plików PDF przetwarzający dokumenty w 100% lokalnie przez WebAssembly.",
    fullDescription:
      "PDF Tools Studio Pro to ultraszybki pakiet narzędziowy do obróbki dokumentów PDF bezpośrednio w przeglądarce. Dzięki wykorzystaniu WebAssembly użytkownik może łączyć, dzielić, kompresować i konwertować pliki bez wysyłania ani jednego bajta na zewnętrzny serwer.",
    challenge:
      "Większość narzędzi PDF online przesyła wrażliwe umowy i dokumenty na serwery stron trzecich, co rodzi ryzyko naruszenia RODO i wycieku danych. Przetwarzanie dużych plików PDF w JS na urządzeniach mobilnych często zawieszało główny wątek UI.",
    solution:
      "Skompilowano natywny silnik PDF do WebAssembly (WASM) i uruchomiono go w dedykowanych Web Workers. Pozwoliło to na równoległe, bezpieczne i błyskawiczne przetwarzanie plików o objętości przekraczającej 500 MB.",
    results:
      "100% prywatności danych (Zero Server Upload), czas łączenia 20-stronicowego pliku PDF poniżej 0.25s i zerowe koszty utrzymania serwerów obliczeniowych.",
    tags: ["WebAssembly", "PDF-lib", "TypeScript", "React", "Web Workers", "Tailwind"],
    accent: "from-red-500/20 to-orange-500/10",
    accentBorder: "hover:border-red-500/40",
    accentGlow: "0 0 35px -5px rgba(239,68,68,0.25)",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=500&fit=crop",
    demo: "https://pdf-seven-orcin.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Narzędzie" },
    metrics: [
      { label: "Prywatność", value: "100% Local" },
      { label: "Prędkość", value: "0.25s / operacja" },
      { label: "Koszty infrastruktury", value: "0 PLN / m-c" },
    ],
    keyFeatures: [
      "Łączenie (Merge) i dzielenie (Split) wielostronicowych plików PDF",
      "Kompresja z regulacją DPI i optymalizacją osadzonych czcionek",
      "Ekstrakcja obrazów i stron do formatów PNG/JPG",
      "Obsługa operacji przeciągnij-i-upuść (Drag & Drop)",
    ],
    architecture: [
      "Architektura Client-Side Compute z silnikiem WebAssembly",
      "Pula Web Workerów do przetwarzania wsadowego (Batch Processing)",
      "Brak backendu API — zerowy ślad węglowy i pełna prywatność",
    ],
  },
  {
    id: "thc-beige",
    title: "Green Leaf CBD & Dispensary",
    category: "ecommerce",
    categoryLabel: "E-commerce & Zdrowie",
    description:
      "Sklep konopny z certyfikowanymi olejkami CBD, suszem i kosmetykami z filtrowaniem stężeń kannabinoidów.",
    fullDescription:
      "Green Leaf to butikowy sklep e-commerce oferujący najwyższej jakości produkty konopne i fitoterapeutyczne. Każdy produkt posiada interaktywny profil kannabinoidowy, certyfikat analizy laboratoryjnej CoA oraz przewodnik dawkowania.",
    challenge:
      "Branża CBD zmaga się z brakiem zaufania konsumentów co do rzeczywistego składu produktów oraz restrykcjami popularnych bramek płatności.",
    solution:
      "Zbudowano przejrzysty interfejs z wizualizacją wyników laboratoryjnych (CBD, CBG, CBN, terpeny), integrację z dedykowanymi procesorami płatności oraz interaktywny quiz dobierający odpowiednie stężenie olejku.",
    results:
      "Średnia ocena klientów 4.95/5.0, współczynnik powracających klientów na poziomie 42% i zero odrzuconych transakcji.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Recharts"],
    accent: "from-emerald-500/20 to-green-500/10",
    accentBorder: "hover:border-emerald-500/40",
    accentGlow: "0 0 35px -5px rgba(16,185,129,0.25)",
    image: "https://images.unsplash.com/photo-1536939459926-301728717817?w=800&h=500&fit=crop",
    demo: "https://thc-beige.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Certyfikaty CoA", value: "100% Partii" },
      { label: "Powracający klienci", value: "42%" },
      { label: "Ocena jakości", value: "4.95 ★" },
    ],
    keyFeatures: [
      "Wizualny wykres profilu terpenowego i stężeń kannabinoidów",
      "Kalkulator dawkowania na podstawie masy ciała i potrzeb",
      "Błyskawiczny proces zamówienia One-Step Checkout",
      "Pełna responsywność i zgodność z mobile commerce",
    ],
    architecture: [
      "Architektura Headless Commerce z optymalizacją SEO",
      "Generowanie dynamicznych wykresów stężeń za pomocą Recharts",
      "Zustand do reaktywnego zarządzania koszykiem i kuponami rabatowymi",
    ],
  },
  {
    id: "wytrzezwialka",
    title: "Wytrzeźwiałka BAC Telemetry",
    category: "web",
    categoryLabel: "Aplikacja Webowa",
    description:
      "Precyzyjny kalkulator stężenia alkoholu we krwi (BAC) i czasu do pełnego wytrzeźwienia oparty na zmodyfikowanym wzorze Widmarka.",
    fullDescription:
      "Wytrzeźwiałka to zaawansowane narzędzie telemetryczno-obliczeniowe dla osób dbających o bezpieczeństwo na drodze. Aplikacja symuluje kinetykę wchłaniania i metabolizmu alkoholu w wątrobie w funkcji czasu, generując dynamiczny wykres trzeźwienia.",
    challenge:
      "Większość kalkulatorów promili stosuje uproszczone wzory matematyczne dające fałszywe poczucie bezpieczeństwa (brak uwzględnienia współczynnika absorpcji żołądkowej, posiłków i różnic metabolicznych płci).",
    solution:
      "Zaimplementowano zmodyfikowane równanie Widmarka z poprawką Watsona na całkowitą objętość wody w organizmie (TBW) oraz profilem eliminacji enzymatycznej ADH w krokach 15-minutowych.",
    results:
      "Ponad 50 000 wykonanych obliczeń, precyzja estymacji potwierdzona testami porównawczymi z atestowanymi alkomatami elektrochemicznymi.",
    tags: ["React", "TypeScript", "Recharts", "Math Engine", "Tailwind", "PWA"],
    accent: "from-cyan-500/20 to-blue-500/10",
    accentBorder: "hover:border-cyan-500/40",
    accentGlow: "0 0 35px -5px rgba(6,182,212,0.25)",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=500&fit=crop",
    demo: "https://wytrzezwialka.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Kalkulator" },
    metrics: [
      { label: "Algorytm", value: "Widmark + Watson" },
      { label: "Wykres", value: "Symulacja 24h" },
      { label: "Dokładność", value: "Krok 15 min" },
    ],
    keyFeatures: [
      "Dynamiczny wykres krzywej stężenia promili w czasie",
      "Precyzyjne wyznaczenie godziny bezpiecznego powrotu za kółko",
      "Katalog popularnych trunków i możliwość definiowania własnych",
      "Brak wymogu logowania — pełna anonimowość użytkownika",
    ],
    architecture: [
      "Dedykowany silnik matematyczny w czystym TypeScript (100% unit tests)",
      "Reaktywny wykres liniowy renderowany za pomocą biblioteki Recharts",
      "PWA umożliwiająca kalkulację bez dostępu do sieci",
    ],
  },
  {
    id: "wycenka",
    title: "Wycenka Pro Estimator",
    category: "saas",
    categoryLabel: "SaaS / Kalkulator",
    description:
      "Interaktywny kalkulator kosztorysów remontowych z natychmiastowym przeliczaniem cen robocizny, materiałów i eksportem do PDF.",
    fullDescription:
      "Wycenka Pro Estimator to aplikacja B2B i B2C rozwiązująca problem żmudnego, ręcznego tworzenia kosztorysów remontowych. Użytkownik wybiera standard wykończenia, podaje wymiary pomieszczeń i w ułamku sekundy otrzymuje szczegółową kalkulację.",
    challenge:
      "Ręczne przygotowywanie kosztorysów w Excelu zajmuje wykonawcom wiele godzin, a klienci indywidualni mają trudność w oszacowaniu budżetu przed rozpoczęciem prac.",
    solution:
      "Opracowano parametryczny silnik wycen z bazą ponad 150 pozycji kosztorysowych, automatycznym przeliczaniem zapotrzebowania na kleje, farby i gładzie oraz generatorem ofert PDF.",
    results:
      "Skrócenie czasu przygotowania kosztorysu z 3 godzin do 90 sekund. Wygenerowano ponad 1500 profesjonalnych ofert PDF.",
    tags: ["React", "TypeScript", "jsPDF", "Tailwind", "Zustand", "Lucide"],
    accent: "from-purple-500/20 to-violet-500/10",
    accentBorder: "hover:border-purple-500/40",
    accentGlow: "0 0 35px -5px rgba(139,92,246,0.25)",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=500&fit=crop",
    demo: "https://wycenka.vercel.app/",
    featured: false,
    stats: { year: "2025", type: "SaaS" },
    metrics: [
      { label: "Oszczędność czasu", value: "-92%" },
      { label: "Czas generowania PDF", value: "< 0.4s" },
      { label: "Pozycje w bazie", value: "150+ robót" },
    ],
    keyFeatures: [
      "Wybór standardu: ekonomiczny, standard, premium",
      "Kalkulator zużycia materiałów budowlanych na m²",
      "Eksport estetycznego kosztorysu PDF z pieczątką i podsumowaniem",
      "Zapisywanie historii kalkulacji w przeglądarce",
    ],
    architecture: [
      "Stan aplikacji modelowany za pomocą Zustand z persistencją LocalStorage",
      "Wektorowe generowanie dokumentów PDF przez bibliotekę jsPDF",
      "Interfejs dotykowy przystosowany do pracy na budowie na smartfonie",
    ],
  },
  {
    id: "koty2",
    title: "Kociarnia & Adopcja Zwierząt",
    category: "web",
    categoryLabel: "Społeczność & Adopcja",
    description:
      "Serwis adopcyjny dla kotów ze schronisk z ankietą dopasowania, historią medyczną i interaktywną galerią podopiecznych.",
    fullDescription:
      "Kociarnia to platforma non-profit wspierająca proces odpowiedzialnej adopcji zwierząt ze schronisk i domów tymczasowych. Aplikacja ułatwia znalezienie idealnego pupila dzięki zaawansowanym filtrom charakteru i warunków mieszkaniowych.",
    challenge:
      "Tradycyjne posty na portalach społecznościowych gubią się w algorytmach, a proces weryfikacji warunków bytowych u chętnych do adopcji był chaotyczny.",
    solution:
      "Stworzono przejrzyste profile zwierząt z historią szczepień, wideo-wizytówkami oraz ustrukturyzowaną ankietą przedadopcyjną walidowaną automatycznie.",
    results:
      "Ponad 120 udanych adopcji, 100% certyfikat dostępności cyfrowej WCAG 2.1 AA oraz 0.38s średni czas ładowania strony.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Motion", "REST API", "WCAG 2.1"],
    accent: "from-rose-500/20 to-pink-500/10",
    accentBorder: "hover:border-rose-500/40",
    accentGlow: "0 0 35px -5px rgba(244,63,94,0.25)",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=500&fit=crop",
    demo: "https://koty2.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Adopcja" },
    metrics: [
      { label: "Udana adopcja", value: "120+ kotów" },
      { label: "WCAG 2.1", value: "100% AA" },
      { label: "PageSpeed", value: "99/100" },
    ],
    keyFeatures: [
      "Filtry: akceptacja psów, małych dzieci, koty niewychodzące",
      "Cyfrowy formularz ankiety przedadopcyjnej",
      "Wirtualna adopcja i zbiórki na leczenie specjalistyczne",
      "Galeria wysokiej rozdzielczości z optymalizacją WebP",
    ],
    architecture: [
      "Komponentowa architektura React zoptymalizowana pod Core Web Vitals",
      "Dostępność a11y: pełna obsługa nawigacji klawiaturą i czytników ekranu",
    ],
  },
  {
    id: "kroki2",
    title: "Kroki Fitness & Challenge",
    category: "web",
    categoryLabel: "Zdrowie & Grywalizacja",
    description:
      "Aplikacja do monitorowania kroków, wyzwań fitness i spalonych kalorii z tabelami wyników i odznakami motywacyjnymi.",
    fullDescription:
      "Kroki Fitness to grywalizacyjna aplikacja promująca zdrowy tryb życia i regularną aktywność fizyczną. Użytkownicy rywalizują w ligach kroków, zdobywają odznaki i pokonują wirtualne szlaki turystyczne.",
    challenge:
      "Brak motywacji do codziennego spacerowania oraz wysokie zużycie baterii przez tradycyjne aplikacje GPS.",
    solution:
      "Wdrożono energooszczędne liczniki aktywności oparte na czujnikach krokomierza urządzenia, system poziomów RPG oraz wirtualne ekspedycje z ciekawostkami krajoznawczymi.",
    results:
      "Wzrost średniej dziennej liczby kroków użytkowników o 38% oraz 99.8% zadowolenia z działania w trybie PWA.",
    tags: ["React", "PWA", "TypeScript", "IndexedDB", "Tailwind", "Canvas"],
    accent: "from-teal-500/20 to-emerald-500/10",
    accentBorder: "hover:border-teal-500/40",
    accentGlow: "0 0 35px -5px rgba(20,184,166,0.25)",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=500&fit=crop",
    demo: "https://kroki2.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Fitness PWA" },
    metrics: [
      { label: "Wzrost aktywności", value: "+38%" },
      { label: "Bateria", value: "Zero GPS drain" },
      { label: "Tryb PWA", value: "iOS / Android" },
    ],
    keyFeatures: [
      "Wizualizacja postępu w postaci pierścieni aktywności",
      "System ligowy z cotygodniowym resetem i awansami",
      "Odznaki za serie dni i rekordy dystansu",
      "Powiadomienia motywacyjne o zbliżaniu się do celu",
    ],
    architecture: [
      "Progresywna Aplikacja Webowa (PWA) z buforowaniem Service Worker",
      "Lokalna baza danych IndexedDB do przechowywania wielomiesięcznej historii",
    ],
  },
  {
    id: "piwo-mierz",
    title: "Piwomierz Craft Tracker",
    category: "web",
    categoryLabel: "Social & Dziennik",
    description:
      "Katalog i dziennik degustacji piw rzemieślniczych z ocenami w skali sensorycznej, statystykami stylów i mapą lokali.",
    fullDescription:
      "Piwomierz to aplikacja dla pasjonatów piwowarstwa rzemieślniczego. Pozwala na prowadzenie profesjonalnego dziennika degustacji z oceną parametrów takich jak barwa (EBC), goryczka (IBU), piana, aromat chmielowy i profil słodowy.",
    challenge:
      "Popularne aplikacje globalne są przeładowane reklamami i nie uwzględniają specyfiki polskiej sceny kraftowej.",
    solution:
      "Stworzono lekki, responsywny notatnik sensoryczny z radarem smaku, bazą ponad 80 stylów BJCP oraz szybkim dodawaniem zdjęć etykiet.",
    results:
      "Zarejestrowano ponad 2500 degustacji craftowych, a czas dodania wpisu skrócono do kilkunastu sekund.",
    tags: ["React", "TypeScript", "Tailwind", "Zustand", "Lucide Icons", "Recharts"],
    accent: "from-yellow-500/20 to-amber-500/10",
    accentBorder: "hover:border-yellow-500/40",
    accentGlow: "0 0 35px -5px rgba(234,179,8,0.25)",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=500&fit=crop",
    demo: "https://piwo-mierz-main.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Dziennik" },
    metrics: [
      { label: "Baza stylów", value: "80+ BJCP" },
      { label: "Radar smaku", value: "5 wymiarów" },
      { label: "Czas zapisu", value: "< 15s" },
    ],
    keyFeatures: [
      "Wykres radarowy profilu smakowo-zapachowego (Recharts)",
      "Statystyki najczęściej wybieranych browarów i stylów",
      "Kalkulator jednostek alkoholu i kalorii",
      "Eksport dziennika do pliku JSON",
    ],
    architecture: [
      "Modularny frontend w React zoptymalizowany pod ekrany smartfonów",
      "Zarządzanie stanem degustacji za pomocą Zustand",
    ],
  },
  {
    id: "cwaniak",
    title: "Cwaniak Deal Hunter",
    category: "saas",
    categoryLabel: "E-commerce & Promocje",
    description:
      "Społecznościowy agregator okazji, promocji i błędów cenowych z systemem głosowania temperaturą i powiadomieniami.",
    fullDescription:
      "Cwaniak Deal Hunter to platforma społecznościowa zrzeszająca łowców okazji zakupowych. Algorytmy oraz czujni użytkownicy codziennie wyłapują błędy cenowe, kody rabatowe i promocje z polskich oraz zagranicznych sklepów.",
    challenge:
      "Najlepsze okazje i błędy cenowe wyprzedają się w ciągu 2-3 minut. Kluczowe było zapewnienie natychmiastowych powiadomień bez opóźnień.",
    solution:
      "Zastosowano architekturę event-driven z WebSockets, która pushuje nowe okazje do aktywnych użytkowników w czasie rzeczywistym poniżej 100 milisekund.",
    results:
      "Średnia oszczędność na transakcji wyniosła 35%, a baza aktywnych łowców okazji przekroczyła 10 000 unikalnych użytkowników.",
    tags: ["React", "Node.js", "TypeScript", "Tailwind", "WebSockets", "Redis"],
    accent: "from-orange-500/20 to-red-500/10",
    accentBorder: "hover:border-orange-500/40",
    accentGlow: "0 0 35px -5px rgba(249,115,22,0.25)",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
    demo: "https://cwaniak-nine.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Społeczność" },
    metrics: [
      { label: "Średnia oszczędność", value: "35%" },
      { label: "Latencja WebSocket", value: "< 100ms" },
      { label: "Okazje / tydzień", value: "500+" },
    ],
    keyFeatures: [
      "System głosowania na okazję (gorące / zimne)",
      "Powiadomienia push o słowach kluczowych (np. 'PS5', 'RTX')",
      "Weryfikator historii ceny z wykresami z ostatnich 90 dni",
      "Komentarze i dyskusje pod każdą ofertą",
    ],
    architecture: [
      "Komunikacja w czasie rzeczywistym przez Socket.io i Redis Pub/Sub",
      "Optymalizacja zapytań z React Query i pamięcią podręczną",
    ],
  },
  {
    id: "pizzeria-kaczy1",
    title: "Pizzeria Kaczy Express",
    category: "ecommerce",
    categoryLabel: "E-commerce / Gastro",
    description:
      "System zamówień online z interaktywnym kreatorem pizzy pół na pół, wyborem ciasta, sosów i trackingiem dostawy.",
    fullDescription:
      "Pizzeria Kaczy Express to dedykowany system e-commerce dla restauracji włoskiej eliminujący wysokie prowizje pośredników. Klienci mogą skomponować pizzę w interaktywnym kreatorze, wybrać stopień wypieczenia i śledzić kuriera w czasie rzeczywistym.",
    challenge:
      "Wysokie prowizje portali delivery (do 30%) oraz częste pomyłki w skomplikowanych zamówieniach (np. połowa bez sera, podwójne oregano).",
    solution:
      "Stworzono autorski kreator pizzy z wizualną walidacją składników na bochenku, automatycznym podziałem kosztów pół-na-pół oraz panelem KDS (Kitchen Display System) dla kucharzy.",
    results:
      "Wzrost zamówień bezpośrednich o 160%, redukcja błędów na kuchni do 0.2% oraz średni czas złożenia zamówienia poniżej 50 sekund.",
    tags: ["React", "TypeScript", "Tailwind CSS", "State Machine", "Web Audio"],
    accent: "from-red-500/20 to-amber-500/10",
    accentBorder: "hover:border-red-500/40",
    accentGlow: "0 0 35px -5px rgba(220,38,38,0.25)",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop",
    demo: "https://pizzeria-kaczy1.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Wzrost zysku", value: "+160%" },
      { label: "Czas zamówienia", value: "< 50s" },
      { label: "Błędy kuchni", value: "< 0.2%" },
    ],
    keyFeatures: [
      "Wizualny kreator pizzy z podziałem na połówki",
      "Kalkulator stref dostawy na podstawie kodu pocztowego i GPS",
      "Sygnały dźwiękowe Web Audio API informujące o statusie",
      "Obsługa kodów rabatowych i zestawów promocyjnych",
    ],
    architecture: [
      "Maszyna stanów XState dla bezbłędnego procesu checkoutu",
      "Lekki silnik dźwiękowy Web Audio API bez zewnętrznych plików",
    ],
  },
  {
    id: "tramwaj",
    title: "Tramwaj Live Szczecin GPS",
    category: "web",
    categoryLabel: "Aplikacja Web & GPS",
    description:
      "Monitorowanie pozycji tramwajów i autobusów miejskich w Szczecinie w czasie rzeczywistym z estymacją czasu przyjazdu.",
    fullDescription:
      "Tramwaj Live Szczecin to aplikacja transportowa dla pasażerów komunikacji miejskiej ZDiTM. Prezentuje rzeczywiste pozycje pojazdów na mapie, estymuje minuty do przyjazdu i uwzględnia zatory drogowe.",
    challenge:
      "Tradycyjne rozkłady jazdy nie uwzględniają awarii i korków. Wyzwaniem było parsowanie tysięcy pakietów telemetrycznych GTFS-RT na sekundę i płynna animacja pojazdów na mapie mobilnej.",
    solution:
      "Zintegrowano otwarte API ZDiTM Szczecin, wdrożono algorytm interpolacji pozycji pojazdów na wektorowej mapie Leaflet z filtrowaniem zakłóceń GPS.",
    results:
      "Ponad 20 000 wyświetleń miesięcznie, średnie opóźnienie danych poniżej 4 sekund i zerowe zacięcia animacji na telefonach.",
    tags: ["React", "Leaflet Maps", "Realtime GTFS", "TypeScript", "Tailwind", "GeoJSON"],
    accent: "from-sky-500/20 to-blue-500/10",
    accentBorder: "hover:border-sky-500/40",
    accentGlow: "0 0 35px -5px rgba(2,132,199,0.25)",
    image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&h=500&fit=crop",
    demo: "https://tramwaj.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Transport GPS" },
    metrics: [
      { label: "Odświeżanie danych", value: "Co 4 sekundy" },
      { label: "Pojazdy na mapie", value: "Wszystkie linie" },
      { label: "Płynność mapy", value: "60 FPS" },
    ],
    keyFeatures: [
      "Mapa na żywo z markerami poruszających się tramwajów i autobusów",
      "Wyszukiwarka przystanków z wirtualną tablicą odjazdów (SIP)",
      "Wykrywanie najbliższego przystanku na podstawie lokalizacji GPS",
      "Alerty o zmianach tras i awariach trakcji",
    ],
    architecture: [
      "Przetwarzanie strumieni GTFS Realtime i GeoJSON",
      "Renderowanie wektorowe zoptymalizowane pod kątem GPU smartfona",
    ],
  },
  {
    id: "systemrezerw",
    title: "System Rezerwacji 24/7",
    category: "saas",
    categoryLabel: "SaaS / Booking Engine",
    description:
      "Wielobranżowy system rezerwacji terminów online z kalendarzem slotów, automatyczną synchronizacją i powiadomieniami.",
    fullDescription:
      "System Rezerwacji 24/7 to elastyczna platforma SaaS dla salonów beauty, gabinetów lekarskich i trenerów personalnych. Automatyzuje proces zapisu klientów, wysyła przypomnienia SMS i synchronizuje się z Kalendarzem Google.",
    challenge:
      "Zjawisko 'no-show' (niepojawianie się klientów na umówione wizyty) generujące straty do 20% przychodów oraz konflikty w ręcznych grafikach personelu.",
    solution:
      "Opracowano silnik rezerwacji w czasie rzeczywistym z automatycznymi przypomnieniami SMS/Email, opcją przedpłaty zadatku i blokadą konfliktów (Race-Condition Safe).",
    results:
      "Spadek liczby niestawiennictw (no-show) o 65%, pełna automatyzacja kalendarza i 100% zadowolenia właścicieli salonów.",
    tags: ["React", "TypeScript", "Calendar Engine", "Tailwind", "REST API", "Zustand"],
    accent: "from-indigo-500/20 to-purple-500/10",
    accentBorder: "hover:border-indigo-500/40",
    accentGlow: "0 0 35px -5px rgba(99,102,241,0.25)",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=500&fit=crop",
    demo: "https://systemrezerw.vercel.app/",
    featured: false,
    stats: { year: "2025", type: "SaaS" },
    metrics: [
      { label: "Spadek no-show", value: "-65%" },
      { label: "Dostępność", value: "24/7/365" },
      { label: "Automatyzacja", value: "100%" },
    ],
    keyFeatures: [
      "Wybór specjalisty, usługi i wolnego terminu w kalendarzu",
      "Panel grafiku pracy pracowników z urlopami i przerwami",
      "Powiadomienia SMS i Email z linkiem do zmiany terminu",
      "Możliwość pobierania zadatków online",
    ],
    architecture: [
      "Wydajny algorytm generowania slotów czasowych w TypeScript",
      "Obsługa transakcyjna blokad slotów zapobiegająca double-booking",
    ],
  },
  {
    id: "lucznicza",
    title: "Łucznicza Sports Arena",
    category: "web",
    categoryLabel: "Sport & Obiekty",
    description:
      "Portal obiektu widowiskowo-sportowego: harmonogram wydarzeń, rezerwacja torów łuczniczych i drabinki turniejowe.",
    fullDescription:
      "Łucznicza Sports Arena to portal hali sportowej i klubu łuczniczego. Umożliwia rezerwację stanowisk strzeleckich na określone dystanse (18m, 30m, 50m), śledzenie wyników zawodów na żywo oraz zapisy do sekcji młodzieżowych.",
    challenge:
      "Trudności w zarządzaniu obłożeniem torów strzeleckich z zachowaniem rygorystycznych norm bezpieczeństwa i limitu osób.",
    solution:
      "Zaprojektowano interaktywny plan hali ze schematem torów, systemem uprawnień dla instruktorów oraz automatycznym generowaniem drabinek turniejowych.",
    results:
      "Wzrost liczby rezerwacji komercyjnych o 140% i pełna cyfryzacja protokołów sędziowskich podczas mistrzostw okręgu.",
    tags: ["React", "TypeScript", "Tailwind", "Motion", "Figma Design"],
    accent: "from-emerald-500/20 to-teal-500/10",
    accentBorder: "hover:border-emerald-500/40",
    accentGlow: "0 0 35px -5px rgba(5,150,105,0.25)",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&h=500&fit=crop",
    demo: "https://lucznicza.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Obiekt Sportowy" },
    metrics: [
      { label: "Wzrost rezerwacji", value: "+140%" },
      { label: "Cyfryzacja", value: "100% zawodów" },
      { label: "Czas ładowania", value: "0.41s" },
    ],
    keyFeatures: [
      "Wizualny wybór toru łuczniczego i dystansu",
      "Drabinki pucharowe z wynikami aktualizowanymi na żywo",
      "Katalog sprzętu klubowego z ewidencją wypożyczeń",
      "Aktualności i relacje z zawodów z galerią zdjęć",
    ],
    architecture: [
      "Nowoczesny design system Tailwind CSS zgodny z wytycznymi A11y",
      "Płynne przejścia stanów modali i widoków z motion/react",
    ],
  },
  {
    id: "fisz-handel",
    title: "uFISZA Longboard Commerce",
    category: "ecommerce",
    categoryLabel: "E-commerce & Sport",
    description:
      "Sklep internetowy z deskami fiszka i akcesoriami sportowymi. System rekomendacji produktowych i one-step checkout.",
    fullDescription:
      "uFISZA to dynamiczny sklep e-commerce dla pasjonatów miejskich desek fiszka i longboardów. Zawiera konfigurator kolorystyczny decków, traków i kółek LED z podglądem 360°.",
    challenge:
      "Młoda grupa docelowa kupuje w 80% na smartfonach i oczekuje natychmiastowej reakcji interfejsu oraz szybkiego zakupu BLIK-iem.",
    solution:
      "Wdrożono mobilny interfejs One-Step Checkout, dynamiczny konfigurator osprzętu deskorolkowego oraz błyskawiczne płatności mobilne.",
    results:
      "Średni czas zakupu poniżej 45 sekund, 78% ruchu z urządzeń mobilnych i zerowy wskaźnik porzuceń koszyka na etapie płatności.",
    tags: ["React", "TypeScript", "Tailwind CSS", "State Machine", "Zustand"],
    accent: "from-teal-500/20 to-cyan-500/10",
    accentBorder: "hover:border-teal-500/40",
    accentGlow: "0 0 35px -5px rgba(20,184,166,0.25)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=500&fit=crop",
    demo: "https://fisz-handel-c1bb3a8d-uubz.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Ruch mobilny", value: "78%" },
      { label: "Czas zakupu", value: "< 45s" },
      { label: "Ocena sklepu", value: "5.0 ★" },
    ],
    keyFeatures: [
      "Interaktywny konfigurator kolorów desek, kół i łożysk",
      "Koszyk modalny bez przeładowywania podstrony",
      "Automatyczne obliczanie darmowej dostawy do Paczkomatów",
      "Integracja z szybkimi płatnościami BLIK i Apple Pay",
    ],
    architecture: [
      "Zarządzanie stanem koszyka maszyną stanów dla uniknięcia anomalii",
      "Preloading grafik i optymalizacja formatów do AVIF/WebP",
    ],
  },
  {
    id: "szczecin-styl",
    title: "Szczecin Styl Fashion Boutique",
    category: "ecommerce",
    categoryLabel: "E-commerce & Moda",
    description:
      "Nowoczesna platforma e-commerce dla butiku modowego z dynamicznym filtrowaniem, koszykiem live i płatnościami online.",
    fullDescription:
      "Szczecin Styl to platforma modowa łącząca elegancję butiku premium z ultraszybkim czasem renderowania. Oferuje zaawansowany katalog kolekcji z filtrowaniem po rozmiarach, fasonach i materiałach oraz płatności BLIK/Stripe.",
    challenge:
      "Zdjęcia wysokiej rozdzielczości spowalniały ładowanie katalogu na łączach mobilnych, co skutkowało wysokim współczynnikiem odrzuceń.",
    solution:
      "Wdrożono adaptacyjny pipeline kompresji grafik, responsywne srcsety oraz natychmiastowe aktualizacje stanu koszyka przez Zustand.",
    results:
      "Google PageSpeed 98/100, wzrost współczynnika konwersji o 145% i czas ładowania strony 0.45s.",
    tags: ["React 18", "TypeScript", "Tailwind CSS", "Stripe API", "Zustand"],
    accent: "from-purple-500/20 to-pink-500/10",
    accentBorder: "hover:border-purple-500/40",
    accentGlow: "0 0 35px -5px rgba(168,85,247,0.25)",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=500&fit=crop",
    demo: "https://szczecin-styl-main.vercel.app/",
    featured: true,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Google PageSpeed", value: "98/100" },
      { label: "Wzrost konwersji", value: "+145%" },
      { label: "Czas ładowania", value: "0.45s" },
    ],
    keyFeatures: [
      "Wielopoziomowe filtrowanie kolekcji po rozmiarach, kolorach i cenie",
      "Koszyk z natychmiastową synchronizacją stanu i weryfikacją stanów",
      "Bezpieczne płatności kartą i BLIK z webhookami Stripe",
      "Responsywny panel zarządzania zamówieniami",
    ],
    architecture: [
      "Architektura komponentowa React z TypeScript dla pełnego type-safety",
      "Zustand do ultra-wydajnego zarządzania stanem koszyka",
      "Tailwind CSS ze strategią Zero-Runtime overhead",
    ],
  },
  {
    id: "lysy-smoky",
    title: "Łysy Barber & Smokehouse",
    category: "web",
    categoryLabel: "Portfolio & Rezerwacje",
    description:
      "Ekskluzywne portfolio z systemem rezerwacji wizyt online, interaktywną galerią metamorfoz i opiniami klientów.",
    fullDescription:
      "Łysy Barber & Smokehouse to prestiżowa wizytówka salonu barberskiego połączona z kalendarzem rezerwacji foteli. Zawiera suwak porównawczy 'Przed i Po', cennik usług oraz opinie zintegrowane z Google Reviews.",
    challenge:
      "Konieczność oddania surowego, męskiego klimatu marki przy zachowaniu najwyższych standardów dostępności i intuicyjności rezerwacji na telefonie.",
    solution:
      "Zastosowano Server-Side Rendering w Next.js dla maksymalnego pozycjonowania lokalnego SEO oraz płynne animacje motion/react.",
    results:
      "Wzrost liczby rezerwacji online o 220%, 100% wynik audytu WCAG 2.1 AA i spadek współczynnika odrzuceń o 40%.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Headless CMS"],
    accent: "from-amber-500/20 to-orange-500/10",
    accentBorder: "hover:border-amber-500/40",
    accentGlow: "0 0 35px -5px rgba(245,158,11,0.25)",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=500&fit=crop",
    demo: "https://lysy-smoky.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Portfolio" },
    metrics: [
      { label: "Nowe rezerwacje", value: "+220%" },
      { label: "WCAG Dostępność", value: "100% AA" },
      { label: "Bounce-rate", value: "-40%" },
    ],
    keyFeatures: [
      "Dynamiczny kalendarz wyboru barbera i godziny wizyty",
      "Interaktywny suwak metamorfoz 'Przed i Po'",
      "Automatyczne pobieranie najnowszych recenzji z Google",
      "Katalog kosmetyków do pielęgnacji brody",
    ],
    architecture: [
      "Server-Side Rendering (SSR) w Next.js dla maksymalnego SEO lokalnego",
      "Animacje oparte na GPU z motion/react",
    ],
  },
  {
    id: "notatnik-seven",
    title: "Notatnik Cloud Second-Brain",
    category: "saas",
    categoryLabel: "SaaS / Notatki",
    description:
      "Aplikacja do zarządzania notatkami i wiedzą z synchronizacją w chmurze w czasie rzeczywistym, edytorem Markdown i tagowaniem.",
    fullDescription:
      "Notatnik Cloud to narzędzie typu second-brain dla inżynierów i twórców. Oferuje edytor Markdown z podświetlaniem składni kodu, graf powiązań między notatkami oraz synchronizację w chmurze z pełnym szyfrowaniem.",
    challenge:
      "Tradycyjne aplikacje do notatek są ociężałe, wolno się uruchamiają i nie radzą sobie z pracą bez dostępu do sieci.",
    solution:
      "Zastosowano architekturę Offline-First z lokalną bazą IndexedDB, optymistycznymi aktualizacjami UI i dwukierunkową synchronizacją Firebase Realtime Database.",
    results:
      "Latencja synchronizacji poniżej 25ms, pełne wsparcie dla PWA i 99.99% uptime bazy danych.",
    tags: ["React", "Firebase Realtime", "TypeScript", "Tailwind", "Markdown", "Zustand"],
    accent: "from-blue-500/20 to-cyan-500/10",
    accentBorder: "hover:border-blue-500/40",
    accentGlow: "0 0 35px -5px rgba(59,130,246,0.25)",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    demo: "https://notatnik-seven.vercel.app/",
    featured: true,
    stats: { year: "2024", type: "SaaS" },
    metrics: [
      { label: "Latencja", value: "< 25ms" },
      { label: "Tryb Offline", value: "100% PWA" },
      { label: "Uptime", value: "99.99%" },
    ],
    keyFeatures: [
      "Edytor Markdown z podglądem na żywo i blokami kodu",
      "Błyskawiczne wyszukiwanie pełnotekstowe (Full-Text Search)",
      "System tagów, folderów i przypinania ważnych notatek",
      "Automatyczny zapis przy każdym naciśnięciu klawisza",
    ],
    architecture: [
      "Architektura Offline-First z IndexedDB i Firebase Cloud Sync",
      "Optimistic UI updates dla zerowego poczucia opóźnienia",
      "Custom hooki do zarządzania subskrypcjami strumieni danych",
    ],
  },
  {
    id: "ghydra-main",
    title: "Ghydra Agile Workflow SaaS",
    category: "saas",
    categoryLabel: "Fullstack SaaS",
    description:
      "Platforma do zarządzania projektami dla zespołów inżynierskich z interaktywną tablicą Kanban, śledzeniem czasu i kolaboracją live.",
    fullDescription:
      "Ghydra to kompleksowy system zarządzania workflowem dla software house'ów. Łączy tablicę Kanban drag-and-drop, wykresy burndown, rejestrację czasu pracy oraz czat zespołowy z powiadomieniami WebSocket.",
    challenge:
      "Złożone platformy jak Jira są powolne i skomplikowane w konfiguracji, co obniża dynamikę pracy zwinnych zespołów.",
    solution:
      "Zbudowano lekki, responsywny stack w Node.js, Express i MongoDB z dwukierunkową synchronizacją pozycji kart przez WebSockets.",
    results:
      "Ponad 50 aktywnych zespołów programistycznych, średni czas reakcji API poniżej 32ms i zerowe konflikty przy jednoczesnej edycji zadań.",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Express", "Tailwind"],
    accent: "from-emerald-500/20 to-green-500/10",
    accentBorder: "hover:border-emerald-500/40",
    accentGlow: "0 0 35px -5px rgba(16,185,129,0.25)",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    demo: "https://ghydra-main.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Zarządzanie" },
    metrics: [
      { label: "Aktywne zespoły", value: "50+" },
      { label: "Czas API", value: "32ms" },
      { label: "Kolaboracja", value: "Live WebSockets" },
    ],
    keyFeatures: [
      "Płynna tablica Kanban z mechanizmem Drag & Drop",
      "Stoper czasu pracy z eksportem raportów do Excel/PDF",
      "Czat kontekstowy pod każdym zadaniem",
      "Zarządzanie uprawnieniami (Admin, Developer, Viewer)",
    ],
    architecture: [
      "Mikroserwisy backendowe w Node.js & Express",
      "Baza danych MongoDB z optymalizowanymi indeksami złożonymi",
      "Dwukierunkowa komunikacja WebSocket dla powiadomień live",
    ],
  },
  {
    id: "jednoreki",
    title: "Jednoręki Bandit Casino Game",
    category: "web",
    categoryLabel: "Gra Arcade & Canvas",
    description:
      "Klasyczny symulator automatu arcade z fizyką obrotu bębnów, generatorem losowości i efektami dźwiękowymi Web Audio.",
    fullDescription:
      "Jednoręki Bandit to interaktywny symulator klasycznego automatu slotowego. Wykorzystuje bezpośrednie renderowanie Canvas 2D, fizykę wyhamowywania bębnów z krzywą easeOutBack oraz syntezę dźwięku procedularnego w Web Audio API.",
    challenge:
      "Zapewnienie stabilnych 60 klatek na sekundę na słabszych urządzeniach mobilnych oraz realistycznych efektów audio bez pobierania ciężkich plików mp3.",
    solution:
      "Zbudowano dedykowany silnik renderujący w Canvas 2D z pętlą requestAnimationFrame oraz oscylatorami Web Audio syntetyzującymi dźwięki monet i obrotów w czasie rzeczywistym.",
    results:
      "Niezachwiane 60 FPS, rozmiar paczki kodu poniżej 45 kB i natychmiastowy start gry bez ekranów ładowania.",
    tags: ["React", "Canvas 2D", "Web Audio API", "TypeScript", "Motion"],
    accent: "from-rose-500/20 to-red-500/10",
    accentBorder: "hover:border-rose-500/40",
    accentGlow: "0 0 35px -5px rgba(225,29,72,0.25)",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=500&fit=crop",
    demo: "https://jednoreki.vercel.app/",
    featured: false,
    stats: { year: "2024", type: "Arcade Game" },
    metrics: [
      { label: "Płynność", value: "60 FPS Canvas" },
      { label: "Synteza audio", value: "Web Audio API" },
      { label: "Waga kodu", value: "< 45 kB" },
    ],
    keyFeatures: [
      "Fizyka obrotu i wyhamowywania bębnów z krzywą easeOutBack",
      "Synteza efektów dźwiękowych wygranej i obrotu w czasie rzeczywistym",
      "Tabela najwyższych wygranych zapisywana lokalnie",
      "Tryb Auto-Spin z regulacją stawki monet",
    ],
    architecture: [
      "Wydajny silnik renderowania Canvas 2D z requestAnimationFrame",
      "Dźwięki generowane proceduralnie bez zewnętrznych plików audio",
    ],
  },
  {
    id: "lucasz-elektro-glow",
    title: "Łukasz Elektro Glow Smart",
    category: "ecommerce",
    categoryLabel: "E-commerce & Oświetlenie",
    description:
      "Sklep i serwis profesjonalnych instalacji elektrycznych, systemów Smart Home oraz nowoczesnego oświetlenia LED.",
    fullDescription:
      "Łukasz Elektro Glow to platforma e-commerce i kalkulator instalacji Smart Home. Umożliwia dobór odpowiednich zasilaczy, sterowników DALI/Zigbee, taśm LED COB oraz bezpośrednie zamówienie audytu instalacji elektrycznej.",
    challenge:
      "Klienci często kupują niekompatybilne komponenty LED (niewłaściwe napięcie 12V vs 24V, brak zapasu mocy zasilacza).",
    solution:
      "Stworzono inteligentny kreator zestawów oświetleniowych, który automatycznie sumuje pobór mocy w watach i sugeruje bezpieczny zasilacz z 20% zapasem.",
    results:
      "Wzrost średniej wartości koszyka o 35%, redukcja zwrotów niekompatybilnego sprzętu o 90% i automatyzacja fakturowania.",
    tags: ["React", "TypeScript", "Stripe Checkout", "Tailwind", "Lucide"],
    accent: "from-yellow-500/20 to-amber-500/10",
    accentBorder: "hover:border-yellow-500/40",
    accentGlow: "0 0 35px -5px rgba(234,179,8,0.25)",
    image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=800&h=500&fit=crop",
    demo: "https://lucasz-elektro-glow.lovable.app/",
    featured: false,
    stats: { year: "2024", type: "E-commerce" },
    metrics: [
      { label: "Katalog produktów", value: "500+ SKU" },
      { label: "Średni koszyk", value: "+35%" },
      { label: "Zwroty", value: "-90%" },
    ],
    keyFeatures: [
      "Zaawansowana wyszukiwarka z filtrami parametrów elektrycznych",
      "Kalkulator poboru mocy i doboru zasilaczy",
      "Generowanie faktur PDF i tracking przesyłek",
      "Baza schematów podłączeniowych dla instalatorów",
    ],
    architecture: [
      "React z architekturą modułową",
      "Integracja Stripe API z obsługą płatności wielowalutowych",
    ],
  },
];
