import { describe, it, expect } from "vitest";
import { executeCodeInWorker } from "@/lib/code-runner";

describe("Web Worker Code Execution Sandbox Suite", () => {
  it("executes valid JavaScript code and captures console output", async () => {
    const code = `
      const x = 10;
      const y = 20;
      console.log("Suma:", x + y);
      return x * y;
    `;

    const result = await executeCodeInWorker(code);
    expect(result.success).toBe(true);
    expect(result.output).toContain("Suma: 30");
    expect(result.output).toContain("200");
  });

  it("handles and formats runtime errors cleanly", async () => {
    const code = `
      const obj = null;
      obj.invalidPropertyAccess();
    `;

    const result = await executeCodeInWorker(code);
    expect(result.success).toBe(false);
    expect(result.output).toContain("Runtime Error");
  });

  it("formats structured arrays and objects cleanly", async () => {
    const code = `
      const user = { name: "Grzegorz", role: "Architect", active: true };
      console.log(user);
    `;

    const result = await executeCodeInWorker(code);
    expect(result.success).toBe(true);
    expect(result.output).toContain("Grzegorz");
    expect(result.output).toContain("Architect");
  });
});
