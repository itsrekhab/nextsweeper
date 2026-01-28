"use client";

import MineIcon from "@/public/mine.svg";
import SizeIcon from "@/public/size.svg";
import { cn } from "@udecode/cn";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import { DifficultyLocaleCode, difficultyModes } from "./_constants/constants";

function DifficultyLink({
  href,
  children,
  className,
  onClick,
}: ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn([
        "relative block px-4 py-2",
        "before:absolute before:block before:transition-transform before:origin-left before:transform-[scaleX(0)] hover:before:transform-[scaleX(1)] before:inset-0",
        className,
      ])}
      onClick={onClick}
    >
      <span className="relative z-1">{children}</span>
    </Link>
  );
}

export default function Home() {
  const t = useTranslations();
  const [hovered, setHovered] = useState<
    (typeof difficultyModes)[number] | null
  >(null);

  return (
    <>
      <section className="flex flex-col justify-center items-center h-[50vh]">
        <h1 className="text-blue-700 font-bold text-3xl">NextSweeper</h1>
        <p className="text-sm">{t("Home.hero_description")}</p>
      </section>
      <section
        className="overflow-hidden mx-auto flex max-w-64 rounded-md bg-gray-200 dark:bg-gray-800"
        onMouseLeave={() => setHovered(null)}
      >
        <ul className="flex-[1_0_50%] mx-auto text-center">
          {difficultyModes.map((mode) => (
            <li key={mode.id} onMouseEnter={() => setHovered(mode)}>
              <DifficultyLink
                href={`/game?mode=${mode.id}`}
                className={cn(
                  mode.locale_code === "beginner" && "before:bg-gray-500/50",
                  mode.locale_code === "intermediate" &&
                    "before:bg-[color-mix(in_oklch,var(--color-gray-500),var(--color-blue-500))]/50",
                  mode.locale_code === "expert" && "before:bg-blue-500/50",
                )}
                onClick={() => {
                  localStorage.setItem("difficulty", mode.id + "");
                }}
              >
                {t(
                  `DifficultySelect.${mode.locale_code as DifficultyLocaleCode}`,
                )}
              </DifficultyLink>
            </li>
          ))}
        </ul>
        <div className="flex flex-col basis-1/2 items-start justify-center p-4 bg-interactive text-sm">
          {hovered === null ? (
            t("DifficultySelect.message")
          ) : (
            <>
              <p className="flex gap-1">
                <SizeIcon
                  className="size-4"
                  title={t("DifficultySelect.size")}
                />
                <span>
                  {`${hovered.params.height}x${hovered.params.width}`}
                </span>
              </p>
              <p className="flex gap-1">
                <MineIcon
                  className="size-4 text-foreground"
                  title={t("DifficultySelect.mines")}
                />
                <span>{hovered.params.mines}</span>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
