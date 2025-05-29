import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { WalletConnectionModal } from "@/components/wallet-connection-modal";
import { DemoProvider } from "@/context/demo-context";
import { CommunityProvider } from "@/context/community-context";
import WagmiComponentProvider from "@/components/WagmiComponentProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/context/wallet-context";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WAGA Protocol | Blockchain-Powered Coffee Traceability",
  description:
    "Transforming the coffee value chain with blockchain technology for transparency, traceability, and financial empowerment.",
  generator: "v0.dev",
};
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <WagmiComponentProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <WalletProvider>
              <DemoProvider>
                <CommunityProvider>
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <WalletConnectionModal />
                  <Toaster />
                </CommunityProvider>
              </DemoProvider>
            </WalletProvider>
          </ThemeProvider>
        </WagmiComponentProvider>
      </body>
    </html>
  );
}
