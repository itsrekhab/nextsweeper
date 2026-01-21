import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import Footer from "@/_components/Footer";
import { cn } from "@udecode/cn";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import Header from "./_components/Header";

const plex = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-plex-sans",
});
const plex_mono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "NextSweeper",
  description: "A Minesweeper implementation in React and Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={cn([
        "bg-background-accent grid [--content-padding:calc((var(--container-7xl)-var(--container-3xl))/2)]",
        "grid-cols-[1fr_[content-box-start]_minmax(0,var(--content-padding))_[content-start]_min(100%,var(--container-3xl))_[content-end]_minmax(0,var(--content-padding))_[content-box-end]_1fr]",
        "grid-rows-[calc(var(--header-height))_minmax(calc(100dvh-var(--header-height)-var(--footer-height)),auto)_min-content]",
      ])}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                      try {
                        let theme = localStorage.getItem('theme');
                        let supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        if (theme === 'dark' || (!theme && supportDarkMode)) {
                          document.documentElement.dataset.theme = 'dark';
                        } else {
                          document.documentElement.dataset.theme = 'light';
                        }
                      } catch (e) {}
                  `,
          }}
        />
      </head>
      <body
        className={`${plex.variable} ${plex_mono.variable} col-[content-box] row-span-full grid grid-rows-subgrid grid-cols-subgrid min-h-screen bg-background text-foreground font-sans antialiased`}
      >
        <NextIntlClientProvider>
          <Header />
          {/*<ViewTransition>*/}
          <main className="col-[content] row-2 pt-2 w-auto">{children}</main>
          <Footer />
          {/*</ViewTransition>*/}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
