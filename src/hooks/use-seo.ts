import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function useSeo(customConfig?: SeoConfig) {
  const { lang, t } = useI18n();

  useEffect(() => {
    const isPl = lang === "pl";

    const title =
      customConfig?.title ||
      (isPl
        ? "GK.dev — Grzegorz | Senior Fullstack Developer & Cloud Architect"
        : "GK.dev — Grzegorz | Senior Fullstack Engineer & Cloud Architect");

    const description =
      customConfig?.description ||
      (isPl
        ? "Projektowanie i wdrażanie nowoczesnych platform SaaS, aplikacji webowych i architektur cloud w React 19, TypeScript, Node.js i AWS. Sprawdź case studies i bazę wiedzy."
        : "Architecting high-performance SaaS platforms, cloud-native systems and modern web applications in React 19, TypeScript, Node.js and AWS. Explore interactive case studies.");

    const url = customConfig?.url || "https://gkdev.pl";
    const image = customConfig?.image || "https://gkdev.pl/og-image.png";

    // 1. Update Document Title
    document.title = title;

    // Helper to safely set meta tag content
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", isPl
      ? "Fullstack Developer, React 19, TypeScript, Next.js 15, Node.js, Architektura Cloud, SaaS, Tailwind CSS, Szczecin, Programista Polska"
      : "Fullstack Engineer, React 19, TypeScript, Next.js 15, Node.js, Cloud Architecture, SaaS, Tailwind CSS, Europe, Software Architect");

    // 3. OpenGraph Meta
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:locale", isPl ? "pl_PL" : "en_US");
    setMetaTag("property", "og:image", image);

    // 4. Twitter Card Meta
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);

    // 5. Update HTML lang attribute
    document.documentElement.lang = isPl ? "pl" : "en";

    // 6. Canonical link
    let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // 7. Dynamic JSON-LD Schema.org update
    const schemaId = "gkdev-dynamic-jsonld";
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = schemaId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "name": "Grzegorz",
          "url": "https://gkdev.pl",
          "jobTitle": isPl ? "Senior Fullstack Developer & Cloud Architect" : "Senior Fullstack Engineer & Cloud Architect",
          "inLanguage": isPl ? "pl-PL" : "en-US",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Szczecin",
            "addressCountry": "PL"
          },
          "knowsAbout": [
            "React 19",
            "Next.js 15",
            "TypeScript",
            "Node.js",
            "NestJS",
            "PostgreSQL",
            "Redis",
            "Docker",
            "AWS Cloud Architecture",
            "Core Web Vitals & Web Performance Optimization",
            "Tailwind CSS"
          ],
          "sameAs": [
            "https://github.com/gkdev",
            "https://linkedin.com/in/gkdev"
          ]
        },
        {
          "@type": "WebSite",
          "name": "GK.dev",
          "url": "https://gkdev.pl",
          "inLanguage": isPl ? "pl-PL" : "en-US",
          "description": description
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(structuredData);
  }, [lang, customConfig, t]);
}
