import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detect slow network conditions using the Network Information API.
 * Returns true when save-data is enabled or connection is 2g/slow-2g.
 */
export function isSlowConnection(): boolean {
  const conn = (navigator as any).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  const slowTypes = ["2g", "slow-2g"];
  if (slowTypes.includes(conn.effectiveType)) return true;
  return false;
}
