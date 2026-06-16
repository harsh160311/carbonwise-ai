import { CarbonInput, Recommendation, HotspotCategory, PersonalizedReductionPlan } from '../types/index.js';
import { calculateCarbonFootprint, getScoreBenchmarks, calculateSustainabilityScore } from '../utils/calculations.js';

const EMISSION_FACTORS = {
  transportation: { car: 0.21, bike: 0, bus: 0.089, train: 0.041 },
  energy: { electricity: 0.527, ac: 0.65 },
  food: { vegetarian: 1.5, nonVegetarian: 3.3 },
  lifestyle: { onlineShopping: 2.5, waste: 1.8 },
} as const;

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const SYSTEM_PROMPT = `You are CarbonWise AI, a friendly sustainability coach. Help users understand and reduce their carbon footprint.

CRITICAL: Always reply in HINGLISH (Roman script - mix of Hindi and English).
- Write in Roman script only (no Devanagari/Hindi script)
- Mix Hindi and English naturally — Hinglish style
- For example: "Aap apni electricity usage kam kar sakte hain LED bulbs use karke"
- Even if user writes in pure English, still reply in Hinglish
- Even if user writes in Devanagari Hindi, still reply in Roman Hinglish
- Keep it casual, conversational, and friendly

Rules:
- Be concise, practical, encouraging
- Use metric units (kg CO₂, km, kWh)
- When carbon data is provided, give personalized advice based on it
- Keep responses under 200 words
- Use bullet points for multiple tips
- Use correct spelling — no spelling mistakes or gibberish words`;

function calculateHotspots(carbonData: CarbonInput): HotspotCategory[] {
  const result = calculateCarbonFootprint(carbonData);
  const categories: HotspotCategory[] = [
    { name: 'Transportation', value: result.transportation, percentage: 0 },
    { name: 'Energy', value: result.energy, percentage: 0 },
    { name: 'Food', value: result.food, percentage: 0 },
    { name: 'Lifestyle', value: result.lifestyle, percentage: 0 },
  ];
  const total = result.total || 1;
  return categories.map((c) => ({ ...c, percentage: (c.value / total) * 100 })).sort((a, b) => b.value - a.value);
}

function buildDeepReductionPlan(carbonData: CarbonInput): PersonalizedReductionPlan {
  const hotspots = calculateHotspots(carbonData);
  const highest = hotspots[0];
  const total = calculateCarbonFootprint(carbonData).total;

  let categorySavings = 0;
  if (highest.name === 'Transportation') {
    const input = carbonData.transportation;
    const carSave = input.carDistance * 0.21 * 0.3 * 30;
    const transitSave = input.carDistance * 0.21 * 0.6 * 30;
    categorySavings = Math.max(carSave, transitSave);
  } else if (highest.name === 'Energy') {
    const input = carbonData.energy;
    categorySavings = Math.max(input.electricityUsage * 0.527 * 0.3, input.acUsage * 0.65 * 0.25);
  } else if (highest.name === 'Food') {
    const input = carbonData.food;
    const nonVegSave = input.nonVegetarianMeals * 1.8 * 4;
    categorySavings = nonVegSave;
  } else if (highest.name === 'Lifestyle') {
    const input = carbonData.lifestyle;
    categorySavings = Math.max(input.onlineShoppingFrequency * 2.5 * 0.5, input.wasteGeneration * 1.8 * 0.6 * 4);
  }

  const reductionPercent = total > 0 ? (categorySavings / total) * 100 : 0;

  return {
    highestCategory: highest,
    categorySavings: Math.round(categorySavings * 10) / 10,
    totalFootprint: Math.round(total * 10) / 10,
    reductionPercent: Math.round(reductionPercent * 10) / 10,
    recommendations: [],
  };
}

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

