"use client";

import { locales } from "@/constants";
import { setLocale } from "@/i18n/set-locale";
import { useLocale } from "next-intl";

export default function LangSwitcher() {
  const locale = useLocale();

  return (
    <select
      className="rounded-sm bg-interactive hover:bg-interactive-hover px-2 py-1"
      value={locale}
      onChange={(e) => {
        setLocale(e.target.value);
      }}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
