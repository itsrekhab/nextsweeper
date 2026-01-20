import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import Footer from "@/_components/Footer";
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
    <html lang={locale} suppressHydrationWarning>
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
        className={`${plex.variable} ${plex_mono.variable} mx-auto flex flex-col items-center bg-background-accent min-h-screen text-foreground font-sans antialiased`}
      >
        <NextIntlClientProvider>
          <Header />
          {/*<ViewTransition>*/}
          <div className="mt-12 bg-background xl:w-full xl:grow xl:max-w-7xl">
            {children}
          </div>
          <Footer />
          {/*</ViewTransition>*/}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
