/**
 * Advanced GKgadu Real-Time Data Pipeline & Cache Mesh
 * Simulates low-latency in-memory cache (Redis/Upstash KV),
 * high-throughput stream event log (Kafka/PubSub topic mesh),
 * and persistent local caching with TTL.
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export interface KafkaStreamEvent {
  topic: "gkgadu-messages" | "gkgadu-presence" | "gkgadu-auth-siema";
  offset: number;
  key: string;
  partition: number;
  timestamp: number;
  value: unknown;
}

class GkgaduRealtimeDataPipeline {
  private redisCache = new Map<string, CacheEntry<unknown>>();
  private kafkaTopicOffsets: Record<string, number> = {
    "gkgadu-messages": 1000,
    "gkgadu-presence": 2000,
    "gkgadu-auth-siema": 500,
  };
  private streamListeners: Array<(event: KafkaStreamEvent) => void> = [];

  constructor() {
    // Restore local Redis snapshot if available
    if (typeof localStorage !== "undefined") {
      try {
        const snapshot = localStorage.getItem("gkgadu_redis_cache_snapshot");
        if (snapshot) {
          const parsed = JSON.parse(snapshot);
          for (const [k, v] of Object.entries(parsed)) {
            this.redisCache.set(k, v as CacheEntry<unknown>);
          }
        }
      } catch {
        // Ignore cache storage errors
      }
    }
  }

  /**
   * Redis Set with TTL (Time To Live in ms)
   */
  public redisSet<T>(key: string, data: T, ttlMs = 3600000): void {
    this.redisCache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
    this.persistRedisSnapshot();
  }

  /**
   * Redis Get with automatic TTL invalidation
   */
  public redisGet<T>(key: string): T | null {
    const entry = this.redisCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.redisCache.delete(key);
      this.persistRedisSnapshot();
      return null;
    }

    return entry.data;
  }

  /**
   * Publish event to Kafka stream topic
   */
  public kafkaPublish(topic: KafkaStreamEvent["topic"], key: string, value: unknown): KafkaStreamEvent {
    this.kafkaTopicOffsets[topic] = (this.kafkaTopicOffsets[topic] || 0) + 1;
    const event: KafkaStreamEvent = {
      topic,
      offset: this.kafkaTopicOffsets[topic],
      key,
      partition: Math.abs(key.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)) % 4,
      timestamp: Date.now(),
      value,
    };

    // Cache latest event in Redis under stream key
    this.redisSet(`kafka:stream:${topic}:${key}`, event, 86400000);

    // Notify local subscribers
    for (const listener of this.streamListeners) {
      try {
        listener(event);
      } catch {
        // Ignore listener error
      }
    }

    return event;
  }

  /**
   * Subscribe to Kafka streaming events
   */
  public kafkaSubscribe(listener: (event: KafkaStreamEvent) => void): () => void {
    this.streamListeners.push(listener);
    return () => {
      this.streamListeners = this.streamListeners.filter((l) => l !== listener);
    };
  }

  private persistRedisSnapshot(): void {
    if (typeof localStorage === "undefined") return;
    try {
      const obj: Record<string, unknown> = {};
      let count = 0;
      for (const [k, v] of this.redisCache.entries()) {
        if (count++ > 50) break; // Limit snapshot size
        obj[k] = v;
      }
      localStorage.setItem("gkgadu_redis_cache_snapshot", JSON.stringify(obj));
    } catch {
      // Ignore storage quota
    }
  }
}

export const gkgaduDataPipeline = new GkgaduRealtimeDataPipeline();
