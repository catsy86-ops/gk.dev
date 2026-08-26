export type Language = "pl" | "en";

export interface Translations {
  nav: {
    start: string;
    about: string;
    skills: string;
    projects: string;
    reviews: string;
    articles: string;
    faq: string;
    contact: string;
    downloadCv: string;
    search: string;
    available: string;
    aiAssistant: string;
    clientPortal: string;
    bookConsultation: string;
    writeMe: string;
    soundToggleOn: string;
    soundToggleOff: string;
    themeToggle: string;
    mobileNavToggle: string;
  };
  hero: {
    badge: string;
    greeting: string;
    iam: string;
    name: string;
    description: string;
    seeProjects: string;
    contactMe: string;
    scroll: string;
    roles: string[];
    greetings: string[];
    vitalsBadge: string;
    cleanCodeBadge: string;
  };
  about: {
    badge: string;
    title: string;
    highlight: string;
    bioRole: string;
    bioDesc: string;
    stackLabel: string;
    passionsLabel: string;
    downloadCv: string;
    writeMe: string;
    experienceTab: string;
    educationTab: string;
    passions: { emoji: string; label: string }[];
    experiences: {
      year: string;
      title: string;
      company: string;
      description: string;
      highlights: string[];
      tags: string[];
    }[];
    educations: {
      year: string;
      title: string;
      company: string;
      description: string;
      highlights: string[];
      tags: string[];
    }[];
  };
  skills: {
    badge: string;
    title: string;
    highlight: string;
    radarTab: string;
    simulatorTab: string;
    benchmarkTab: string;
    items: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      highlights: string[];
      tags: string[];
    }[];
  };
  projects: {
    badge: string;
    title: string;
    highlight: string;
    filterLabel: string;
    all: string;
    saas: string;
    ecommerce: string;
    web: string;
    searchPlaceholder: string;
    found: string;
    of: string;
    reset: string;
    emptyTitle: string;
    emptyDesc: string;
    viewLive: string;
    caseStudy: string;
    swipeHint: string;
    githubCta: string;
    startProjectCta: string;
    bottomHeading: string;
  };
  stats: {
    badge: string;
    title: string;
    subtitle: string;
    vitalsHeading: string;
    vitalsDesc: string;
    experienceLabel: string;
    experienceSub: string;
    projectsLabel: string;
    projectsSub: string;
    techLabel: string;
    techSub: string;
    clientsLabel: string;
    clientsSub: string;
  };
  testimonials: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    verified: string;
    items: {
      name: string;
      role: string;
      text: string;
      metric: string;
      project: string;
    }[];
  };
  articles: {
    badge: string;
    title: string;
    highlight: string;
    readMore: string;
    searchPlaceholder: string;
    bookmarkAdded: string;
    bookmarkRemoved: string;
    emptyTitle: string;
    emptyDesc: string;
    sourcesHeading: string;
    categories: {
      all: string;
      performance: string;
      architecture: string;
      security: string;
      ai: string;
    };
  };
  faq: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    searchPlaceholder: string;
    customQuestion: string;
    customQuestionDesc: string;
    writeDirectly: string;
    emptyTitle: string;
    emptyDesc: string;
    categories: {
      all: string;
      pricing: string;
      tech: string;
      cooperation: string;
    };
    items: {
      category: string;
      question: string;
      answer: string;
    }[];
  };
  contact: {
    badge: string;
    title: string;
    highlight: string;
    sla: string;
    emailCopiedTitle: string;
    emailCopiedDesc: string;
    calcCta: string;
    rfpCta: string;
    topicLabel: string;
    topics: string[];
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    send: string;
    sending: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
    calcTitle: string;
    calcApplied: string;
    briefApplied: string;
  };
  footer: {
    rights: string;
    craftedWith: string;
    navHeading: string;
    connectHeading: string;
    commandHint: string;
    tagline: string;
    location: string;
    madeWith: string;
    andCleanCode: string;
    backToTop: string;
    status: string;
  };
}

