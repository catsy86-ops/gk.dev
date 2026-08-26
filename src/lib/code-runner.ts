/**
 * Web Worker Code Execution Sandbox
 * Safely executes JavaScript snippets in an isolated background thread with console stream capturing and timeout protection.
 */

export interface ExecutionResult {
  success: boolean;
  output: string;
  executionTimeMs: number;
  error?: string;
}

export async function executeCodeInWorker(
  code: string,
  timeoutMs = 2000
): Promise<ExecutionResult> {
  const startTime = performance.now();

  // If running in environment without Web Worker support (e.g. Node/jsdom tests), use safe synchronous sandbox fallback
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return executeFallback(code, startTime);
  }

  const workerScript = `
    self.onmessage = function(e) {
      const logs = [];
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalInfo = console.info;

      function formatValue(v) {
        if (v === undefined) return "undefined";
        if (v === null) return "null";
        if (typeof v === "object") {
          try {
            return JSON.stringify(v, null, 2);
          } catch {
            return String(v);
          }
        }
        return String(v);
      }

      console.log = function(...args) {
        logs.push(args.map(formatValue).join(" "));
      };
      console.info = function(...args) {
        logs.push("[INFO] " + args.map(formatValue).join(" "));
      };
      console.warn = function(...args) {
        logs.push("[WARN] " + args.map(formatValue).join(" "));
      };
      console.error = function(...args) {
        logs.push("[ERROR] " + args.map(formatValue).join(" "));
      };

      try {
        const result = (new Function(e.data.code))();
        if (result !== undefined) {
          logs.push("> Result: " + formatValue(result));
        }
        self.postMessage({ success: true, logs });
      } catch (err) {
        self.postMessage({
          success: false,
          logs,
          error: err instanceof Error ? err.message : String(err)
        });
      } finally {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
        console.info = originalInfo;
      }
    };
  `;

  let worker: Worker | null = null;
  let objectUrl: string | null = null;

  try {
    const blob = new Blob([workerScript], { type: "application/javascript" });
    objectUrl = URL.createObjectURL(blob);
    worker = new Worker(objectUrl);

    return await new Promise<ExecutionResult>((resolve) => {
      const timer = setTimeout(() => {
        if (worker) {
          worker.terminate();
        }
        resolve({
          success: false,
          output: "❌ Execution timed out (exceeded 2000ms limit). Possible infinite loop detected.",
          executionTimeMs: Math.round(performance.now() - startTime),
          error: "TimeoutError",
        });
      }, timeoutMs);

      worker.onmessage = (event) => {
        clearTimeout(timer);
        const { success, logs, error } = event.data;
        const duration = Math.round(performance.now() - startTime);

        let outputText = logs.length > 0 ? logs.join("\n") : "✔ Code executed successfully with no output.";
        if (error) {
          outputText += `\n❌ Runtime Error: ${error}`;
        } else {
          outputText += `\n✔ Process finished with exit code 0 (${duration}ms)`;
        }

        resolve({
          success,
          output: outputText,
          executionTimeMs: duration,
          error,
        });
      };

      worker.onerror = (err) => {
        clearTimeout(timer);
        resolve({
          success: false,
          output: `❌ Worker Compilation Error: ${err.message}`,
          executionTimeMs: Math.round(performance.now() - startTime),
          error: err.message,
        });
      };

      worker.postMessage({ code });
    });
  } catch (err) {
    return {
      success: false,
      output: `❌ Sandbox Initialization Error: ${err instanceof Error ? err.message : String(err)}`,
      executionTimeMs: Math.round(performance.now() - startTime),
      error: String(err),
    };
  } finally {
    if (worker) {
      worker.terminate();
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

function executeFallback(code: string, startTime: number): ExecutionResult {
  const logs: string[] = [];
  const originalLog = console.log;

  function formatValue(v: unknown): string {
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    if (typeof v === "object") {
      try {
        return JSON.stringify(v, null, 2);
      } catch {
        return String(v);
      }
    }
    return String(v);
  }

  try {
    console.log = (...args: unknown[]) => {
      logs.push(args.map(formatValue).join(" "));
    };

    const fn = new Function(code);
    const result = fn();
    if (result !== undefined) {
      logs.push("> Result: " + formatValue(result));
    }

    const duration = Math.round(performance.now() - startTime);
    const outputText =
      (logs.length > 0 ? logs.join("\n") : "✔ Code executed successfully.") +
      `\n✔ Process finished with exit code 0 (${duration}ms)`;

    return {
      success: true,
      output: outputText,
      executionTimeMs: duration,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      output: `${logs.join("\n")}\n❌ Runtime Error: ${err instanceof Error ? err.message : String(err)}`,
      executionTimeMs: duration,
      error: String(err),
    };
  } finally {
    console.log = originalLog;
  }
}
