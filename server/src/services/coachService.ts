import { CarbonInput, Recommendation } from '../types/index.js';
import { calculateCarbonFootprint, getScoreBenchmarks } from '../utils/calculations.js';

const SYSTEM_PROMPT = `You are CarbonWise AI, a friendly sustainability coach. Help users understand and reduce their carbon footprint.

CRITICAL: Always reply in the EXACT SAME language/style as the user's message.
- If user writes in Hindi/Devanagari → reply in Hindi/Devanagari
- If user writes in Roman Hinglish (e.g. "energy kaise kam karein") → reply in Roman Hinglish
- If user writes in English → reply in English
- If user mixes Hinglish → reply in Hinglish (Roman script)

Rules:
- Be concise, practical, encouraging
- Use metric units (kg CO₂, km, kWh)
- When carbon data is provided, give personalized advice based on it
- Keep responses under 200 words
- Use bullet points for multiple tips
- Use correct spelling — no spelling mistakes or gibberish words`;

function buildPrompt(message: string, carbonData?: CarbonInput): { system: string; context: string } {
  let context = '';
  if (carbonData) {
    const result = calculateCarbonFootprint(carbonData);
    const categories = [
      { name: 'Transportation', value: result.transportation },
      { name: 'Energy', value: result.energy },
      { name: 'Food', value: result.food },
      { name: 'Lifestyle', value: result.lifestyle },
    ];
    categories.sort((a, b) => b.value - a.value);

    context = `User's Carbon Footprint Data (monthly):
- Total: ${result.total.toFixed(1)} kg CO₂
- ${categories.map(c => `${c.name}: ${c.value.toFixed(1)} kg CO₂`).join('\n- ')}
- Biggest category: ${categories[0].name} (${result.total > 0 ? ((categories[0].value / result.total) * 100).toFixed(0) : 0}% of total)`;
  }

  return { system: SYSTEM_PROMPT, context };
}

async function generateAIReponse(
  message: string,
  carbonData?: CarbonInput,
): Promise<string | null> {
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_KEY) return null;

  const { system, context } = buildPrompt(message, carbonData);

  const messages = [{ role: 'system', content: system }];
  if (context) messages.push({ role: 'system', content: `User Data:\n${context}` });
  messages.push({ role: 'user', content: message });

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({ model: 'openrouter/free', messages, max_tokens: 500 }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json() as any;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    if (content.length < 20) return null;

    const alphaRatio = (content.match(/[a-zA-Z\u0900-\u097F0-9\s]/g)?.length || 0) / content.length;
    if (alphaRatio < 0.5) return null;

    const carbonWords = ['carbon', 'co2', 'footprint', 'energy', 'emission', 'footprint', 'kg', 'climate', 'sustainable'];
    const hasRelevantContent = carbonWords.some(w => content.toLowerCase().includes(w)) || (content.toLowerCase().includes('क') || content.toLowerCase().includes('co'));
    if (!hasRelevantContent && content.length > 50) {
      const englishWords = (content.match(/[a-zA-Z]\w+/g) || []).length;
      const hindiChars = (content.match(/[\u0900-\u097F]/g) || []).length;
      if (englishWords < 3 && hindiChars < 5) return null;
    }

    return content;
  } catch {
    return null;
  }
}

