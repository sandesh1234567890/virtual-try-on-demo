import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Footer from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sandesh Surwase | Virtual Try-On",
  description: "AI-Powered Virtual Try-On Experience by Sandesh Surwase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
