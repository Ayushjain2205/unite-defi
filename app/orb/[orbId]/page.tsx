"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrbIcon } from "@/components/ui/orb-icon";
import { PerformanceChart } from "@/components/performance-chart";
import { ActivityFeed } from "@/components/activity-feed";
import { useOrbStore } from "@/lib/store";
import {
  Play,
  Pause,
  Trash2,
  Settings,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function OrbPage() {
  const router = useRouter();
  const params = useParams();
  const orbId = params.orbId as string;

  const { orbs, updateOrb, deleteOrb } = useOrbStore();
  const [timeRange, setTimeRange] = useState<"24h" | "7d">("24h");

  const orb = orbs.find((o) => o.id === orbId);

  useEffect(() => {
    if (!orb) {
      router.push("/");
    }
  }, [orb, router]);

  const handlePauseResume = () => {
    if (orb) {
      const newStatus = orb.status === "active" ? "paused" : "active";
      updateOrb(orb.id, { status: newStatus });
      toast.success(`Orb ${newStatus === "active" ? "resumed" : "paused"}`);
    }
  };

  const handleDelete = () => {
    if (orb && confirm("Are you sure you want to delete this Orb?")) {
      deleteOrb(orb.id);
      toast.success("Orb deleted");
      router.push("/");
    }
  };

  if (!orb) {
    return <div>Loading...</div>;
  }

  const performanceStats = [
    {
      label: "Total P&L",
      value: `$${orb.performance.pnl.toFixed(2)}`,
      icon: DollarSign,
      positive: orb.performance.pnl >= 0,
    },
    {
      label: "Total Trades",
      value: orb.performance.trades.toString(),
      icon: Activity,
      positive: true,
    },
    {
      label: "Win Rate",
      value: `${orb.performance.winRate.toFixed(1)}%`,
      icon: Target,
      positive: orb.performance.winRate >= 50,
    },
    {
      label: "Active Time",
      value: formatDistanceToNow(orb.createdAt),
      icon: Calendar,
      positive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Orb Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <OrbIcon
                size="lg"
                orbId={orb.id}
                pulse={orb.status === "active"}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{orb.name}</h1>
                <div className="flex items-center gap-2">
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
                  <span className="text-sm text-gray-500">
                    Created{" "}
                    {formatDistanceToNow(orb.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handlePauseResume}>
              {orb.status === "active" ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/orb/${orb.id}/edit`)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Strategy Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Overview</CardTitle>
              <CardDescription>
                Original prompt and generated logic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{orb.prompt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart and Activity Feed Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance Chart
                    </CardTitle>
                    <CardDescription>P&L over time</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={timeRange === "24h" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange("24h")}
                    >
                      24H
                    </Button>
                    <Button
                      variant={timeRange === "7d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange("7d")}
                    >
                      7D
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceChart timeRange={timeRange} data={[]} />
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
