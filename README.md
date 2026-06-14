# CarbonWise AI

> **AI-Powered Carbon Footprint Awareness Platform**

CarbonWise AI is a modern, full-stack web application that helps individuals understand, track, and reduce their carbon footprint through personalized AI-powered recommendations, interactive simulations, and gamified challenges.

---

## Features

### 1. Carbon Footprint Calculator
Calculate your estimated monthly CO₂ emissions across four categories:
- **Transportation** - Car, bike, bus, and train travel
- **Energy** - Electricity and AC usage
- **Food** - Vegetarian and non-vegetarian meals
- **Lifestyle** - Online shopping and waste generation

### 2. Interactive Dashboard
- Monthly and weekly footprint summaries
- Emission category breakdown with pie charts
- Weekly and monthly trend charts
- Sustainability score (0–100)

### 3. Carbon Reduction Simulator
- Real-time slider-based simulation
- Instant feedback on emission changes
- Compare current vs. optimized footprint
- Category-level savings breakdown

### 4. AI Sustainability Coach
- Natural language chat interface (Hindi, Hinglish & English)
- Real AI via OpenRouter (Gemma, Llama, Mistral models)
- Personalized recommendations based on user data
- Context-aware responses with carbon footprint analysis
- Carbon hotspot analysis with visual bars
- Environmental equivalence (tree planting equivalent)
- Fallback rule-based system when AI is unavailable

### 5. Progress Tracking
- Historical data stored in local storage
- Weekly and monthly trend visualization
- Improvement percentage tracking

### 6. Sustainability Score
- Score from 0–100 with categories: Excellent, Good, Average, Needs Improvement
- Benchmark-based scoring against Indian average (167 kg/month), global average (250 kg/month), and sustainable target (83 kg/month)
- Transparent scoring methodology
- Progress tracking over time

### 7. Eco Challenges
- **15 gamified challenges** across all 4 categories
- Progress tracking with points
- Visual completion indicators
- Reset functionality
- Persistent storage (survives server restart)

---

## Architecture

```
carbonwise-ai/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── calculator/    # Calculator form components
│   │   │   ├── challenges/    # Challenge cards & progress
│   │   │   ├── coach/         # AI chat components
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── layout/        # Navbar, Footer, Layout
│   │   │   ├── simulator/     # Simulator controls & results
│   │   │   └── ui/            # Base UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Calculations & helpers
│   │   └── tests/             # Unit & component tests
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Zod schemas
│   │   ├── middleware/        # Error handling
│   │   └── tests/             # Backend tests
│   └── tsconfig.json
├── vercel.json                # Vercel deployment config
├── .env.example
└── README.md
```

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Recharts** for data visualization
- **Zod** for validation

### Backend
- **Node.js** with Express
- **TypeScript**
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate Limiting** for API protection
- **Zod** for request validation
- **OpenRouter AI** for intelligent coach responses

### Testing
- **Vitest** for unit tests
- **React Testing Library** for component tests

---

## Emission Factors & Sources

All emission factors used in calculations are from verified sources:

