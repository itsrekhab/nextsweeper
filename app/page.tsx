import { useTranslations } from "next-intl";
import Link from "next/link";
import { DifficultyLocaleCode, difficultyModes } from "./_constants/constants";

function DifficultyLink({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
    >
      {children}
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
            <DifficultyLink href={`/game?mode=${mode.id}`}>
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
