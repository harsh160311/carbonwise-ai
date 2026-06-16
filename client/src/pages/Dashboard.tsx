import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonData } from '../hooks/useCarbonData';
import { FootprintSummary } from '../components/dashboard/FootprintSummary';
import { EmissionBreakdown } from '../components/dashboard/EmissionBreakdown';
import { SustainabilityScoreCard } from '../components/dashboard/SustainabilityScoreCard';
import { WeeklyTrend } from '../components/dashboard/WeeklyTrend';
import { MonthlyTrend } from '../components/dashboard/MonthlyTrend';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { WeeklyData, MonthlyData, CarbonResult } from '../types';

function EmptyDashboardState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100">
          <svg className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-slate-800">Your Dashboard Awaits</h1>
        <p className="mb-8 max-w-lg text-slate-500">
          Calculate your carbon footprint first to unlock personalized charts, track weekly trends, monitor your sustainability score, and get AI-powered recommendations.
        </p>
        <Button size="lg" onClick={onNavigate} aria-label="Go to calculator to calculate your carbon footprint">
          Calculate Your Footprint
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const {
    latestEntry,
    weeklyData,
    monthlyData,
    improvementPercentage,
  } = useCarbonData();

  const memoResult = useMemo((): CarbonResult | null =>
    latestEntry?.result ?? null, [latestEntry]);
  const memoWeekly = useMemo((): WeeklyData[] => weeklyData, [weeklyData]);
  const memoMonthly = useMemo((): MonthlyData[] => monthlyData, [monthlyData]);
  const memoImprovement = useMemo((): number => improvementPercentage, [improvementPercentage]);
  const memoWeeklyTotal = useMemo((): number => latestEntry?.weeklyTotal ?? 0, [latestEntry]);
  const memoSustainabilityScore = useMemo((): number => latestEntry?.sustainabilityScore ?? 0, [latestEntry]);

  if (!latestEntry) {
    return <EmptyDashboardState onNavigate={() => navigate('/calculator')} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">
          Your carbon footprint overview and trends
        </p>
      </div>

      <div className="mb-8">
        <FootprintSummary
          result={memoResult!}
          weeklyTotal={memoWeeklyTotal}
          improvementPercentage={memoImprovement}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmissionBreakdown result={memoResult!} />
        </div>
        <div>
          <SustainabilityScoreCard score={memoSustainabilityScore} />
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <WeeklyTrend data={memoWeekly} />
        <MonthlyTrend data={memoMonthly} />
      </div>

      <Card padding="md">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h3 className="font-semibold text-slate-800">
              Recalculate Your Footprint
            </h3>
            <p className="text-sm text-slate-500">
              Update your data to see how your changes affect your score.
            </p>
          </div>
          <a
            href="/simulator"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-500 bg-transparent px-4 py-2 text-sm font-medium text-emerald-600 transition-all duration-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Try the Simulator
          </a>
        </div>
      </Card>
    </div>
  );
}