| Factor | Value | Unit | Source |
|--------|-------|------|--------|
| Car travel | 0.21 | kg CO₂/km | [EPA (US)](https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle) |
| Bus travel | 0.089 | kg CO₂/km | [DEFRA (UK)](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting) |
| Train travel | 0.041 | kg CO₂/km | [DEFRA (UK)](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting) |
| Electricity | 0.527 | kg CO₂/kWh | [CEA (India)](https://cea.nic.in/carbon-dioxide-emission-factors/) |
| AC usage | 0.65 | kg CO₂/hour | [BEE (India)](https://www.beestarlabel.com/) |
| Vegetarian meal | 1.5 | kg CO₂/meal | [Our World in Data](https://ourworldindata.org/food-choice-vs-eating-local) |
| Non-vegetarian meal | 3.3 | kg CO₂/meal | [Our World in Data](https://ourworldindata.org/food-choice-vs-eating-local) |
| Online shopping | 2.5 | kg CO₂/order | [MIT Climate Portal](https://climate.mit.edu/ask-mit/how-much-does-online-shopping-contribute-pollution) |
| Waste | 1.8 | kg CO₂/kg | [EPA (US)](https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling) |

### Benchmark Data

| Benchmark | Value | Source |
|-----------|-------|--------|
| Indian average footprint | 167 kg CO₂/month | [Global Carbon Project](https://www.globalcarbonproject.org/) |
| Global average footprint | 250 kg CO₂/month | [World Bank](https://data.worldbank.org/indicator/EN.ATM.CO2E.PC) |
| Sustainable target | 83 kg CO₂/month | [UNEP](https://www.unep.org/resources/emissions-gap-report) |

> **Note:** Tree equivalence: 1 tree absorbs ~21 kg CO₂ per year ([USDA Forest Service](https://www.fs.usda.gov/)).

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd carbonwise-ai

# Install all dependencies
npm run install:all

# Or install individually:
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### Environment Variables

Copy the example environment files:

```bash
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
```

|
> **Note:** The AI Coach uses OpenRouter API for real AI responses. If no API key is set, it falls back to a rule-based system. Get a free key at [openrouter.ai](https://openrouter.ai).

---

## Running Locally

```bash
# Run both client and server
npm run dev

# Run only client
npm run dev:client

# Run only server
npm run dev:server
```

- Client: http://localhost:5173
- Server: http://localhost:3001

---

## Testing

```bash
# Run all tests
npm test

# Run client tests only
npm run test:client

# Run server tests only
npm run test:server

# Watch mode
cd client && npm run test:watch
cd server && npm run test:watch
```

### Test Coverage

- **Calculator tests** - Verifies emission calculations across all categories
- **Score tests** - Tests sustainability score calculation and categorization
- **Recommendation tests** - Tests AI recommendation generation logic
- **Component tests** - Tests UI component rendering

---

## Security Practices

- **Input validation** using Zod schemas on all API endpoints
- **Rate limiting** (100 requests per 15 minutes)
- **Helmet** security headers
- **CORS** configured for specific origins
- **Environment variables** for sensitive configuration
- **Request body size limits** (10kb)
- **No secrets exposed** in client-side code
- **Error boundaries** to prevent UI crashes
- **Safe localStorage** usage with try-catch

---

## Accessibility Features

- Semantic HTML (`<nav>`, `<main>`, `<footer>`, `<section>`)
- ARIA attributes (`aria-label`, `aria-current`, `aria-expanded`, `aria-live`)
- Keyboard navigation support
- Focus visible indicators
- Screen reader friendly labels
- Color contrast compliance (Tailwind defaults)
- Responsive design (mobile-first)
- Form input validation with error announcements
- Progress indicators with ARIA attributes

---

## Performance Optimizations

- **Lazy loading** - Route-level code splitting with React.lazy
- **Memoization** - React.useMemo and React.useCallback
- **Optimized rendering** - Component separation
- **Vite chunk splitting** - Vendor and chart libraries separated
- **Efficient calculations** - Pure functions with no side effects
- **CSS utility classes** - Tailwind for minimal CSS bundle
- **Debounced inputs** - No unnecessary re-renders

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/carbon/calculate` | Calculate carbon footprint |
| GET | `/api/carbon/factors` | Get emission factors |
| POST | `/api/coach/chat` | Send message to AI coach |
| GET | `/api/challenges` | Get all challenges |
| POST | `/api/challenges/update` | Update challenge progress |
| POST | `/api/challenges/reset` | Reset all challenges |
| GET | `/api/health` | Health check |

---

## Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` configuration handles:
- Build command: `cd client && npm run build`
- Output directory: `client/dist`
- SPA routing rewrites

### Server Deployment

The server can be deployed to any Node.js hosting (Render, Railway, Fly.io, etc.).

```bash
cd server
npm run build
npm start
```

---

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Social sharing and leaderboards
- [ ] Community challenges and teams
- [ ] User accounts with cloud sync
- [ ] Multi-language support (more Indian languages)
- [ ] PDF report generation
- [ ] Carbon offset marketplace integration
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Advanced analytics with ML predictions

---

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for a sustainable future.

---

*Deployed on Vercel + Render*
