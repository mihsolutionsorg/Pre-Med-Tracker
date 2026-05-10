import { useState } from 'react';
import { ArrowRight, ClipboardList, BadgeCheck, ChevronRight } from 'lucide-react';

interface OnboardingData {
  name: string;
  school: string;
  year: string;
  semester: string;
  track: string;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const DEFAULTS: OnboardingData = {
  name: '',
  school: '',
  year: 'undergrad-freshman',
  semester: 'fall',
  track: 'both',
};

// ── Tracking illustration: donut chart + floating badge cards ─────────────────
function TrackingIllustration() {
  const cx = 100, cy = 100;
  const R = 56;
  const sw = 22;
  const C = 2 * Math.PI * R; // ≈ 351.86

  // segments: [pct, color, startAngle(deg)]
  const segments: [number, string, number][] = [
    [0.38, '#3B82F6', -90],                    // blue  – clinical
    [0.20, '#FB923C', -90 + 0.38 * 360],       // orange – research
    [0.32, '#4ADE80', -90 + 0.58 * 360],       // green  – volunteer
    [0.10, '#F87171', -90 + 0.90 * 360],       // red    – shadowing
  ];

  const gap = 3;

  return (
    <svg viewBox="0 0 200 200" width="188" height="188" aria-hidden="true">
      <defs>
        <filter id="card-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.13" />
        </filter>
      </defs>

      {/* Outer sage ring */}
      <circle cx={cx} cy={cy} r={R + 16} fill="none" stroke="#86efac" strokeWidth={10} strokeOpacity={0.35} />

      {/* Donut segments */}
      {segments.map(([pct, color, rot], i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={`${pct * C - gap} ${C - pct * C + gap}`}
          transform={`rotate(${rot} ${cx} ${cy})`}
          strokeLinecap="butt"
        />
      ))}

      {/* White donut hole */}
      <circle cx={cx} cy={cy} r={R - sw / 2 - 1} fill="white" fillOpacity={0.15} />

      {/* Hours badge — top left */}
      <rect x="6" y="18" width="62" height="50" rx="10" fill="white" filter="url(#card-shadow)" />
      {/* Clock face */}
      <circle cx="28" cy="37" r="9" fill="none" stroke="#6B7280" strokeWidth="1.5" />
      <line x1="28" y1="30" x2="28" y2="37" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="37" x2="34" y2="37" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
      <text x="51" y="33" textAnchor="middle" fontSize="8" fontWeight="700" fill="#374151" fontFamily="system-ui,sans-serif">Hrs</text>
      <text x="37" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1F2937" fontFamily="system-ui,sans-serif">Hours</text>

      {/* GPA / MCAT badge — bottom right */}
      <rect x="132" y="132" width="62" height="52" rx="10" fill="white" filter="url(#card-shadow)" />
      <text x="163" y="151" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1D4ED8" fontFamily="system-ui,sans-serif">GPA</text>
      <line x1="142" y1="157" x2="184" y2="157" stroke="#E5E7EB" strokeWidth="1.2" />
      <text x="163" y="172" textAnchor="middle" fontSize="11" fontWeight="800" fill="#7C3AED" fontFamily="system-ui,sans-serif">MCAT</text>
    </svg>
  );
}

// ── Splash screen config ──────────────────────────────────────────────────────
type SplashScreen =
  | { kind: 'icon'; icon: React.ElementType; headline: string; sub: string }
  | { kind: 'illustration'; illustration: React.ReactNode; headline: string; sub: string };

const SPLASH_SCREENS: SplashScreen[] = [
  {
    kind: 'icon',
    icon: ClipboardList,
    headline: 'Your Pre-Med Journey, Organized.',
    sub: 'No more guessing what comes next. A personalized roadmap from Freshman year to White Coat.',
  },
  {
    kind: 'illustration',
    illustration: <TrackingIllustration />,
    headline: 'Track Every Milestone.',
    sub: 'Log clinical hours, shadow shifts, and GPA trends in one secure place.',
  },
  {
    kind: 'icon',
    icon: BadgeCheck,
    headline: 'Ready to start?',
    sub: 'Build your roadmap in under a minute. You can always update your info later.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function Onboarding({ onComplete }: OnboardingProps) {
  const [phase, setPhase] = useState<'splash' | 'data'>('splash');
  const [splashStep, setSplashStep] = useState(0);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const handleSkip = () => onComplete(DEFAULTS);

  const handleSplashNext = () => {
    if (splashStep < 2) setSplashStep(splashStep + 1);
    else setPhase('data');
  };

  const handleDataNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete({ name: name.trim() || 'there', school, year, semester, track: 'both' });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return school.trim().length > 0;
      case 3: return year.length > 0;
      case 4: return semester.length > 0;
      default: return false;
    }
  };

