import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yasmin & Bruno | Rifa do Nosso Grande Sonho",
  description:
    "Conheça os prêmios e acompanhe o projeto especial de Yasmin e Bruno rumo ao casamento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}