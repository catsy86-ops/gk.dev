/**
 * Mobile Utilities: Web Share API & vCard generator
 */

import { hapticSuccess, hapticLight } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";

export interface ShareDataPayload {
  title: string;
  text: string;
  url: string;
}

/**
 * Trigger native mobile share sheet or fallback to clipboard
 */
export async function sharePortfolio(payload?: Partial<ShareDataPayload>): Promise<void> {
  const shareData: ShareDataPayload = {
    title: payload?.title || "Grzegorz — Mid Fullstack Developer (GK.dev)",
    text: payload?.text || "Sprawdź portfolio, projekty i interaktywne demo Grzegorza ze Szczecina!",
    url: payload?.url || (typeof window !== "undefined" ? window.location.origin : "https://gkdev.pl"),
  };

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(shareData);
      hapticSuccess();
      return;
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return; // User cancelled share sheet
      }
    }
  }

  // Fallback: Copy URL to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      hapticSuccess();
      toast({
        title: "Skopiowano link do schowka! 📋",
        description: shareData.url,
      });
      return;
    } catch {
      // Ignore
    }
  }

  toast({
    title: "Udostępnij portfolio",
    description: shareData.url,
  });
}

/**
 * Generate and download Grzegorz vCard (.vcf) directly into phone contacts
 */
export function downloadVCard(): void {
  hapticLight();
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:;Grzegorz;;;",
    "FN:Grzegorz (GK.dev)",
    "TITLE:Mid Fullstack Developer",
    "ORG:GK.dev Software",
    "EMAIL;TYPE=INTERNET,PREF:kontakt@gkdev.pl",
    "URL:https://gkdev.pl",
    "NOTE:Mid Fullstack Developer ze Szczecina • React 19, TypeScript, Node.js",
    "END:VCARD",
  ].join("\r\n");

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Grzegorz_GKdev_Wizytowka.vcf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  hapticSuccess();
  toast({
    title: "Pobrano wizytówkę vCard! 📇",
    description: "Możesz dodać kontakt bezpośrednio do książki telefonicznej.",
  });
}
