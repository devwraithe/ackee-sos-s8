'use client';

import { useWallet } from "@solana/wallet-adapter-react";
import { FooterSection } from "./components/FooterSection";
import { Welcome } from "./components/Welcome";
import { TipperDashboard } from "./components/TipperDashboard";
import SendTip from "./components/SendTip";
import HeaderSection from "./components/HeaderSection";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between">
      {/* Header Section */}
      <HeaderSection />

      {/* Main Section */}
      <main className="p-6 md:p-12 lg:p-0">
        <div className="lg:flex lg:justify-center">
          {!connected ? (
            <Welcome />
          ) : (
            <div className="lg:flex lg:flex-row items-start lg:gap-14">
              <SendTip />
              <div className="mt-6 md:mt-12 lg:mt-0">
                <TipperDashboard />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}