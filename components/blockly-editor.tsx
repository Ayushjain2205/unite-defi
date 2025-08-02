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

  // Advanced trading blocks
  Blockly.defineBlocksWithJsonArray([
    {
      type: "technical_indicator",
      message0: "When %1 %2 %3 %4",
      args0: [
        {
          type: "field_dropdown",
          name: "INDICATOR",
          options: [
            ["RSI", "RSI"],
            ["MACD", "MACD"],
            ["Bollinger Bands", "BOLLINGER"],
            ["Moving Average", "MA"],
            ["Stochastic", "STOCH"],
            ["Volume", "VOLUME"],
            ["Price Action", "PRICE_ACTION"],
            ["Support/Resistance", "S_R"],
          ],
        },
        {
          type: "field_dropdown",
          name: "OPERATOR",
          options: [
            ["<", "LT"],
            [">", "GT"],
            ["=", "EQ"],
            ["Crosses Above", "CROSS_ABOVE"],
            ["Crosses Below", "CROSS_BELOW"],
            ["Between", "BETWEEN"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "TIMEFRAME",
          options: [
            ["1m", "1m"],
            ["5m", "5m"],
            ["15m", "15m"],
            ["1h", "1h"],
            ["4h", "4h"],
            ["1d", "1d"],
          ],
        },
      ],
      inputsInline: true,
      output: "Boolean",
      colour: "#FF6B6B",
      tooltip: "Technical indicator condition",
    },
    {
      type: "trading_action",
      message0: "%1 %2 %3 of %4",
      args0: [
        {
          type: "field_dropdown",
          name: "ACTION",
          options: [
            ["Buy", "BUY"],
            ["Sell", "SELL"],
            ["Buy Long", "BUY_LONG"],
            ["Sell Short", "SELL_SHORT"],
            ["Close Position", "CLOSE"],
          ],
        },
        {
          type: "field_dropdown",
          name: "ORDER_TYPE",
          options: [
            ["Market", "MARKET"],
            ["Limit", "LIMIT"],
            ["Stop Loss", "STOP_LOSS"],
            ["Take Profit", "TAKE_PROFIT"],
            ["Trailing Stop", "TRAILING_STOP"],
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
            ["BTC/USDT", "BTC_USDT"],
            ["ETH/USDT", "ETH_USDT"],
            ["SOL/USDT", "SOL_USDT"],
            ["ADA/USDT", "ADA_USDT"],
            ["DOT/USDT", "DOT_USDT"],
            ["LINK/USDT", "LINK_USDT"],
            ["MATIC/USDT", "MATIC_USDT"],
            ["AVAX/USDT", "AVAX_USDT"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#4ECDC4",
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
      colour: "#45B7D1",
      tooltip: "Entry point for trading strategy",
      deletable: false,
    },
    {
      type: "risk_management",
      message0: "Risk Management %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "RISK_TYPE",
          options: [
            ["Max Position Size", "MAX_POSITION"],
            ["Stop Loss", "STOP_LOSS"],
            ["Take Profit", "TAKE_PROFIT"],
            ["Max Daily Loss", "MAX_DAILY_LOSS"],
            ["Max Portfolio Risk", "MAX_PORTFOLIO_RISK"],
          ],
        },
        {
          type: "input_value",
          name: "PERCENTAGE",
          check: "Number",
        },
        {
          type: "field_label",
          text: "% of portfolio",
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FF9F43",
      tooltip: "Risk management settings",
    },
    {
      type: "portfolio_balance",
      message0: "Portfolio Balance %1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "BALANCE_TYPE",
          options: [
            ["Total Value", "TOTAL_VALUE"],
            ["Available Balance", "AVAILABLE"],
            ["Position Value", "POSITION_VALUE"],
            ["Unrealized P&L", "UNREALIZED_PNL"],
            ["Realized P&L", "REALIZED_PNL"],
          ],
        },
        {
          type: "field_dropdown",
          name: "ASSET",
          options: [
            ["USDT", "USDT"],
            ["BTC", "BTC"],
            ["ETH", "ETH"],
            ["All Assets", "ALL"],
          ],
        },
      ],
      inputsInline: true,
      output: "Number",
      colour: "#A55EEA",
      tooltip: "Get portfolio balance information",
    },
    {
      type: "market_data",
      message0: "Market Data %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "DATA_TYPE",
          options: [
            ["Current Price", "PRICE"],
            ["24h Change", "24H_CHANGE"],
            ["24h Volume", "24H_VOLUME"],
            ["Market Cap", "MARKET_CAP"],
            ["Fear & Greed Index", "FEAR_GREED"],
            ["Funding Rate", "FUNDING_RATE"],
          ],
        },
        {
          type: "field_dropdown",
          name: "ASSET",
          options: [
            ["BTC/USDT", "BTC_USDT"],
            ["ETH/USDT", "ETH_USDT"],
            ["SOL/USDT", "SOL_USDT"],
            ["ADA/USDT", "ADA_USDT"],
            ["DOT/USDT", "DOT_USDT"],
          ],
        },
        {
          type: "field_dropdown",
          name: "TIMEFRAME",
          options: [
            ["1m", "1m"],
            ["5m", "5m"],
            ["15m", "15m"],
            ["1h", "1h"],
            ["4h", "4h"],
            ["1d", "1d"],
          ],
        },
      ],
      inputsInline: true,
      output: "Number",
      colour: "#26DE81",
      tooltip: "Get real-time market data",
    },
    {
      type: "get_price",
      message0: "Get Price %1 on %2",
      args0: [
        {
          type: "field_dropdown",
          name: "ASSET",
          options: [
            ["BTC", "BTC"],
            ["ETH", "ETH"],
            ["SOL", "SOL"],
            ["ADA", "ADA"],
            ["DOT", "DOT"],
            ["LINK", "LINK"],
            ["MATIC", "MATIC"],
            ["AVAX", "AVAX"],
            ["UNI", "UNI"],
            ["AAVE", "AAVE"],
          ],
        },
        {
          type: "field_dropdown",
          name: "EXCHANGE",
          options: [
            ["Binance", "BINANCE"],
            ["Coinbase", "COINBASE"],
            ["Kraken", "KRAKEN"],
            ["KuCoin", "KUCOIN"],
            ["Bybit", "BYBIT"],
            ["OKX", "OKX"],
          ],
        },
      ],
      inputsInline: true,
      output: "Number",
      colour: "#00B894",
      tooltip: "Get current price from exchange",
    },
    {
      type: "blockchain_operation",
      message0: "%1 %2 on %3",
      args0: [
        {
          type: "field_dropdown",
          name: "OPERATION",
          options: [
            ["Send", "SEND"],
            ["Receive", "RECEIVE"],
            ["Swap", "SWAP"],
            ["Bridge", "BRIDGE"],
            ["Stake", "STAKE"],
            ["Unstake", "UNSTAKE"],
            ["Claim Rewards", "CLAIM"],
            ["Vote", "VOTE"],
          ],
        },
        {
          type: "input_value",
          name: "AMOUNT",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "CHAIN",
          options: [
            ["Ethereum", "ETH"],
            ["Binance Smart Chain", "BSC"],
            ["Polygon", "POLYGON"],
            ["Arbitrum", "ARBITRUM"],
            ["Optimism", "OPTIMISM"],
            ["Solana", "SOLANA"],
            ["Avalanche", "AVALANCHE"],
            ["Cardano", "CARDANO"],
            ["Polkadot", "POLKADOT"],
            ["Cosmos", "COSMOS"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#6C5CE7",
      tooltip: "Blockchain operation",
    },
    {
      type: "defi_operation",
      message0: "%1 %2 %3 on %4",
      args0: [
        {
          type: "field_dropdown",
          name: "DEFI_ACTION",
          options: [
            ["Deposit", "DEPOSIT"],
            ["Withdraw", "WITHDRAW"],
            ["Borrow", "BORROW"],
            ["Repay", "REPAY"],
            ["Add Liquidity", "ADD_LIQUIDITY"],
            ["Remove Liquidity", "REMOVE_LIQUIDITY"],
            ["Stake", "STAKE"],
            ["Unstake", "UNSTAKE"],
            ["Claim Rewards", "CLAIM_REWARDS"],
            ["Harvest", "HARVEST"],
          ],
        },
        {
          type: "input_value",
          name: "AMOUNT",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "TOKEN",
          options: [
            ["USDT", "USDT"],
            ["USDC", "USDC"],
            ["DAI", "DAI"],
            ["WETH", "WETH"],
            ["WBTC", "WBTC"],
            ["UNI", "UNI"],
            ["AAVE", "AAVE"],
            ["CRV", "CRV"],
            ["COMP", "COMP"],
            ["SUSHI", "SUSHI"],
          ],
        },
        {
          type: "field_dropdown",
          name: "PROTOCOL",
          options: [
            ["Uniswap", "UNISWAP"],
            ["SushiSwap", "SUSHISWAP"],
            ["Aave", "AAVE"],
            ["Compound", "COMPOUND"],
            ["Curve", "CURVE"],
            ["Yearn Finance", "YEARN"],
            ["Balancer", "BALANCER"],
            ["1inch", "1INCH"],
            ["PancakeSwap", "PANCAKESWAP"],
            ["Trader Joe", "TRADER_JOE"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FD79A8",
      tooltip: "DeFi protocol operation",
    },
    {
      type: "swap_operation",
      message0: "Swap %1 %2 for %3 %4",
      args0: [
        {
          type: "input_value",
          name: "FROM_AMOUNT",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "FROM_TOKEN",
          options: [
            ["USDT", "USDT"],
            ["USDC", "USDC"],
            ["ETH", "ETH"],
            ["BTC", "BTC"],
            ["SOL", "SOL"],
            ["ADA", "ADA"],
            ["DOT", "DOT"],
            ["LINK", "LINK"],
            ["MATIC", "MATIC"],
            ["AVAX", "AVAX"],
          ],
        },
        {
          type: "input_value",
          name: "TO_AMOUNT",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "TO_TOKEN",
          options: [
            ["USDT", "USDT"],
            ["USDC", "USDC"],
            ["ETH", "ETH"],
            ["BTC", "BTC"],
            ["SOL", "SOL"],
            ["ADA", "ADA"],
            ["DOT", "DOT"],
            ["LINK", "LINK"],
            ["MATIC", "MATIC"],
            ["AVAX", "AVAX"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FDCB6E",
      tooltip: "Token swap operation",
    },
    {
      type: "staking_operation",
      message0: "%1 %2 %3 on %4",
      args0: [
        {
          type: "field_dropdown",
          name: "STAKING_ACTION",
          options: [
            ["Stake", "STAKE"],
            ["Unstake", "UNSTAKE"],
            ["Claim Rewards", "CLAIM"],
            ["Reinvest", "REINVEST"],
            ["Delegate", "DELEGATE"],
            ["Undelegate", "UNDELEGATE"],
          ],
        },
        {
          type: "input_value",
          name: "AMOUNT",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "TOKEN",
          options: [
            ["ETH", "ETH"],
            ["SOL", "SOL"],
            ["ADA", "ADA"],
            ["DOT", "DOT"],
            ["ATOM", "ATOM"],
            ["MATIC", "MATIC"],
            ["AVAX", "AVAX"],
            ["BNB", "BNB"],
            ["FTM", "FTM"],
            ["NEAR", "NEAR"],
          ],
        },
        {
          type: "field_dropdown",
          name: "VALIDATOR",
          options: [
            ["Auto Select", "AUTO"],
            ["Binance", "BINANCE"],
            ["Coinbase", "COINBASE"],
            ["Kraken", "KRAKEN"],
            ["Lido", "LIDO"],
            ["Rocket Pool", "ROCKET_POOL"],
            ["Custom Validator", "CUSTOM"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#E17055",
      tooltip: "Staking operation",
    },
    {
      type: "gas_optimization",
      message0: "Gas Optimization %1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "GAS_STRATEGY",
          options: [
            ["Low Priority", "LOW"],
            ["Medium Priority", "MEDIUM"],
            ["High Priority", "HIGH"],
            ["Custom Gas Price", "CUSTOM"],
            ["Wait for Low Gas", "WAIT"],
            ["Use Layer 2", "L2"],
          ],
        },
        {
          type: "field_dropdown",
          name: "NETWORK",
          options: [
            ["Ethereum", "ETH"],
            ["Polygon", "POLYGON"],
            ["Arbitrum", "ARBITRUM"],
            ["Optimism", "OPTIMISM"],
            ["BSC", "BSC"],
            ["Avalanche", "AVALANCHE"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#74B9FF",
      tooltip: "Gas fee optimization",
    },
  ]);

  console.log("Custom blocks defined successfully");
};

// Advanced toolbox configuration for crypto trading bots
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
        {
          kind: "block",
          type: "controls_repeat_ext",
        },
      ],
    },
    {
      kind: "category",
      name: "📊 Technical Analysis",
      colour: "#FF6B6B",
      contents: [
        {
          kind: "block",
          type: "technical_indicator",
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
      name: "⚡ Trading Actions",
      colour: "#4ECDC4",
      contents: [
        {
          kind: "block",
          type: "trading_action",
        },
      ],
    },
    {
      kind: "category",
      name: "🛡️ Risk Management",
      colour: "#FF9F43",
      contents: [
        {
          kind: "block",
          type: "risk_management",
        },
      ],
    },
    {
      kind: "category",
      name: "💰 Portfolio",
      colour: "#A55EEA",
      contents: [
        {
          kind: "block",
          type: "portfolio_balance",
        },
        {
          kind: "block",
          type: "market_data",
        },
        {
          kind: "block",
          type: "get_price",
        },
      ],
    },
    {
      kind: "category",
      name: "🔗 Blockchain",
      colour: "#6C5CE7",
      contents: [
        {
          kind: "block",
          type: "blockchain_operation",
        },
        {
          kind: "block",
          type: "gas_optimization",
        },
      ],
    },
    {
      kind: "category",
      name: "🔄 DeFi",
      colour: "#FD79A8",
      contents: [
        {
          kind: "block",
          type: "defi_operation",
        },
        {
          kind: "block",
          type: "swap_operation",
        },
      ],
    },
    {
      kind: "category",
      name: "🔒 Staking",
      colour: "#E17055",
      contents: [
        {
          kind: "block",
          type: "staking_operation",
        },
      ],
    },
    {
      kind: "category",
      name: "🔢 Math & Logic",
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
                
                /* Custom block styles */
                .blocklyBlock[data-type="technical_indicator"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3) !important;
                }
                
                .blocklyBlock[data-type="trading_action"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(78, 205, 196, 0.3) !important;
                }
                
                .blocklyBlock[data-type="strategy_start"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(69, 183, 209, 0.3) !important;
                }
                
                .blocklyBlock[data-type="risk_management"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 159, 67, 0.3) !important;
                }
                
                .blocklyBlock[data-type="portfolio_balance"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(165, 94, 234, 0.3) !important;
                }
                
                .blocklyBlock[data-type="market_data"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(38, 222, 129, 0.3) !important;
                }
                
                .blocklyBlock[data-type="get_price"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(0, 184, 148, 0.3) !important;
                }
                
                .blocklyBlock[data-type="blockchain_operation"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(108, 92, 231, 0.3) !important;
                }
                
                .blocklyBlock[data-type="defi_operation"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(253, 121, 168, 0.3) !important;
                }
                
                .blocklyBlock[data-type="swap_operation"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(253, 203, 110, 0.3) !important;
                }
                
                .blocklyBlock[data-type="staking_operation"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(225, 112, 85, 0.3) !important;
                }
                
                .blocklyBlock[data-type="gas_optimization"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(116, 185, 255, 0.3) !important;
                }
                
                /* Hover effects - disabled to prevent oscillation */
                /* .blocklyBlock:hover {
                  transform: translateY(-1px) !important;
                  transition: transform 0.2s ease !important;
                } */
                
                /* Custom fonts for all Blockly text */
                .blocklyText, .blocklyDropdownText, .blocklyFieldLabel {
                  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-weight: 500 !important;
                  font-size: 14px !important;
                }
                
                /* Make dropdown text more readable */
                .blocklyDropdownText {
                  font-weight: 600 !important;
                  color: #374151 !important;
                }
                
                /* Style the field labels */
                .blocklyFieldLabel {
                  font-weight: 600 !important;
                  color: #6B7280 !important;
                }
                
                /* Custom font for toolbox categories */
                .blocklyTreeRoot, .blocklyTreeLabel {
                  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-weight: 500 !important;
                  font-size: 14px !important;
                }
              `,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