  // ─── Splash Phase ───────────────────────────────────────────────────────────
  if (phase === 'splash') {
    const screen = SPLASH_SCREENS[splashStep];
    const isLast = splashStep === 2;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex flex-col px-6 py-10">
        {/* Top spacer keeps content vertically centred */}
        <div className="h-6" />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          {screen.kind === 'illustration' ? (
            <div className="mb-8 drop-shadow-xl">
              {screen.illustration}
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center mb-8 shadow-lg">
              <screen.icon size={44} className="text-white" strokeWidth={1.5} />
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            {screen.headline}
          </h1>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs">
            {screen.sub}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {SPLASH_SCREENS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === splashStep ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Buttons row — Skip (left) + Next/CTA (right) */}
        {isLast ? (
          <button
            onClick={handleSplashNext}
            className="w-full bg-white text-blue-700 font-bold text-base py-4 rounded-2xl shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            Create My Roadmap
            <ArrowRight size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="flex-none px-5 py-4 text-white/80 hover:text-white font-semibold text-base underline underline-offset-2 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSplashNext}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold text-base py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-4">
          SERH Solutions LLC &nbsp;©&nbsp; 2026
        </p>
      </div>
    );
  }

  // ─── Data Collection Phase ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo + progress */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Pre-Med Journey
          </h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Step {step} of 4</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What should we call you?</h2>
                <p className="text-gray-500 text-sm">Let's make this journey personal</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleDataNext()}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you studying?</h2>
                <p className="text-gray-500 text-sm">Your college or university</p>
              </div>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleDataNext()}
                placeholder="e.g., UCLA, Boston University"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What year are you?</h2>
                <p className="text-gray-500 text-sm">Select your current academic year</p>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'undergrad-freshman',  label: 'Freshman' },
                  { value: 'undergrad-sophomore', label: 'Sophomore' },
                  { value: 'undergrad-junior',    label: 'Junior' },
                  { value: 'undergrad-senior',    label: 'Senior' },
                  { value: 'gap-year',            label: 'Gap Year' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setYear(option.value)}
                    className={`w-full p-3.5 rounded-xl border-2 text-left font-medium transition-all text-sm ${
                      year === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Which semester?</h2>
                <p className="text-gray-500 text-sm">Current or upcoming semester</p>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'fall',   label: 'Fall' },
                  { value: 'spring', label: 'Spring' },
                  { value: 'summer', label: 'Summer' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSemester(option.value)}
                    className={`w-full p-3.5 rounded-xl border-2 text-left font-medium transition-all text-sm ${
                      semester === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Continue / Finish */}
          <div className="mt-7 space-y-3">
            <button
              onClick={handleDataNext}
              disabled={!canProceed()}
              className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-sm'
                  : 'bg-gray-200 cursor-not-allowed text-gray-400'
              }`}
            >
              {step < 4 ? <><span>Continue</span><ArrowRight size={18} /></> : 'Build My Roadmap 🎉'}
            </button>

            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-300 font-medium text-sm transition-all"
              >
                Back
              </button>
            )}

            <button
              onClick={handleSkip}
              className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
