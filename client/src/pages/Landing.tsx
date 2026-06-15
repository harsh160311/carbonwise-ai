import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const features = [
  {
    title: 'Carbon Calculator',
    description:
      'Calculate your carbon footprint across transportation, energy, food, and lifestyle categories.',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.012M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'AI Sustainability Coach',
    description:
      'Get personalized recommendations from an AI-powered coach to reduce your environmental impact.',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Reduction Simulator',
    description:
      'Simulate lifestyle changes and see instant updates to your carbon footprint.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    title: 'Eco Challenges',
    description:
      'Take on gamified challenges to build sustainable habits and earn points.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    title: 'Progress Tracking',
    description:
      'Track your emissions over time with weekly and monthly trends.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Sustainability Score',
    description:
      'Get a clear 0-100 sustainability score with actionable improvement tips.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
];

export function Landing() {
  const navigate = useNavigate();

  const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer';
  const btnOutline =
    'inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-500 bg-transparent px-6 py-3 text-base font-medium text-emerald-600 transition-all duration-200 hover:bg-emerald-50 active:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer';

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              AI-Powered Sustainability
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Understand Your{' '}
              <span className="text-emerald-500">Carbon Footprint</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-500">
              CarbonWise AI helps you track, understand, and reduce your carbon
              emissions with personalized insights, AI-powered recommendations,
              and gamified challenges.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/calculator')}
                className={btnPrimary}
              >
                Calculate Your Footprint
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/ai-coach')}
                className={btnOutline}
              >
                Talk to AI Coach
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Everything you need to{' '}
              <span className="text-emerald-500">go green</span>
            </h2>
            <p className="mx-auto max-w-2xl text-slate-500">
              A comprehensive platform to measure, track, and reduce your carbon
              footprint with the help of AI.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group transition-shadow hover:shadow-md">
                <div
                  className={`mb-4 inline-flex rounded-xl ${feature.bg} p-3`}
                >
                  <svg
                    className={`h-6 w-6 ${feature.color}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to make a difference?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-emerald-100">
            Start your sustainability journey today. Calculate your footprint
            and get personalized recommendations.
          </p>
          <button
            onClick={() => navigate('/calculator')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-emerald-700 shadow-sm transition-all duration-200 hover:bg-emerald-50 active:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
