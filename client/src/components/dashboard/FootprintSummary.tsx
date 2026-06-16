import { memo } from 'react';
import type { CarbonResult } from '../../types';
import { formatEmissions } from '../../utils/format';

interface FootprintSummaryProps {
  result: CarbonResult;
  weeklyTotal: number;
  improvementPercentage: number;
}

export const FootprintSummary = memo(function FootprintSummary({
  result,
  weeklyTotal,
  improvementPercentage,
}: FootprintSummaryProps) {
  const stats = [
    {
      label: 'Monthly Total',
      value: formatEmissions(result.total),
      sub: `${formatEmissions(result.total / 30)} / day`,
      color: 'text-emerald-600',
    },
    {
      label: 'Weekly Total',
      value: formatEmissions(weeklyTotal),
      sub: `${formatEmissions(weeklyTotal / 7)} / day`,
      color: 'text-blue-600',
    },
    {
      label: 'Daily Average',
      value: formatEmissions(result.total / 30),
      sub: 'Based on 30-day month',
      color: 'text-purple-600',
    },
    {
      label: 'Improvement',
      value: `${improvementPercentage}%`,
      sub: improvementPercentage >= 0 ? 'vs last week' : 'increase needed',
      color:
        improvementPercentage >= 0 ? 'text-emerald-600' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {stat.label}
          </p>
          <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
});
