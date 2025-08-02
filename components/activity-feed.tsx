'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'trade' | 'signal' | 'alert' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  value?: number;
  status?: 'buy' | 'sell' | 'neutral';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'trade',
    title: 'BUY Order Executed',
    description: 'Bought 0.5 ETH at $2,845.32',
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    value: 1422.66,
    status: 'buy'
  },
  {
    id: '2',
    type: 'signal',
    title: 'RSI Signal Detected',
    description: 'RSI dropped to 28.5, triggering buy condition',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'neutral'
  },
  {
    id: '3',
    type: 'trade',
    title: 'SELL Order Executed',
    description: 'Sold 0.3 ETH at $2,892.15',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    value: 867.65,
    status: 'sell'
  },
  {
    id: '4',
    type: 'success',
    title: 'Profit Target Reached',
    description: 'Position closed with +5.2% gain',
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    value: 74.32,
    status: 'neutral'
  },
  {
    id: '5',
    type: 'alert',
    title: 'Gas Fee Alert',
    description: 'Gas fees elevated at 45 gwei, delaying trades',
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    status: 'neutral'
  }
];

export function ActivityFeed() {
  const getIcon = (type: string, status?: string) => {
    switch (type) {
      case 'trade':
        return status === 'buy' ? 
          <TrendingUp className="w-4 h-4 text-green-600" /> :
          <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'signal':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBadgeColor = (type: string, status?: string) => {
    if (type === 'trade') {
      return status === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }
    switch (type) {
      case 'signal':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'alert':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <Badge className={`text-xs ${getBadgeColor(activity.type, activity.status)}`}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                  {activity.value && (
                    <span className={`text-xs font-medium ${
                      activity.status === 'buy' ? 'text-green-600' : 
                      activity.status === 'sell' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      ${activity.value.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}