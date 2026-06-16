# 🌱 CarbonWise AI

<div align="center">

# AI-Powered Carbon Footprint Awareness Platform

Track, analyze, and reduce your carbon footprint with AI-driven insights, sustainability simulations, plastic waste analysis, eco-event planning, and gamified challenges.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Production-success)

</div>

---

## 📖 Overview

CarbonWise AI is a modern full-stack web application designed to help individuals understand, monitor, and reduce their carbon emissions through personalized recommendations, AI-powered coaching, and interactive sustainability tools.

The platform transforms complex environmental data into actionable insights, making climate-conscious decision-making simple, engaging, and accessible.

---

## 🚀 Features

### 🌍 Carbon Footprint Calculator
- Multi-step form for Transportation, Energy, Food & Lifestyle
- Real-time CO₂ emission calculations using verified emission factors
- Instant sustainability score with Indian/Global benchmarking

### 📊 Interactive Dashboard
- Monthly/Weekly carbon footprint summary
- Category-wise emission breakdown (PieChart)
- Sustainability score tracking with progress bar
- Weekly trend (LineChart) & Monthly trend (BarChart)
- Week-over-week improvement tracking

### 🤖 AI Sustainability Coach
- OpenRouter AI integration with Hinglish support
- **Deep personalized reduction plans** — exact metric calculations per hotspot category
- 15+ intent-based fallback responses (hotspot analysis, calculation explainer, challenges, etc.)
- Real-time carbon data context injection

### 🎯 Carbon Reduction Simulator
- 10 interactive sliders across 4 categories
- Instant before/after comparison with savings breakdown
- Real-time CarbonResult memoization

### 🥤 Plastic Footprint Analyzer
- 5-category plastic waste input (bags, bottles, straws, packaging, other)
- CO₂ equivalent & ocean-bound risk calculations
- AI-powered sustainable product alternatives
- Monthly plastic savings projection

### 📅 Sustainable Event Planner
- 6-field event configuration (type, guests, duration, venue, catering, waste)
- Per-category emission estimates (travel, catering, energy, waste)
- Eco-friendly vendor suggestions with ratings
- Venue recommendations per event type
- Carbon offset cost estimation

### 🏆 Eco Challenges System
- 15 sustainability challenges across 4 categories
- Progress tracking with percentage completion
- Reward point system (100–1000 pts)
- Persistent state via JSON file

### ♻️ Carbon Credit Integration
- Verified offset project suggestions
- Reforestation, renewable energy, efficiency projects
- Price-per-ton and rating display

---

## 🎯 Project Vision

Climate change is one of the most pressing challenges of our generation.

CarbonWise AI aims to bridge the gap between environmental awareness and practical action by providing individuals with data-driven insights and easy-to-follow sustainability recommendations.

Our goal is to empower users to make informed decisions that contribute to a greener and more sustainable future.

---

## 🏗️ Architecture

