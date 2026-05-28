import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Tektur } from "next/font/google";
import "./globals.css";

/**
 * Resolves the canonical site URL in priority order:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override (e.g. on the HOSTiQ
 *      production host where leagueit.org is the real domain).
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel auto-injects this for
 *      production deploys (e.g. priceless-leavitt-b2fe6a.vercel.app).
 *   3. VERCEL_URL — Vercel auto-injects this for preview deploys
 *      (deployment-specific hash URL).
 *   4. Fallback to the real domain so local dev / unknown hosts
 *      still emit valid absolute OG / canonical URLs.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://leagueit.org");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IT League Backend — інженерний спорт для backend-фахівців",
    template: "%s · IT League Backend",
  },
  description:
    "IT League Backend — система турнірів, рейтингів і сезонів для backend-інженерів. Не лекції, а перевірка скілів у змаганнях з оцінкою від практикуючих експертів.",
  keywords: [
    "IT League",
    "backend",
    "інженерний спорт",
    "змагання програмістів",
    "Україна",
    "backend developer",
    "практика програмування",
  ],
  authors: [{ name: "IT League" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: "IT League Backend",
    title: "IT League Backend — інженерний спорт для backend-фахівців",
    description:
      "Система турнірів, рейтингів і сезонів. Тут зростають через змагання, а не лекції.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IT League Backend",
    description:
      "Інженерний спорт для backend-фахівців. Тут не вчать — тут перевіряють.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

const tektur = Tektur({
  subsets: ["latin", "cyrillic"],
  variable: "--font-tektur",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${tektur.variable}`}>
        {children}
      </body>
    </html>
  );
}
