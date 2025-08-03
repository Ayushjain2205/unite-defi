"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrbIcon } from "@/components/ui/orb-icon";
import { useOrbStore } from "@/lib/store";
import {
  Play,
  RotateCcw,
  Rocket,
  Save,
  Settings,
  ArrowLeft,
} from "lucide-react";
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

export default function BuilderPage() {
  const router = useRouter();
  const params = useParams();
  const draftId = params.draftId as string;

  const {
    drafts,
    currentDraft,
    updateDraft,
    publishOrb,
    setCurrentDraft,
    loadDraft,
  } = useOrbStore();
  const [orbName, setOrbName] = useState("");
  const [currentBlocks, setCurrentBlocks] = useState<string>("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "error"
  >("saved");

  // Auto-save functionality
  useEffect(() => {
    if (!currentDraft || !currentBlocks) return;

    setAutoSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      try {
        updateDraft(currentDraft.id, {
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
  }, [currentBlocks, orbName, currentDraft, updateDraft]);

  useEffect(() => {
    const draft = loadDraft(draftId);
    if (draft) {
      setCurrentDraft(draft);
      setOrbName(draft.name);
      setCurrentBlocks(draft.blocks || "");
    } else {
      // Redirect if draft not found
      toast.error("Strategy not found");
      router.push("/builder");
    }
  }, [draftId, loadDraft, setCurrentDraft, router]);

  const handleSaveDraft = () => {
    if (currentDraft) {
      updateDraft(currentDraft.id, { name: orbName, blocks: currentBlocks });
      toast.success("Strategy saved successfully!");
    }
  };

  const handleTestStrategy = () => {
    toast.info("Running strategy test...");
    // Simulate test
    setTimeout(() => {
      toast.success("Test completed! Strategy looks good.");
    }, 2000);
  };

  const handlePublish = () => {
    if (currentDraft) {
      updateDraft(currentDraft.id, { name: orbName, blocks: currentBlocks });
      const newOrbId = publishOrb(currentDraft.id, currentBlocks);
      toast.success("Orb published and activated!");
      if (newOrbId) {
        setTimeout(() => {
          router.push(`/orb/${newOrbId}`);
        }, 1500);
      }
    }
  };

  const handleReset = () => {
    setCurrentBlocks("");
    toast.info("Workspace reset");
  };

  const handleBackToBuilder = () => {
    router.push("/builder");
  };

  const generateStrategyDescription = (prompt: string) => {
    // Simple natural language interpretation
    const conditions = [];
    const actions = [];

    if (prompt.toLowerCase().includes("buy")) {
      actions.push("Execute buy orders");
    }
    if (prompt.toLowerCase().includes("sell")) {
      actions.push("Execute sell orders");
    }
    if (prompt.toLowerCase().includes("rsi")) {
      conditions.push("Monitor RSI indicators");
    }
    if (prompt.toLowerCase().includes("gas")) {
      conditions.push("Track gas fee levels");
    }
    if (prompt.toLowerCase().includes("price")) {
      conditions.push("Watch price movements");
    }

    return {
      conditions:
        conditions.length > 0 ? conditions : ["Monitor market conditions"],
      actions: actions.length > 0 ? actions : ["Execute trading decisions"],
    };
  };

  if (!currentDraft) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading strategy...</p>
        </div>
      </div>
    );
  }

  const strategy = generateStrategyDescription(currentDraft.prompt);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Builder Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackToBuilder}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <OrbIcon size="md" gradient={3} />
              <div>
                <Input
                  value={orbName}
                  onChange={(e) => setOrbName(e.target.value)}
                  className="text-xl font-bold border-0 p-0 h-auto bg-transparent focus:ring-0 focus:border-b focus:border-indigo-500"
                  placeholder="Orb Name"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Auto-saving</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      autoSaveStatus === "saved"
                        ? "bg-green-500"
                        : autoSaveStatus === "saving"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="capitalize">{autoSaveStatus}</span>
                  <span>
                    • Last modified:{" "}
                    {new Date(currentDraft.lastModified).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleTestStrategy}>
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Strategy Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Strategy Details</CardTitle>
            <CardDescription>
              Information about this trading strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Original Prompt
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{currentDraft.prompt}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Strategy Analysis
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Conditions:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.conditions.map((condition, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Actions:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.actions.map((action, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BlocklyEditor
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
