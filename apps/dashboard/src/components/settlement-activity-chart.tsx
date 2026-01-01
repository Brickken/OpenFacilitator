'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import type { Transaction } from '@/lib/api';

interface ActivityDataPoint {
  date: string;
  dateFormatted: string;
  settlements: number;
  verifications: number;
  amount: number;
}

interface SettlementActivityChartProps {
  transactions: Transaction[];
}

function generateChartData(transactions: Transaction[], days: number): ActivityDataPoint[] {
  const now = new Date();
  const data: ActivityDataPoint[] = [];

  // Create a map of date -> stats
  const dateMap = new Map<string, { settlements: number; verifications: number; amount: number }>();

  // Initialize all days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    dateMap.set(dateKey, { settlements: 0, verifications: 0, amount: 0 });
  }

  // Aggregate transactions by date
  transactions.forEach((tx) => {
    const txDate = new Date(tx.createdAt);
    const dateKey = txDate.toISOString().split('T')[0];

    if (dateMap.has(dateKey)) {
      const stats = dateMap.get(dateKey)!;
      if (tx.type === 'settle') {
        stats.settlements++;
        // Parse amount - assuming format like "0.99 USDC" or just a number
        const amountStr = tx.amount.toString().replace(/[^0-9.]/g, '');
        stats.amount += parseFloat(amountStr) || 0;
      } else {
        stats.verifications++;
      }
    }
  });

  // Convert to array
  dateMap.forEach((stats, dateKey) => {
    const date = new Date(dateKey);
    data.push({
      date: dateKey,
      dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      settlements: stats.settlements,
      verifications: stats.verifications,
      amount: Math.round(stats.amount * 100) / 100,
    });
  });

  return data;
}

export function SettlementActivityChart({ transactions }: SettlementActivityChartProps) {
  const [range, setRange] = useState<7 | 30>(7);
  const data = generateChartData(transactions, range);

  const totalSettled = data.reduce((sum, d) => sum + d.amount, 0);
  const totalSettlements = data.reduce((sum, d) => sum + d.settlements, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Settlement Activity
            </CardTitle>
            <CardDescription>
              ${totalSettled.toFixed(2)} settled across {totalSettlements} transactions
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant={range === 7 ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setRange(7)}
            >
              7D
            </Button>
            <Button
              variant={range === 30 ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setRange(30)}
            >
              30D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {totalSettlements === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            No settlement activity in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="dateFormatted"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                interval={range === 7 ? 0 : 'preserveStartEnd'}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(value) => `$${value}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Settled']}
                labelFormatter={(label) => String(label)}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
