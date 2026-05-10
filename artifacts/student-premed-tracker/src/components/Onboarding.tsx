import { useState } from 'react';
import { ArrowRight, ClipboardList, Target, BadgeCheck, ChevronRight } from 'lucide-react';

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

const SPLASH_SCREENS = [
  {
    icon: ClipboardList,
    headline: 'Your Pre-Med Journey, Organized.',
    sub: 'No more guessing what comes next. A personalized roadmap from Freshman year to White Coat.',
  },
  {
    icon: Target,
    headline: 'Track Every Milestone.',
    sub: 'From Freshman Fall to your med school application. Your personalized roadmap, updated in real time.',
  },
  {
    icon: BadgeCheck,
    headline: 'Ready to start?',
    sub: 'Build your roadmap in under a minute. You can always update your info later.',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [phase, setPhase] = useState<'splash' | 'data'>('splash');
  const [splashStep, setSplashStep] = useState(0); // 0-indexed, 0–2
  const [step, setStep] = useState(1);             // 1–4 for data steps
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const handleSkip = () => {
    onComplete(DEFAULTS);
  };

  const handleSplashNext = () => {
    if (splashStep < 2) {
      setSplashStep(splashStep + 1);
    } else {
      setPhase('data');
    }
  };

  const handleDataNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({ name: name.trim() || 'there', school, year, semester, track: 'both' });
    }
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

  // ─── Splash Phase ────────────────────────────────────────────────────────────
  if (phase === 'splash') {
    const screen = SPLASH_SCREENS[splashStep];
    const Icon = screen.icon;
    const isLast = splashStep === 2;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex flex-col px-6 py-10">
        {/* Skip */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSkip}
            className="text-blue-200 hover:text-white text-sm font-medium transition-colors px-2 py-1"
          >
            Skip for now
          </button>
        </div>

        {/* Content — centred */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          {/* Icon circle */}
          <div className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center mb-8 shadow-lg">
            <Icon size={44} className="text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            {screen.headline}
          </h1>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs">
            {screen.sub}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {SPLASH_SCREENS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === splashStep ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        {isLast ? (
          <button
            onClick={handleSplashNext}
            className="w-full bg-white text-blue-700 font-bold text-base py-4 rounded-2xl shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            Create My Roadmap
            <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSplashNext}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold text-base py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            Next
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    );
  }

  // ─── Data Collection Phase ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo + progress */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Pre-Med Journey
          </h1>

          {/* 4-step progress bar */}
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
              {step < 4 ? (
                <>Continue <ArrowRight size={18} /></>
              ) : (
                'Build My Roadmap 🎉'
              )}
            </button>

            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-300 font-medium text-sm transition-all"
              >
                Back
              </button>
            )}

            {/* Skip for now */}
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
