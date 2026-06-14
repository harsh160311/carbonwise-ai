export interface CarbonInput {
  transportation: {
    carDistance: number;
    bikeDistance: number;
    busDistance: number;
    trainDistance: number;
  };
  energy: {
    electricityUsage: number;
    acUsage: number;
  };
  food: {
    vegetarianMeals: number;
    nonVegetarianMeals: number;
  };
  lifestyle: {
    onlineShoppingFrequency: number;
    wasteGeneration: number;
  };
}

export interface CarbonResult {
  transportation: number;
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
}

export interface CarbonData {
  id: string;
  date: string;
  input: CarbonInput;
  result: CarbonResult;
  sustainabilityScore: number;
  weeklyTotal: number;
}

export interface WeeklyData {
  week: string;
  total: number;
  transportation: number;
  energy: number;
  food: number;
  lifestyle: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  transportation: number;
  energy: number;
  food: number;
  lifestyle: number;
}

export interface Recommendation {
  category: string;
  suggestion: string;
  impact: string;
  savings: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  points: number;
  category: string;
  completed: boolean;
  progress: number;
}

export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ScoreCategory = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';

export interface SustainabilityScoreResult {
  score: number;
  category: ScoreCategory;
  explanation: string;
}
