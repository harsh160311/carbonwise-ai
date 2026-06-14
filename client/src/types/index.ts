export interface TransportationInput {
  carDistance: number;
  bikeDistance: number;
  busDistance: number;
  trainDistance: number;
}

export interface EnergyInput {
  electricityUsage: number;
  acUsage: number;
}

export interface FoodInput {
  vegetarianMeals: number;
  nonVegetarianMeals: number;
}

export interface LifestyleInput {
  onlineShoppingFrequency: number;
  wasteGeneration: number;
}

export interface CarbonInput {
  transportation: TransportationInput;
  energy: EnergyInput;
  food: FoodInput;
  lifestyle: LifestyleInput;
}

export interface CarbonResult {
  transportation: number;
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
}

export interface FootprintResponse {
  result: CarbonResult;
  sustainabilityScore: number;
  scoreCategory: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  weeklyTotal: number;
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

export type ScoreCategory =
  | 'Excellent'
  | 'Good'
  | 'Average'
  | 'Needs Improvement';

export interface SustainabilityScoreResult {
  score: number;
  category: ScoreCategory;
  explanation: string;
}

export interface EmissionFactors {
  transportation: Record<string, number>;
  energy: Record<string, number>;
  food: Record<string, number>;
  lifestyle: Record<string, number>;
}
