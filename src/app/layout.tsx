import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Tektur } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT League",
  description: "Landing page for the IT League project.",
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
