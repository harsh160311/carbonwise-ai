import type { CarbonInput, Recommendation } from '../types';

function generateTransportRecommendations(
  input: CarbonInput['transportation'],
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (input.carDistance > 10) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Consider carpooling or using public transport for your daily commute.',
      impact: 'High',
      savings: input.carDistance * 0.21 * 0.5 * 30,
    });
  }
  if (input.bikeDistance < 5 && input.carDistance > 5) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Replace short car trips (< 5km) with cycling to eliminate emissions.',
      impact: 'Medium',
      savings: 5 * 0.21 * 30,
    });
  }
  if (input.busDistance === 0 && input.trainDistance === 0 && input.carDistance > 0) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Use buses or trains — they produce 60-80% less CO₂ per km than cars.',
      impact: 'High',
      savings: input.carDistance * 0.21 * 0.7 * 30,
    });
  }
  return recs;
}

function generateEnergyRecommendations(
  input: CarbonInput['energy'],
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (input.electricityUsage > 500) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Switch to LED bulbs and energy-efficient appliances.',
      impact: 'High',
      savings: input.electricityUsage * 0.527 * 0.3 * 30,
    });
  }
  if (input.acUsage > 4) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Set AC to 24°C — every degree saves 6% on cooling energy.',
      impact: 'Medium',
      savings: input.acUsage * 0.65 * 0.2 * 30,
    });
  }
  if (input.electricityUsage > 300) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Unplug electronics when not in use to reduce standby power.',
      impact: 'Low',
      savings: input.electricityUsage * 0.527 * 0.1 * 30,
    });
  }
  return recs;
}

function generateFoodRecommendations(
  input: CarbonInput['food'],
): Recommendation[] {
  const recs: Recommendation[] = [];
  const totalMeals = input.vegetarianMeals + input.nonVegetarianMeals;
  if (totalMeals > 0 && input.nonVegetarianMeals / totalMeals > 0.5) {
    recs.push({
      category: 'Food',
      suggestion:
        'Have 3-4 vegetarian meals per week — plant-based meals have half the footprint.',
      impact: 'High',
      savings: input.nonVegetarianMeals * 1.8 * 4,
    });
  }
  if (input.nonVegetarianMeals > 10) {
    recs.push({
      category: 'Food',
      suggestion:
        'Reduce red meat to once a week to lower food footprint by 40%.',
      impact: 'Medium',
      savings: input.nonVegetarianMeals * 3.3 * 0.4 * 4,
    });
  }
  return recs;
}

function generateLifestyleRecommendations(
  input: CarbonInput['lifestyle'],
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (input.onlineShoppingFrequency > 3) {
    recs.push({
      category: 'Lifestyle',
      suggestion:
        'Consolidate online orders to reduce packaging and delivery emissions.',
      impact: 'Medium',
      savings: input.onlineShoppingFrequency * 2.5 * 0.5 * 4,
    });
  }
  if (input.wasteGeneration > 3) {
    recs.push({
      category: 'Lifestyle',
      suggestion:
        'Start composting and recycling to cut methane from landfills.',
      impact: 'High',
      savings: input.wasteGeneration * 1.8 * 0.6 * 4,
    });
  }
  return recs;
}

export function generateRecommendations(
  input: CarbonInput,
): Recommendation[] {
  return [
    ...generateTransportRecommendations(input.transportation),
    ...generateEnergyRecommendations(input.energy),
    ...generateFoodRecommendations(input.food),
    ...generateLifestyleRecommendations(input.lifestyle),
  ];
}
