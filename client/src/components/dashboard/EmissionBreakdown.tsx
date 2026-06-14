import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { CarbonResult } from '../../types';
import { Card } from '../ui/Card';

interface EmissionBreakdownProps {
  result: CarbonResult;
}

const COLORS = {
  transportation: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  lifestyle: '#8b5cf6',
};

const CATEGORY_LABELS: Record<string, string> = {
  transportation: 'Transportation',
  energy: 'Energy',
  food: 'Food',
  lifestyle: 'Lifestyle',
};

export function EmissionBreakdown({ result }: EmissionBreakdownProps) {
  const data = useMemo(
    () =>
      Object.entries(result)
        .filter(([key]) => key !== 'total')
        .map(([key, value]) => ({
          name: CATEGORY_LABELS[key] || key,
          value: Math.round(value * 10) / 10,
          color: COLORS[key as keyof typeof COLORS],
        })),
    [result],
  );

  const total = result.total;

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Emission Breakdown
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} kg CO₂`, 'Emissions']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-slate-800">
                {item.value} kg
              </span>
              <span className="ml-2 text-xs text-slate-400">
                ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
