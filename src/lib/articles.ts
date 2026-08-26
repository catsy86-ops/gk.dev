export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Wydajność" | "Architektura" | "SaaS & Security";
  readTime: string;
  publishDate: string;
  tags: string[];
  content: {
    heading: string;
    body: string;
    codeSnippet?: {
      language: string;
      code: string;
      caption?: string;
    };
  }[];
}

export const articlesData: Article[] = [
  {
    id: "core-web-vitals-nextjs-15",
    slug: "core-web-vitals-nextjs-15",
    title: "Maksymalizacja Core Web Vitals: Jak osiągnąć 100/100 w Next.js 15 i React 19",
    excerpt:
      "Głęboka analiza technik eliminacji opóźnień INP, optymalizacji LCP poniżej 0.6s oraz strategii hybrydowego streamingu SSR na krawędzi sieci (Edge CDN).",
    category: "Wydajność",
    readTime: "5 min czytania",
    publishDate: "2024-11-15",
    tags: ["React 19", "Next.js 15", "Web Vitals", "Lighthouse", "Edge"],
    content: [
      {
        heading: "1. Redukcja Interaction to Next Paint (INP)",
        body: "Nowa metryka INP zastąpiła dawny FID i mierzy pełną responsywność interfejsu w całym cyklu życia sesji. Kluczem do uzyskania sub-50ms INP jest eliminacja blokowania wątku głównego (Long Tasks > 50ms) poprzez użycie `startTransition` oraz delegowanie ciężkich obliczeń do Web Workerów lub synchronicznych ramy `requestAnimationFrame`.",
        codeSnippet: {
          language: "tsx",
          code: `import { useTransition, useState } from "react";

export function OptimizedFilter() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(allData);

  const handleFilter = (query: string) => {
    // Nie blokujemy wpisywania w pole input
    startTransition(() => {
      setItems(allData.filter(item => item.name.includes(query)));
    });
  };

  return <SearchInput onChange={handleFilter} isPending={isPending} />;
}`,
          caption: "Przykład: Bezinwazyjna filtracja z useTransition w React 19",
        },
      },
      {
        heading: "2. Largest Contentful Paint (LCP) poniżej 600ms",
        body: "Dla optymalizacji LCP kluczowe jest wcześniejsze dostarczenie krytycznego zasobu graficznego z nagłówkiem `fetchpriority=\"high\"`, eliminacja ładowania fontów blokujących render (użycie formatu WOFF2 ze zmiennym krojem `font-display: swap`) oraz streaming SSR w Next.js z komponentami `<Suspense>`.",
      },
      {
        heading: "3. Zero-Runtime CSS i budżet JavaScript",
        body: "Przejście na Tailwind CSS z kompilacją JIT oraz dynamiczny code-splitting z rollup/manualChunks pozwala obniżyć wagę krytycznego bundle'a poniżej 100 KB gzip, co bezpośrednio przekłada się na natychmiastowe FCP (First Contentful Paint).",
      },
    ],
  },
  {
    id: "microservices-vs-modular-monolith",
    slug: "microservices-vs-modular-monolith",
    title: "Architektura Mikroserwisów vs Modularny Monolit: Kiedy i jak skalować",
    excerpt:
      "Praktyczne studium przypadków wyboru architektury backendowej. Od wzorca Outbox Pattern i kolejki zdarzeń w Redis, po bazy relacyjne PostgreSQL i pgvector.",
    category: "Architektura",
    readTime: "7 min czytania",
    publishDate: "2024-10-28",
    tags: ["Architektura", "Node.js", "PostgreSQL", "Redis", "Mikroserwisy"],
    content: [
      {
        heading: "1. Pułapka przedwczesnej dystrybucji",
        body: "Wielu inżynierów popełnia błąd wdrażania dziesiątek mikroserwisów w fazie MVP, co skutkuje narzutem sieciowym, skomplikowanym śledzeniem transakcji rozproszonych (Saga Pattern) i wysokim kosztem infrastruktury. Rekomendowanym podejściem jest rozpoczęcie od dobrze odseparowanego Modularnego Monolitu w oparciu o czyste domeny (DDD).",
      },
      {
        heading: "2. Transakcyjny Outbox Pattern dla spójności zdarzeń",
        body: "Gdy wydzielenie mikroserwisu staje się konieczne z uwagi na skalę zespołową, niezawodność gwarantuje wzorzec Transactional Outbox. Zamiast publikować zdarzenie do brokera bezpośrednio w bloku HTTP, zapisujemy je w tej samej transakcji ACID w bazie danych.",
        codeSnippet: {
          language: "ts",
          code: `async function createOrder(client: PrismaClient, orderData: OrderDto) {
  return await client.$transaction(async (tx) => {
    const order = await tx.order.create({ data: orderData });
    await tx.outboxEvent.create({
      data: {
        eventType: "OrderCreated",
        payload: JSON.stringify(order),
        status: "PENDING",
      },
    });
    return order;
  });
}`,
          caption: "Wzorzec Transactional Outbox w Prisma & PostgreSQL",
        },
      },
      {
        heading: "3. Cache-Aside i Invalidacja w czasie rzeczywistym",
        body: "Połączenie Redis Cluster z kluczami TTL i webhookami unieważniania danych eliminuje ponad 90% powtarzalnych zapytań SQL typu SELECT, pozwalając bazie danych skupić się wyłącznie na zapisach i transakcjach.",
      },
    ],
  },
  {
    id: "saas-security-stripe-webhooks",
    slug: "saas-security-stripe-webhooks",
    title: "Bezpieczeństwo Platform SaaS: Idempotencja, Webhooki Stripe i RBAC",
    excerpt:
      "Standardy tworzenia bezpiecznych systemów płatności subskrypcyjnych, weryfikacji podpisów kryptograficznych HMAC oraz granularnej kontroli dostępu opartej na rolach.",
    category: "SaaS & Security",
    readTime: "6 min czytania",
    publishDate: "2024-09-20",
    tags: ["Security", "Stripe API", "Auth", "RBAC", "TypeScript"],
    content: [
      {
        heading: "1. Idempotencja w przetwarzaniu webhooków płatniczych",
        body: "Webhooki mogą zostać dostarczone wielokrotnie w przypadku problemów z siecią lub ponowień po stronie dostawcy (np. Stripe). Każde zdarzenie musi posiadać unikalny klucz idempotencji (idempotency key) zapisywany w bazie lub cache'u Redis przed wykonaniem operacji na koncie klienta.",
        codeSnippet: {
          language: "ts",
          code: `export async function handleWebhookEvent(event: Stripe.Event) {
  const isProcessed = await redis.set(\`webhook:\${event.id}\`, "1", "NX", "EX", 86400);
  if (!isProcessed) {
    return { status: "already_processed" };
  }

  switch (event.type) {
    case "invoice.payment_succeeded":
      await activateUserSubscription(event.data.object);
      break;
  }
  return { status: "success" };
}`,
          caption: "Atomowa weryfikacja idempotencji w Redis (SET NX)",
        },
      },
      {
        heading: "2. Weryfikacja sygnatury HMAC SHA-256",
        body: "Przetwarzanie surowego strumienia bajtów (`raw body`) jest niezbędne do weryfikacji kryptograficznego podpisu `Stripe-Signature`, co chroni endpoint przed atakami typu Replay i Man-in-the-Middle.",
      },
      {
        heading: "3. Granularny RBAC & Row-Level Security (RLS)",
        body: "W architekturach multi-tenant każda tabela powinna zawierać `tenant_id` powiązany z politykami PostgreSQL RLS, uniemożliwiając wyciek danych pomiędzy organizacjami nawet w przypadku błędu w warstwie aplikacji.",
      },
    ],
  },
];
