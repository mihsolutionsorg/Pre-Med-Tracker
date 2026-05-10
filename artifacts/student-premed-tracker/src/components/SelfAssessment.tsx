import { useState, useEffect } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { semesterPriorities } from '../data/semesterPriorities';

interface SelfAssessmentProps {
  currentYear: string;
  currentSemester: string;
  completedPriorities: string[];
  onUpdateCompletedPriorities: (ids: string[]) => void;
}

export function SelfAssessment({ currentYear, currentSemester, completedPriorities, onUpdateCompletedPriorities }: SelfAssessmentProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);

  useEffect(() => {
    const syncTimeframe = () => {
      const saved = localStorage.getItem('premed-roadmap-timeframe');
      if (!saved) {
        setSelectedYear(currentYear);
        setSelectedSemester(currentSemester);
        return;
      }
      try {
        const parsed = JSON.parse(saved);
        setSelectedYear(parsed.year || currentYear);
        setSelectedSemester(parsed.semester || currentSemester);
      } catch {
        setSelectedYear(currentYear);
        setSelectedSemester(currentSemester);
      }
    };

    syncTimeframe();

    const handleTimeframeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ year?: string; semester?: string }>;
      if (customEvent.detail?.year) setSelectedYear(customEvent.detail.year);
      if (customEvent.detail?.semester) setSelectedSemester(customEvent.detail.semester);
    };

    window.addEventListener('premed-roadmap-timeframe-change', handleTimeframeChange as EventListener);
    return () => window.removeEventListener('premed-roadmap-timeframe-change', handleTimeframeChange as EventListener);
  }, [currentYear, currentSemester]);

  const priorities = semesterPriorities[selectedYear]?.[selectedSemester] || [];

  useEffect(() => {
    const initialAnswers: Record<string, boolean> = {};
    priorities.forEach(priority => {
      initialAnswers[priority.id] = completedPriorities.includes(priority.id);
    });
    setAnswers(initialAnswers);
  }, [selectedYear, selectedSemester, completedPriorities]);

  const handleAnswer = (priorityId: string, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [priorityId]: answer }));
  };

  const handleSubmit = () => {
    const currentTermIds = priorities.map(p => p.id);
    const checkedIds = priorities
      .filter((priority) => answers[priority.id] === true)
      .map((priority) => priority.id);

    const otherTermsCompleted = completedPriorities.filter(id => !currentTermIds.includes(id));
    const merged = [...otherTermsCompleted, ...checkedIds];

    onUpdateCompletedPriorities(merged);
    setHasSubmitted(true);
  };

  const handleCancel = () => {
    const initialAnswers: Record<string, boolean> = {};
    priorities.forEach(priority => {
      initialAnswers[priority.id] = completedPriorities.includes(priority.id);
    });
    setAnswers(initialAnswers);
    setHasSubmitted(false);
  };

  const completedCount = Object.values(answers).filter(a => a === true).length;
  const totalCount = priorities.length;
  const allComplete = completedCount === totalCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categorizedPriorities: Record<string, typeof priorities> = {};
  priorities.forEach(priority => {
    if (!categorizedPriorities[priority.category]) {
      categorizedPriorities[priority.category] = [];
    }
    categorizedPriorities[priority.category].push(priority);
  });

  const getSuggestions = () => {
    const incompletePriorities = priorities.filter(p => !answers[p.id]);
    const criticalCategories = ['Academic', 'MCAT', 'Application'];
    const hasCriticalGaps = incompletePriorities.some(p => criticalCategories.includes(p.category));
    const suggestions = [];

    if (allComplete) {
      suggestions.push('✓ You\'re on track! Keep up the excellent work.');
      suggestions.push('Continue building on your momentum and stay consistent with your goals.');
    } else {
      if (hasCriticalGaps) {
        suggestions.push('⚠️ Schedule a meeting with your pre-med advisor this week to discuss your progress.');
      }
      const missingCategories = new Set(incompletePriorities.map(p => p.category));
      if (missingCategories.has('Academic')) suggestions.push('Focus on academic priorities immediately - GPA is difficult to recover later.');
      if (missingCategories.has('MCAT')) suggestions.push('MCAT preparation requires consistent daily effort. Start your study plan now.');
      if (missingCategories.has('Clinical')) suggestions.push('Begin accumulating clinical hours early. Shadowing opportunities take time to secure.');
      if (missingCategories.has('Application')) suggestions.push('Application components (personal statement, letters) require months of preparation.');
      if (completionPercentage < 50) suggestions.push('Create a weekly action plan to address incomplete priorities systematically.');
    }

    return suggestions;
  };

  if (priorities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">Self-Assessment</h2>
          <p className="text-purple-100">No priorities defined for this semester.</p>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheck size={28} />
            <h2 className="text-2xl font-bold">Results</h2>
          </div>
          <p className="text-purple-100">Your honest self-evaluation</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-1">{completedCount}/{totalCount}</div>
            <div className="text-sm text-gray-500 mb-4">priorities completed</div>
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm ${
              allComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {allComplete ? <><CheckCircle size={18} /> On Track</> : <><AlertTriangle size={18} /> Course-Correct Now</>}
            </div>
          </div>

          <div className="mb-5">
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${allComplete ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-500 mt-1.5">{completionPercentage}% Complete</div>
          </div>

          <div className={`p-4 rounded-xl border ${allComplete ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <h3 className={`font-semibold text-sm mb-2.5 ${allComplete ? 'text-green-900' : 'text-yellow-900'}`}>Recommendations</h3>
            <ul className="space-y-1.5">
              {getSuggestions().map((suggestion, idx) => (
                <li key={idx} className={`text-xs ${allComplete ? 'text-green-800' : 'text-yellow-800'}`}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setHasSubmitted(false)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
            >
              Review Answers
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>

        {!allComplete && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Priorities to Address ({totalCount - completedCount})</h3>
            <ul className="space-y-2">
              {priorities.filter(p => !answers[p.id]).map((priority) => (
                <li key={priority.id} className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-500 font-bold mt-0.5 text-xs">•</span>
                  <div className="flex-1">
                    <span className="text-xs text-red-900">{priority.text}</span>
                    <div className="text-xs text-red-400 mt-0.5">{priority.category}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck size={24} />
          <div>
            <div className="text-xs text-purple-200">Self-Assessment</div>
            <h2 className="text-xl font-bold">Am I on track?</h2>
          </div>
        </div>
        <p className="text-purple-100 text-sm font-medium">Answer honestly. No partial credit.</p>
      </div>

      <div className="space-y-4">
        {Object.entries(categorizedPriorities).map(([category, categoryPriorities]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">{category}</h3>
              <span className="text-xs text-gray-400">
                {categoryPriorities.filter(p => answers[p.id] === true).length} / {categoryPriorities.length}
              </span>
            </div>
            <div className="space-y-3">
              {categoryPriorities.map((priority) => (
                <div key={priority.id} className="border border-gray-100 rounded-lg p-3.5">
                  <p className="text-sm text-gray-800 mb-2.5 leading-snug">{priority.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswer(priority.id, true)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors ${
                        answers[priority.id] === true ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleAnswer(priority.id, false)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors ${
                        answers[priority.id] === false ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors"
          >
            Submit Assessment
          </button>
          <button
            onClick={handleCancel}
            className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
