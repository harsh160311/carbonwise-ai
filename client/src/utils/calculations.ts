import type {
  CarbonInput,
  CarbonResult,
  TransportationInput,
  EnergyInput,
  FoodInput,
  LifestyleInput,
} from '../types';
import { EMISSION_FACTORS } from './emissionFactors';

export function calculateTransportation(
  input: TransportationInput,
): number {
  return (
    input.carDistance * EMISSION_FACTORS.transportation.car +
    input.bikeDistance * EMISSION_FACTORS.transportation.bike +
    input.busDistance * EMISSION_FACTORS.transportation.bus +
    input.trainDistance * EMISSION_FACTORS.transportation.train
  );
}

export function calculateEnergy(input: EnergyInput): number {
  return (
    input.electricityUsage * EMISSION_FACTORS.energy.electricity +
    input.acUsage * EMISSION_FACTORS.energy.ac
  );
}

export function calculateFood(input: FoodInput): number {
  return (
    input.vegetarianMeals * EMISSION_FACTORS.food.vegetarian +
    input.nonVegetarianMeals * EMISSION_FACTORS.food.nonVegetarian
  );
}

export function calculateLifestyle(input: LifestyleInput): number {
  return (
    input.onlineShoppingFrequency *
      EMISSION_FACTORS.lifestyle.onlineShopping +
    input.wasteGeneration * EMISSION_FACTORS.lifestyle.waste
  );
}

export function calculateCarbonFootprint(input: CarbonInput): CarbonResult {
  const transportation = calculateTransportation(input.transportation);
  const energy = calculateEnergy(input.energy);
  const food = calculateFood(input.food);
  const lifestyle = calculateLifestyle(input.lifestyle);
  const total = transportation + energy + food + lifestyle;

  return { transportation, energy, food, lifestyle, total };
}

export function calculateSustainabilityScore(
  total: number,
  weeklyTotal: number,
): number {
  const maxSustainableMonthly = 500;
  const maxSustainableWeekly = 125;
  const monthlyScore = Math.max(0, 100 - (total / maxSustainableMonthly) * 100);
  const weeklyScore = Math.max(0, 100 - (weeklyTotal / maxSustainableWeekly) * 100);
  const score = Math.round(monthlyScore * 0.6 + weeklyScore * 0.4);
  return Math.min(100, Math.max(0, score));
}
