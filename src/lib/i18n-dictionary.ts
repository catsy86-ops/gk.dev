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
  };
  skills: {
    badge: string;
    title: string;
    highlight: string;
    radarTab: string;
    simulatorTab: string;
    benchmarkTab: string;
  };
  articles: {
    badge: string;
    title: string;
    highlight: string;
    readMore: string;
    searchPlaceholder: string;
    bookmarkAdded: string;
    bookmarkRemoved: string;
  };
  contact: {
    badge: string;
    title: string;
    highlight: string;
    sla: string;
    send: string;
    sending: string;
    successTitle: string;
    successDesc: string;
    calcTitle: string;
  };
  footer: {
    rights: string;
    craftedWith: string;
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
      aiAssistant: "AI Asystent",
      clientPortal: "Strefa Klienta",
      bookConsultation: "Umów Konsultację",
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
    },
    skills: {
      badge: "Kompetencje & Stack",
      title: "Moje",
      highlight: "umiejętności",
      radarTab: "Radar Kompetencji 360°",
      simulatorTab: "Symulator Architektury",
      benchmarkTab: "Benchmark Baz Danych",
    },
    articles: {
      badge: "Inżynieria & Baza Wiedzy",
      title: "Artykuły &",
      highlight: "analizy techniczne",
      readMore: "Czytaj pełną analizę",
      searchPlaceholder: "Szukaj (np. INP, Redis, Stripe)...",
      bookmarkAdded: "Dodano do zakładek",
      bookmarkRemoved: "Usunięto z zakładek",
    },
    contact: {
      badge: "Kontakt",
      title: "Napisz do",
      highlight: "mnie",
      sla: "Dostępny do nowych wyzwań • Odpowiedź w < 4h",
      send: "Wyślij wiadomość",
      sending: "Wysyłanie...",
      successTitle: "Wiadomość wysłana!",
      successDesc: "Dziękuję za kontakt. Odpiszę najszybciej jak to możliwe.",
      calcTitle: "Kalkulator Wyceny",
    },
    footer: {
      rights: "© 2026 GK.dev • Kodowanie w Szczecinie",
      craftedWith: "Zaprojektowane z pasją i rygorystycznym Clean Code",
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
      aiAssistant: "AI Assistant",
      clientPortal: "Client Portal",
      bookConsultation: "Book Call",
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
    },
    skills: {
      badge: "Engineering Skills & Stack",
      title: "My Core",
      highlight: "Competencies",
      radarTab: "360° Tech Radar",
      simulatorTab: "Architecture Simulator",
      benchmarkTab: "Database Benchmark",
    },
    articles: {
      badge: "Engineering Knowledge Base",
      title: "Articles &",
      highlight: "Technical Deep-Dives",
      readMore: "Read Full Analysis",
      searchPlaceholder: "Search (e.g. INP, Redis, Stripe)...",
      bookmarkAdded: "Added to Bookmarks",
      bookmarkRemoved: "Removed from Bookmarks",
    },
    contact: {
      badge: "Contact",
      title: "Get in",
      highlight: "Touch",
      sla: "Available for new projects • Reply within < 4h",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successDesc: "Thank you for reaching out. I will get back to you promptly.",
      calcTitle: "Project Estimator",
    },
    footer: {
      rights: "© 2026 GK.dev • Engineering from Szczecin, EU",
      craftedWith: "Engineered with passion and rigorous Clean Code",
    },
  },
};
