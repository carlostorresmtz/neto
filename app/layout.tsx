import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import ScrollReset from "@/components/ScrollReset";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.useneto.com.mx"),
  title: {
    default: "Neto — Tu asistente financiero personal",
    template: "%s — Neto",
  },
  description:
    "Conecta tu Gmail y deja que Neto lea tus correos bancarios. Analiza gastos, detecta suscripciones y responde preguntas sobre tu dinero en segundos.",
  alternates: {
    canonical: "https://www.useneto.com.mx",
  },
  openGraph: {
    title: "Neto — Asistente financiero personal para México",
    description:
      "Neto lee tus correos bancarios y responde en español cualquier pregunta sobre tu dinero. Sin hojas de cálculo, sin apps extra.",
    url: "https://www.useneto.com.mx",
    siteName: "Neto",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neto — Asistente financiero personal para México",
    description:
      "Neto lee tus correos bancarios y responde en español cualquier pregunta sobre tu dinero. Sin hojas de cálculo, sin apps extra.",
    site: "@useneto",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1E40AF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('neto-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
      </head>
      <body style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
        <Providers>
          <ScrollReset />
          {children}
        </Providers>
      </body>
    </html>
  );
}