async function generateAIResponse(
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

    const data: OpenRouterResponse = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    if (content.length < 20) return null;

    const alphaRatio = (content.match(/[a-zA-Z0-9\s]/g)?.length || 0) / content.length;
    if (alphaRatio < 0.6) return null;

    const devanagariChars = (content.match(/[\u0900-\u097F]/g) || []).length;
    if (devanagariChars > 5) return null;

    const hasEnglish = (content.match(/[a-zA-Z]\w+/g) || []).length >= 3;
    if (!hasEnglish && content.length > 50) return null;

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
        'Carpooling ya public transport use karein daily commute ke liye. Buses produce 60% less CO₂ than cars per km.',
      impact: 'High',
      savings: input.carDistance * 0.21 * 0.5 * 30,
    });
  }
  if (input.bikeDistance < 5 && input.carDistance > 5) {
    recs.push({
      category: 'Transportation',
      suggestion:
        'Chhoti car trips (< 5km) ki jagah cycling karein — zero emissions aur acchi exercise!',
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
        'LED bulbs, energy-efficient appliances use karein aur devices unplug rakhein — electricity usage 30% tak kam ho sakta hai.',
      impact: 'High',
      savings: input.electricityUsage * 0.527 * 0.3,
    });
  }
  if (input.acUsage > 4) {
    recs.push({
      category: 'Energy',
      suggestion:
        'AC 24°C pe rakhein instead of 18°C — har degree 6% cooling energy bachata hai.',
      impact: 'Medium',
      savings: input.acUsage * 0.65 * 0.2,
    });
  }
  if (input.electricityUsage > 300 && input.electricityUsage <= 500) {
    recs.push({
      category: 'Energy',
      suggestion:
        'Electronics ko unplug karein jab use mein nahi hain aur power strips use karein — standby power 10% tak kam ho sakta hai.',
      impact: 'Low',
      savings: input.electricityUsage * 0.527 * 0.1,
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
        'Hafte ki 3-4 meat meals ki jagah plant-based options khaayein — inka carbon footprint aadha hota hai.',
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
        'Online orders consolidate karein — packaging waste aur delivery emissions 50% tak kam ho sakte hain.',
      impact: 'Medium',
      savings: input.onlineShoppingFrequency * 2.5 * 0.5,
    });
  }
  if (input.wasteGeneration > 3) {
    recs.push({
      category: 'Lifestyle',
      suggestion:
        'Organic waste compost karein aur recycling badhayein — waste-related methane emissions 60% tak kam ho sakti hain.',
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

  let summary = `Aapka estimated monthly carbon footprint hai **${result.total.toFixed(1)} kg CO₂**.\n\nBreakdown:\n`;
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
    let analysis = `\n\n**Hotspot Analysis (Sabse bade sources)**:\n`;
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
  const plan = buildDeepReductionPlan(carbonData);

  let response = buildDataSummary(carbonData);

  const { highestCategory, categorySavings, totalFootprint, reductionPercent } = plan;

  response += `\n\n**🎯 Deep Impact Analysis (Aapke liye exact savings)**`;

  response += `\n\nAapka sabse bada hotspot hai **${highestCategory.name}** — jo **${highestCategory.percentage.toFixed(0)}%** (${highestCategory.value.toFixed(1)} kg) contribute kar raha hai total ${totalFootprint} kg CO₂/month mein se.`;

  response += `\n\n📊 **Exact Calculation:**`;
  response += `\n• **Current ${highestCategory.name} emissions**: ${highestCategory.value.toFixed(1)} kg CO₂/month`;
  response += `\n• **Target reduction (30% of hotspot)**: ${(highestCategory.value * 0.3).toFixed(1)} kg CO₂/month`;
  response += `\n• **Instant savings by focusing on ${highestCategory.name}**: ${categorySavings} kg CO₂/month`;
  response += `\n• **Overall footprint reduction**: ~${reductionPercent}%`;
  response += `\n• **Equivalent to**: ${treesEquivalency(categorySavings)}`;

  if (highestCategory.name === 'Transportation') {
    const km = carbonData.transportation.carDistance;
    response += `\n\n💡 **Action Plan**: Reducing your car travel from ${km} km/day to ${Math.round(km * 0.7)} km/day (${Math.round(km * 0.3)} km less) will instantly save **${(km * 0.21 * 0.3 * 30).toFixed(1)} kg CO₂/month**.`;
  } else if (highestCategory.name === 'Energy') {
    const kwh = carbonData.energy.electricityUsage;
    response += `\n\n💡 **Action Plan**: Reducing electricity from ${kwh} kWh to ${Math.round(kwh * 0.8)} kWh/month saves **${(kwh * 0.527 * 0.2).toFixed(1)} kg CO₂/month**. AC at 24°C instead of 18°C saves additional **${(carbonData.energy.acUsage * 0.65 * 0.25).toFixed(1)} kg CO₂/month**.`;
  } else if (highestCategory.name === 'Food') {
    const nv = carbonData.food.nonVegetarianMeals;
    const replaceCount = Math.min(5, Math.round(nv * 0.4));
    response += `\n\n💡 **Action Plan**: Replacing ${replaceCount} non-vegetarian meals with vegetarian options per week saves **${(replaceCount * 1.8 * 4).toFixed(1)} kg CO₂/month**.`;
  } else if (highestCategory.name === 'Lifestyle') {
    const shop = carbonData.lifestyle.onlineShoppingFrequency;
    response += `\n\n💡 **Action Plan**: Reducing online shopping from ${shop} to ${Math.max(0, shop - 2)} orders/month saves **${(Math.min(shop, 2) * 2.5 * 0.5).toFixed(1)} kg CO₂/month**. Composting waste adds **${(carbonData.lifestyle.wasteGeneration * 1.8 * 0.6 * 4).toFixed(1)} kg more savings**.`;
  }

  response += hotspotAnalysis(carbonData);

  if (recs.length > 0) {
    response += '\n\n**Personalized recommendations (Aapke liye sujhaav)**:\n';
    recs.slice(0, 4).forEach((rec, i) => {
      response += `\n${i + 1}. **${rec.category}**: ${rec.suggestion}\n   - Lagbhag ~${rec.savings.toFixed(0)} kg CO₂/month bacha sakte hain (${rec.impact} impact)`;
    });
    const totalSavings = recs.reduce((s, r) => s + r.savings, 0);
    response += `\n\n**💰 Total potential savings: ${totalSavings.toFixed(0)} kg CO₂/month** (${result.total > 0 ? ((totalSavings / result.total) * 100).toFixed(0) : 0}% reduction possible!)`;
    response += `\n🌿 ${treesEquivalency(totalSavings)}`;
  } else {
    response += '\nAap already bahut accha kar rahe hain! Aise hi sustainable habits maintain karein.';
  }

  response += '\n\nSimulator mein jaakar real time changes try karein!';
  return response;
}

export async function generateCoachResponse(
  message: string,
  carbonData?: CarbonInput,
): Promise<string> {
  const aiResponse = await generateAIResponse(message, carbonData);
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
      return `Namaste! 👋 Aapka monthly carbon footprint hai **${result.total.toFixed(1)} kg CO₂**. Mujhse poochhiye kaise reduce karein ya aapka biggest impact area kya hai!`;
    }
    return 'Namaste! Main hoon aapka CarbonWise AI Sustainability Coach. Mujhse poochhiye carbon footprint kam karne ke tips, apna impact samajhne, ya personalized eco-suggestions ke liye!';
  }

  if (isAskPurpose) {
    return 'CarbonWise AI ek smart sustainability platform hai jo aapke carbon footprint ko calculate karta hai aur use kam karne ke tips deta hai.\n\n**Kya kar sakte hain?**\n\n1. **Calculator** — apna monthly carbon footprint calculate karein (energy, transport, food, lifestyle)\n2. **Dashboard** — apne footprint ka visual overview dekhein\n3. **Simulator** — "kya agar" scenarios try karein\n4. **AI Coach** — mujhse poochhein, main har sawaal ka jawab doonga\n5. **Challenges** — eco-friendly goals complete karein aur points jeetein\n\n**Kaise kaam karta hai?**\nAap apna data (bijli usage, car travel, khana, shopping) dete hain. System standard emission factors ka use karke CO₂ calculate karta hai. Phir AI aapko personalized suggestions deta hai.\n\nKya aap Calculator se start karna chahoge?';
  }

  if (isAskImpact) {
    if (!carbonData) {
      return 'Pehle apna carbon footprint Calculator page se calculate karein. Phir main aapko personalized insights de sakta hoon!';
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

    const plan = buildDeepReductionPlan(carbonData);
    let response = buildDataSummary(carbonData);
    response += hotspotAnalysis(carbonData);
    response += `\nAapka sabse bada impact area hai **${plan.highestCategory.name}** — jo **${plan.highestCategory.percentage.toFixed(1)}%** total emissions contribute kar raha hai (${plan.highestCategory.value.toFixed(1)} kg CO₂).`;
    response += `\n\n📊 **Exact savings calculation:**`;
    response += `\n• Reduce ${plan.highestCategory.name} by 30% → save **${plan.categorySavings} kg CO₂/month**`;
    response += `\n• That's a **${plan.reductionPercent}%** reduction of your total footprint!`;
    response += `\n🌿 ${treesEquivalency(plan.categorySavings)}`;
    return response;
  }

  if (isAskCalculation) {
    return 'Carbon footprint calculate kaise hota hai — samajhiye:\n\nHar category ka simple formula hai:\n\n**Energy** = electricity (kWh) × 0.527 + AC (hours) × 0.65\n**Transport** = car (km) × 0.21 + bus (km) × 0.089 + train (km) × 0.041\n**Food** = veg meals × 1.5 + non-veg meals × 3.3\n**Lifestyle** = online shopping × 2.5 + waste (kg) × 1.8\n\nYeh numbers (0.527, 0.21, etc.) standard emission factors hain — matlab har unit activity se kitna CO₂ banta hai.\n\n**Total** = Energy + Transport + Food + Lifestyle\n**Percentage** = (category total ÷ overall total) × 100\n\nApna footprint dekhne ke liye Calculator page try karein!';
  }

  if (isAskReduce) {
    if (!carbonData) {
      return 'Bahut accha sawaal! Carbon footprint kam karne ke kuch general tips:\n\n1. **Transport**: Walking, cycling ya public transit use karein\n2. **Energy**: LED bulbs lagayein, devices unplug rakhein\n3. **Food**: Plant-based meals zyada khayein\n4. **Lifestyle**: Shopping kam karein, recycle zyada karein\n\nPersonalized recommendations ke liye pehle Calculator page se apna footprint calculate karein!';
    }
    return buildPersonalizedReductionPlan(carbonData);
  }

  if (isAskChallenge) {
    return 'Mast idea! Yeh rahe eco-challenges jo aap try kar sakte hain:\n\n' +
      '**Transportation**:\n' +
      '1. **Public Transport Week** - Sirf public transit 7 din (500 pts)\n' +
      '2. **No Car Day** - Ek din bina car ke (100 pts)\n' +
      '3. **Bike Commute** - 3+ days cycling is hafte (250 pts)\n' +
      '4. **Carpool Week** - 5 din ride share karein (300 pts)\n\n' +
      '**Energy**:\n' +
      '5. **Save Electricity** - 20% usage kam karein (300 pts)\n' +
      '6. **Solar Switch** - Sirf solar chargers ek hafte (350 pts)\n' +
      '7. **Cold Water Wash** - Thande paani mein kapde dhoyein 2 hafte (200 pts)\n' +
      '8. **AC-Free Week** - 7 din bina AC ke (400 pts)\n\n' +
      '**Food**:\n' +
      '9. **Plant-Based Week** - Sirf plant meals 7 din (400 pts)\n' +
      '10. **Local Food Challenge** - Sirf local food ek hafte (350 pts)\n' +
      '11. **Meat-Free Month** - 30 din no meat (1000 pts)\n\n' +
      '**Lifestyle**:\n' +
      '12. **Green Shopping** - Ek hafte online shopping nahi (200 pts)\n' +
      '13. **Zero Waste Week** - 7 din koi landfill waste nahi (450 pts)\n' +
      '14. **Paperless Office** - Ek hafte paper use na karein (150 pts)\n' +
      '15. **Tree Planting Drive** - Is mahine 5 ped lagayein (600 pts)\n\n' +
      'Challenges page jaakar apna progress track karein!';
  }

  if (isAskScore) {
    if (!carbonData) {
      const benchmarks = getScoreBenchmarks();
      return 'Sustainability Score (0-100) aapke footprint ko in benchmarks se compare karta hai:' +
        '\n\n- **Indian average**: ' + benchmarks.indianAvg + ' kg CO\u2082/month' +
        '\n- **Global average**: ' + benchmarks.globalAvg + ' kg CO\u2082/month' +
        '\n- **Target (sustainable)**: ' + benchmarks.target + ' kg CO\u2082/month' +
        '\n\nScore categories:' +
        '\n- **80-100**: Excellent' +
        '\n- **60-79**: Good' +
        '\n- **40-59**: Average' +
        '\n- **0-39**: Needs Improvement' +
        '\n\nApna score dekhne ke liye pehle Calculator se footprint calculate karein!';
    }
    const result = calculateCarbonFootprint(carbonData);
    const benchmarks = getScoreBenchmarks();
    const score = Math.round(Math.max(0, 100 - (result.total / benchmarks.indianAvg) * 100));
    const category = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement';

    let comparison = '';
    if (result.total < benchmarks.target) {
      comparison = '\n\nBahut accha! Aapka footprint (' + result.total.toFixed(1) + ' kg) sustainable target (' + benchmarks.target + ' kg) se bhi kam hai!';
    } else if (result.total < benchmarks.indianAvg) {
      comparison = '\n\nAapka footprint (' + result.total.toFixed(1) + ' kg) Indian average (' + benchmarks.indianAvg + ' kg) se kam hai. Aise hi improve karte rahein!';
    } else if (result.total < benchmarks.globalAvg) {
      comparison = '\n\nAapka footprint (' + result.total.toFixed(1) + ' kg) global average (' + benchmarks.globalAvg + ' kg) se kam hai lekin Indian average (' + benchmarks.indianAvg + ' kg) se thoda zyada hai.';
    } else {
      comparison = '\n\nAapka footprint (' + result.total.toFixed(1) + ' kg) global average (' + benchmarks.globalAvg + ' kg) se zyada hai. Simulator mein jaakar savings explore karein!';
    }

    return 'Aapka Sustainability Score hai **' + score + '/100** (' + category + ').' + comparison;
  }

  if (isAskTransport) {
    return 'Transport emissions kam karne ke tips:\n\n1. **Walk ya bike** karein chhoti doori ke liye (<5 km) — zero emissions\n2. **Public transport** (bus/train) cars se 60-80% kam CO₂ produce karta hai\n3. **Carpool** — 4 log ek car share karein to 75% emissions kam\n4. **Electric vehicles** petrol cars se 50-70% kam emissions\n5. **Flights avoid karein** — ek round trip 1+ ton CO₂ emit kar sakta hai\n\nTip: Sirf 10 km/day car ki jagah bus use karein to ~550 kg CO₂/year bacha sakte hain!';
  }

  if (isAskEnergy) {
    return 'Energy emissions kam karne ke tips:\n\n1. **LED bulbs** incandescent se 80% kam energy use karte hain\n2. **Devices unplug karein** — standby power 10% bill ka ho sakta hai\n3. **AC 24°C** pe rakhein instead of 18°C — har degree pe 6% energy bachta hai\n4. **Solar panels** grid electricity 60-90% tak kam kar sakte hain\n5. **Energy-efficient appliances** 30-50% kam power use karte hain\n\nElectricity usually sabse bada contributor hota hai. Har 100 kWh saved = 53 kg CO₂ kam!';
  }

  if (isAskFood) {
    return 'Food emissions kam karne ke tips:\n\n1. **Plant-based meals** ka carbon footprint meat meals se aadha hai\n2. **Red meat kam khayein** — beef 60 kg CO₂ per kg vs lentils 2 kg per kg\n3. **Food waste avoid karein** — 1/3 food waste hota hai, jo 8% global emissions hai\n4. **Local & seasonal khareedein** — transport emissions 10x tak kam hote hain\n5. **Compost karein** organic waste ko landfill mein bhejne ki jagah\n\nHafte mein sirf 3 din vegetarian jaane se ~200 kg CO₂/year bachta hai!';
  }

  if (isAskLifestyle) {
    return 'Lifestyle emissions kam karne ke tips:\n\n1. **Online shopping kam karein** — orders consolidate karein delivery trips kam karne ke liye\n2. **Single-use plastic avoid karein** — har kg plastic se 6 kg CO₂ banta hai\n3. **Recycle aur compost karein** — waste methane emissions 60% tak kam hoti hain\n4. **Second-hand kharidein** — product life badhti hai aur manufacturing emissions kam\n5. **Minimalism** — jo item nahi kharida, uska production footprint bhi nahi\n\nChhoti lifestyle changes bhi time ke saath bade savings mein badal sakti hain!';
  }

  if (carbonData) {
    return buildPersonalizedReductionPlan(carbonData);
  }

  return 'Main aapki kaise madad kar sakta hoon?\n\nYeh sawaal poochh sakte hain:\n1. **Footprint kaise reduce karein?** — "Apna carbon footprint kaise kam karein"\n2. **Sabse bada impact kiska hai?** — "Mera sabse bada carbon source kya hai"\n3. **Calculation kaise hoti hai?** — "Calculate kese hota hai"\n4. **Eco challenges** — "Kaun se challenges try kar sakta hoon"\n5. **Sustainability score** — "Mera score kya hai"\n\nPehle Calculator page se apna carbon footprint calculate karein!';
}