function generateTransportRecommendations(
  input: CarbonInput['transportation'],
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (input.carDistance > 10) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Consider carpooling or using public transport for your daily commute. Buses produce 60% less CO₂ than cars per km.',
      impact: 'High',
      savings: input.carDistance * 0.21 * 0.5 * 30,
    });
  }
  if (input.bikeDistance < 5 && input.carDistance > 5) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Replace short car trips (< 5km) with cycling — zero emissions and great exercise!',
      impact: 'Medium',
      savings: 5 * 0.21 * 30,
    });
  }
  if (input.busDistance === 0 && input.trainDistance === 0 && input.carDistance > 0) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Switch to buses or trains instead of cars — they produce 60-80% less CO₂ per km.',
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
        'Switch to LED bulbs, energy-efficient appliances, and unplug devices when not in use to cut electricity usage by 30%.',
      impact: 'High',
      savings: input.electricityUsage * 0.527 * 0.3 * 30,
    });
  }
  if (input.acUsage > 4) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Set AC to 24°C instead of 18°C — every degree saves 6% on cooling energy.',
      impact: 'Medium',
      savings: input.acUsage * 0.65 * 0.2 * 30,
    });
  }
  if (input.electricityUsage > 300 && input.electricityUsage <= 500) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Unplug electronics when not in use and switch to power strips to reduce standby power by up to 10%.',
      impact: 'Low',
      savings: input.electricityUsage * 0.527 * 0.1 * 30,
    });
  }
  return recs;
}

function generateFoodRecommendations(input: CarbonInput['food']): Recommendation[] {
  const recs: Recommendation[] = [];
  const totalMeals = input.vegetarianMeals + input.nonVegetarianMeals;
  if (totalMeals > 0 && input.nonVegetarianMeals / totalMeals > 0.5) {
    recs.push({
      category: 'Food',
      suggestion:
        'Replace 3-4 meat meals per week with plant-based options — they have half the carbon footprint.',
      impact: 'High',
      savings: input.nonVegetarianMeals * 1.8 * 4,
    });
  }
  if (input.nonVegetarianMeals > 10) {
    recs.push({
      category: 'Food',
      suggestion:
        'Reduce red meat to once a week to lower your food footprint by 40%.',
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
        'Consolidate online orders to reduce packaging waste and delivery emissions by up to 50%.',
      impact: 'Medium',
      savings: input.onlineShoppingFrequency * 2.5 * 0.5 * 4,
    });
  }
  if (input.wasteGeneration > 3) {
    recs.push({
      category: 'Lifestyle',
      suggestion:
        'Start composting organic waste and recycling more. This can cut waste-related methane emissions by 60%.',
      impact: 'High',
      savings: input.wasteGeneration * 1.8 * 0.6 * 4,
    });
  }
  return recs;
}

export function generateRecommendations(input: CarbonInput): Recommendation[] {
  return [
    ...generateTransportRecommendations(input.transportation),
    ...generateEnergyRecommendations(input.energy),
    ...generateFoodRecommendations(input.food),
    ...generateLifestyleRecommendations(input.lifestyle),
  ];
}

function buildDataSummary(carbonData: CarbonInput): string {
  const result = calculateCarbonFootprint(carbonData);
  const categories = [
    { name: 'Transportation', value: result.transportation },
    { name: 'Energy', value: result.energy },
    { name: 'Food', value: result.food },
    { name: 'Lifestyle', value: result.lifestyle },
  ];
  categories.sort((a, b) => b.value - a.value);

  let summary = `Your estimated monthly carbon footprint is **${result.total.toFixed(1)} kg CO₂**.\n\nBreakdown:\n`;
  categories.forEach((c) => {
    const pct = result.total > 0 ? ((c.value / result.total) * 100).toFixed(0) : '0';
    summary += `- **${c.name}**: ${c.value.toFixed(1)} kg (${pct}%)\n`;
  });
  return summary;
}

function treesEquivalency(kgCO2: number): string {
  const treesPlanted = (kgCO2 / 21).toFixed(0);
  return `${treesPlanted} trees planted (1 tree absorbs ~21 kg CO₂/year)`;
}

