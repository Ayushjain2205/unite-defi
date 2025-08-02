'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Clock, Target, Zap, BarChart3 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  category: string;
}

const templates: Template[] = [
  {
    id: 'rsi-scalp',
    name: 'RSI Scalping',
    description: 'Buy when RSI < 30, sell when RSI > 70',
    prompt: 'Buy BTC when RSI < 30, sell when RSI > 70',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'Technical'
  },
  {
    id: 'price-breakout',
    name: 'Price Breakout',
    description: 'Execute trades when price crosses key levels',
    prompt: 'Sell ETH when price crosses $3000',
    icon: <Target className="w-5 h-5" />,
    category: 'Technical'
  },
  {
    id: 'dca-daily',
    name: 'Daily DCA',
    description: 'Dollar-cost average at scheduled intervals',
    prompt: 'Dollar-cost average into SOL every day at 12pm',
    icon: <Clock className="w-5 h-5" />,
    category: 'DCA'
  },
  {
    id: 'gas-optimizer',
    name: 'Gas Fee Optimizer',
    description: 'Trade when gas fees are optimal',
    prompt: 'Buy ETH if gas fee drops below 20 gwei',
    icon: <Zap className="w-5 h-5" />,
    category: 'DeFi'
  },
  {
    id: 'momentum-follow',
    name: 'Momentum Following',
    description: 'Follow strong price momentum trends',
    prompt: 'Buy when 24h volume > 200% average and price up > 5%',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'Technical'
  },
  {
    id: 'profit-take',
    name: 'Profit Taking',
    description: 'Systematic profit taking strategy',
    prompt: 'Take 25% profit when position is up 20%, stop loss at -10%',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'Risk Management'
  }
];

interface TemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplatesModal({ open, onOpenChange, onSelectTemplate }: TemplatesModalProps) {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose a Strategy Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates
                  .filter(template => template.category === category)
                  .map(template => (
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
                            <CardTitle className="text-base">{template.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm text-gray-600 mb-3">
                          {template.description}
                        </CardDescription>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <code className="text-xs text-gray-700">{template.prompt}</code>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}