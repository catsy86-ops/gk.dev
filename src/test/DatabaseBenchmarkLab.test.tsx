import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatabaseBenchmarkLab } from "@/components/DatabaseBenchmarkLab";

describe("DatabaseBenchmarkLab", () => {
  it("renders benchmark targets and allows running live latency queries", () => {
    render(<DatabaseBenchmarkLab />);

    expect(screen.getByText("Laboratorium Benchmarków Bazodanowych & AI Vector")).toBeInTheDocument();
    expect(screen.getByText("Redis In-Memory Cluster")).toBeInTheDocument();
    expect(screen.getByText("pgvector HNSW Vector Search")).toBeInTheDocument();

    const runBtn = screen.getByText("Uruchom Benchmark na Żywo");
    expect(runBtn).toBeInTheDocument();

    fireEvent.click(runBtn);
    expect(screen.getByText("Wykonywanie zapytań...")).toBeInTheDocument();
  });
});
