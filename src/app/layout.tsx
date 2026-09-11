import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Ulo — a modular Rust framework for server applications";
const DESCRIPTION =
  "Ulo organizes Rust server applications into modules, controllers, and injectable services, with guards, interceptors, and pipes on HTTP, WebSocket, RPC, and gRPC alike. Bring your own HTTP server: Axum, Actix, Salvo, Poem, and Rocket adapters ship with it.";

// Set NEXT_PUBLIC_SITE_URL to the deployed origin so shared links resolve the
// OG image. Vercel supplies its own production host; localhost is the fallback
// for a local build.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { template: "%s | Ulo", default: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Ulo",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
