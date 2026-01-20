import { cn } from "@udecode/cn";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ComponentProps } from "react";
import { DifficultyLocaleCode, difficultyModes } from "./_constants/constants";

function DifficultyLink({
  href,
  children,
  className,
}: ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn([
        "relative block px-4 py-2",
        "before:absolute before:block before:transition-transform before:origin-left before:transform-[scaleX(0)] hover:before:transform-[scaleX(1)] before:inset-0",
        className,
      ])}
    >
      <span className="relative z-1">{children}</span>
    </Link>
  );
}

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex flex-col items-center text-center">
      <h1 className="h-[50vh] align-middle text-3xl leading-[50vh] font-bold text-blue-700">
        NextSweeper
      </h1>
      <div>
        <p>{t("Home.hero_description")}</p>
      </div>
      <p>{t("DifficultySelect.message")}</p>
      <ul className="overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
        {difficultyModes.map((mode) => (
          <li key={mode.id}>
            <DifficultyLink
              href={`/game?mode=${mode.id}`}
              className={cn(
                mode.locale_code === "beginner" && "before:bg-gray-500/50",
                mode.locale_code === "intermediate" &&
                  "before:bg-[color-mix(in_oklch,var(--color-gray-500),var(--color-blue-500))]/50",
                mode.locale_code === "expert" && "before:bg-blue-500/50",
              )}
            >
              {t(
                `DifficultySelect.${mode.locale_code as DifficultyLocaleCode}`,
              )}
            </DifficultyLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
