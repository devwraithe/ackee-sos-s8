import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";

const libreFranklin = Libre_Franklin({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Euergetes",
  description: "Solana-based instant SOL tipping platform",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${libreFranklin.className} antialiased`}>
        <Toaster />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
