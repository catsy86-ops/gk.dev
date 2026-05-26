import { useEffect, useState } from "react";

function getCSSVar(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function parseHSL(hsl: string): { h: number; s: number; l: number } {
  const parts = hsl.split(/\s+/);
  return {
    h: parseFloat(parts[0]),
    s: parseFloat(parts[1]),
    l: parseFloat(parts[2]),
  };
}

export function useThemeCanvasColor() {
  const [color, setColor] = useState({ h: 217, s: 91, l: 60 });
  const [colorLight, setColorLight] = useState({ h: 217, s: 91, l: 65 });

  useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        const primary = parseHSL(getCSSVar("--primary"));
        const accent = parseHSL(getCSSVar("--accent-blue"));
        setColor({ h: primary.h || 217, s: primary.s || 91, l: primary.l || 60 });
        setColorLight({ h: accent.h || 217, s: accent.s || 91, l: accent.l || 65 });
      } else {
        const primary = parseHSL(getCSSVar("--primary"));
        setColor({ h: primary.h || 221, s: primary.s || 83, l: Math.min((primary.l || 53) + 5, 70) });
        setColorLight({ h: primary.h || 221, s: primary.s || 83, l: Math.min((primary.l || 53) + 10, 75) });
      }
    };
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const hsla = (alpha: number) => `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
  const hslaLight = (alpha: number) => `hsla(${colorLight.h}, ${colorLight.s}%, ${colorLight.l}%, ${alpha})`;

  return { hsla, hslaLight, color, colorLight };
}