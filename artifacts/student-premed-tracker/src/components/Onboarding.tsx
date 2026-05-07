import { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: {
    name: string;
    school: string;
    year: string;
    semester: string;
    track: string;
  }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleComplete = () => {
    onComplete({ name, school, year, semester, track: 'both' });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return school.trim().length > 0;
      case 3:
        return year.length > 0;
      case 4:
        return semester.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="text-pink-500 fill-pink-500" size={40} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pre-Med Journey
            </h1>
          </div>
          <div className="flex gap-2 justify-center mt-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What should we call you?</h2>
                <p className="text-gray-600">Let's make this journey personal</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you studying?</h2>
                <p className="text-gray-600">Your college or university</p>
              </div>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g., UCLA, Boston University"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What year are you?</h2>
                <p className="text-gray-600">Select your current academic year</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'undergrad-freshman', label: 'Freshman' },
                  { value: 'undergrad-sophomore', label: 'Sophomore' },
                  { value: 'undergrad-junior', label: 'Junior' },
                  { value: 'undergrad-senior', label: 'Senior' },
                  { value: 'gap-year', label: 'Gap Year' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setYear(option.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
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
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Which semester?</h2>
                <p className="text-gray-600">Current or upcoming semester</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'fall', label: 'Fall' },
                  { value: 'spring', label: 'Spring' },
                  { value: 'summer', label: 'Summer' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSemester(option.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
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

          <div className="mt-8">
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  canProceed()
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Build My Roadmap
              </button>
            )}
          </div>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full mt-3 py-2.5 bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-300 rounded-lg text-gray-700 hover:text-gray-900 font-medium transition-all"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
