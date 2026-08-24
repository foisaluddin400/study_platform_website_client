import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AbroadPath OS | Study Abroad Consultancy Management Platform",
  description:
    "The all-in-one operating system for education consultancies. Manage leads, student dossiers, university shortlisting, applications, offer letters, visa processing, and commissions in one unified workspace.",
  keywords: [
    "study abroad CRM",
    "education consultancy software",
    "student management system",
    "visa tracking SaaS",
    "university application CRM",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className} h-full antialiased`}>
      <body className={`${inter.className} min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white`}>
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
