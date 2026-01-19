import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Stats.head");
  return {
    title: `${t("title")} - NextSweeper`,
    description: t("description"),
  };
}

export default function StatsLayout({ children }: LayoutProps<"/stats">) {
  return <>{children}</>;
}
