import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

// Display face. Variable width + optical size, which is what the
// compressed editorial headline proportion depends on.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Syafik Barda | Full-Stack & Backend Developer",
  description:
    "Portfolio of Syafik Barda, a software developer building full-stack web platforms, backend systems, and IoT telemetry. Computer Engineering undergraduate at Diponegoro University.",
  keywords: [
    "Syafik Barda",
    "Computer Engineering",
    "Diponegoro University",
    "Full-Stack Developer",
    "Backend Developer",
    "Next.js",
    "React",
    "IoT",
    "Internship Portfolio",
  ],
  authors: [{ name: "Syafik Barda" }],
  openGraph: {
    title: "Syafik Barda | Full-Stack & Backend Developer",
    description:
      "Full-stack web platforms, backend systems, and IoT telemetry. Selected project work and the stack behind it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4f1" },
  ],
};

// Applies the saved theme before first paint so the page never flashes
// the wrong mode. Runs only if the reader has explicitly picked one.
const THEME_INIT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {/* Scroll-reveal wrappers start hidden. Without JS they would stay
            that way, so the page falls back to plain visible content. */}
        <noscript>
          <style>{`.invisible { visibility: visible !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-[100dvh] bg-bg text-fg antialiased">
        <a
          href="#main"
          className="pill sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
