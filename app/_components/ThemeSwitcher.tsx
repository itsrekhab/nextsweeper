"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

function isValidTheme(checkTheme: string | null): checkTheme is Theme {
  return themes.some((theme) => theme === checkTheme);
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  const t = useTranslations("ThemeSelect");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (isValidTheme(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "system") {
      localStorage.removeItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.dataset.theme = systemTheme;
    } else {
      localStorage.setItem("theme", theme);
      document.documentElement.dataset.theme = theme;
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="h-8 w-24 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-sm" />
    );
  }

  return (
    <select
      className="rounded-sm bg-interactive hover:bg-interactive-hover px-2 py-1"
      value={theme}
      onChange={(e) => {
        const val = e.target.value;
        if (isValidTheme(val)) setTheme(val);
      }}
    >
      {themes.map((th) => (
        <option key={th} value={th}>
          {t(`${th}`)}
        </option>
      ))}
    </select>
  );
}
