import { Language } from "./i18n-dictionary";

export interface ArticleSource {
  title: string;
  url: string;
  sourceName: string;
}

export interface ArticleContentSection {
  heading: string;
  body: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Wydajność" | "Architektura" | "SaaS & Security" | "AI & Vector Search";
  categoryEn: "Performance" | "Architecture" | "SaaS & Security" | "AI & Vector Search";
  readTime: string;
  readTimeEn: string;
  publishDate: string;
  tags: string[];
  sources: ArticleSource[];
  content: ArticleContentSection[];
  contentEn: ArticleContentSection[];
}

export const articlesData: Article[] = [
  {
    id: "core-web-vitals-nextjs-15",
    slug: "core-web-vitals-nextjs-15",
    title: "Maksymalizacja Core Web Vitals: Jak osiągnąć 100/100 w Next.js 15 i React 19",
    excerpt:
      "Głęboka analiza technik eliminacji opóźnień INP, optymalizacji LCP poniżej 0.6s oraz strategii hybrydowego streamingu SSR na krawędzi sieci (Edge CDN).",
    category: "Wydajność",
    categoryEn: "Performance",
    readTime: "5 min czytania",
    readTimeEn: "5 min read",
    publishDate: "2024-11-15",
    tags: ["React 19", "Next.js 15", "Performance", "Streaming SSR", "Edge"],
    sources: [
      {
        title: "Optimizing Interaction to Next Paint (INP) Guide",
        url: "https://web.dev/articles/optimize-inp",
        sourceName: "Google Chrome Developers (web.dev)",
      },
      {
        title: "How Next.js Partial Prerendering and Streaming Works",
        url: "https://vercel.com/blog/partial-prerendering-with-next-js-app-router",
        sourceName: "Vercel Engineering Blog",
      },
      {
        title: "React 19 Concurrent Features & Server Actions",
        url: "https://react.dev/blog/2024/04/25/react-19",
        sourceName: "React Official Documentation",
      },
    ],
    content: [
      {
        heading: "1. Redukcja Interaction to Next Paint (INP)",
        body: "Nowa metryka INP zastąpiła dawny FID i mierzy pełną responsywność interfejsu w całym cyklu życia sesji. Kluczem do uzyskania sub-50ms INP jest eliminacja blokowania wątku głównego (Long Tasks > 50ms) poprzez użycie `startTransition` oraz delegowanie ciężkich obliczeń do Web Workerów lub synchronicznych ramy `requestAnimationFrame`.",
        codeSnippet: {
          language: "tsx",
          code: `import { useTransition, useState } from "react";

export function OptimizedFilter({ allData }: { allData: Array<{ id: string; name: string }> }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(allData);

  const handleFilter = (search: string) => {
    setQuery(search); // Natychmiastowa aktualizacja pola input (0 latency)
    startTransition(() => {
      // Niekrytyczne przeliczanie listy w tle (nie blokuje wpisywania)
      setItems(allData.filter(item => item.name.toLowerCase().includes(search.toLowerCase())));
    });
  };

  return (
    <div>
      <input value={query} onChange={(e) => handleFilter(e.target.value)} />
      {isPending && <span className="spinner">Aktualizowanie...</span>}
      <ItemList items={items} />
    </div>
  );
}`,
          caption: "Wzorzec: Bezinwazyjna filtracja z useTransition w React 19",
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
    contentEn: [
      {
        heading: "1. Minimizing Interaction to Next Paint (INP)",
        body: "The INP metric measures user interaction responsiveness across the entire lifecycle of a page. Achieving sub-50ms INP requires breaking up Long Tasks (>50ms) using `useTransition` and yielding execution to the browser main thread via `scheduler.yield()` or microtask slicing.",
        codeSnippet: {
          language: "tsx",
          code: `import { useTransition, useState } from "react";

export function OptimizedFilter({ allData }: { allData: Array<{ id: string; name: string }> }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(allData);

  const handleFilter = (search: string) => {
    setQuery(search); // Instant input visual feedback
    startTransition(() => {
      // Non-blocking background filter calculation
      setItems(allData.filter(item => item.name.toLowerCase().includes(search.toLowerCase())));
    });
  };

  return (
    <div>
      <input value={query} onChange={(e) => handleFilter(e.target.value)} />
      {isPending && <span className="spinner">Updating...</span>}
      <ItemList items={items} />
    </div>
  );
}`,
          caption: "Pattern: Non-blocking filtering with React 19 useTransition",
        },
      },
      {
        heading: "2. Largest Contentful Paint (LCP) Under 600ms",
        body: "LCP optimization relies on early resource hints (`fetchpriority=\"high\"`), self-hosting WOFF2 variable typography with `font-display: swap`, and streaming SSR using Next.js Suspense boundaries to flush HTML shells before data resolution.",
      },
      {
        heading: "3. Zero-Runtime CSS & Strict JavaScript Budgets",
        body: "Combining Tailwind CSS JIT compilation with granular rollup manual chunking keeps critical entry chunks under 100 KB gzipped, ensuring rapid first contentful paint across diverse mobile network topologies.",
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
    categoryEn: "Architecture",
    readTime: "7 min czytania",
    readTimeEn: "7 min read",
    publishDate: "2024-10-28",
    tags: ["Architektura", "Node.js", "PostgreSQL", "Redis", "Mikroserwisy"],
    sources: [
      {
        title: "Modular Monolith: A Primer",
        url: "https://martinfowler.com/articles/modular-monolith.html",
        sourceName: "Martin Fowler Architecture Guide",
      },
      {
        title: "Transactional Outbox Pattern for Distributed Systems",
        url: "https://microservices.io/patterns/data/transactional-outbox.html",
        sourceName: "Microservices.io by Chris Richardson",
      },
      {
        title: "High Performance Caching Topologies with Redis",
        url: "https://redis.io/resources/cache-architectures/",
        sourceName: "Redis Architecture Engineering",
      },
    ],
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
    contentEn: [
      {
        heading: "1. The Premature Distribution Trap",
        body: "Premature microservice adoption creates distributed transaction complexity, network overhead, and infrastructural bloat. Starting with a strict Modular Monolith leveraging Domain-Driven Design (DDD) provides clear boundary isolation with zero IPC penalties.",
      },
      {
        heading: "2. Transactional Outbox Pattern for Dual-Write Safety",
        body: "When boundary extraction becomes necessary, reliable event dispatch is achieved through the Transactional Outbox pattern. Instead of direct HTTP/broker publish, events are committed within the primary ACID database transaction.",
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
          caption: "Transactional Outbox Pattern in Prisma & PostgreSQL",
        },
      },
      {
        heading: "3. Real-Time Cache-Aside & Invalidation",
        body: "Combining Redis with proactive cache-aside invalidation relieves database load by up to 94%, ensuring sub-10ms query responses during peak concurrent load.",
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
    categoryEn: "SaaS & Security",
    readTime: "6 min czytania",
    readTimeEn: "6 min read",
    publishDate: "2024-09-20",
    tags: ["Security", "Stripe API", "Auth", "RBAC", "TypeScript"],
    sources: [
      {
        title: "Stripe Webhooks Security Best Practices",
        url: "https://stripe.com/docs/webhooks/best-practices",
        sourceName: "Stripe Developer Documentation",
      },
      {
        title: "PostgreSQL Row Level Security (RLS) Deep-Dive",
        url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
        sourceName: "PostgreSQL Official Manual",
      },
      {
        title: "OWASP API Security Top 10 Guidelines",
        url: "https://owasp.org/www-project-api-security/",
        sourceName: "OWASP Foundation",
      },
    ],
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
    contentEn: [
      {
        heading: "1. Idempotency in Payment Webhook Pipelines",
        body: "Network retries and transient failures mean payment webhooks must be treated as at-least-once deliveries. Using atomic Redis `SET ... NX` locks keyed by `event.id` guarantees that credit activations or invoices execute precisely once.",
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
          caption: "Atomic Redis Idempotency Check (SET NX with TTL)",
        },
      },
      {
        heading: "2. Cryptographic HMAC SHA-256 Signature Verification",
        body: "Handling unparsed raw request buffers is mandatory for signature validation against timing attacks and replay payloads via the `Stripe-Signature` timestamp header.",
      },
      {
        heading: "3. Tenant Isolation with PostgreSQL Row-Level Security (RLS)",
        body: "Enforcing DB-level tenant policies ensures that queries executed with session claims never leak records across boundaries, decoupling security from application-layer filters.",
      },
    ],
  },
  {
    id: "ai-pgvector-rag-production",
    slug: "ai-pgvector-rag-production",
    title: "AI & Vector Search: Architektura RAG z PostgreSQL i pgvector w produkcji",
    excerpt:
      "Jak zaprojektować i wdrożyć skalowalne wyszukiwanie semantyczne oraz Retrieval-Augmented Generation (RAG) z czasem odpowiedzi poniżej 25ms.",
    category: "AI & Vector Search",
    categoryEn: "AI & Vector Search",
    readTime: "8 min czytania",
    readTimeEn: "8 min read",
    publishDate: "2024-12-05",
    tags: ["pgvector", "PostgreSQL", "AI", "RAG", "LLM", "HNSW"],
    sources: [
      {
        title: "pgvector: Open-source Vector Similarity Search for PostgreSQL",
        url: "https://github.com/pgvector/pgvector",
        sourceName: "pgvector Official Documentation",
      },
      {
        title: "Choosing between HNSW and IVFFlat Indexes for Vector Search",
        url: "https://supabase.com/blog/openai-embeddings-postgres-vector",
        sourceName: "Supabase Engineering Architecture",
      },
      {
        title: "Building Production RAG Systems: Evaluation & Latency Budgets",
        url: "https://arxiv.org/abs/2312.10997",
        sourceName: "RAG Survey Research & Benchmarks",
      },
    ],
    content: [
      {
        heading: "1. Dobór indeksu wektorowego: HNSW vs IVFFlat",
        body: "Indeksy Hierarchical Navigable Small World (HNSW) zapewniają ponad 10-krotnie wyższą przepustowość zapytań (QPS) oraz recall na poziomie 99% kosztem dłuższego czasu budowania indeksu w porównaniu do IVFFlat. W systemach produkcyjnych HNSW w połączeniu z embeddingami `text-embedding-3-small` (1536 dim) to złoty standard.",
        codeSnippet: {
          language: "sql",
          code: `-- Utworzenie tabeli wiedzy z indeksem HNSW Cosine Similarity
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON knowledge_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
          caption: "Indeks HNSW zoptymalizowany pod kątem odpytywania Cosine Distance",
        },
      },
      {
        heading: "2. Hybrydowe wyszukiwanie: Semantyczne + Full-Text (BM25)",
        body: "Łączenie wyników wektorowych z tradycyjnym indeksem pełnotekstowym PostgreSQL (`tsvector`) za pomocą algorytmu Reciprocal Rank Fusion (RRF) eliminuje halucynacje i gwarantuje odnajdywanie specyficznych numerów seryjnych lub identyfikatorów.",
      },
      {
        heading: "3. Semantic Caching z czasem odpowiedzi < 5ms",
        body: "Przechowywanie zapytań w warstwie cache'ującej Redis z progiem podobieństwa cosinusowego 0.96 pozwala serwować ponad 40% odpowiedzi bez konieczności ponownego odpytywania modelu LLM, redukując koszty API o 60%.",
      },
    ],
    contentEn: [
      {
        heading: "1. Vector Index Selection: HNSW vs IVFFlat",
        body: "Hierarchical Navigable Small World (HNSW) graphs offer 10x higher queries per second with 99%+ recall rates compared to IVFFlat list partitioning. For production workloads with 1536-dimensional embeddings, HNSW is the gold standard.",
        codeSnippet: {
          language: "sql",
          code: `-- Knowledge table schema with optimized HNSW index
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON knowledge_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
          caption: "HNSW Vector Index with Cosine Distance Operator",
        },
      },
      {
        heading: "2. Hybrid Search: Dense Vector + Sparse BM25 (RRF)",
        body: "Combining dense vector embeddings with PostgreSQL full-text search (`tsvector`) using Reciprocal Rank Fusion (RRF) avoids hallucination gaps on exact keyword match requirements.",
      },
      {
        heading: "3. Sub-5ms Semantic Caching",
        body: "Intercepting user queries in Redis using a 0.96 cosine threshold allows serving 40%+ of identical user intents directly without invoking generative LLM inference, slashing API costs.",
      },
    ],
  },
];

