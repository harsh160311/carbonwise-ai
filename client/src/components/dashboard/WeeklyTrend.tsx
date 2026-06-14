import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { WeeklyData } from '../../types';
import { Card } from '../ui/Card';

interface WeeklyTrendProps {
  data: WeeklyData[];
}

export function WeeklyTrend({ data }: WeeklyTrendProps) {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          Weekly Trend
        </h3>
        <p className="text-sm text-slate-400">
          No data yet. Calculate your footprint to see trends.
        </p>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    week: d.week.substring(5),
    emissions: Math.round(d.total * 10) / 10,
  }));

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Weekly Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="week"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'kg CO₂',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#94a3b8', fontSize: 12 },
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value} kg CO₂`, 'Emissions']}
            />
            <Line
              type="monotone"
              dataKey="emissions"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
