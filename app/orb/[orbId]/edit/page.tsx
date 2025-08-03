"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrbIcon } from "@/components/ui/orb-icon";
import { useOrbStore } from "@/lib/store";
import { ArrowLeft, Rocket, Clock, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Dynamic import for client-side only rendering
const BlocklyEditor = dynamic(
  () =>
    import("@/components/blockly-editor").then((mod) => ({
      default: mod.BlocklyEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center border-2 border-gray-200 rounded-lg">
        Loading visual editor...
      </div>
    ),
  }
);

export default function EditOrbPage() {
  const router = useRouter();
  const params = useParams();
  const orbId = params.orbId as string;

  const { orbs, updateOrb } = useOrbStore();
  const setShowSuccessToast = useOrbStore((state) => state.setShowSuccessToast);
  const [orbName, setOrbName] = useState("");
  const [currentBlocks, setCurrentBlocks] = useState<string>("");
  const [blocksLoaded, setBlocksLoaded] = useState(false);
  const [selectedEpoch, setSelectedEpoch] = useState<string>("15");
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "error"
  >("saved");
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);

  const orb = orbs.find((o) => o.id === orbId);

  // Check if store is hydrated
  useEffect(() => {
    const checkHydration = () => {
      const stored = localStorage.getItem("orbfi-store");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          console.log("Stored data:", data);
          if (data.orbs && data.orbs.length > 0) {
            setIsStoreHydrated(true);
          }
        } catch (error) {
          console.error("Error parsing stored data:", error);
        }
      }
      // Also check if orbs are loaded from the store
      if (orbs.length > 0) {
        setIsStoreHydrated(true);
      }
    };

    checkHydration();

    // Check again after a short delay to ensure store is fully hydrated
    const timer = setTimeout(checkHydration, 100);
    return () => clearTimeout(timer);
  }, [orbs.length]);

  // Auto-save functionality
  useEffect(() => {
    if (!orb || !currentBlocks) return;

    setAutoSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      try {
        updateOrb(orb.id, {
          name: orbName,
          blocks: currentBlocks,
        });
        setAutoSaveStatus("saved");
      } catch (error) {
        setAutoSaveStatus("error");
        console.error("Auto-save failed:", error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentBlocks, orbName, orb, updateOrb]);

  useEffect(() => {
    console.log(
      "Edit page useEffect - orb:",
      orb,
      "orbs.length:",
      orbs.length,
      "orbId:",
      orbId,
      "isStoreHydrated:",
      isStoreHydrated
    );

    if (orb) {
      setOrbName(orb.name);
      setCurrentBlocks(orb.blocks || "");
      setBlocksLoaded(true);
    } else if (isStoreHydrated && orbs.length > 0) {
      // If store is hydrated and orbs are loaded but this specific orb is not found
      console.log("Orb not found, redirecting to /");
      console.log(
        "Available orbs:",
        orbs.map((o) => ({ id: o.id, name: o.name }))
      );
      toast.error("Orb not found");
      router.push("/");
    }
    // Don't redirect if store is not hydrated yet
  }, [orb, orbs.length, router, orbId, isStoreHydrated]);

  const handleSaveChanges = () => {
    if (orb) {
      updateOrb(orb.id, {
        name: orbName,
        blocks: currentBlocks,
      });
      toast.success("Orb updated successfully!");
      setTimeout(() => {
        router.push(`/orb/${orb.id}`);
      }, 1500);
    }
  };

  const handleBackToOrb = () => {
    router.push(`/orb/${orbId}`);
  };

  if (!orb) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <OrbIcon size="2xl" orbId={orbId} />
          </div>
          <p className="text-gray-600 mt-4">Loading orb...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Builder Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackToOrb}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orb
            </Button>
            <div className="flex items-center gap-3">
              <OrbIcon size="md" orbId={orb.id} />
              <div>
                <Input
                  value={orbName}
                  onChange={(e) => setOrbName(e.target.value)}
                  className="text-xl font-bold border-0 p-0 h-auto bg-transparent focus:ring-0 focus:border-b focus:border-indigo-500"
                  placeholder="Orb Name"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Last modified:{" "}
                    {new Date(orb.lastModified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                EPOCH:
              </span>
              <Select value={selectedEpoch} onValueChange={setSelectedEpoch}>
                <SelectTrigger className="w-24 h-8 border-0 bg-transparent focus:ring-0 text-sm font-medium">
                  <SelectValue placeholder="Epoch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 mins</SelectItem>
                  <SelectItem value="30">30 mins</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSaveChanges}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Update Orb
            </Button>
          </div>
        </div>

        {/* Strategy Prompt */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Strategy Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <textarea
                value={orb.prompt}
                onChange={(e) => {
                  if (orb) {
                    updateOrb(orb.id, {
                      prompt: e.target.value,
                    });
                  }
                }}
                className="w-full bg-transparent border-0 p-0 text-gray-700 resize-none focus:ring-0 focus:outline-none"
                rows={1}
                placeholder="Enter your strategy description..."
              />
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BlocklyEditor
            key={`orb-${orbId}-${blocksLoaded ? "loaded" : "empty"}`}
            initialXml={currentBlocks}
            onWorkspaceChange={(xmlString) => {
              setCurrentBlocks(xmlString);
            }}
            onCodeGenerate={(code) => {
              console.log("Generated code:", code);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
