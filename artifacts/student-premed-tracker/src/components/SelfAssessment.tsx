import { useState, useEffect } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface SelfAssessmentProps {
  currentYear: string;
  currentSemester: string;
  completedPriorities: string[];
}

interface Priority {
  id: string;
  text: string;
  category: string;
}

// Import same data structure from EnhancedRoadmap
const semesterPriorities: Record<string, Record<string, Priority[]>> = {
  'undergrad-freshman': {
    fall: [
      { id: 'fr-f-1', text: 'Meet with pre-med advisor within first 2 weeks', category: 'Academic' },
      { id: 'fr-f-2', text: 'Enroll in Biology I and General Chemistry I together', category: 'Academic' },
      { id: 'fr-f-3', text: 'Strive for GPA of 3.65+ in first semester', category: 'Academic' },
      { id: 'fr-f-4', text: 'Visit every science professor during office hours before first exam', category: 'Academic' },
      { id: 'fr-f-5', text: 'Do not take more than 16 credit hours', category: 'Academic' },
      { id: 'fr-f-6', text: 'Research 10 physicians and send cold emails for shadowing', category: 'Clinical' },
      { id: 'fr-f-7', text: 'Join 1-2 organizations (quality over quantity)', category: 'Extracurricular' },
      { id: 'fr-f-8', text: 'Choose at least one non-medical community service organization', category: 'Extracurricular' },
      { id: 'fr-f-9', text: 'Create free AMCAS account at aamc.org', category: 'Application' },
      { id: 'fr-f-10', text: 'Begin tracking accomplishments document (update monthly)', category: 'Application' },
      { id: 'fr-f-11', text: 'Establish schedule with 8 hours sleep and full day off', category: 'Wellness' },
    ],
    spring: [
      { id: 'fr-s-1', text: 'Enroll in Biology II and General Chemistry II', category: 'Academic' },
      { id: 'fr-s-2', text: 'Maintain cumulative GPA of 3.65+', category: 'Academic' },
      { id: 'fr-s-3', text: 'Secure at least one consistent shadowing placement', category: 'Clinical' },
      { id: 'fr-s-4', text: 'Document each shadowing session with date, specialty, hours, observation', category: 'Clinical' },
      { id: 'fr-s-5', text: 'Consistently attend and take on small responsibility in organization', category: 'Extracurricular' },
      { id: 'fr-s-6', text: 'Discuss full financial commitment with family ($300k+)', category: 'Planning' },
      { id: 'fr-s-7', text: 'Investigate what DO degree entails and how it aligns with goals', category: 'Planning' },
    ],
    summer: [
      { id: 'fr-su-1', text: 'Retake any course with grade C or below', category: 'Academic' },
      { id: 'fr-su-2', text: 'Enroll in light summer course (English, Psych, Sociology)', category: 'Academic' },
      { id: 'fr-su-3', text: 'Aim for 40-60 cumulative shadowing hours by end of freshman year', category: 'Clinical' },
    ],
  },
  'undergrad-sophomore': {
    fall: [
      { id: 'so-f-1', text: 'Enroll in Organic Chemistry I', category: 'Academic' },
      { id: 'so-f-2', text: 'Attend weekly Organic Chemistry office hours (not just before exams)', category: 'Academic' },
      { id: 'so-f-3', text: 'Maintain cumulative GPA of 3.6+', category: 'Academic' },
      { id: 'so-f-4', text: 'Add a second shadowing specialty (primary care + one other)', category: 'Clinical' },
      { id: 'so-f-5', text: 'Consider volunteering at hospital in addition to shadowing', category: 'Clinical' },
      { id: 'so-f-6', text: 'Take on specific leadership role in at least one organization', category: 'Extracurricular' },
      { id: 'so-f-7', text: 'Schedule meeting with pre-med advisor before semester begins', category: 'Planning' },
      { id: 'so-f-8', text: 'Practice "Why Medicine" story (2 min without saying "helping people")', category: 'Planning' },
    ],
    spring: [
      { id: 'so-s-1', text: 'Complete Organic Chemistry II', category: 'Academic' },
      { id: 'so-s-2', text: 'Start Physics I', category: 'Academic' },
      { id: 'so-s-3', text: 'Target cumulative GPA of 3.65+ by end of sophomore year', category: 'Academic' },
      { id: 'so-s-4', text: 'Achieve total of 100 shadowing hours by end of sophomore year', category: 'Clinical' },
      { id: 'so-s-5', text: 'Ask shadowing physician: "What do you wish you\'d known before med school?"', category: 'Clinical' },
      { id: 'so-s-6', text: 'Join or start research lab (even as unpaid assistant)', category: 'Research' },
      { id: 'so-s-7', text: 'Achieve 50+ hours non-clinical community service', category: 'Extracurricular' },
      { id: 'so-s-8', text: 'Choose 3 letter of rec writers by April', category: 'Application' },
      { id: 'so-s-9', text: 'Understand school\'s pre-med committee letter process', category: 'Application' },
    ],
    summer: [
      { id: 'so-su-1', text: 'Take free MCAT diagnostic test without preparation', category: 'MCAT' },
      { id: 'so-su-2', text: 'Plan MCAT prep timeline based on diagnostic (6-month if <500, 90-day if 500-508)', category: 'MCAT' },
      { id: 'so-su-3', text: 'Apply for scribe position, clinical internship, or EMT certification', category: 'Clinical' },
    ],
  },
  'undergrad-junior': {
    fall: [
      { id: 'ju-f-1', text: 'Complete Physics II and Biochemistry simultaneously', category: 'Academic' },
      { id: 'ju-f-2', text: 'Maintain cumulative GPA of 3.65+', category: 'Academic' },
      { id: 'ju-f-3', text: 'Register for MCAT by November (target Jan-Apr test date)', category: 'MCAT' },
      { id: 'ju-f-4', text: 'Start MCAT prep in October (6-month) or January (90-day)', category: 'MCAT' },
      { id: 'ju-f-5', text: 'Purchase AAMC Official Prep Bundle', category: 'MCAT' },
      { id: 'ju-f-6', text: 'Aim for 150+ cumulative clinical hours by end of fall', category: 'Clinical' },
      { id: 'ju-f-7', text: 'Identify most significant clinical experience for personal statement', category: 'Clinical' },
      { id: 'ju-f-8', text: 'Confirm formal leadership title in at least one activity', category: 'Extracurricular' },
      { id: 'ju-f-9', text: 'Achieve 80+ non-clinical volunteer hours', category: 'Extracurricular' },
      { id: 'ju-f-10', text: 'Compile list of 25-30 target schools using MSAR', category: 'Application' },
      { id: 'ju-f-11', text: 'Organize school list: 5-7 reach, 10-12 target, 5-7 safety, 3-5 DO', category: 'Application' },
    ],
    spring: [
      { id: 'ju-s-1', text: 'Complete remaining prerequisites (English, Sociology, Psychology)', category: 'Academic' },
      { id: 'ju-s-2', text: 'Final GPA check: if below 3.5, seriously consider gap year', category: 'Academic' },
      { id: 'ju-s-3', text: 'Complete all 6 AAMC full-length practice exams under timed conditions', category: 'MCAT' },
      { id: 'ju-s-4', text: 'Target MCAT scores: 511-515 competitive MD, 517+ top 20', category: 'MCAT' },
      { id: 'ju-s-5', text: 'If practice scores below 507, extend prep time - do not test yet', category: 'MCAT' },
      { id: 'ju-s-6', text: 'Achieve 200 cumulative clinical hours by May', category: 'Clinical' },
      { id: 'ju-s-7', text: 'MARCH: Begin drafting personal statement (plan for 10+ drafts)', category: 'Application' },
      { id: 'ju-s-8', text: 'APRIL: Request letters of rec 6-8 weeks in advance with Brag Sheet', category: 'Application' },
      { id: 'ju-s-9', text: 'MAY: Start filling AMCAS activities section (15 slots, 700 chars each)', category: 'Application' },
      { id: 'ju-s-10', text: 'Designate 3 Most Meaningful activities (1,325 chars each)', category: 'Application' },
      { id: 'ju-s-11', text: 'Establish backup plan (gap year, post-bacc, SMP, DO schools)', category: 'Planning' },
    ],
    summer: [
      { id: 'ju-su-1', text: 'JUNE 1: Submit AMCAS application on opening day', category: 'Application' },
      { id: 'ju-su-2', text: 'Pre-write secondary essays using prior-year prompts', category: 'Application' },
      { id: 'ju-su-3', text: 'Return all secondaries within 14 days of receipt', category: 'Application' },
    ],
  },
  'undergrad-senior': {
    fall: [
      { id: 'se-f-1', text: 'Keep GPA up - schools can rescind acceptances for academic decline', category: 'Academic' },
      { id: 'se-f-2', text: 'Complete Biochemistry if not done yet', category: 'Academic' },
      { id: 'se-f-3', text: 'Decide by Oct 1 whether to retake MCAT (fall retake too late for cycle)', category: 'MCAT' },
      { id: 'se-f-4', text: 'Complete all secondaries within 14 days of receipt', category: 'Application' },
      { id: 'se-f-5', text: 'Prepare for both MMI and Traditional Panel interview formats', category: 'Interview' },
      { id: 'se-f-6', text: 'Research each interview school for 4+ hours before arriving', category: 'Interview' },
      { id: 'se-f-7', text: 'Send thank-you email within 24 hours of each interview', category: 'Interview' },
    ],
    spring: [
      { id: 'se-s-1', text: 'If waitlisted, send ONE update letter per school per month', category: 'Application' },
      { id: 'se-s-2', text: 'If accepted to multiple schools, decide by April 30', category: 'Application' },
      { id: 'se-s-3', text: 'Withdraw from all other schools the day you commit', category: 'Application' },
    ],
    summer: [],
  },
  'gap-year': {
    fall: [
      { id: 'gap-f-1', text: 'Work full-time in healthcare (scribe, EMT, clinical research coordinator)', category: 'Clinical' },
      { id: 'gap-f-2', text: 'Aim for 1,000+ clinical hours during gap year', category: 'Clinical' },
      { id: 'gap-f-3', text: 'Choose paid positions when possible to offset application costs', category: 'Clinical' },
      { id: 'gap-f-4', text: 'If GPA below 3.5, enroll in SMP or post-bacc program', category: 'Academic' },
      { id: 'gap-f-5', text: 'If MCAT below 507, retake with structured 3-6 month study plan', category: 'MCAT' },
    ],
    spring: [
      { id: 'gap-s-1', text: 'Completely rewrite personal statement with new experiences and maturity', category: 'Application' },
      { id: 'gap-s-2', text: 'Expand school list to include more DO and mid-tier MD programs', category: 'Application' },
      { id: 'gap-s-3', text: 'Get professional feedback on application from advisors or consultants', category: 'Application' },
      { id: 'gap-s-4', text: 'Build new relationships for updated letters of rec reflecting gap year growth', category: 'Application' },
    ],
    summer: [
      { id: 'gap-su-1', text: 'Submit AMCAS on June 1 (opening day)', category: 'Application' },
      { id: 'gap-su-2', text: 'Complete post-bacc or SMP if enrolled for GPA recovery', category: 'Academic' },
    ],
  },
};

