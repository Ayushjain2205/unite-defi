"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatesModal } from "@/components/templates-modal";
import { OrbIcon } from "@/components/ui/orb-icon";
import { useOrbStore } from "@/lib/store";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  FileText as Template,
  Edit,
  Play,
  Shield,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const router = useRouter();
  const { orbs } = useOrbStore();

  const handleGenerateOrb = () => {
    if (!prompt.trim()) return;

    router.push(`/builder?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleSelectTemplate = (template: any) => {
    setPrompt(template.prompt);
    // Navigate to builder with both prompt and blockly XML
    const params = new URLSearchParams({
      prompt: template.prompt,
      blocks: template.blocklyXml,
    });
    router.push(`/builder?${params.toString()}`);
  };

  const handleEditOrb = (orbId: string) => {
    router.push(`/orb/${orbId}/edit`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="h-[calc(100vh-80px)] flex flex-col justify-center relative">
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your Trading Orb
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Spin up autonomous trading agents in seconds. Use natural
                language or choose from proven templates.
              </p>
            </motion.div>

            {/* Main Input Section with Background Orb */}
            <motion.div variants={itemVariants} className="relative">
              {/* Background Orb */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.08 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <OrbIcon size="8xl" orbId="4facfe" />
              </motion.div>

              <Card className="max-w-4xl mx-auto border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm relative z-10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Describe Your Trading Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Ex: Buy ETH when gas fee drops below 20 gwei and RSI is oversold..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerateOrb}
                      disabled={!prompt.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Generate Orb
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplates(true)}
                      className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Template className="w-4 h-4" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Active Orbs */}
          {orbs.length > 0 && (
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Your Active Orbs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orbs.map((orb) => (
                  <motion.div
                    key={orb.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 border-gray-200"
                      onClick={() => router.push(`/orb/${orb.id}`)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <OrbIcon size="md" orbId={orb.id} />
                            <div>
                              <CardTitle className="text-lg">
                                {orb.name}
                              </CardTitle>
                              <Badge
                                className={
                                  orb.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : orb.status === "paused"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {orb.status}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrb(orb.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {orb.prompt}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">P&L</span>
                            <p
                              className={`font-medium ${
                                orb.performance.pnl >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              ${orb.performance.pnl.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Win Rate</span>
                            <p className="font-medium text-gray-900">
                              {orb.performance.winRate}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            Built by{" "}
            <a
              href="https://iyushjain.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-medium">iyushjain</span>
            </a>
          </div>
        </div>
      </footer>

      <TemplatesModal
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
