import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MonthlyData } from '../../types';
import { Card } from '../ui/Card';

interface MonthlyTrendProps {
  data: MonthlyData[];
}

export function MonthlyTrend({ data }: MonthlyTrendProps) {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          Monthly Trend
        </h3>
        <p className="text-sm text-slate-400">
          No data yet. Calculate your footprint to see trends.
        </p>
      </Card>
    );
  }

  const chartData = data.map((d) => {
    const [year, month] = d.month.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year}`,
      Transportation: Math.round(d.transportation * 10) / 10,
      Energy: Math.round(d.energy * 10) / 10,
      Food: Math.round(d.food * 10) / 10,
      Lifestyle: Math.round(d.lifestyle * 10) / 10,
    };
  });

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Monthly Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
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
            />
            <Legend />
            <Bar
              dataKey="Transportation"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar dataKey="Energy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Food" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Lifestyle" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