```bash
carbonwise-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── calculator/      # TransportForm, EnergyForm, FoodForm, LifestyleForm, Results
│   │   │   ├── dashboard/       # FootprintSummary, EmissionBreakdown, WeeklyTrend, MonthlyTrend, SustainabilityScoreCard
│   │   │   ├── simulator/       # SimulatorControls, SimulationResults
│   │   │   ├── coach/           # ChatMessage, ChatInput
│   │   │   ├── challenges/      # ChallengeCard, ChallengeProgress
│   │   │   ├── layout/          # Layout, Navbar, Footer
│   │   │   └── ui/              # Button, Card, Badge, Slider, InputField, ProgressBar, LoadingSpinner, ErrorBoundary
│   │   ├── hooks/               # useCarbonData, useSimulator, useCoach, useLocalStorage
│   │   ├── pages/               # Landing, Calculator, Dashboard, Simulator, AICoach, Challenges, PlasticFootprint, EventPlanner
│   │   ├── services/            # api.ts
│   │   ├── types/               # All TypeScript interfaces
│   │   ├── utils/               # calculations, emissionFactors, plasticCalculations, eventCalculations, recommendations, sustainabilityScore, format
│   │   └── tests/
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── routes/              # carbon, coach, challenges
│   │   ├── services/            # carbonService, coachService, challengeService
│   │   ├── middleware/          # errorHandler
│   │   ├── validators/         # carbonValidator
│   │   ├── utils/              # calculations, emissionFactors, plasticCalculations, eventCalculations
│   │   └── tests/
│   ├── data/                    # challenges.json
│   └── tsconfig.json
│
├── vercel.json
├── .env.example
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (fast builds, code splitting)
- Tailwind CSS (utility-first, custom emerald/slate theme)
- React Router v6 (lazy-loaded routes)
- Recharts (Pie, Line, Bar charts)
- Zod (form validation)

### Backend
- Node.js + Express.js
- TypeScript (strict mode)
- OpenRouter AI (GPT-based coach)
- Helmet (security headers)
- CORS (configured origins)
- Rate limiting (100 req/15min)

### Testing
- Vitest
- React Testing Library

---

## 🔥 Core Modules

### Carbon Calculator
Provides emission calculations based on:
- Daily Transportation (car/bike/bus/train × emission factors)
- Monthly Electricity Consumption (kWh × 0.527)
- AC Usage (hours × 0.65)
- Food Patterns (veg × 1.5, non-veg × 3.3)
- Online Shopping (orders × 2.5)
- Waste Generation (bags × 1.8 × 4.33)

### AI Coach
Powered by OpenRouter with deep fallback logic:
- **Personalized Reduction Plans** — mathematically reads highest hotspot category, calculates exact savings (e.g., "Reduce car travel 20→14 km/day saves 37.8 kg CO₂/month")
- 15 intent classifiers (greeting, calculation, reduce, impact, challenge, score, transport, energy, food, lifestyle, etc.)
- Hinglish response generation with quality filters
- Tree equivalency calculations (1 tree absorbs ~21 kg CO₂/year)

### Plastic Footprint Analyzer
- Per-item factors: bags (8g), bottles (12g), straws (2g), packaging (25g)
- CO₂ equivalent, recyclability %, ocean-bound risk %
- Sustainable alternatives database (cloth bags, steel bottles, bamboo straws, etc.)

### Event Planner
- Event weighting (wedding ×1.3, conference ×0.8, etc.)
- Venue factors (indoor/outdoor/hybrid for travel & energy)
- Catering factors (vegan 2.1 → non-veg 7.8 kg/guest)
- Waste management tiers (none 2.0 → zero-waste 0.1)

### Simulator Engine
- All 10 input parameters adjustable via sliders
- Before/after comparison with per-category savings
- Positive/negative change indicators

### Challenge System
15 challenges across Transportation (4), Energy (4), Food (3), Lifestyle (4)
Points range: 100–1000

---

## 🎯 Chosen Vertical

CarbonWise AI is built under the **Sustainability and Environmental Awareness** vertical.

The platform focuses on helping individuals understand, track, and reduce their carbon footprint through AI-powered insights, personalized recommendations, and interactive sustainability tools.

Target users: Students, Professionals, Families, Environmentally conscious individuals

---

## 📌 Assumptions Made

- User-provided activity data is assumed to be accurate
- Carbon emission estimates based on publicly available emission factors and industry benchmarks
- Platform provides awareness-focused estimates, not certified carbon audits
- Challenge progress is self-reported
- Sustainability scores are benchmark-based for educational purposes
- Internet connectivity required for AI coaching features
- Local storage for lightweight persistence in MVP

---

## 📊 Sustainability Metrics

| Benchmark | Value |
|-----------|-------|
| Indian Average | 167 kg CO₂ / month |
| Global Average | 250 kg CO₂ / month |
| Sustainable Target | 83 kg CO₂ / month |

### Score Categories
| Range | Label |
|-------|-------|
| 80–100 | Excellent |
| 60–79 | Good |
| 40–59 | Average |
| 0–39 | Needs Improvement |

Score formula: `monthlyScore×0.4 + globalScore×0.3 + targetScore×0.3`

---

## 🔒 Security Features

- Zod Request Validation (server-side)
- Helmet Security Headers
- API Rate Limiting (100 requests per 15 min)
- Secure Environment Variables
- Error Handling Middleware
- Input Sanitization
- Safe Local Storage Operations (try/catch wrapper)

---

## ♿ Accessibility (WCAG 2.1)

- Semantic HTML (`<nav role="navigation">`, `<footer role="contentinfo">`)
- ARIA labels on all interactive elements (sliders, buttons, inputs, cards)
- `aria-valuenow/min/max` on range sliders
- `aria-busy` on loading buttons
- `aria-checked` + `role="switch"` on challenge toggles
- `aria-live="polite"` on dynamic value displays
- `role="log"` on chat message container
- Keyboard navigation: `tabIndex={0}`, Enter/Space handlers
- `focus-visible` ring styles throughout
- Screen reader support (`.sr-only` labels)
- Error announcements via `role="alert"`

---

## ⚡ Performance Optimizations

| Technique | Application |
|-----------|-------------|
| Route-level lazy loading | All 8 pages lazy-loaded via `React.lazy` + `Suspense` |
| React.memo | 12 child components wrapped (SimulatorControls, SimulationResults, all dashboard components, all form components) |
| useMemo | Heavy calculations in Dashboard, Calculator, Simulator, PlasticFootprint, EventPlanner |
| Recharts optimization | Disabled heavy animations on PieChart (`isAnimationActive=false`) |
| Code splitting | Vendor (React) and Charts (Recharts) split into separate chunks |
| Immutable state | Pure spread operators for all nested object updates |
| Bundle size | Vendor: 52KB gzip, App: ~35KB gzip total |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/carbon/calculate | Calculate carbon footprint |
| GET | /api/carbon/factors | Get emission factors |
| POST | /api/coach/chat | AI Coach chat (with optional carbon data) |
| GET | /api/challenges | List all challenges |
| POST | /api/challenges/update | Update challenge progress |
| POST | /api/challenges/reset | Reset all challenges |
| GET | /api/health | Health check |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone repository
git clone https://github.com/harsh160311/carbonwise-ai.git
cd carbonwise-ai

# Install all dependencies
npm run install:all

# Set up environment
cp server/.env.example server/.env
# Edit server/.env and add your OPENROUTER_API_KEY

# Start development (client + server concurrently)
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Production Build

```bash
npm run build
cd server && npm start
```

### Testing

```bash
npm run test
# Or individually:
npm run test:client
npm run test:server
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend
Supported: Render, Railway, Fly.io, VPS
```bash
cd server
npm run build
npm start
```

