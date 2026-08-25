export interface AccentTheme {
  id: string;
  name: string;
  hsl: string;
  colorHex: string;
}

export const accentThemes: AccentTheme[] = [
  { id: "blue", name: "Electric Blue", hsl: "221 83% 53%", colorHex: "#3b82f6" },
  { id: "emerald", name: "Cyber Emerald", hsl: "160 84% 39%", colorHex: "#10b981" },
  { id: "violet", name: "Neon Violet", hsl: "270 91% 65%", colorHex: "#8b5cf6" },
  { id: "amber", name: "Sunset Amber", hsl: "25 95% 53%", colorHex: "#f97316" },
];

export const setGlobalAccent = (themeId: string) => {
  if (typeof document === "undefined") return;
  const theme = accentThemes.find((t) => t.id === themeId) || accentThemes[0];
  document.documentElement.style.setProperty("--primary", theme.hsl);
  document.documentElement.style.setProperty("--ring", theme.hsl);
  localStorage.setItem("accent-theme", theme.id);
};
