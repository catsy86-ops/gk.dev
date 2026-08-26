---
name: ai-rag-architect
description: >-
  Rozwija i optymalizuje interaktywnego asystenta AI w projekcie GK.dev (ai-engine.ts,
  AiAssistantDialog.tsx). Projektuje bazę wiedzy RAG (Retrieval-Augmented Generation),
  integrację z Supabase pgvector, modele embeddingów, podpowiedzi architektoniczne
  oraz bezpieczną obsługę zapytań użytkowników.
---

# AI & RAG Architect (`ai-rag-architect`)

Ten skill definiuje standardy projektowania i rozwoju silnika sztucznej inteligencji **AI Architect Assistant** w projekcie **GK.dev**.

---

## 1. Architektura Silnika AI (`src/lib/ai-engine.ts`)

1. **Hybrydowy Model Odpowiedzi**:
   * **Silnik Reguł & Baza Wiedzy w Pamięci**: Błyskawiczne odpowiedzi na typowe pytania o stack technologiczny (Next.js 15, React 19, Supabase, Clerk, Docker, Kubernetes, Web Vitals, wyceny i stawki B2B).
   * **Generowanie Wycen i Szacunków Architektonicznych**: Automatyczne sugerowanie rekomendowanego stacku, timeline i estymacji budżetowej na podstawie opisu projektu klienta.
2. **Rozszerzenie o Wyszukiwanie Semantyczne (Supabase pgvector)**:
   * Indeksowanie briefów, artykułów technicznych i case studies jako wektorów embeddingów w bazie Supabase.
   * Wyszukiwanie cosinusowe (`match_documents` RPC) wzbogacające prompt LLM o precyzyjny kontekst portfolio.

---

## 2. Dobre Praktyki UX i Bezpieczeństwa

* **Brak Wycieku Kluczy Prywatnych**: Zapytania do zewnętrznych modeli LLM (OpenAI, Gemini, Anthropic) mogą być wykonywane wyłącznie przez zabezpieczone Edge Functions z autoryzacją sesji Clerk / Supabase.
* **Formatowanie Markdown**: Odpowiedzi asystenta muszą być sformatowane w czytelnym Markdown z listami, pogrubieniami i blokami kodu.
* **Telemetria**: Logowanie anonimowych zapytań o technologie w celu analizy trendów zainteresowania klientów.
