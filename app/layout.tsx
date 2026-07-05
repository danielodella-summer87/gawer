import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/SidebarState";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GAWER Intelligence",
  description:
    "Sistema inteligente para evaluación, ranking y gestión de oportunidades estratégicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
