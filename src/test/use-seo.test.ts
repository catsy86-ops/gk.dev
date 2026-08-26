import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSeo } from "@/hooks/use-seo";
import { I18nProvider } from "@/components/I18nProvider";

describe("Dynamic SEO & Meta i18n Synchronizer Suite", () => {
  it("synchronizes document title, description and Schema.org JSON-LD", () => {
    renderHook(() => useSeo(), {
      wrapper: I18nProvider,
    });

    expect(document.title).toContain("GK.dev");
    expect(document.documentElement.lang).toBe("pl");

    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta).not.toBeNull();
    expect(descriptionMeta?.getAttribute("content")).toContain("React 19");

    const jsonLd = document.getElementById("gkdev-dynamic-jsonld");
    expect(jsonLd).not.toBeNull();
    expect(jsonLd?.textContent).toContain("Grzegorz");
    expect(jsonLd?.textContent).toContain("https://schema.org");
  });
});
