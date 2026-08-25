/**
 * 100% Free, Client-Side Local Intelligent Assistant Knowledge Engine
 * Zero external API calls, zero latency, runs entirely in the user's browser.
 */

export interface AiResponse {
  answer: string;
  category: "availability" | "stack" | "projects" | "architecture" | "pricing" | "general";
  suggestedAction?: {
    label: string;
    targetHref: string;
  };
}

interface KnowledgeItem {
  keywords: string[];
  response: AiResponse;
}

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ["dostepnosc", "dostepny", "termin", "b2b", "praca", "zatrudnienie", "zlecenie", "kiedy", "etat", "kontrakt", "freelance"],
    response: {
      answer: "🟢 **Grzegorz jest aktualnie dostępny do nowych wyzwań i projektów!**\n\n- **Model:** B2B / Kontrakt / Dedykowane wdrożenia komercyjne\n- **Lokalizacja:** Remote (100% zdalnie) lub hybrydowo ze Szczecina\n- **Czas reakcji:** Zazwyczaj poniżej 4 godzin\n- **Status:** Gotowy do startu od zaraz przy nowych produktach SaaS, portalach webowych i aplikacjach mobilnych.",
      category: "availability",
      suggestedAction: { label: "Napisz do Grzegorza", targetHref: "#kontakt" },
    },
  },
  {
    keywords: ["stack", "technologie", "technologia", "react", "typescript", "next", "node", "backend", "frontend", "postgres", "aws", "docker", "tailwindcss"],
    response: {
      answer: "⚡ **Główny Stack Technologiczny Grzegorza:**\n\n- **Frontend:** React 19, TypeScript 5, Next.js 15 (App Router / SSR), Tailwind CSS, Motion\n- **Backend & API:** Node.js, NestJS, Express, PostgreSQL, Prisma ORM, Redis, GraphQL\n- **Cloud & DevOps:** AWS (S3, CloudFront, Lambda, ECS), Docker, CI/CD GitHub Actions\n- **Standardy:** 100/100 Core Web Vitals, Strict TypeScript, testy Vitest & Playwright, architektura mikroserwisowa.",
      category: "stack",
      suggestedAction: { label: "Zobacz Radar Umiejętności", targetHref: "#umiejetnosci" },
    },
  },
  {
    keywords: ["certyfikaty", "edukacja", "studia", "kursy", "dyplom", "kwalifikacje", "meta", "aws certified", "doswiadczenie"],
    response: {
      answer: "🎓 **Certyfikacje i Kwalifikacje:**\n\n1. **AWS Certified Solutions Architect – Associate** (Architektura chmurowa, skalowalność i bezpieczeństwo)\n2. **Meta Senior Front-End Developer** (Zaawansowane wzorce React, optymalizacja 60 FPS, dostępność a11y)\n3. **Tytuł Inżyniera Informatyki** (7+ lat komercyjnego doświadczenia w delivery systemów webowych).",
      category: "general",
      suggestedAction: { label: "Zobacz Oś Kariery", targetHref: "#o-mnie" },
    },
  },
  {
    keywords: ["projekty", "portfolio", "aura", "ufisza", "case study", "realizacje", "sklep", "saas", "aplikacje"],
    response: {
      answer: "🚀 **Kluczowe Realizacje Komercyjne:**\n\n- **AURA Intelligence Platform:** Nowoczesny system SaaS z analityką AI w czasie rzeczywistym, subskrypcjami Stripe i czasem odpowiedzi poniżej 50ms.\n- **uFISZA Commerce:** Sklep internetowy high-end z czasem przejścia do kasy <45s i wynikiem +145% konwersji mobilnej.\n- **Wszystkie projekty** posiadają podgląd w ramkach MacBook Pro & iPhone oraz wynik Lighthouse 98-100.",
      category: "projects",
      suggestedAction: { label: "Przeglądaj Projekty", targetHref: "#projekty" },
    },
  },
  {
    keywords: ["cena", "cennik", "koszt", "budzet", "stawka", "ile", "wycena", "estymacja", "pieniadze"],
    response: {
      answer: "💰 **Orientacyjne Widełki Budżetowe i Czasowe:**\n\n- **Wizytówka / High-End Landing Page:** od 3 500 PLN (~1.5 tyg.)\n- **Platforma E-Commerce:** od 8 000 PLN (~3 tyg.)\n- **Dedykowany MVP SaaS / Web App:** od 12 000 PLN (~4 tyg.)\n\nKażdy projekt zawiera pełne prawa autorskie (NDA), testy automatyczne, optymalizację SEO i 30 dni bezpłatnego wsparcia powdrożeniowego.",
      category: "pricing",
      suggestedAction: { label: "Otwórz Kalkulator Projektu", targetHref: "#kontakt" },
    },
  },
  {
    keywords: ["architektura", "mvp", "jak zbudowac", "rekomendacja", "doradztwo", "pomysl", "skalowalnosc", "baza danych"],
    response: {
      answer: "🏛️ **Rekomendowana Architektura dla Nowego Produktu (2026):**\n\n1. **Frontend & Baza:** Next.js 15 (App Router) + Tailwind CSS + PostgreSQL (Supabase / AWS RDS)\n2. **Uwierzytelnianie & Płatności:** NextAuth / Clerk + Stripe Webhooks\n3. **Hosting & CDN:** Vercel lub AWS z CloudFront dla globalnego cache'owania sub-50ms\n4. **Wydajność:** Modułowy podział komponentów i pełna typizacja TypeScript end-to-end.",
      category: "architecture",
      suggestedAction: { label: "Omów Architekturę", targetHref: "#kontakt" },
    },
  },
];

const fallbackResponse: AiResponse = {
  answer: "🤖 **Jestem asystentem inżynieryjnym Grzegorza.**\n\nChętnie odpowiem na pytania o:\n- Dostępność do projektów i terminy B2B\n- Doświadczenie w React 19, TypeScript, Next.js i Node.js\n- Architekturę systemów chmurowych i SaaS\n- Szacunkową wycenę i czas realizacji Twojego pomysłu.\n\nMożesz też skontaktować się bezpośrednio z Grzegorzem pod adresem **kontakt@gkdev.pl**.",
  category: "general",
  suggestedAction: { label: "Przejdź do formularza", targetHref: "#kontakt" },
};

/**
 * Parses a user query and returns matching answer from the local knowledge base.
 */
export function queryAiAssistant(input: string): AiResponse {
  const cleanInput = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (!cleanInput) return fallbackResponse;

  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    for (const keyword of item.keywords) {
      const cleanKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (cleanInput.includes(cleanKeyword)) {
        score += 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  return fallbackResponse;
}
