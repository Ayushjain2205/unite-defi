"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Zap,
  BarChart3,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  category: string;
  blocklyXml: string;
}

const templates: Template[] = [
  {
    id: "rsi-scalp",
    name: "RSI Scalping",
    description: "Buy when RSI < 30, sell when RSI > 70",
    prompt: "Buy BTC when RSI < 30, sell when RSI > 70",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Technical",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="technical_indicator" x="200" y="250">
            <field name="INDICATOR">RSI</field>
            <field name="OPERATOR">LT</field>
            <value name="VALUE">
              <block type="math_number" x="200" y="300">
                <field name="NUM">30</field>
              </block>
            </value>
            <field name="TIMEFRAME">15m</field>
          </block>
        </value>
        <statement name="DO0">
          <block type="trading_action" x="200" y="350">
            <field name="ACTION">BUY</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="400">
                <field name="NUM">100</field>
              </block>
            </value>
            <field name="ASSET">BTC_USDT</field>
          </block>
        </statement>
        <next>
          <block type="controls_if" x="200" y="450">
            <value name="IF0">
              <block type="technical_indicator" x="200" y="500">
                <field name="INDICATOR">RSI</field>
                <field name="OPERATOR">GT</field>
                <value name="VALUE">
                  <block type="math_number" x="200" y="550">
                    <field name="NUM">70</field>
                  </block>
                </value>
                <field name="TIMEFRAME">15m</field>
              </block>
            </value>
            <statement name="DO0">
              <block type="trading_action" x="200" y="600">
                <field name="ACTION">SELL</field>
                <field name="ORDER_TYPE">MARKET</field>
                <value name="AMOUNT">
                  <block type="math_number" x="200" y="650">
                    <field name="NUM">100</field>
                  </block>
                </value>
                <field name="ASSET">BTC_USDT</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "price-breakout",
    name: "Price Breakout",
    description: "Execute trades when price crosses key levels",
    prompt: "Sell ETH when price crosses $3000",
    icon: <Target className="w-5 h-5" />,
    category: "Technical",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="logic_compare" x="200" y="250">
            <field name="OP">GT</field>
            <value name="A">
              <block type="get_price" x="200" y="300">
                <field name="ASSET">ETH</field>
                <field name="EXCHANGE">BINANCE</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" x="200" y="350">
                <field name="NUM">3000</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="trading_action" x="200" y="400">
            <field name="ACTION">SELL</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="450">
                <field name="NUM">50</field>
              </block>
            </value>
            <field name="ASSET">ETH_USDT</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "dca-daily",
    name: "Daily DCA",
    description: "Dollar-cost average at scheduled intervals",
    prompt: "Dollar-cost average into SOL every day at 12pm",
    icon: <Clock className="w-5 h-5" />,
    category: "DCA",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_repeat_ext" x="200" y="200">
        <value name="TIMES">
          <block type="math_number" x="200" y="250">
            <field name="NUM">1</field>
          </block>
        </value>
        <statement name="DO">
          <block type="trading_action" x="200" y="300">
            <field name="ACTION">BUY</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="350">
                <field name="NUM">25</field>
              </block>
            </value>
            <field name="ASSET">SOL_USDT</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "gas-optimizer",
    name: "Gas Fee Optimizer",
    description: "Trade when gas fees are optimal",
    prompt: "Buy ETH if gas fee drops below 20 gwei",
    icon: <Zap className="w-5 h-5" />,
    category: "DeFi",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="logic_compare" x="200" y="250">
            <field name="OP">LT</field>
            <value name="A">
              <block type="market_data" x="200" y="300">
                <field name="DATA_TYPE">FEAR_GREED</field>
                <field name="ASSET">ETH_USDT</field>
                <field name="TIMEFRAME">1h</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" x="200" y="350">
                <field name="NUM">20</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="trading_action" x="200" y="400">
            <field name="ACTION">BUY</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="450">
                <field name="NUM">100</field>
              </block>
            </value>
            <field name="ASSET">ETH_USDT</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "momentum-follow",
    name: "Momentum Following",
    description: "Follow strong price momentum trends",
    prompt: "Buy when 24h volume > 200% average and price up > 5%",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Technical",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="logic_operation" x="200" y="250">
            <field name="OP">AND</field>
            <value name="A">
              <block type="logic_compare" x="200" y="300">
                <field name="OP">GT</field>
                <value name="A">
                  <block type="market_data" x="200" y="350">
                    <field name="DATA_TYPE">24H_VOLUME</field>
                    <field name="ASSET">BTC_USDT</field>
                    <field name="TIMEFRAME">1d</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_arithmetic" x="200" y="400">
                    <field name="OP">MULTIPLY</field>
                    <value name="A">
                      <block type="math_number" x="200" y="450">
                        <field name="NUM">2</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number" x="200" y="500">
                        <field name="NUM">1000000</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
            <value name="B">
              <block type="logic_compare" x="200" y="550">
                <field name="OP">GT</field>
                <value name="A">
                  <block type="market_data" x="200" y="600">
                    <field name="DATA_TYPE">24H_CHANGE</field>
                    <field name="ASSET">BTC_USDT</field>
                    <field name="TIMEFRAME">1d</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_number" x="200" y="650">
                    <field name="NUM">5</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="trading_action" x="200" y="700">
            <field name="ACTION">BUY</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="750">
                <field name="NUM">200</field>
              </block>
            </value>
            <field name="ASSET">BTC_USDT</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "profit-take",
    name: "Profit Taking",
    description: "Systematic profit taking strategy",
    prompt: "Take 25% profit when position is up 20%, stop loss at -10%",
    icon: <DollarSign className="w-5 h-5" />,
    category: "Risk Management",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="logic_compare" x="200" y="250">
            <field name="OP">GT</field>
            <value name="A">
              <block type="portfolio_balance" x="200" y="300">
                <field name="BALANCE_TYPE">UNREALIZED_PNL</field>
                <field name="ASSET">ALL</field>
              </block>
            </value>
            <value name="B">
              <block type="math_arithmetic" x="200" y="350">
                <field name="OP">MULTIPLY</field>
                <value name="A">
                  <block type="portfolio_balance" x="200" y="400">
                    <field name="BALANCE_TYPE">TOTAL_VALUE</field>
                    <field name="ASSET">ALL</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_number" x="200" y="450">
                    <field name="NUM">0.2</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="trading_action" x="200" y="500">
            <field name="ACTION">SELL</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_arithmetic" x="200" y="550">
                <field name="OP">MULTIPLY</field>
                <value name="A">
                  <block type="portfolio_balance" x="200" y="600">
                    <field name="BALANCE_TYPE">POSITION_VALUE</field>
                    <field name="ASSET">ALL</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_number" x="200" y="650">
                    <field name="NUM">0.25</field>
                  </block>
                </value>
              </block>
            </value>
            <field name="ASSET">BTC_USDT</field>
          </block>
        </statement>
        <next>
          <block type="controls_if" x="200" y="700">
            <value name="IF0">
              <block type="logic_compare" x="200" y="750">
                <field name="OP">LT</field>
                <value name="A">
                  <block type="portfolio_balance" x="200" y="800">
                    <field name="BALANCE_TYPE">UNREALIZED_PNL</field>
                    <field name="ASSET">ALL</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_arithmetic" x="200" y="850">
                    <field name="OP">MULTIPLY</field>
                    <value name="A">
                      <block type="portfolio_balance" x="200" y="900">
                        <field name="BALANCE_TYPE">TOTAL_VALUE</field>
                        <field name="ASSET">ALL</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number" x="200" y="950">
                        <field name="NUM">-0.1</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO0">
              <block type="trading_action" x="200" y="1000">
                <field name="ACTION">SELL</field>
                <field name="ORDER_TYPE">STOP_LOSS</field>
                <value name="AMOUNT">
                  <block type="portfolio_balance" x="200" y="1050">
                    <field name="BALANCE_TYPE">POSITION_VALUE</field>
                    <field name="ASSET">ALL</field>
                  </block>
                </value>
                <field name="ASSET">BTC_USDT</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "ai-trading-agent",
    name: "AI Trading Agent",
    description: "AI-powered trading with sentiment analysis",
    prompt:
      "Use AI to analyze market sentiment and execute trades based on confidence scores",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "AI",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="ai_agent" x="200" y="200">
        <field name="AGENT_TYPE">TRADING_AGENT</field>
        <field name="MODEL">GPT4</field>
        <statement name="CONFIG">
          <block type="ai_agent_config" x="200" y="300">
            <field name="TEMPERATURE">0.5</field>
            <field name="MAX_TOKENS">1024</field>
            <field name="STRATEGY">BALANCED</field>
            <field name="UPDATE_FREQUENCY">15MIN</field>
          </block>
          <block type="ai_prompt" x="200" y="400">
            <field name="PROMPT_TEXT">Analyze current market conditions, technical indicators, and sentiment data to determine optimal trading opportunities. Consider RSI, MACD, volume, and market sentiment. Execute trades only when confidence score is above 75%.</field>
            <field name="PROMPT_TYPE">TRADING_DECISION</field>
          </block>
          <block type="ai_data_source" x="200" y="500">
            <field name="DATA_SOURCE">MARKET_DATA</field>
            <field name="UPDATE_FREQUENCY">5MIN</field>
          </block>
          <block type="ai_condition" x="200" y="600">
            <field name="CONDITION_TYPE">CONFIDENCE</field>
            <field name="OPERATOR">GT</field>
            <value name="THRESHOLD">
              <block type="math_number" x="200" y="650">
                <field name="NUM">75</field>
              </block>
            </value>
          </block>
          <block type="trading_action" x="200" y="700">
            <field name="ACTION">BUY</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="750">
                <field name="NUM">100</field>
              </block>
            </value>
            <field name="ASSET">BTC_USDT</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "defi-yield-farming",
    name: "DeFi Yield Farming",
    description: "Automated yield farming across multiple protocols",
    prompt:
      "Automatically farm yield by moving funds between the highest yielding DeFi protocols",
    icon: <Zap className="w-5 h-5" />,
    category: "DeFi",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="logic_compare" x="200" y="250">
            <field name="OP">GT</field>
            <value name="A">
              <block type="portfolio_balance" x="200" y="300">
                <field name="BALANCE_TYPE">AVAILABLE</field>
                <field name="ASSET">USDT</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" x="200" y="350">
                <field name="NUM">1000</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="defi_operation" x="200" y="400">
            <field name="DEFI_ACTION">DEPOSIT</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="450">
                <field name="NUM">500</field>
              </block>
            </value>
            <field name="TOKEN">USDT</field>
            <field name="PROTOCOL">AAVE</field>
          </block>
          <block type="defi_operation" x="200" y="500">
            <field name="DEFI_ACTION">ADD_LIQUIDITY</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="550">
                <field name="NUM">300</field>
              </block>
            </value>
            <field name="TOKEN">USDT</field>
            <field name="PROTOCOL">UNISWAP</field>
          </block>
          <block type="staking_operation" x="200" y="600">
            <field name="STAKING_ACTION">STAKE</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="650">
                <field name="NUM">200</field>
              </block>
            </value>
            <field name="TOKEN">ETH</field>
            <field name="VALIDATOR">LIDO</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "grid-trading",
    name: "Grid Trading",
    description: "Automated grid trading with dynamic price levels",
    prompt:
      "Set up a grid trading strategy with buy orders at every 2% drop and sell orders at every 2% rise",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Technical",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_repeat_ext" x="200" y="200">
        <value name="TIMES">
          <block type="math_number" x="200" y="250">
            <field name="NUM">10</field>
          </block>
        </value>
        <statement name="DO">
          <block type="controls_if" x="200" y="300">
            <value name="IF0">
              <block type="logic_compare" x="200" y="350">
                <field name="OP">LT</field>
                <value name="A">
                  <block type="get_price" x="200" y="400">
                    <field name="ASSET">BTC</field>
                    <field name="EXCHANGE">BINANCE</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_arithmetic" x="200" y="450">
                    <field name="OP">MULTIPLY</field>
                    <value name="A">
                      <block type="get_price" x="200" y="500">
                        <field name="ASSET">BTC</field>
                        <field name="EXCHANGE">BINANCE</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number" x="200" y="550">
                        <field name="NUM">0.98</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO0">
              <block type="trading_action" x="200" y="600">
                <field name="ACTION">BUY</field>
                <field name="ORDER_TYPE">LIMIT</field>
                <value name="AMOUNT">
                  <block type="math_number" x="200" y="650">
                    <field name="NUM">50</field>
                  </block>
                </value>
                <field name="ASSET">BTC_USDT</field>
              </block>
            </statement>
            <next>
              <block type="controls_if" x="200" y="700">
                <value name="IF0">
                  <block type="logic_compare" x="200" y="750">
                    <field name="OP">GT</field>
                    <value name="A">
                      <block type="get_price" x="200" y="800">
                        <field name="ASSET">BTC</field>
                        <field name="EXCHANGE">BINANCE</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_arithmetic" x="200" y="850">
                        <field name="OP">MULTIPLY</field>
                        <value name="A">
                          <block type="get_price" x="200" y="900">
                            <field name="ASSET">BTC</field>
                            <field name="EXCHANGE">BINANCE</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="math_number" x="200" y="950">
                            <field name="NUM">1.02</field>
                          </block>
                        </value>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO0">
                  <block type="trading_action" x="200" y="1000">
                    <field name="ACTION">SELL</field>
                    <field name="ORDER_TYPE">LIMIT</field>
                    <value name="AMOUNT">
                      <block type="math_number" x="200" y="1050">
                        <field name="NUM">50</field>
                      </block>
                    </value>
                    <field name="ASSET">BTC_USDT</field>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  {
    id: "arbitrage-bot",
    name: "Arbitrage Bot",
    description: "Automated arbitrage between exchanges",
    prompt:
      "Monitor price differences between exchanges and execute arbitrage trades when spread > 0.5%",
    icon: <Target className="w-5 h-5" />,
    category: "Technical",
    blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="strategy_start" x="200" y="100">
    <statement name="DO">
      <block type="controls_if" x="200" y="200">
        <value name="IF0">
          <block type="logic_compare" x="200" y="250">
            <field name="OP">GT</field>
            <value name="A">
              <block type="math_arithmetic" x="200" y="300">
                <field name="OP">MINUS</field>
                <value name="A">
                  <block type="get_price" x="200" y="350">
                    <field name="ASSET">BTC</field>
                    <field name="EXCHANGE">BINANCE</field>
                  </block>
                </value>
                <value name="B">
                  <block type="get_price" x="200" y="400">
                    <field name="ASSET">BTC</field>
                    <field name="EXCHANGE">COINBASE</field>
                  </block>
                </value>
              </block>
            </value>
            <value name="B">
              <block type="math_arithmetic" x="200" y="450">
                <field name="OP">MULTIPLY</field>
                <value name="A">
                  <block type="get_price" x="200" y="500">
                    <field name="ASSET">BTC</field>
                    <field name="EXCHANGE">BINANCE</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_number" x="200" y="550">
                    <field name="NUM">0.005</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="trading_action" x="200" y="600">
            <field name="ACTION">BUY</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="650">
                <field name="NUM">100</field>
              </block>
            </value>
            <field name="ASSET">BTC_USDT</field>
          </block>
          <block type="trading_action" x="200" y="700">
            <field name="ACTION">SELL</field>
            <field name="ORDER_TYPE">MARKET</field>
            <value name="AMOUNT">
              <block type="math_number" x="200" y="750">
                <field name="NUM">100</field>
              </block>
            </value>
            <field name="ASSET">BTC_USDT</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
];

interface TemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplatesModal({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplatesModalProps) {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Choose a Strategy Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-200"
                      onClick={() => {
                        onSelectTemplate(template);
                        onOpenChange(false);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            {template.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {template.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm text-gray-600 mb-3">
                          {template.description}
                        </CardDescription>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <code className="text-xs text-gray-700">
                            {template.prompt}
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
