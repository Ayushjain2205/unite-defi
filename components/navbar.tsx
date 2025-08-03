"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrbIcon } from "@/components/ui/orb-icon";
import { useOrbStore } from "@/lib/store";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import { sepolia } from "thirdweb/chains";

export function Navbar() {
  const router = useRouter();
  const { orbs } = useOrbStore();

  const handleHomeClick = () => {
    console.log("Navigating to home...");
    window.location.href = "/";
  };

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            <OrbIcon size="md" orbId="667eea" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OrbFi</h1>
              <p className="text-sm text-gray-600">Autonomous Trading Agents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {orbs.length} Active Orbs
            </Badge>
            <ConnectButton client={client} chain={sepolia} />
          </div>
        </div>
      </div>
    </header>
  );
}