function hotspotAnalysis(carbonData: CarbonInput): string {
  const result = calculateCarbonFootprint(carbonData);
  const categories = [
    { name: 'Transportation', value: result.transportation },
    { name: 'Energy', value: result.energy },
    { name: 'Food', value: result.food },
    { name: 'Lifestyle', value: result.lifestyle },
  ].filter(c => c.value > 0);
  categories.sort((a, b) => b.value - a.value);

  if (categories.length === 0) return '';

  const total = categories.reduce((s, c) => s + c.value, 0);
  let analysis = `\n\n**Hotspot Analysis**:\n`;
  categories.forEach((c, i) => {
    const pct = total > 0 ? ((c.value / total) * 100).toFixed(0) : '0';
    const bar = '█'.repeat(parseInt(pct) / 10) || '▏';
    analysis += `${i + 1}. **${c.name}**: ${bar} ${pct}% (${c.value.toFixed(1)} kg)\n`;
  });
  return analysis;
}

function buildPersonalizedReductionPlan(carbonData: CarbonInput): string {
  const result = calculateCarbonFootprint(carbonData);
  const recs = generateRecommendations(carbonData);

  let response = buildDataSummary(carbonData);

  const categories = [
    { name: 'Transportation', value: result.transportation },
    { name: 'Energy', value: result.energy },
    { name: 'Food', value: result.food },
    { name: 'Lifestyle', value: result.lifestyle },
  ];
  categories.sort((a, b) => b.value - a.value);
  const biggest = categories[0];
  const bigPct = result.total > 0 ? ((biggest.value / result.total) * 100).toFixed(0) : '0';

  response += `\nYour biggest impact area is **${biggest.name}** (${bigPct}% of total). Focus here first.`;
  response += hotspotAnalysis(carbonData);

  if (recs.length > 0) {
    response += '\n\n**Personalized recommendations**:\n';
    recs.slice(0, 4).forEach((rec, i) => {
      response += `\n${i + 1}. **${rec.category}**: ${rec.suggestion}\n   - Save ~${rec.savings.toFixed(0)} kg CO₂/month (${rec.impact} impact)`;
    });
    const totalSavings = recs.reduce((s, r) => s + r.savings, 0);
    response += `\n\nTotal potential savings: **${totalSavings.toFixed(0)} kg CO₂/month** (${result.total > 0 ? ((totalSavings / result.total) * 100).toFixed(0) : 0}% reduction possible!)`;
    response += `\n${treesEquivalency(totalSavings)}`;
  } else {
    response += '\nYou are already doing great! Keep maintaining your sustainable habits.';
  }

  response += '\n\nTry the Simulator to experiment with changes in real time!';
  return response;
}

