import { Cpu, Server, Database, Globe, Zap, Shield, Activity, Bot, HardDrive } from "lucide-react";

export interface ArchitecturePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  nodes: {
    id: string;
    label: string;
    type: "client" | "edge" | "gateway" | "service" | "cache" | "database" | "ai";
    icon: typeof Cpu;
    status: "healthy" | "busy" | "cached" | "standby";
    latency: string;
  }[];
  defaultMetrics: {
    ttfb: number;
    cacheHitRate: number;
    p99Latency: number;
    throughput: number;
  };
}

export const architecturePresets: ArchitecturePreset[] = [
  {
    id: "saas-edge",
    name: "Global Next.js 15 + Edge CDN",
    category: "Web & SaaS Architecture",
    description:
      "Hybrydowy rendering SSR na krawędzi sieci (Edge) z inteligentnym cache'owaniem Redis i bazą PostgreSQL.",
    nodes: [
      { id: "client", label: "User Browser", type: "client", icon: Globe, status: "healthy", latency: "1ms" },
      { id: "edge", label: "Cloudflare Edge", type: "edge", icon: Zap, status: "cached", latency: "12ms" },
      { id: "gateway", label: "API Gateway", type: "gateway", icon: Shield, status: "healthy", latency: "8ms" },
      { id: "service", label: "Node.js Microservice", type: "service", icon: Server, status: "busy", latency: "18ms" },
      { id: "cache", label: "Redis Cluster", type: "cache", icon: HardDrive, status: "cached", latency: "2ms" },
      { id: "db", label: "PostgreSQL (AWS RDS)", type: "database", icon: Database, status: "healthy", latency: "14ms" },
    ],
    defaultMetrics: {
      ttfb: 18,
      cacheHitRate: 98.6,
      p99Latency: 35,
      throughput: 12500,
    },
  },
  {
    id: "ai-rag",
    name: "AI Agent & Vector Search RAG Pipeline",
    category: "AI & Modern Data",
    description:
      "Strumieniowanie odpowiedzi LLM z lokalnym wektoryzowaniem embeddingów i dynamicznym buforowaniem kontekstu.",
    nodes: [
      { id: "client", label: "Chat Client", type: "client", icon: Globe, status: "healthy", latency: "2ms" },
      { id: "gateway", label: "Streaming Proxy", type: "gateway", icon: Zap, status: "healthy", latency: "15ms" },
      { id: "ai", label: "LLM Inference Engine", type: "ai", icon: Bot, status: "busy", latency: "85ms" },
      { id: "cache", label: "Semantic Cache", type: "cache", icon: HardDrive, status: "cached", latency: "4ms" },
      { id: "db", label: "Vector DB (pgvector)", type: "database", icon: Database, status: "healthy", latency: "22ms" },
    ],
    defaultMetrics: {
      ttfb: 42,
      cacheHitRate: 94.2,
      p99Latency: 110,
      throughput: 4200,
    },
  },
  {
    id: "event-driven",
    name: "Event-Driven Realtime Engine (WebSockets)",
    category: "Realtime Collaboration",
    description:
      "Dwukierunkowa synchronizacja stanu w czasie rzeczywistym z obsługą kolejki zdarzeń i trybem Offline-First.",
    nodes: [
      { id: "client", label: "App Client (PWA)", type: "client", icon: Globe, status: "healthy", latency: "0ms" },
      { id: "gateway", label: "WebSocket Gateway", type: "gateway", icon: Activity, status: "busy", latency: "6ms" },
      { id: "service", label: "Worker Queue", type: "service", icon: Server, status: "busy", latency: "12ms" },
      { id: "cache", label: "Pub/Sub Redis", type: "cache", icon: HardDrive, status: "cached", latency: "3ms" },
      { id: "db", label: "Event Store DB", type: "database", icon: Database, status: "healthy", latency: "16ms" },
    ],
    defaultMetrics: {
      ttfb: 8,
      cacheHitRate: 99.1,
      p99Latency: 22,
      throughput: 28000,
    },
  },
];