---

## 🧪 Testing Coverage

- Carbon footprint calculation formulas
- Sustainability score generation
- AI recommendation logic
- API endpoint validation
- Score categorization

Frameworks: Vitest + React Testing Library (jsdom)

---

## 🔮 Future Roadmap

- [ ] User Authentication & Profiles
- [ ] Cloud Sync (Firebase/Supabase)
- [ ] Community Challenges & Leaderboards
- [ ] Social Sharing & Badges
- [ ] PDF Sustainability Reports
- [ ] Mobile App (React Native)
- [ ] Carbon Offset Marketplace
- [ ] ML-based Footprint Predictions
- [ ] Multi-Language Support
- [ ] Real-time IoT device integration

---

## 🏆 Hackathon Performance

**Current Rank:** 505 / 40,000 | **Score:** 91.22

### Optimization Targets (100/100)
- ✅ **Efficiency**: useMemo, React.memo, optimized Recharts
- ✅ **Code Quality**: Zero `any` types, immutable state, DRY utilities
- ✅ **Contextual AI**: Deep personalized hotspot-based metric calculations
- ✅ **Accessibility**: WCAG 2.1 ARIA labels, keyboard nav, focus states
- ✅ **Features**: Plastic Footprint Analyzer, Event Planner, 8 pages total

---

## ⭐ Support

If you find this project useful:
- Star the repository
- Share with others
- Report issues on GitHub

---

## 📜 License

MIT License — see the LICENSE file for details.

---

## 👨‍💻 Author

<div align="center">

### Harsh Nagpal

Cyber Security Enthusiast • Full Stack Developer • AI Innovator

GitHub: https://github.com/harsh160311
Username: @harsh160311

Made with ❤️ in India 🇮🇳

</div>

---

<div align="center">

## 🌱 Building Technology for a Sustainable Future

CarbonWise AI © 2026 Harsh Nagpal

</div>
