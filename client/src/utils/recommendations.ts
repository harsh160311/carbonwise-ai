import type { CarbonInput, Recommendation } from '../types';

function generateTransportRecommendations(
  input: CarbonInput['transportation'],
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (input.carDistance > 10) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Carpooling ya public transport use karein daily commute ke liye.',
      impact: 'High',
      savings: input.carDistance * 0.21 * 0.5 * 30,
    });
  }
  if (input.bikeDistance < 5 && input.carDistance > 5) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Chhoti car trips (< 5km) ki jagah cycling karein — zero emissions.',
      impact: 'Medium',
      savings: 5 * 0.21 * 30,
    });
  }
  if (input.busDistance === 0 && input.trainDistance === 0 && input.carDistance > 0) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Cars ki jagah buses ya trains use karein — ye 60-80% less CO₂ produce karti hain per km.',
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
        'LED bulbs aur energy-efficient appliances use karein.',
      impact: 'High',
      savings: input.electricityUsage * 0.527 * 0.3,
    });
  }
  if (input.acUsage > 4) {
    recs.push({
      category: 'Energy',
      suggestion:
        'AC 24°C pe rakhein — har degree 6% cooling energy bachata hai.',
      impact: 'Medium',
      savings: input.acUsage * 0.65 * 0.2,
    });
  }
  if (input.electricityUsage > 300) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Electronics unplug rakhein jab use mein nahi hain — standby power kam hota hai.',
      impact: 'Low',
      savings: input.electricityUsage * 0.527 * 0.1,
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
        'Hafte ki 3-4 vegetarian meals khaayein — plant-based meals ka footprint aadha hota hai.',
      impact: 'High',
      savings: input.nonVegetarianMeals * 1.8 * 4,
    });
  }
  if (input.nonVegetarianMeals > 10) {
    recs.push({
      category: 'Food',
      suggestion:
        'Red meat sirf hafte mein ek baar khaayein — food footprint 40% tak kam ho sakta hai.',
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
        'Online orders consolidate karein — packaging aur delivery emissions kam hote hain.',
      impact: 'Medium',
      savings: input.onlineShoppingFrequency * 2.5 * 0.5,
    });
  }
  if (input.wasteGeneration > 3) {
    recs.push({
      category: 'Lifestyle',
      suggestion:
        'Composting aur recycling start karein — landfills se methane emissions kam hote hain.',
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
