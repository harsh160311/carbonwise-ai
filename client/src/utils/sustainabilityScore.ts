import type { ScoreCategory } from '../types';

export function getScoreCategory(score: number): {
  category: ScoreCategory;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      category: 'Excellent',
      color: '#10b981',
      description: 'You are living a highly sustainable lifestyle!',
    };
  }
  if (score >= 60) {
    return {
      category: 'Good',
      color: '#34d399',
      description: 'You are on the right track. Keep improving!',
    };
  }
  if (score >= 40) {
    return {
      category: 'Average',
      color: '#f59e0b',
      description: 'Room for improvement in several areas.',
    };
  }
  return {
    category: 'Needs Improvement',
    color: '#ef4444',
    description:
      'Significant changes needed to reduce your footprint.',
  };
}

export function getScoreExplanation(score: number): string {
  return `Your Sustainability Score of ${score}/100 is calculated by comparing your monthly carbon emissions against a sustainable target of 500 kg CO₂/month. The score considers both your monthly total (60% weight) and weekly average (40% weight). A higher score means lower environmental impact.`;
}
