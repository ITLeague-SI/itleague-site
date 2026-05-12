import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Tektur } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://itleague.example.com";

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
