export interface BenchmarkTarget {
  id: string;
  name: string;
  engine: string;
  type: string;
  baseLatencyMs: number;
  complexity: string;
  color: string;
  description: string;
}

export const benchmarkTargets: BenchmarkTarget[] = [
  {
    id: "redis",
    name: "Redis In-Memory Cluster",
    engine: "Redis 7.2 (RAM Cache-Aside)",
    type: "O(1) Hash Lookup",
    baseLatencyMs: 0.8,
    complexity: "Sub-millisecond",
    color: "bg-emerald-500",
    description: "Klucz w pamięci operacyjnej z TTL – idealny dla sesji, koszyków i cache'owania zapytań SQL.",
  },
  {
    id: "postgres-btree",
    name: "PostgreSQL B-Tree Index",
    engine: "PostgreSQL 16 (AWS RDS)",
    type: "O(log N) Indexed SELECT",
    baseLatencyMs: 12.4,
    complexity: "Optimal ACID Query",
    color: "bg-primary",
    description: "Zapytanie relacyjne po unikalnym indeksie B-Tree z buforowaniem stron w buforze shared_buffers.",
  },
  {
    id: "pgvector-hnsw",
    name: "pgvector HNSW Vector Search",
    engine: "pgvector (Cosine Distance)",
    type: "Nearest Neighbor (1536 dim)",
    baseLatencyMs: 18.6,
    complexity: "High-Dimensional Search",
    color: "bg-cyan-500",
    description: "Wyszukiwanie semantyczne wektorów OpenAI text-embedding-3-small z indeksem HNSW.",
  },
  {
    id: "full-scan",
    name: "Full Table Scan (Brak Indeksu)",
    engine: "PostgreSQL Seq Scan",
    type: "O(N) Disk I/O Scan",
    baseLatencyMs: 142.0,
    complexity: "Slow / Unindexed",
    color: "bg-destructive",
    description: "Sekwencyjne skanowanie 1 000 000 wierszy z dysku SSD – scenariusz wymagający refaktoryzacji indeksów.",
  },
];