export function SelfAssessment({ currentYear, currentSemester, completedPriorities }: SelfAssessmentProps) {
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

  // Initialize answers based on completed priorities
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
    setHasSubmitted(true);
  };

  const handleCancel = () => {
    // Reset to initial state
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

  // Organize by category
  const categorizedPriorities: Record<string, Priority[]> = {};
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

      if (missingCategories.has('Academic')) {
        suggestions.push('Focus on academic priorities immediately - GPA is difficult to recover later.');
      }
      if (missingCategories.has('MCAT')) {
        suggestions.push('MCAT preparation requires consistent daily effort. Start your study plan now.');
      }
      if (missingCategories.has('Clinical')) {
        suggestions.push('Begin accumulating clinical hours early. Shadowing opportunities take time to secure.');
      }
      if (missingCategories.has('Application')) {
        suggestions.push('Application components (personal statement, letters) require months of preparation.');
      }

      if (completionPercentage < 50) {
        suggestions.push('Create a weekly action plan to address incomplete priorities systematically.');
      }
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
            <h2 className="text-2xl font-bold">Self-Assessment Results</h2>
          </div>
          <p className="text-purple-100">Your honest self-evaluation</p>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {completedCount}/{totalCount}
            </div>
            <div className="text-lg text-gray-600 mb-4">priorities completed</div>

            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
              allComplete
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {allComplete ? (
                <>
                  <CheckCircle size={24} />
                  On Track
                </>
              ) : (
                <>
                  <AlertTriangle size={24} />
                  Course-Correct Now
                </>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  allComplete ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">{completionPercentage}% Complete</div>
          </div>

          {/* Suggestions */}
          <div className={`p-4 rounded-lg border-2 ${
            allComplete
              ? 'bg-green-50 border-green-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <h3 className={`font-bold mb-3 ${
              allComplete ? 'text-green-900' : 'text-yellow-900'
            }`}>
              Recommendations
            </h3>
            <ul className="space-y-2">
              {getSuggestions().map((suggestion, idx) => (
                <li key={idx} className={`text-sm ${
                  allComplete ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setHasSubmitted(false)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Review Answers
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Incomplete Priorities */}
        {!allComplete && (
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              Priorities to Address ({totalCount - completedCount})
            </h3>
            <ul className="space-y-2">
              {priorities.filter(p => !answers[p.id]).map((priority) => (
                <li key={priority.id} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <div className="flex-1">
                    <span className="text-sm text-red-900">{priority.text}</span>
                    <div className="text-xs text-red-600 mt-1">{priority.category}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const getYearLabel = (year: string) => {
    const labels: Record<string, string> = {
      'undergrad-freshman': 'Freshman',
      'undergrad-sophomore': 'Sophomore',
      'undergrad-junior': 'Junior',
      'undergrad-senior': 'Senior',
      'gap-year': 'Gap Year',
    };
    return labels[year] || year;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck size={28} />
          <div>
            <div className="text-sm text-purple-100">Self-Assessment</div>
            <h2 className="text-2xl font-bold">Am I on track?</h2>
          </div>
        </div>
        <p className="text-purple-100 font-medium mb-2">
          Answer honestly. No partial credit.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(categorizedPriorities).map(([category, categoryPriorities]) => (
          <div key={category} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{category}</h3>
              <span className="text-sm text-gray-500">
                {categoryPriorities.filter(priority => answers[priority.id] === true).length} / {categoryPriorities.length}
              </span>
            </div>
            <div className="space-y-3">
              {categoryPriorities.map((priority) => (
                <div key={priority.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 mb-3">{priority.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswer(priority.id, true)}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        answers[priority.id] === true
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleAnswer(priority.id, false)}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        answers[priority.id] === false
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold"
          >
            Submit Assessment
          </button>
          <button
            onClick={handleCancel}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