export async function generateCoachResponse(
  message: string,
  carbonData?: CarbonInput,
): Promise<string> {
  const aiResponse = await generateAIReponse(message, carbonData);
  if (aiResponse) return aiResponse;

  const lower = message.toLowerCase();

  const isAskPurpose = /(kaam kya|kaam kese|kis liye|kya kaam|website kya|app kya|yeh kya|yh kya|ye kya|yeh website|yh website|what is this|what does this|how does this work|kya krti|kya krta|kyu bna|kyu banaya|intro|introduction|about this|about carbonwise|purpose kya)/.test(lower);
  const isGreeting = /^(hi|hello|hey|namaste|hii|yo|hlo|sup|what's up|wasup)\b/.test(lower);
  const isAskCalculation = /(calculate kese|calculate kaise|how (is|was|does|do you) .* calculat|kaise calculate|kese calculate|calculation kaise|formula kya|formula kya hai|kaise aaya|kese aaya|how does.*calculate|how do you calculate|calculation kese|calculation kaise hoti|kaise calculate kiya|explain calculation|breakdown kaise|formula kya h|method kya)/.test(lower);
  const isAskReduce = /(reduce|save|how (can|do) i|how to|tips|suggest|recommend|kam|km kr|ghatana|sudhar|improve|lower|cut|help|kya karun|kya kare|upay|upai|tarika|suggestion|kya kru|suljhaw|solution|hack|trick|best way)/.test(lower);
  const isAskImpact = /(biggest|most impact|affects me most|sabse zyada|sbse jyada|sbse jada|sabse jada|major|main|primary|highest|largest|top contributor|biggest contributor|most affect|kiska sabse|kaunsi category|category sabse|kyu energy|kyu transport)/.test(lower);
  const isAskChallenge = /(challenge|goal|gamification|chunauti|challenge kya|challenge konse|challenge kaise|mission|task|daily task|eco challenge)/.test(lower);
  const isAskScore = /(score|sustainability|rating|kitna score|score kya|mujhe kitna|mera score|my score|how bad|how good am i)/.test(lower);
  const isAskTransport = /(transport|car|bike|bus|train|vehicle|drive|commute|travel|petrol|diesel|ev|electric vehicle|fuel|emission.*car)/.test(lower);
  const isAskEnergy = /(energy|electricity|bijli|light|ac|air conditioner|heater|fan|appliance|power|battery|solar|led)/.test(lower);
  const isAskFood = /(food|diet|meal|khana|veg|vegetarian|non.veg|meat|vegan|plant|dairy|milk|cheese|chicken|mutton|beef)/.test(lower);
  const isAskLifestyle = /(lifestyle|shopping|waste|kachra|garbage|recycle|plastic|online shopping|delivery|packaging|disposal|compost)/.test(lower);

  if (isGreeting && !isAskReduce && !isAskImpact) {
    if (carbonData) {
      const result = calculateCarbonFootprint(carbonData);
      return `Hello! 👋 I see you have carbon data — your monthly footprint is **${result.total.toFixed(1)} kg CO₂**. Ask me how to reduce it or what your biggest impact area is!`;
    }
    return 'Hello! I am your CarbonWise AI Sustainability Coach. Ask me about reducing your carbon footprint, understanding your impact, or getting personalized eco-tips!';
  }

  if (isAskPurpose) {
    return 'CarbonWise AI ek smart sustainability platform hai jo aapke carbon footprint ko calculate karta hai aur use kam karne ke tips deta hai.\n\n**Kya kar sakte hain?**\n\n1. **Calculator** — apna monthly carbon footprint calculate karein (energy, transport, food, lifestyle)\n2. **Dashboard** — apne footprint ka visual overview dekhein\n3. **Simulator** — "kya agar" scenarios try karein\n4. **AI Coach** — mujhse poochhein, main har sawaal ka jawab doonga\n5. **Challenges** — eco-friendly goals complete karein aur points jeetein\n\n**Kaise kaam karta hai?**\nAap apna data (bijli usage, car travel, khana, shopping) dete hain. System standard emission factors ka use karke CO₂ calculate karta hai. Phir AI aapko personalized suggestions deta hai.\n\nKya aap Calculator se start karna chahoge?';
  }

  if (isAskImpact) {
    if (!carbonData) {
      return 'To analyze your biggest impact, please calculate your carbon footprint first using the Calculator page. Then I can give you personalized insights!';
    }
    const result = calculateCarbonFootprint(carbonData);
    const categories = [
      { name: 'Transportation', value: result.transportation },
      { name: 'Energy', value: result.energy },
      { name: 'Food', value: result.food },
      { name: 'Lifestyle', value: result.lifestyle },
    ];
    categories.sort((a, b) => b.value - a.value);
    const biggest = categories[0];
    const total = result.total;
    const pct = total > 0 ? ((biggest.value / total) * 100).toFixed(1) : '0';

    let response = buildDataSummary(carbonData);
    response += hotspotAnalysis(carbonData);
    response += `\n**${biggest.name}** is your biggest impact area — contributing **${pct}%** of total emissions (${biggest.value.toFixed(1)} kg CO₂).`;
    const saving20 = biggest.value * 0.2;
    response += `\n\nIf you reduce ${biggest.name.toLowerCase()} by just 20%, you would save ~${saving20.toFixed(1)} kg CO₂/month.`;
    response += `\n${treesEquivalency(saving20)}`;
    return response;
  }

  if (isAskCalculation) {
    return 'Here is how the carbon footprint is calculated:\n\nEach category uses a simple formula:\n\n**Energy** = electricity (kWh) × 0.527 + AC (hours) × 0.65\n**Transport** = car (km) × 0.21 + bus (km) × 0.089 + train (km) × 0.041\n**Food** = veg meals × 1.5 + non-veg meals × 3.3\n**Lifestyle** = online shopping × 2.5 + waste (kg) × 1.8\n\nThe numbers (0.527, 0.21, etc.) are standard emission factors from environmental research — they represent kg of CO₂ per unit of activity.\n\n**Total** = Energy + Transport + Food + Lifestyle\n**Percentage** = (category total ÷ overall total) × 100\n\nTry the Calculator page to see your own footprint!';
  }

  if (isAskReduce) {
    if (!carbonData) {
      return 'Great question! Here are general tips to reduce your carbon footprint:\n\n1. **Transport**: Walk, bike, or use public transit\n2. **Energy**: Switch to LEDs, unplug devices\n3. **Food**: Eat more plant-based meals\n4. **Lifestyle**: Reduce shopping, recycle more\n\nFor personalized recommendations, calculate your footprint on the Calculator page!';
    }
    return buildPersonalizedReductionPlan(carbonData);
  }

  if (isAskChallenge) {
    return 'Great idea! Here are eco-challenges you can try:\n\n' +
      '**Transportation**:\n' +
      '1. **Public Transport Week** - Only public transit for 7 days (500 pts)\n' +
      '2. **No Car Day** - Car-free for one day (100 pts)\n' +
      '3. **Bike Commute** - Bike for 3+ days this week (250 pts)\n' +
      '4. **Carpool Week** - Share rides for 5 days (300 pts)\n\n' +
      '**Energy**:\n' +
      '5. **Save Electricity** - Reduce usage by 20% (300 pts)\n' +
      '6. **Solar Switch** - Solar chargers only for a week (350 pts)\n' +
      '7. **Cold Water Wash** - Cold wash for 2 weeks (200 pts)\n' +
      '8. **AC-Free Week** - No AC for 7 days (400 pts)\n\n' +
      '**Food**:\n' +
      '9. **Plant-Based Week** - Only plant meals for 7 days (400 pts)\n' +
      '10. **Local Food Challenge** - Local food only for a week (350 pts)\n' +
      '11. **Meat-Free Month** - No meat for 30 days (1000 pts)\n\n' +
      '**Lifestyle**:\n' +
      '12. **Green Shopping** - No online shopping for a week (200 pts)\n' +
      '13. **Zero Waste Week** - No landfill waste for 7 days (450 pts)\n' +
      '14. **Paperless Office** - Go paperless for a week (150 pts)\n' +
      '15. **Tree Planting Drive** - Plant 5 trees this month (600 pts)\n\n' +
      'Visit the Challenges page to track your progress!';
  }

  if (isAskScore) {
    if (!carbonData) {
      const benchmarks = getScoreBenchmarks();
      return 'Your Sustainability Score (0-100) compares your footprint against these benchmarks:' +
        '\n\n- **Indian average**: ' + benchmarks.indianAvg + ' kg CO\u2082/month' +
        '\n- **Global average**: ' + benchmarks.globalAvg + ' kg CO\u2082/month' +
        '\n- **Target (sustainable)**: ' + benchmarks.target + ' kg CO\u2082/month' +
        '\n\nScore categories:' +
        '\n- **80-100**: Excellent' +
        '\n- **60-79**: Good' +
        '\n- **40-59**: Average' +
        '\n- **0-39**: Needs Improvement' +
        '\n\nCalculate your footprint to see your score!';
    }
    const result = calculateCarbonFootprint(carbonData);
    const benchmarks = getScoreBenchmarks();
    const score = Math.round(Math.max(0, 100 - (result.total / benchmarks.indianAvg) * 100));
    const category = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement';

    let comparison = '';
    if (result.total < benchmarks.target) {
      comparison = '\n\nGreat! Your footprint (' + result.total.toFixed(1) + ' kg) is below the sustainable target of ' + benchmarks.target + ' kg!';
    } else if (result.total < benchmarks.indianAvg) {
      comparison = '\n\nYour footprint (' + result.total.toFixed(1) + ' kg) is below the Indian average (' + benchmarks.indianAvg + ' kg). Keep improving!';
    } else if (result.total < benchmarks.globalAvg) {
      comparison = '\n\nYour footprint (' + result.total.toFixed(1) + ' kg) is below the global average (' + benchmarks.globalAvg + ' kg) but above the Indian average (' + benchmarks.indianAvg + ' kg).';
    } else {
      comparison = '\n\nYour footprint (' + result.total.toFixed(1) + ' kg) is above the global average (' + benchmarks.globalAvg + ' kg). Try the Simulator to find savings!';
    }

    return 'Your Sustainability Score is **' + score + '/100** (' + category + ').' + comparison;
  }

  if (isAskTransport) {
    return 'Here are tips to reduce transport emissions:\n\n1. **Walk or bike** for short trips (<5 km) — zero emissions\n2. **Public transport** (bus/train) produces 60-80% less CO₂ than cars\n3. **Carpool** — sharing a car with 4 people cuts emissions by 75%\n4. **Electric vehicles** produce 50-70% fewer emissions than petrol cars\n5. **Avoid flights** when possible — a round trip can emit 1+ ton CO₂\n\nTip: Replacing just 10 km/day of car travel with bus saves ~550 kg CO₂/year!';
  }

  if (isAskEnergy) {
    return 'Here are tips to reduce energy emissions:\n\n1. **LED bulbs** use 80% less energy than incandescent\n2. **Unplug devices** — standby power can be 10% of your bill\n3. **AC at 24°C** instead of 18°C saves 6% per degree\n4. **Solar panels** can cut grid electricity use by 60-90%\n5. **Energy-efficient appliances** use 30-50% less power\n\nElectricity is often the biggest contributor. Every 100 kWh saved = 53 kg CO₂ less!';
  }

  if (isAskFood) {
    return 'Here are tips to reduce food emissions:\n\n1. **Plant-based meals** have half the carbon footprint of meat meals\n2. **Reduce red meat** — beef produces 60 kg CO₂ per kg vs 2 kg for lentils\n3. **Avoid food waste** — 1/3 of food is wasted, producing 8% of global emissions\n4. **Buy local & seasonal** — reduces transport emissions by up to 10x\n5. **Compost organic waste** instead of sending to landfill\n\nGoing vegetarian for just 3 days a week saves ~200 kg CO₂/year!';
  }

  if (isAskLifestyle) {
    return 'Here are tips to reduce lifestyle emissions:\n\n1. **Reduce online shopping** — consolidate orders to cut delivery trips\n2. **Avoid single-use plastic** — produces 6 kg CO₂ per kg of plastic\n3. **Recycle & compost** — cuts waste methane emissions by 60%\n4. **Buy second-hand** — extends product life and reduces manufacturing emissions\n5. **Minimalism** — every item you don\'t buy saves its production footprint\n\nSmall lifestyle changes add up to big savings over time!';
  }

  if (carbonData) {
    return buildPersonalizedReductionPlan(carbonData);
  }

  return 'Main aapki kaise madad kar sakta hoon?\n\nYeh sawaal poochh sakte hain:\n1. **Footprint kaise reduce karein?** — "How can I reduce my footprint?"\n2. **Sabse bada impact kiska hai?** — "What affects me most?"\n3. **Calculation kaise hoti hai?** — "Calculate kese hota hai"\n4. **Eco challenges** — "What challenges can I try?"\n5. **Sustainability score** — "What is my score?"\n\nPehle Calculator page se apna carbon footprint calculate karein!';
}
