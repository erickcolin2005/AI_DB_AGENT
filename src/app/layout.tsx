// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // si no usas Tailwind, igual puede existir vacío

export const metadata: Metadata = {
  title: "AI DB Agent",
  description: "Query your DB with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}