export const translations: Record<Language, Translations> = {
  pl: {
    nav: {
      start: "Start",
      about: "O mnie",
      skills: "Umiejętności",
      projects: "Projekty",
      reviews: "Opinie",
      articles: "Baza Wiedzy",
      faq: "FAQ",
      contact: "Kontakt",
      downloadCv: "Pobierz CV",
      search: "Szukaj...",
      available: "Dostępny",
      aiAssistant: "GK AI",
      clientPortal: "Strefa Klienta",
      bookConsultation: "Konsultacja",
      writeMe: "Napisz",
      soundToggleOn: "Wycisz dźwięki",
      soundToggleOff: "Włącz dźwięki",
      themeToggle: "Przełącz motyw",
      mobileNavToggle: "Menu nawigacji",
    },
    hero: {
      badge: "Profil Inżynierski",
      greeting: "Cześć",
      iam: ", jestem ",
      name: "Grzegorz",
      description: "Tworzę nowoczesne aplikacje webowe i mobilne z pasją do czystego kodu,",
      seeProjects: "Zobacz projekty",
      contactMe: "Napisz do mnie",
      scroll: "Scroll",
      roles: ["Fullstack Developer", "React Specialist", "Cloud Architect", "UI/UX Enthusiast"],
      greetings: ["Cześć", "Hello", "Hej", "Yo", "Siema"],
      vitalsBadge: "100% Core Vitals",
      cleanCodeBadge: "Strict Clean Code",
    },
    about: {
      badge: "Profil & Ścieżka Kariery",
      title: "Inżynieria z pasją do",
      highlight: "doskonałości",
      bioRole: "Senior Fullstack Engineer",
      bioDesc: "Specjalizuję się w tworzeniu zaawansowanych aplikacji SaaS, platform e-commerce oraz systemów chmurowych z bezkompromisowym naciskiem na wydajność, bezpieczeństwo i estetykę.",
      stackLabel: "Główny Stack:",
      passionsLabel: "Pasje i rozwój:",
      downloadCv: "Pobierz CV (PDF)",
      writeMe: "Napisz",
      experienceTab: "Doświadczenie Komercyjne",
      educationTab: "Certyfikaty & Edukacja",
      passions: [
        { emoji: "🚀", label: "Nowe technologie" },
        { emoji: "🎮", label: "Game dev & 3D" },
        { emoji: "📚", label: "Open source" },
        { emoji: "☕", label: "Kawa specialty" },
      ],
      experiences: [
        {
          year: "2023 — TERAZ",
          title: "Senior Fullstack Developer & Architekt",
          company: "Freelance / Dedykowane Platformy SaaS",
          description: "Projektowanie i wdrażanie kompletnych systemów webowych, aplikacji mobilnych i backendu API w chmurze.",
          highlights: ["Wzrost konwersji klientów do +145%", "Optymalizacja Core Web Vitals do 98-100", "Architektura mikroserwisów & Serverless"],
          tags: ["React 19", "Next.js", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
        },
        {
          year: "2021 — 2023",
          title: "Fullstack Software Engineer",
          company: "Software House & Agencje UE",
          description: "Budowanie platform SaaS dla e-commerce i enterprise, integracje bramek płatniczych oraz optymalizacja zapytań SQL.",
          highlights: ["Obsługa 100k+ unikalnych sesji miesięcznie", "Projektowanie API GraphQL & REST", "Redukcja czasu ładowania aplikacji o 60%"],
          tags: ["TypeScript", "NestJS", "PostgreSQL", "Docker", "Redis", "Tailwind"],
        },
        {
          year: "2019 — 2021",
          title: "Frontend Developer",
          company: "Startup Technologiczny",
          description: "Rozwój interfejsów użytkownika w React i TypeScript, integracje z zewnętrznymi API oraz dbałość o responsywność i animacje.",
          highlights: ["Wdrożenie biblioteki komponentów Design System", "Współpraca w metodyce Agile/Scrum", "100% Type-Safe TypeScript codebase"],
          tags: ["React", "TypeScript", "Redux", "REST API", "SCSS"],
        },
      ],
      educations: [
        {
          year: "2024",
          title: "AWS Certified Solutions Architect",
          company: "Amazon Web Services",
          description: "Międzynarodowy certyfikat poświadczający wiedzę z projektowania skalowalnych, bezpiecznych i bezawaryjnych architektur chmurowych.",
          highlights: ["High Availability & Fault Tolerance", "Serverless & Containerized Workloads", "Cost Optimization & Security"],
          tags: ["AWS", "Cloud Architecture", "S3", "Lambda", "ECS"],
        },
        {
          year: "2023",
          title: "Meta Front-End Developer Professional",
          company: "Meta Platforms",
          description: "Zaawansowana certyfikacja obejmująca architekturę React, optymalizację renderowania, testy jednostkowe i dostępność WCAG.",
          highlights: ["Test-Driven Development (TDD)", "Zaawansowane wzorce React", "Dostępność cyfrowa (a11y)"],
          tags: ["React", "CI/CD", "Jest/Vitest", "Web Standards"],
        },
        {
          year: "2015 — 2019",
          title: "Inżynieria Oprogramowania & Informatyka",
          company: "Studia Inżynierskie",
          description: "Tytuł inżyniera informatyki ze specjalizacją w inżynierii systemów webowych, algorytmach i strukturach danych oraz bazach relacyjnych.",
          highlights: ["Obrona pracy inżynierskiej z wyróżnieniem", "Algorytmika i bazy danych", "Projektowanie architektur SOLID"],
          tags: ["Informatyka", "Algorytmy", "Bazy Danych", "Sieci"],
        },
      ],
    },
    skills: {
      badge: "Kompetencje & Stack",
      title: "Moje",
      highlight: "umiejętności",
      radarTab: "Radar Kompetencji 360°",
      simulatorTab: "Symulator Architektury",
      benchmarkTab: "Benchmark Baz Danych",
      items: [
        {
          id: "frontend",
          title: "Frontend Engineering",
          subtitle: "React • Next.js • TypeScript",
          description: "Tworzenie nowoczesnych, responsywnych interfejsów webowych z dbałością o 60 FPS, dostępność (a11y) i estetykę pixel-perfect.",
          highlights: ["Ultra-fast Core Web Vitals", "Server Components & SSR", "Type-safe State Management"],
          tags: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Motion", "Zustand", "Radix UI"],
        },
        {
          id: "backend",
          title: "Backend & Systemy API",
          subtitle: "Node.js • PostgreSQL • Redis",
          description: "Skalowalne usługi backendowe, bezpieczne bazy danych, relacje, cache'owanie i architektura sterowana zdarzeniami.",
          highlights: ["Bezpieczne autoryzacje JWT/OAuth", "Transakcje i indeksy DB", "Sub-50ms API Latency"],
          tags: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "GraphQL", "REST"],
        },
        {
          id: "cloud",
          title: "Cloud & DevOps",
          subtitle: "AWS • Docker • CI/CD",
          description: "Automatyzacja procesów deploymentu, konteneryzacja, bezawaryjny hosting chmurowy i monitoring.",
          highlights: ["Automatyczny pipeline CI/CD", "Skalowalność horyzontalna", "Zero-Downtime Releases"],
          tags: ["AWS S3/EC2", "Docker", "GitHub Actions", "Vercel", "Linux", "Nginx"],
        },
        {
          id: "architecture",
          title: "Architektura & Clean Code",
          subtitle: "Design Patterns • Testing",
          description: "Struktury kodu łatwe w utrzymaniu, refaktoryzacji i skalowaniu zespołowym w oparciu o SOLID i Clean Architecture.",
          highlights: ["95%+ Test Coverage", "Modułowość kodu", "Standardy ESLint/Prettier"],
          tags: ["SOLID", "Design Patterns", "Vitest", "Playwright", "Monorepo"],
        },
        {
          id: "mobile",
          title: "Mobile Development",
          subtitle: "React Native • Cross-platform",
          description: "Aplikacje mobilne na platformy iOS i Android z natywną wydajnością i płynnymi animacjami gestów.",
          highlights: ["Płynna obsługa gestów", "Tryb Offline", "iOS & Android"],
          tags: ["React Native", "Expo", "Mobile UX", "Async Storage"],
        },
        {
          id: "uiux",
          title: "UI/UX & Design Systems",
          subtitle: "Figma • Prototyping",
          description: "Projektowanie użytecznych i intuicyjnych systemów designu z naciskiem na konwersję i ergonomię użytkownika.",
          highlights: ["Komponenty modułowe", "Dostępność cyfrowa", "Responsive Design"],
          tags: ["Figma", "Design Tokens", "Micro-interactions", "WCAG 2.1"],
        },
      ],
    },
    projects: {
      badge: "Portfolio & Case Studies",
      title: "Wybrane",
      highlight: "realizacje",
      filterLabel: "Filtr:",
      all: "Wszystkie projekty",
      saas: "Fullstack & SaaS",
      ecommerce: "E-commerce",
      web: "Web & Mobile",
      searchPlaceholder: "Szukaj (np. Stripe, React, SaaS)...",
      found: "Znaleziono:",
      of: "z",
      reset: "Resetuj filtry",
      emptyTitle: "Brak pasujących projektów",
      emptyDesc: "Spróbuj wpisać inną frazę lub zresetuj filtr.",
      viewLive: "Zobacz Live",
      caseStudy: "Case Study",
      swipeHint: "← Przesuń kciukiem w lewo / prawo →",
      githubCta: "Odwiedź profil GitHub",
      startProjectCta: "Rozpocznij projekt",
      bottomHeading: "Chcesz poznać więcej szczegółów lub omówić dedykowany projekt?",
    },
    stats: {
      badge: "Metryki & Doświadczenie",
      title: "Inżynieria potwierdzona liczbami",
      subtitle: "Wysoka wydajność, czysty kod i dbałość o każdy milisekund ładowania.",
      vitalsHeading: "Google Lighthouse Core Web Vitals",
      vitalsDesc: "Zoptymalizowany pod kątem natychmiastowego First Contentful Paint (< 0.6s) i maksymalnego SEO.",
      experienceLabel: "Lat Doświadczenia",
      experienceSub: "W branży IT & Web",
      projectsLabel: "Ukończonych Projektów",
      projectsSub: "SaaS, E-commerce, Apps",
      techLabel: "Głównych Technologii",
      techSub: "TypeScript, React, Node",
      clientsLabel: "Klientów & Partnerów",
      clientsSub: "Polska, UE i Globalnie",
    },
    testimonials: {
      badge: "Rekomendacje & Social Proof",
      title: "Zaufanie potwierdzone",
      highlight: "wynikami",
      subtitle: "Referencje od liderów technologicznych, startupów i agencji.",
      verified: "Zweryfikowane wdrożenie",
      items: [
        {
          name: "Anna Kowalska",
          role: "CEO, TechStart",
          text: "GK dostarczył fantastyczną aplikację webową, która przekroczyła nasze oczekiwania. Profesjonalizm, architektura i dbałość o detale na najwyższym poziomie.",
          metric: "+145% wzrostu sprzedaży",
          project: "E-Commerce High-End",
        },
        {
          name: "Michał Nowak",
          role: "CTO, DataFlow",
          text: "Współpraca z GK to czysta przyjemność. Błyskawiczna komunikacja, terminowość i kod najwyższej jakości. Zdecydowanie polecam do projektów o wysokiej skali.",
          metric: "300% szybszy frontend",
          project: "Platforma SaaS & API",
        },
        {
          name: "Katarzyna Wiśniewska",
          role: "Product Manager, CloudBase",
          text: "Nasz dashboard analityczny został zbudowany perfekcyjnie. Responsywny, szybki i piękny wizualnie. Nasi klienci biznesowi są absolutnie zachwyceni.",
          metric: "99.99% Uptime & Realtime",
          project: "Cloud Dashboard",
        },
        {
          name: "Tomasz Zieliński",
          role: "Founder, AppVenture",
          text: "GK pomógł nam przebudować architekturę aplikacji. Wydajność wzrosła spektakularnie, a UX jest teraz na światowym poziomie referencyjnym.",
          metric: "-55% bounce rate",
          project: "Aplikacja Web & Mobile",
        },
        {
          name: "Ewa Mazur",
          role: "Head of Design, Pixelworks",
          text: "Implementacja designu była bezbłędnie pixel-perfect. GK doskonale rozumie zaawansowane micro-interactions i potrafi przełożyć makiety na 60 FPS.",
          metric: "100/100 Core Web Vitals",
          project: "Design System & Frontend",
        },
        {
          name: "Paweł Dąbrowski",
          role: "VP Engineering, FinScope",
          text: "Bezpieczeństwo i wydajność naszej platformy finansowej były kluczowe. GK dostarczył rozwiązanie spełniające najostrzejsze standardy enterprise.",
          metric: "0 luk bezpieczeństwa",
          project: "FinTech Platform",
        },
        {
          name: "Marta Lewandowska",
          role: "CMO, GreenTech Solutions",
          text: "Nowa platforma przyniosła nam ogromny skok konwersji. GK nie tylko koduje — rozumie produkt biznesowo i tworzy rozwiązania przynoszące wymierne zyski.",
          metric: "+180% nowych leadów",
          project: "GreenTech Ecosystem",
        },
      ],
    },
    articles: {
      badge: "Inżynieria & Baza Wiedzy",
      title: "Artykuły &",
      highlight: "analizy techniczne",
      readMore: "Czytaj pełną analizę",
      searchPlaceholder: "Szukaj (np. INP, Redis, Stripe, RAG)...",
      bookmarkAdded: "Dodano do zakładek",
      bookmarkRemoved: "Usunięto z zakładek",
      emptyTitle: "Brak pasujących publikacji",
      emptyDesc: "Spróbuj wpisać inne słowo kluczowe lub zresetuj filtr.",
      sourcesHeading: "Źródła inżynieryjne i dokumentacja techniczna:",
      categories: {
        all: "Wszystkie",
        performance: "Wydajność",
        architecture: "Architektura",
        security: "SaaS & Security",
        ai: "AI & Vector Search",
      },
    },
    faq: {
      badge: "Baza Wiedzy & FAQ",
      title: "Często zadawane",
      highlight: "pytania",
      subtitle: "Wszystko, co warto wiedzieć przed rozpoczęciem wspólnego projektu.",
      searchPlaceholder: "Szukaj w pytaniach (np. wycena, czas, AWS, SEO)...",
      customQuestion: "Masz niestandardowe pytanie?",
      customQuestionDesc: "Chętnie odpowiem na wszelkie pytania techniczne i biznesowe.",
      writeDirectly: "Napisz bezpośrednio",
      emptyTitle: "Brak wyników",
      emptyDesc: "Nie znaleziono pytań pasujących do wpisanej frazy.",
      categories: {
        all: "Wszystkie",
        pricing: "Wycena & Czas",
        tech: "Technologie",
        cooperation: "Współpraca",
      },
      items: [
        {
          category: "Współpraca",
          question: "Jak wygląda proces współpracy i rozliczeń?",
          answer: "Zaczynamy od bezpłatnej rozmowy o Twoich celach biznesowych i architekturze. Przygotowuję szczegółowy estymator i harmonogram. Pracujemy w 1-2 tygodniowych sprintach z regularnymi wersjami demo na środowisku stagingowym.",
        },
        {
          category: "Wycena & Czas",
          question: "Ile kosztuje i ile trwa stworzenie dedykowanej aplikacji?",
          answer: "Prosty landing page / sklep to zwykle 1–2 tygodnie (od 3 500 zł). Kompleksowa platforma SaaS lub dedykowana aplikacja webowa to 4–8 tygodni (od 12 000 zł). Zawsze przedstawiam przejrzysty, stały budżet (Fixed Price) lub model Time & Material.",
        },
        {
          category: "Wycena & Czas",
          question: "Czy oferujesz wsparcie i SLA po wdrożeniu produkcyjnym?",
          answer: "Tak! Każdy projekt objęty jest 30-dniową bezpłatną gwarancją i opieką powdrożeniową. Dostępne są również elastyczne pakiety SLA obejmujące monitoring 24/7, optymalizację chmury AWS oraz ciągły rozwój nowych funkcji.",
        },
        {
          category: "Technologie",
          question: "W jakim stacku technologicznym tworzysz aplikacje?",
          answer: "Główny ekosystem to React 19, Next.js 15, TypeScript, Tailwind CSS na frontendzie oraz Node.js (NestJS/Express), PostgreSQL, Redis i AWS na backendzie. Do aplikacji mobilnych używam React Native i Flutter.",
        },
        {
          category: "Współpraca",
          question: "Czy kod i prawa autorskie przechodzą w 100% na klienta?",
          answer: "Oczywiście. Wraz z finalnym wdrożeniem i rozliczeniem przekazuję pełne autorskie prawa majątkowe, repozytorium GitHub oraz całą dokumentację wdrożeniową i architektoniczną.",
        },
        {
          category: "Technologie",
          question: "Czy dbasz o maksymalną wydajność, SEO i dostępność WCAG?",
          answer: "Zdecydowanie. Każda realizacja jest optymalizowana pod kątem natychmiastowego ładowania (sub-second TTFB), responsywności na każdym ekranie oraz standardów WCAG 2.1 (A11y).",
        },
      ],
    },
    contact: {
      badge: "Kontakt",
      title: "Napisz do",
      highlight: "mnie",
      sla: "Dostępny do nowych wyzwań • Odpowiedź w < 4h",
      emailCopiedTitle: "Skopiowano email",
      emailCopiedDesc: "kontakt@gkdev.pl zapisano w schowku.",
      calcCta: "Kalkulator Wyceny Projektu",
      rfpCta: "Generator Briefu B2B / RFP",
      topicLabel: "Wybierz temat rozmowy:",
      topics: [
        "Nowy Projekt SaaS",
        "Audyt Architektury",
        "Aplikacja Web / Mobile",
        "Współpraca / Zespół",
      ],
      nameLabel: "Imię",
      emailLabel: "Email",
      messageLabel: "Wiadomość",
      send: "Wyślij wiadomość",
      sending: "Wysyłanie...",
      successTitle: "Wiadomość wysłana!",
      successDesc: "Dziękuję za kontakt. Odpiszę najszybciej jak to możliwe.",
      sendAnother: "Wyślij kolejną wiadomość",
      calcTitle: "Kalkulator Wyceny",
      calcApplied: "Wycena wczytana do formularza!",
      briefApplied: "Brief wczytany do wiadomości!",
    },
    footer: {
      rights: "© 2026 GK.dev • Wszelkie prawa zastrzeżone",
      craftedWith: "Zaprojektowane z pasją i rygorystycznym Clean Code",
      navHeading: "Nawigacja",
      connectHeading: "Social Media & Kontakt",
      commandHint: "Menu poleceń",
      tagline: "Nowoczesne aplikacje internetowe i systemy chmurowe. Bezkompromisowa wydajność, bezpieczeństwo i dbałość o każdy piksel.",
      location: "Szczecin, Polska",
      madeWith: "Stworzone z",
      andCleanCode: "i rygorystycznym Clean Code",
      backToTop: "Wróć na górę",
      status: "Dostępny do nowych projektów",
    },
  },
  en: {
    nav: {
      start: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      reviews: "Testimonials",
      articles: "Knowledge Base",
      faq: "FAQ",
      contact: "Contact",
      downloadCv: "Resume PDF",
      search: "Search...",
      available: "Available",
      aiAssistant: "GK AI",
      clientPortal: "Client Portal",
      bookConsultation: "Book Call",
      writeMe: "Contact",
      soundToggleOn: "Mute sound",
      soundToggleOff: "Unmute sound",
      themeToggle: "Toggle theme",
      mobileNavToggle: "Toggle navigation",
    },
    hero: {
      badge: "Engineering Profile",
      greeting: "Hello",
      iam: ", I'm ",
      name: "Grzegorz",
      description: "Crafting modern high-performance web and mobile apps with clean code,",
      seeProjects: "Explore Projects",
      contactMe: "Get in Touch",
      scroll: "Scroll",
      roles: ["Fullstack Developer", "React Specialist", "Cloud Architect", "UI/UX Enthusiast"],
      greetings: ["Hello", "Hi there", "Welcome", "Greetings", "Hey"],
      vitalsBadge: "100% Core Vitals",
      cleanCodeBadge: "Strict Clean Code",
    },
    about: {
      badge: "Engineering Profile & Career Path",
      title: "Engineering with Passion for",
      highlight: "Excellence",
      bioRole: "Senior Fullstack Engineer",
      bioDesc: "Specializing in high-performance SaaS applications, modern e-commerce storefronts, and cloud architectures with rigorous focus on speed, resilience, and UX.",
      stackLabel: "Core Stack:",
      passionsLabel: "Interests & Growth:",
      downloadCv: "Download CV (PDF)",
      writeMe: "Get in Touch",
      experienceTab: "Commercial Experience",
      educationTab: "Certifications & Education",
      passions: [
        { emoji: "🚀", label: "Emerging Tech" },
        { emoji: "🎮", label: "Game Dev & 3D" },
        { emoji: "📚", label: "Open Source" },
        { emoji: "☕", label: "Specialty Coffee" },
      ],
      experiences: [
        {
          year: "2023 — PRESENT",
          title: "Senior Fullstack Developer & Architect",
          company: "Freelance / Dedicated SaaS Platforms",
          description: "Architecting and delivering complete web ecosystems, mobile apps, and serverless cloud APIs.",
          highlights: ["Client conversion uplift up to +145%", "Core Web Vitals optimized to 98-100", "Microservices & Serverless architecture"],
          tags: ["React 19", "Next.js", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
        },
        {
          year: "2021 — 2023",
          title: "Fullstack Software Engineer",
          company: "Software Houses & EU Agencies",
          description: "Building scalable e-commerce & enterprise SaaS platforms, payment gateway integrations, and SQL query tuning.",
          highlights: ["Handling 100k+ monthly unique sessions", "Designing GraphQL & REST APIs", "60% reduction in application load times"],
          tags: ["TypeScript", "NestJS", "PostgreSQL", "Docker", "Redis", "Tailwind"],
        },
        {
          year: "2019 — 2021",
          title: "Frontend Developer",
          company: "Tech Startup",
          description: "Developing modular UI components in React and TypeScript, integrating external APIs with 60 FPS motion fidelity.",
          highlights: ["Design System component library implementation", "Agile/Scrum team collaboration", "100% Type-Safe TypeScript codebase"],
          tags: ["React", "TypeScript", "Redux", "REST API", "SCSS"],
        },
      ],
      educations: [
        {
          year: "2024",
          title: "AWS Certified Solutions Architect",
          company: "Amazon Web Services",
          description: "Certified expertise in designing highly available, scalable, fault-tolerant, and cost-effective cloud architectures.",
          highlights: ["High Availability & Fault Tolerance", "Serverless & Containerized Workloads", "Cost Optimization & Security"],
          tags: ["AWS", "Cloud Architecture", "S3", "Lambda", "ECS"],
        },
        {
          year: "2023",
          title: "Meta Front-End Developer Professional",
          company: "Meta Platforms",
          description: "Advanced certification covering modern React paradigms, render profiling, unit testing, and WCAG accessibility standards.",
          highlights: ["Test-Driven Development (TDD)", "Advanced React Patterns", "Web Accessibility (a11y)"],
          tags: ["React", "CI/CD", "Jest/Vitest", "Web Standards"],
        },
        {
          year: "2015 — 2019",
          title: "Software Engineering & Computer Science (B.Eng.)",
          company: "University Degree",
          description: "Bachelor of Engineering degree specializing in web systems engineering, data structures & algorithms, and relational databases.",
          highlights: ["Graduated with Honors", "Algorithms and Relational DBs", "SOLID Architecture Design"],
          tags: ["Computer Science", "Algorithms", "Databases", "Networks"],
        },
      ],
    },
    skills: {
      badge: "Skills & Engineering Stack",
      title: "My Core",
      highlight: "Competencies",
      radarTab: "360° Tech Radar",
      simulatorTab: "Architecture Simulator",
      benchmarkTab: "Database Benchmark",
      items: [
        {
          id: "frontend",
          title: "Frontend Engineering",
          subtitle: "React • Next.js • TypeScript",
          description: "Developing modern, ultra-responsive web applications with 60 FPS motion, a11y compliance, and pixel-perfect design.",
          highlights: ["Ultra-fast Core Web Vitals", "Server Components & SSR", "Type-safe State Management"],
          tags: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Motion", "Zustand", "Radix UI"],
        },
        {
          id: "backend",
          title: "Backend & API Systems",
          subtitle: "Node.js • PostgreSQL • Redis",
          description: "Scalable backend microservices, resilient relational databases, caching tiers, and event-driven architectures.",
          highlights: ["Secure JWT/OAuth auth flows", "ACID transactions & DB indexing", "Sub-50ms API Latency"],
          tags: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "GraphQL", "REST"],
        },
        {
          id: "cloud",
          title: "Cloud & DevOps",
          subtitle: "AWS • Docker • CI/CD",
          description: "Deployment pipeline automation, containerization, resilient cloud hosting, and infrastructure observability.",
          highlights: ["Automated CI/CD workflows", "Horizontal auto-scaling", "Zero-Downtime Releases"],
          tags: ["AWS S3/EC2", "Docker", "GitHub Actions", "Vercel", "Linux", "Nginx"],
        },
        {
          id: "architecture",
          title: "Architecture & Clean Code",
          subtitle: "Design Patterns • Testing",
          description: "Maintainable, testable codebases designed for team velocity based on SOLID and Clean Architecture principles.",
          highlights: ["95%+ Test Coverage", "Modular Domain Design", "ESLint/Prettier Standards"],
          tags: ["SOLID", "Design Patterns", "Vitest", "Playwright", "Monorepo"],
        },
        {
          id: "mobile",
          title: "Mobile Development",
          subtitle: "React Native • Cross-platform",
          description: "Cross-platform mobile apps for iOS and Android with native performance and smooth gesture handling.",
          highlights: ["Fluid gesture interactions", "Offline-first sync", "iOS & Android"],
          tags: ["React Native", "Expo", "Mobile UX", "Async Storage"],
        },
        {
          id: "uiux",
          title: "UI/UX & Design Systems",
          subtitle: "Figma • Prototyping",
          description: "Crafting intuitive design systems with rigorous attention to typography, conversion rates, and user ergonomics.",
          highlights: ["Modular design tokens", "Digital accessibility", "Responsive Design"],
          tags: ["Figma", "Design Tokens", "Micro-interactions", "WCAG 2.1"],
        },
      ],
    },
    projects: {
      badge: "Portfolio & Case Studies",
      title: "Featured",
      highlight: "Projects",
      filterLabel: "Filter:",
      all: "All Projects",
      saas: "Fullstack & SaaS",
      ecommerce: "E-commerce",
      web: "Web & Mobile",
      searchPlaceholder: "Search (e.g. Stripe, React, SaaS)...",
      found: "Found:",
      of: "of",
      reset: "Reset filters",
      emptyTitle: "No projects matched",
      emptyDesc: "Try another search term or clear the active filter.",
      viewLive: "Live Demo",
      caseStudy: "Case Study",
      swipeHint: "← Swipe horizontally on mobile →",
      githubCta: "Visit GitHub Profile",
      startProjectCta: "Start a Project",
      bottomHeading: "Looking to explore technical details or discuss a custom build?",
    },
    stats: {
      badge: "Metrics & Track Record",
      title: "Engineering Proven by Numbers",
      subtitle: "Peak performance, clean code, and relentless optimization for every millisecond.",
      vitalsHeading: "Google Lighthouse Core Web Vitals",
      vitalsDesc: "Engineered for instant First Contentful Paint (< 0.6s) and maximum organic search visibility.",
      experienceLabel: "Years Experience",
      experienceSub: "In IT & Web Industry",
      projectsLabel: "Delivered Projects",
      projectsSub: "SaaS, E-commerce, Apps",
      techLabel: "Core Technologies",
      techSub: "TypeScript, React, Node",
      clientsLabel: "Clients & Partners",
      clientsSub: "Poland, EU & Globally",
    },
    testimonials: {
      badge: "Testimonials & Social Proof",
      title: "Trust Backed by",
      highlight: "Real Results",
      subtitle: "Endorsements from tech leaders, founders, and product teams.",
      verified: "Verified Delivery",
      items: [
        {
          name: "Anna Kowalska",
          role: "CEO, TechStart",
          text: "GK delivered a fantastic web platform that exceeded our expectations. Professionalism, system architecture, and attention to detail were world-class.",
          metric: "+145% sales conversion",
          project: "High-End E-Commerce",
        },
        {
          name: "Michał Nowak",
          role: "CTO, DataFlow",
          text: "Working with GK was a seamless experience. Rapid communication, strict deadlines, and spotless code quality. Highly recommended for scalable systems.",
          metric: "300% faster frontend",
          project: "SaaS Platform & API",
        },
        {
          name: "Katarzyna Wiśniewska",
          role: "Product Manager, CloudBase",
          text: "Our analytics dashboard was built to perfection. Responsive, blazing fast, and visually striking. Our enterprise clients are thrilled.",
          metric: "99.99% Realtime Uptime",
          project: "Cloud Dashboard",
        },
        {
          name: "Tomasz Zieliński",
          role: "Founder, AppVenture",
          text: "GK restructured our frontend architecture. Performance improved dramatically, and our UX is now at top industry benchmark levels.",
          metric: "-55% bounce rate",
          project: "Web & Mobile App",
        },
        {
          name: "Ewa Mazur",
          role: "Head of Design, Pixelworks",
          text: "The design implementation was strictly pixel-perfect. GK understands advanced micro-interactions and translates design mocks into fluid 60 FPS.",
          metric: "100/100 Core Web Vitals",
          project: "Design System & Frontend",
        },
        {
          name: "Paweł Dąbrowski",
          role: "VP Engineering, FinScope",
          text: "Security and latency in our financial platform were mission-critical. GK delivered a solution conforming to strict enterprise requirements.",
          metric: "Zero security vulnerabilities",
          project: "FinTech Platform",
        },
        {
          name: "Marta Lewandowska",
          role: "CMO, GreenTech Solutions",
          text: "The new platform generated an immediate surge in conversions. GK doesn't just write code — he understands business metrics and ROI.",
          metric: "+180% qualified leads",
          project: "GreenTech Ecosystem",
        },
      ],
    },
    articles: {
      badge: "Engineering Knowledge Base",
      title: "Articles &",
      highlight: "Technical Analyses",
      readMore: "Read Full Analysis",
      searchPlaceholder: "Search (e.g. INP, Redis, Stripe, RAG)...",
      bookmarkAdded: "Added to Bookmarks",
      bookmarkRemoved: "Removed from Bookmarks",
      emptyTitle: "No publications found",
      emptyDesc: "Try another keyword or clear the active category.",
      sourcesHeading: "Engineering Sources & Technical Documentation:",
      categories: {
        all: "All",
        performance: "Performance",
        architecture: "Architecture",
        security: "SaaS & Security",
        ai: "AI & Vector Search",
      },
    },
    faq: {
      badge: "Knowledge Base & FAQ",
      title: "Frequently Asked",
      highlight: "Questions",
      subtitle: "Everything you need to know before starting a collaboration.",
      searchPlaceholder: "Search questions (e.g. pricing, timeline, AWS, SEO)...",
      customQuestion: "Have a custom question?",
      customQuestionDesc: "I'd be glad to discuss specific technical and business details.",
      writeDirectly: "Get in Touch",
      emptyTitle: "No results",
      emptyDesc: "No questions matched your search query.",
      categories: {
        all: "All",
        pricing: "Pricing & Timeline",
        tech: "Tech Stack",
        cooperation: "Collaboration",
      },
      items: [
        {
          category: "Collaboration",
          question: "How does the project collaboration and delivery workflow look?",
          answer: "We start with a free consultation discussing your technical and business goals. I prepare a detailed estimate and milestones. We iterate in 1-2 week sprints with live staging deployments for transparency.",
        },
        {
          category: "Pricing & Timeline",
          question: "How much does a custom web application cost and how long does it take?",
          answer: "A modern landing page or storefront typically takes 1-2 weeks (from €800 / 3,500 PLN). A comprehensive SaaS platform or custom web app takes 4-8 weeks (from €2,800 / 12,000 PLN). I offer transparent Fixed-Price and Time & Material models.",
        },
        {
          category: "Pricing & Timeline",
          question: "Do you offer post-launch support and SLA maintenance?",
          answer: "Yes! Every project includes a 30-day complimentary post-launch warranty. Optional SLA packages are available for 24/7 uptime monitoring, AWS cloud optimization, and continuous feature development.",
        },
        {
          category: "Tech Stack",
          question: "What core technology stack do you use?",
          answer: "The primary stack is React 19, Next.js 15, TypeScript, and Tailwind CSS on the frontend, with Node.js (NestJS/Express), PostgreSQL, Redis, and AWS on the backend. For mobile apps, I use React Native and Flutter.",
        },
        {
          category: "Collaboration",
          question: "Do I receive 100% intellectual property and source code ownership?",
          answer: "Absolutely. Upon project completion and settlement, full IP rights, the GitHub repository, and all deployment/architecture documentation are transferred to you.",
        },
        {
          category: "Tech Stack",
          question: "Do you guarantee peak performance, SEO, and accessibility?",
          answer: "Yes. Every delivery is engineered for instant sub-second loading, full responsiveness across all viewports, and WCAG 2.1 AA accessibility standards.",
        },
      ],
    },
    contact: {
      badge: "Contact",
      title: "Get in",
      highlight: "Touch",
      sla: "Available for new projects • Reply within < 4h",
      emailCopiedTitle: "Email Copied",
      emailCopiedDesc: "kontakt@gkdev.pl has been saved to your clipboard.",
      calcCta: "Project Estimator Tool",
      rfpCta: "B2B Brief / RFP Generator",
      topicLabel: "Select a topic:",
      topics: [
        "New SaaS Project",
        "Architecture Audit",
        "Web / Mobile App",
        "Team Engineering Role",
      ],
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successDesc: "Thank you for reaching out. I will get back to you promptly.",
      sendAnother: "Send another message",
      calcTitle: "Project Estimator",
      calcApplied: "Estimate loaded into form!",
      briefApplied: "Brief loaded into message!",
    },
    footer: {
      rights: "© 2026 GK.dev • All rights reserved",
      craftedWith: "Engineered with passion and rigorous Clean Code",
      navHeading: "Navigation",
      connectHeading: "Social Media & Contact",
      commandHint: "Command menu",
      tagline: "Modern web applications and cloud architectures. Uncompromising performance, security, and pixel-perfect design.",
      location: "Szczecin, Poland (CET)",
      madeWith: "Crafted with",
      andCleanCode: "& rigorous Clean Code",
      backToTop: "Back to top",
      status: "Available for new challenges",
    },
  },
};

