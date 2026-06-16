import { memo } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { getScoreCategory, getScoreExplanation } from '../../utils/sustainabilityScore';
import { Badge } from '../ui/Badge';

interface SustainabilityScoreCardProps {
  score: number;
}

export const SustainabilityScoreCard = memo(function SustainabilityScoreCard({ score }: SustainabilityScoreCardProps) {
  const { category, color, description } = getScoreCategory(score);
  const explanation = getScoreExplanation(score);

  const badgeVariant =
    category === 'Excellent'
      ? 'success'
      : category === 'Good'
        ? 'info'
        : category === 'Average'
          ? 'warning'
          : 'danger';

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Sustainability Score
      </h3>
      <div className="mb-4 flex items-end gap-3">
        <span
          className="text-5xl font-bold"
          style={{ color }}
        >
          {score}
        </span>
        <span className="mb-1 text-2xl font-light text-slate-300">/100</span>
      </div>
      <Badge variant={badgeVariant} className="mb-4">
        {category}
      </Badge>
      <ProgressBar value={score} color={color} size="lg" className="mb-3" />
      <p className="text-sm text-slate-500">{description}</p>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        {explanation}
      </p>
    </Card>
  );
});
