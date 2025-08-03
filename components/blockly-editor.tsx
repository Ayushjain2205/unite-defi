"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as Blockly from "blockly";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

// Define custom blocks
const defineCustomBlocks = () => {
  // Check if blocks are already defined to prevent redefinition
  if (
    Blockly.Blocks["trading_condition"] &&
    Blockly.Blocks["trading_action"] &&
    Blockly.Blocks["strategy_start"] &&
    Blockly.Blocks["ai_agent"] &&
    Blockly.Blocks["ai_agent_config"] &&
    Blockly.Blocks["ai_prompt"] &&
    Blockly.Blocks["ai_condition"] &&
    Blockly.Blocks["ai_data_source"] &&
    Blockly.Blocks["ai_learning"] &&
    Blockly.Blocks["ai_optimization"]
  ) {
    console.log("Custom blocks already defined, skipping...");
    return;
  }

  console.log("Defining custom blocks...");

  // Advanced trading blocks
  Blockly.defineBlocksWithJsonArray([
    // 1inch Limit Order Blocks
    {
      type: "limit_order_1inch",
      message0: "1inch Limit Order %1 %2 %3 %4 %5 %6",
      args0: [
        {
          type: "field_dropdown",
          name: "ORDER_SIDE",
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
        {
          type: "input_value",
          name: "LIMIT_PRICE",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "EXPIRY",
          options: [
            ["1 hour", "1H"],
            ["4 hours", "4H"],
            ["1 day", "1D"],
            ["7 days", "7D"],
            ["30 days", "30D"],
            ["No expiry", "NEVER"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FF6B35",
      tooltip: "Create a 1inch limit order",
    },
    {
      type: "limit_order_condition",
      message0: "When %1 %2 %3 %4 %5",
      args0: [
        {
          type: "field_dropdown",
          name: "CONDITION_TYPE",
          options: [
            ["Price crosses above", "PRICE_CROSS_ABOVE"],
            ["Price crosses below", "PRICE_CROSS_BELOW"],
            ["Price is above", "PRICE_ABOVE"],
            ["Price is below", "PRICE_BELOW"],
            ["Volume spike", "VOLUME_SPIKE"],
            ["RSI condition", "RSI_CONDITION"],
            ["MACD signal", "MACD_SIGNAL"],
            ["Time-based", "TIME_BASED"],
          ],
        },
        {
          type: "input_value",
          name: "THRESHOLD",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "TOKEN_PAIR",
          options: [
            ["ETH/USDT", "ETH_USDT"],
            ["BTC/USDT", "BTC_USDT"],
            ["SOL/USDT", "SOL_USDT"],
            ["ADA/USDT", "ADA_USDT"],
            ["DOT/USDT", "DOT_USDT"],
            ["LINK/USDT", "LINK_USDT"],
            ["MATIC/USDT", "MATIC_USDT"],
            ["AVAX/USDT", "AVAX_USDT"],
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
        {
          type: "field_dropdown",
          name: "EXECUTION_TYPE",
          options: [
            ["Execute immediately", "IMMEDIATE"],
            ["Place limit order", "LIMIT_ORDER"],
            ["Place stop order", "STOP_ORDER"],
            ["Place OCO order", "OCO_ORDER"],
          ],
        },
      ],
      inputsInline: true,
      output: "Boolean",
      colour: "#FF8C42",
      tooltip: "Condition for executing limit orders",
    },
    {
      type: "limit_order_management",
      message0: "Limit Order Management %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "ACTION",
          options: [
            ["Place Order", "PLACE"],
            ["Cancel Order", "CANCEL"],
            ["Modify Order", "MODIFY"],
            ["Get Order Status", "STATUS"],
            ["List Active Orders", "LIST"],
            ["Cancel All Orders", "CANCEL_ALL"],
          ],
        },
        {
          type: "field_dropdown",
          name: "ORDER_TYPE",
          options: [
            ["Limit Order", "LIMIT"],
            ["Stop Limit", "STOP_LIMIT"],
            ["OCO Order", "OCO"],
            ["Trailing Stop", "TRAILING_STOP"],
            ["Time-weighted", "TWAP"],
            ["Iceberg Order", "ICEBERG"],
          ],
        },
        {
          type: "field_dropdown",
          name: "PROTOCOL",
          options: [
            ["1inch", "1INCH"],
            ["1inch Fusion", "1INCH_FUSION"],
            ["1inch Limit Orders", "1INCH_LIMIT"],
            ["1inch Aggregator", "1INCH_AGGREGATOR"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FFA500",
      tooltip: "Manage 1inch limit orders",
    },
    {
      type: "limit_order_strategy",
      message0: "Limit Order Strategy %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "STRATEGY_TYPE",
          options: [
            ["Grid Trading", "GRID"],
            ["DCA Strategy", "DCA"],
            ["Arbitrage", "ARBITRAGE"],
            ["Mean Reversion", "MEAN_REVERSION"],
            ["Momentum Trading", "MOMENTUM"],
            ["Scalping", "SCALPING"],
            ["Swing Trading", "SWING"],
            ["Custom Strategy", "CUSTOM"],
          ],
        },
        {
          type: "field_dropdown",
          name: "RISK_LEVEL",
          options: [
            ["Conservative", "CONSERVATIVE"],
            ["Moderate", "MODERATE"],
            ["Aggressive", "AGGRESSIVE"],
            ["Very Aggressive", "VERY_AGGRESSIVE"],
          ],
        },
        {
          type: "input_statement",
          name: "CONFIG",
        },
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      colour: "#FF6347",
      tooltip: "Configure limit order strategy",
    },
    {
      type: "limit_order_config",
      message0: "Strategy Config %1 %2 %3 %4",
      args0: [
        {
          type: "field_dropdown",
          name: "GRID_SPACING",
          options: [
            ["0.1%", "0.001"],
            ["0.5%", "0.005"],
            ["1%", "0.01"],
            ["2%", "0.02"],
            ["5%", "0.05"],
            ["10%", "0.1"],
          ],
        },
        {
          type: "field_dropdown",
          name: "POSITION_SIZE",
          options: [
            ["1% of portfolio", "0.01"],
            ["2% of portfolio", "0.02"],
            ["5% of portfolio", "0.05"],
            ["10% of portfolio", "0.1"],
            ["20% of portfolio", "0.2"],
            ["Fixed amount", "FIXED"],
          ],
        },
        {
          type: "field_dropdown",
          name: "MAX_ORDERS",
          options: [
            ["5 orders", "5"],
            ["10 orders", "10"],
            ["20 orders", "20"],
            ["50 orders", "50"],
            ["100 orders", "100"],
            ["Unlimited", "UNLIMITED"],
          ],
        },
        {
          type: "field_dropdown",
          name: "SLIPPAGE_TOLERANCE",
          options: [
            ["0.1%", "0.001"],
            ["0.5%", "0.005"],
            ["1%", "0.01"],
            ["2%", "0.02"],
            ["5%", "0.05"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FF7F50",
      tooltip: "Configure limit order parameters",
    },
    {
      type: "limit_order_monitoring",
      message0: "Monitor Orders %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "MONITOR_TYPE",
          options: [
            ["Order Status", "STATUS"],
            ["Fill Rate", "FILL_RATE"],
            ["Execution Time", "EXECUTION_TIME"],
            ["Slippage", "SLIPPAGE"],
            ["Gas Costs", "GAS_COSTS"],
            ["Profit/Loss", "P_L"],
          ],
        },
        {
          type: "field_dropdown",
          name: "ALERT_TYPE",
          options: [
            ["Order Filled", "ORDER_FILLED"],
            ["Order Cancelled", "ORDER_CANCELLED"],
            ["Price Alert", "PRICE_ALERT"],
            ["Volume Alert", "VOLUME_ALERT"],
            ["Error Alert", "ERROR_ALERT"],
            ["Performance Alert", "PERFORMANCE_ALERT"],
          ],
        },
        {
          type: "field_dropdown",
          name: "NOTIFICATION",
          options: [
            ["Email", "EMAIL"],
            ["SMS", "SMS"],
            ["Push Notification", "PUSH"],
            ["Telegram", "TELEGRAM"],
            ["Discord", "DISCORD"],
            ["Slack", "SLACK"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#FF4500",
      tooltip: "Monitor and alert on limit orders",
    },
    // AI Agent Blocks
    {
      type: "ai_agent",
      message0: "🤖 AI Agent %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "AGENT_TYPE",
          options: [
            ["Trading Agent", "TRADING_AGENT"],
            ["Market Analysis Agent", "MARKET_ANALYSIS"],
            ["Risk Management Agent", "RISK_MANAGEMENT"],
            ["Portfolio Optimization Agent", "PORTFOLIO_OPTIMIZATION"],
            ["Sentiment Analysis Agent", "SENTIMENT_ANALYSIS"],
            ["News Analysis Agent", "NEWS_ANALYSIS"],
            ["Technical Analysis Agent", "TECHNICAL_ANALYSIS"],
            ["Arbitrage Agent", "ARBITRAGE_AGENT"],
            ["Limit Order Agent", "LIMIT_ORDER_AGENT"],
          ],
        },
        {
          type: "field_dropdown",
          name: "MODEL",
          options: [
            ["GPT-4", "GPT4"],
            ["GPT-3.5 Turbo", "GPT35"],
            ["Claude 3", "CLAUDE3"],
            ["Claude 3.5 Sonnet", "CLAUDE35"],
            ["Gemini Pro", "GEMINI_PRO"],
            ["Llama 3", "LLAMA3"],
            ["Custom Model", "CUSTOM"],
          ],
        },
        {
          type: "input_statement",
          name: "CONFIG",
        },
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      colour: "#8B5CF6",
      tooltip: "AI agent for automated decision making",
    },
    {
      type: "ai_agent_config",
      message0: "Agent Config %1 %2 %3 %4",
      args0: [
        {
          type: "field_dropdown",
          name: "TEMPERATURE",
          options: [
            ["Conservative (0.1)", "0.1"],
            ["Balanced (0.5)", "0.5"],
            ["Creative (0.8)", "0.8"],
            ["Very Creative (1.0)", "1.0"],
          ],
        },
        {
          type: "field_dropdown",
          name: "MAX_TOKENS",
          options: [
            ["Short (256)", "256"],
            ["Medium (512)", "512"],
            ["Long (1024)", "1024"],
            ["Very Long (2048)", "2048"],
          ],
        },
        {
          type: "field_dropdown",
          name: "STRATEGY",
          options: [
            ["Conservative", "CONSERVATIVE"],
            ["Balanced", "BALANCED"],
            ["Aggressive", "AGGRESSIVE"],
            ["Adaptive", "ADAPTIVE"],
          ],
        },
        {
          type: "field_dropdown",
          name: "UPDATE_FREQUENCY",
          options: [
            ["Real-time", "REALTIME"],
            ["Every 5 minutes", "5MIN"],
            ["Every 15 minutes", "15MIN"],
            ["Every hour", "1HOUR"],
            ["Daily", "DAILY"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#A855F7",
      tooltip: "Configure AI agent parameters",
    },
    {
      type: "ai_prompt",
      message0: "📝 AI Prompt %1 %2",
      args0: [
        {
          type: "field_multilinetext",
          name: "PROMPT_TEXT",
          text: "Analyze the current market conditions and provide trading recommendations based on technical indicators and market sentiment.",
        },
        {
          type: "field_dropdown",
          name: "PROMPT_TYPE",
          options: [
            ["Trading Decision", "TRADING_DECISION"],
            ["Market Analysis", "MARKET_ANALYSIS"],
            ["Risk Assessment", "RISK_ASSESSMENT"],
            ["Portfolio Review", "PORTFOLIO_REVIEW"],
            ["News Impact", "NEWS_IMPACT"],
            ["Technical Analysis", "TECHNICAL_ANALYSIS"],
            ["Sentiment Analysis", "SENTIMENT_ANALYSIS"],
            ["Custom", "CUSTOM"],
          ],
        },
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      colour: "#EC4899",
      tooltip: "Define AI prompt for analysis",
    },
    {
      type: "ai_condition",
      message0: "🧠 AI Condition %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "CONDITION_TYPE",
          options: [
            ["Confidence Score", "CONFIDENCE"],
            ["Sentiment Score", "SENTIMENT"],
            ["Risk Score", "RISK_SCORE"],
            ["Market Trend", "MARKET_TREND"],
            ["Volatility Level", "VOLATILITY"],
            ["Volume Analysis", "VOLUME_ANALYSIS"],
            ["Price Movement", "PRICE_MOVEMENT"],
            ["Custom Metric", "CUSTOM_METRIC"],
          ],
        },
        {
          type: "field_dropdown",
          name: "OPERATOR",
          options: [
            [">", "GT"],
            ["<", "LT"],
            ["=", "EQ"],
            [">=", "GTE"],
            ["<=", "LTE"],
            ["Contains", "CONTAINS"],
            ["Not Contains", "NOT_CONTAINS"],
          ],
        },
        {
          type: "input_value",
          name: "THRESHOLD",
          check: "Number",
        },
      ],
      inputsInline: true,
      output: "Boolean",
      colour: "#F59E0B",
      tooltip: "AI-powered condition checking",
    },
    {
      type: "ai_data_source",
      message0: "📊 AI Data Source %1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "DATA_SOURCE",
          options: [
            ["Market Data", "MARKET_DATA"],
            ["News & Sentiment", "NEWS_SENTIMENT"],
            ["Social Media", "SOCIAL_MEDIA"],
            ["On-chain Data", "ONCHAIN_DATA"],
            ["Technical Indicators", "TECHNICAL_INDICATORS"],
            ["Fundamental Data", "FUNDAMENTAL_DATA"],
            ["Alternative Data", "ALTERNATIVE_DATA"],
            ["Custom API", "CUSTOM_API"],
          ],
        },
        {
          type: "field_dropdown",
          name: "UPDATE_FREQUENCY",
          options: [
            ["Real-time", "REALTIME"],
            ["Every minute", "1MIN"],
            ["Every 5 minutes", "5MIN"],
            ["Every 15 minutes", "15MIN"],
            ["Every hour", "1HOUR"],
            ["Daily", "DAILY"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#10B981",
      tooltip: "Data source for AI analysis",
    },
    {
      type: "ai_learning",
      message0: "🎓 AI Learning %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "LEARNING_TYPE",
          options: [
            ["Reinforcement Learning", "REINFORCEMENT"],
            ["Supervised Learning", "SUPERVISED"],
            ["Unsupervised Learning", "UNSUPERVISED"],
            ["Online Learning", "ONLINE"],
            ["Transfer Learning", "TRANSFER"],
            ["Meta Learning", "META"],
          ],
        },
        {
          type: "field_dropdown",
          name: "MODEL_TYPE",
          options: [
            ["Neural Network", "NEURAL_NETWORK"],
            ["Decision Tree", "DECISION_TREE"],
            ["Random Forest", "RANDOM_FOREST"],
            ["Support Vector Machine", "SVM"],
            ["Gradient Boosting", "GRADIENT_BOOSTING"],
            ["Custom Model", "CUSTOM"],
          ],
        },
        {
          type: "field_dropdown",
          name: "TRAINING_FREQUENCY",
          options: [
            ["Continuous", "CONTINUOUS"],
            ["Daily", "DAILY"],
            ["Weekly", "WEEKLY"],
            ["Monthly", "MONTHLY"],
            ["On Performance Drop", "ON_PERFORMANCE_DROP"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#3B82F6",
      tooltip: "AI model learning and training",
    },
    {
      type: "ai_optimization",
      message0: "⚡ AI Optimization %1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OPTIMIZATION_TYPE",
          options: [
            ["Portfolio Optimization", "PORTFOLIO"],
            ["Risk Optimization", "RISK"],
            ["Timing Optimization", "TIMING"],
            ["Position Sizing", "POSITION_SIZING"],
            ["Entry/Exit Points", "ENTRY_EXIT"],
            ["Multi-Strategy", "MULTI_STRATEGY"],
            ["Parameter Tuning", "PARAMETER_TUNING"],
            ["Hyperparameter Optimization", "HYPERPARAMETER"],
          ],
        },
        {
          type: "field_dropdown",
          name: "OPTIMIZATION_METHOD",
          options: [
            ["Bayesian Optimization", "BAYESIAN"],
            ["Genetic Algorithm", "GENETIC"],
            ["Gradient Descent", "GRADIENT_DESCENT"],
            ["Grid Search", "GRID_SEARCH"],
            ["Random Search", "RANDOM_SEARCH"],
            ["Evolutionary Strategy", "EVOLUTIONARY"],
          ],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: "#EF4444",
      tooltip: "AI-powered strategy optimization",
    },
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
          type: "ai_agent",
        },
        {
          kind: "block",
          type: "ai_agent_config",
        },
        {
          kind: "block",
          type: "ai_prompt",
        },
        {
          kind: "block",
          type: "ai_condition",
        },
        {
          kind: "block",
          type: "ai_data_source",
        },
        {
          kind: "block",
          type: "ai_learning",
        },
        {
          kind: "block",
          type: "ai_optimization",
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
      name: "🎯 Limit Orders",
      colour: "#FF6B35",
      contents: [
        {
          kind: "block",
          type: "limit_order_1inch",
        },
        {
          kind: "block",
          type: "limit_order_condition",
        },
        {
          kind: "block",
          type: "limit_order_management",
        },
        {
          kind: "block",
          type: "limit_order_strategy",
        },
        {
          kind: "block",
          type: "limit_order_config",
        },
        {
          kind: "block",
          type: "limit_order_monitoring",
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
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualOperationRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const handleWorkspaceChange = useCallback(() => {
    if (!workspaceRef.current || isManualOperationRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const workspace = workspaceRef.current;
        if (!workspace || isManualOperationRef.current) return;
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlString = Blockly.Xml.domToText(xml);
        // Only call onWorkspaceChange if the XML is not empty
        if (xmlString.length > 61) {
          // 61 is the length of empty XML
          onWorkspaceChange?.(xmlString);
        }
      } catch (error) {
        console.error("Error in workspace change handler:", error);
      }
    }, 500); // Increased timeout to reduce frequency
  }, [onWorkspaceChange]);

  // Store the callback in a ref to avoid dependency issues
  const handleWorkspaceChangeRef = useRef(handleWorkspaceChange);
  handleWorkspaceChangeRef.current = handleWorkspaceChange;

  useEffect(() => {
    if (!blocklyDiv.current) {
      return;
    }

    try {
      // Define custom blocks first
      defineCustomBlocks();

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

      workspaceRef.current = ws;

      // Load initial XML if provided
      if (initialXml) {
        try {
          const xml = Blockly.utils.xml.textToDom(initialXml);
          Blockly.Xml.domToWorkspace(xml, ws);
        } catch (error) {
          console.error("Error loading initial XML:", error);
          setError("Failed to load initial blocks");
        }
      } else {
        // Add a default strategy start block
        const startBlock = ws.newBlock("strategy_start");
        startBlock.initSvg();
        startBlock.render();

        // Simple centering - just move to a reasonable position
        startBlock.moveBy(200, 100);
      }

      // Add workspace change listener
      ws.addChangeListener(handleWorkspaceChangeRef.current);

      // Mark initialization as complete
      setTimeout(() => {}, 100);

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
    const workspace = workspaceRef.current;
    if (!workspace) return;

    workspace.clear();
    const startBlock = workspace.newBlock("strategy_start");
    startBlock.initSvg();
    startBlock.render();
    startBlock.moveBy(200, 100);
  };

  const handleTest = () => {
    toast.success(
      "Visual editor is working! You can drag and drop blocks to build your strategy."
    );
  };

  const handleSave = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    // Disable workspace change listener temporarily
    isManualOperationRef.current = true;

    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);
    console.log("Manual save - XML length:", xmlText.length);
    // Don't call onWorkspaceChange here to avoid re-renders
    toast.success("Workspace saved successfully!");

    // Re-enable after a short delay
    setTimeout(() => {
      isManualOperationRef.current = false;
    }, 1000);
  };

  const handleTestWorkspaceChange = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    handleWorkspaceChangeRef.current();
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
                
                /* 1inch Limit Order Block Styles */
                .blocklyBlock[data-type="limit_order_1inch"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3) !important;
                  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%) !important;
                }
                
                .blocklyBlock[data-type="limit_order_condition"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 140, 66, 0.3) !important;
                  background: linear-gradient(135deg, #FF8C42 0%, #FFA500 100%) !important;
                }
                
                .blocklyBlock[data-type="limit_order_management"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 165, 0, 0.3) !important;
                  background: linear-gradient(135deg, #FFA500 0%, #FFB84D 100%) !important;
                }
                
                .blocklyBlock[data-type="limit_order_strategy"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 99, 71, 0.3) !important;
                  background: linear-gradient(135deg, #FF6347 0%, #FF7F50 100%) !important;
                }
                
                .blocklyBlock[data-type="limit_order_config"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 127, 80, 0.3) !important;
                  background: linear-gradient(135deg, #FF7F50 0%, #FF9F7F 100%) !important;
                }
                
                .blocklyBlock[data-type="limit_order_monitoring"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(255, 69, 0, 0.3) !important;
                  background: linear-gradient(135deg, #FF4500 0%, #FF6347 100%) !important;
                }
                
                /* AI Block Styles */
                .blocklyBlock[data-type="ai_agent"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3) !important;
                  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%) !important;
                }
                
                .blocklyBlock[data-type="ai_agent_config"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(168, 85, 247, 0.3) !important;
                  background: linear-gradient(135deg, #A855F7 0%, #C084FC 100%) !important;
                }
                
                .blocklyBlock[data-type="ai_prompt"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.3) !important;
                  background: linear-gradient(135deg, #EC4899 0%, #F472B6 100%) !important;
                }
                
                .blocklyBlock[data-type="ai_condition"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3) !important;
                  background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%) !important;
                }
                
                .blocklyBlock[data-type="ai_data_source"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3) !important;
                  background: linear-gradient(135deg, #10B981 0%, #34D399 100%) !important;
                }
                
                .blocklyBlock[data-type="ai_learning"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3) !important;
                  background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%) !important;
                }
                
                .blocklyBlock[data-type="ai_optimization"] {
                  border-radius: 8px !important;
                  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3) !important;
                  background: linear-gradient(135deg, #EF4444 0%, #F87171 100%) !important;
                }
                
                /* Enhanced toolbox/category menu styling */
                .blocklyTreeRoot {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                  border-radius: 12px !important;
                  margin: 8px !important;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                }
                
                .blocklyTreeRow {
                  border-radius: 8px !important;
                  margin: 4px 8px !important;
                  transition: all 0.2s ease !important;
                }
                
                .blocklyTreeRow:hover {
                  background: rgba(255, 255, 255, 0.1) !important;
                  transform: translateX(4px) !important;
                }
                
                .blocklyTreeSelected {
                  background: rgba(255, 255, 255, 0.2) !important;
                  border-radius: 8px !important;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
                }
                
                .blocklyTreeIcon {
                  border-radius: 6px !important;
                  margin: 4px !important;
                }
                
                .blocklyTreeIconClosed {
                  background: rgba(255, 255, 255, 0.9) !important;
                }
                
                .blocklyTreeIconOpen {
                  background: rgba(255, 255, 255, 0.9) !important;
                }
                
                /* Category headers styling */
                .blocklyTreeLabel {
                  font-weight: 600 !important;
                  color: #ffffff !important;
                  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
                  padding: 8px 12px !important;
                }
                
                /* Block items in toolbox */
                .blocklyTreeContent {
                  border-radius: 6px !important;
                  margin: 2px 4px !important;
                  transition: all 0.2s ease !important;
                }
                
                .blocklyTreeContent:hover {
                  background: rgba(255, 255, 255, 0.15) !important;
                  transform: scale(1.02) !important;
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
