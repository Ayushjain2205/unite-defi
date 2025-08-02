"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as Blockly from "blockly";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Save } from "lucide-react";

// Define custom blocks
const defineCustomBlocks = () => {
  // Check if blocks are already defined to prevent redefinition
  if (
    Blockly.Blocks["trading_condition"] &&
    Blockly.Blocks["trading_action"] &&
    Blockly.Blocks["strategy_start"]
  ) {
    console.log("Custom blocks already defined, skipping...");
    return;
  }

  console.log("Defining custom blocks...");

  // Trading condition block
  Blockly.defineBlocksWithJsonArray([
    {
      type: "trading_condition",
      message0: "When %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "INDICATOR",
          options: [
            ["RSI", "RSI"],
            ["Price", "PRICE"],
            ["Volume", "VOLUME"],
            ["Gas Fee", "GAS"],
          ],
        },
        {
          type: "field_dropdown",
          name: "OPERATOR",
          options: [
            ["<", "LT"],
            [">", "GT"],
            ["=", "EQ"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
          check: "Number",
        },
      ],
      inputsInline: true,
      output: "Boolean",
      colour: 210,
      tooltip: "Trading condition trigger",
    },
    {
      type: "trading_action",
      message0: "%1 %2 of %3",
      args0: [
        {
          type: "field_dropdown",
          name: "ACTION",
          options: [
            ["Buy", "BUY"],
            ["Sell", "SELL"],
          ],
        },
        {
          type: "input_value",
          name: "AMOUNT",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "ASSET",
          options: [
            ["ETH", "ETH"],
            ["BTC", "BTC"],
            ["SOL", "SOL"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 120,
      tooltip: "Execute trading action",
    },
    {
      type: "strategy_start",
      message0: "Trading Strategy %1 %2",
      args0: [
        {
          type: "input_statement",
          name: "DO",
        },
        {
          type: "field_label",
          text: "Execute:",
        },
      ],
      colour: 160,
      tooltip: "Entry point for trading strategy",
      deletable: false,
    },
  ]);

  console.log("Custom blocks defined successfully");
};

// Simple toolbox configuration
const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "🎯 Strategy",
      colour: "#5C81A6",
      contents: [
        {
          kind: "block",
          type: "strategy_start",
        },
        {
          kind: "block",
          type: "controls_if",
        },
      ],
    },
    {
      kind: "category",
      name: "📊 Conditions",
      colour: "#5CA65C",
      contents: [
        {
          kind: "block",
          type: "trading_condition",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
        {
          kind: "block",
          type: "logic_operation",
        },
      ],
    },
    {
      kind: "category",
      name: "⚡ Actions",
      colour: "#A65C81",
      contents: [
        {
          kind: "block",
          type: "trading_action",
        },
      ],
    },
    {
      kind: "category",
      name: "🔢 Math",
      colour: "#745CA6",
      contents: [
        {
          kind: "block",
          type: "math_number",
        },
        {
          kind: "block",
          type: "math_arithmetic",
        },
      ],
    },
    {
      kind: "category",
      name: "🔗 Logic",
      colour: "#A6745C",
      contents: [
        {
          kind: "block",
          type: "logic_boolean",
        },
        {
          kind: "block",
          type: "logic_negate",
        },
      ],
    },
  ],
};

interface BlocklyEditorProps {
  initialXml?: string;
  onWorkspaceChange?: (xmlString: string) => void;
  onCodeGenerate?: (code: string) => void;
}

export function BlocklyEditor({
  initialXml,
  onWorkspaceChange,
  onCodeGenerate,
}: BlocklyEditorProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitializing = useRef(true);

  const handleWorkspaceChange = useCallback(() => {
    if (!workspace || isInitializing.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlString = Blockly.Xml.domToText(xml);
        onWorkspaceChange?.(xmlString);
      } catch (error) {
        console.error("Error in workspace change handler:", error);
      }
    }, 300);
  }, [workspace, onWorkspaceChange]);

  // Store the callback in a ref to avoid dependency issues
  const handleWorkspaceChangeRef = useRef(handleWorkspaceChange);
  handleWorkspaceChangeRef.current = handleWorkspaceChange;

  useEffect(() => {
    if (!blocklyDiv.current) {
      console.log("Blockly div not ready");
      return;
    }

    console.log("Initializing Blockly workspace...");
    setError(null);

    try {
      // Define custom blocks first
      defineCustomBlocks();

      // Verify blocks are registered
      console.log("Available block types:", Object.keys(Blockly.Blocks));
      console.log(
        "Custom blocks registered:",
        Blockly.Blocks["trading_condition"]
          ? "trading_condition ✓"
          : "trading_condition ✗",
        Blockly.Blocks["trading_action"]
          ? "trading_action ✓"
          : "trading_action ✗",
        Blockly.Blocks["strategy_start"]
          ? "strategy_start ✓"
          : "strategy_start ✗"
      );

      console.log("Creating Blockly workspace...");

      // Create workspace with minimal configuration
      const ws = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        scrollbars: {
          horizontal: false,
          vertical: false,
        },
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        move: {
          scrollbars: false,
          drag: true,
          wheel: true,
        },
      });

      console.log("Workspace created successfully:", ws);
      setWorkspace(ws);

      // Load initial XML if provided
      if (initialXml) {
        try {
          console.log("Loading initial XML...");
          const xml = Blockly.utils.xml.textToDom(initialXml);
          Blockly.Xml.domToWorkspace(xml, ws);
        } catch (error) {
          console.error("Error loading initial XML:", error);
          setError("Failed to load initial blocks");
        }
      } else {
        // Add a default strategy start block
        console.log("Adding default strategy start block...");
        const startBlock = ws.newBlock("strategy_start");
        startBlock.initSvg();
        startBlock.render();

        // Center the initial block - use same logic as reset
        startBlock.moveBy(50, 50);
      }

      // Add workspace change listener
      ws.addChangeListener(handleWorkspaceChangeRef.current);

      // Add listener for new blocks to center them
      ws.addChangeListener((event: any) => {
        if (event.type === Blockly.Events.BLOCK_CREATE && event.blockId) {
          const block = ws.getBlockById(event.blockId);
          if (block) {
            // Get workspace dimensions
            const workspaceMetrics = ws.getMetrics();
            const blockMetrics = block.getHeightWidth();

            // Calculate center position - adjust for actual workspace area
            const centerX =
              (workspaceMetrics.viewWidth - blockMetrics.width) / 2 - 100; // Offset to account for toolbox
            const centerY =
              (workspaceMetrics.viewHeight - blockMetrics.height) / 2 - 50; // Offset to account for header

            // Move block to center
            block.moveBy(centerX, centerY);
          }
        }
      });

      // Mark initialization as complete
      setTimeout(() => {
        isInitializing.current = false;
        console.log("Blockly initialization complete");
      }, 100);

      // Cleanup
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        ws.removeChangeListener(handleWorkspaceChangeRef.current);

        // Force hide any remaining scrollbars
        const scrollbars = blocklyDiv.current?.querySelectorAll(
          ".blocklyScrollbarVertical, .blocklyScrollbarHorizontal"
        );
        scrollbars?.forEach((sb) => {
          (sb as HTMLElement).style.display = "none";
          (sb as HTMLElement).style.visibility = "hidden";
        });

        ws.dispose();
      };
    } catch (error) {
      console.error("Error initializing Blockly workspace:", error);
      setError(`Failed to initialize Blockly: ${error}`);
    }
  }, [initialXml]);

  const handleReset = () => {
    if (workspace) {
      workspace.clear();
      const startBlock = workspace.newBlock("strategy_start");
      startBlock.initSvg();
      startBlock.render();
      startBlock.moveBy(50, 50);
    }
  };

  const handleTest = () => {
    alert(
      "Visual editor is working! You can drag and drop blocks to build your strategy."
    );
  };

  const handleSave = () => {
    if (workspace) {
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xml);
      console.log("Saved workspace:", xmlText);
      alert("Strategy saved! Check console for XML data.");
    }
  };

  return (
    <Card className="h-[600px] border-2 border-gray-200">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Visual Strategy Builder</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          <div
            ref={blocklyDiv}
            className="h-full w-full"
            style={{
              overflow: "hidden",
              position: "relative",
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .blocklyScrollbarVertical { display: none !important; }
                .blocklyScrollbarHorizontal { display: none !important; }
                .blocklyScrollbarVertical { visibility: hidden !important; }
                .blocklyScrollbarHorizontal { visibility: hidden !important; }
              `,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
