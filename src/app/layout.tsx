import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "¡¡Busco Profe!! — Encuentra tu profesor particular ideal",
  description:
    "Conectamos alumnos con los mejores profesores particulares. Busca por materia, ciudad y modalidad. Clases presenciales y virtuales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
