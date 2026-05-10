import { useState } from 'react';
import { Target, BadgeCheck, BookOpen, Info, Check, HelpCircle } from 'lucide-react';
import { semesterPriorities, ALL_PRIORITY_IDS } from '../data/semesterPriorities';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  isBCPM: boolean;
}

interface ExamPlan {
  targetDate: string;
  targetScore: number;
  currentPhase: string;
  weeklyHours: number;
}

interface DashboardProps {
  name: string;
  year: string;
  semester: string;
  planYear?: string;
  planSemester?: string;
  roadmapCompletedPriorities?: string[];
  completedMilestones: string[];
  completedPriorities: string[];
  experienceHours: {
    clinical: number;
    research: number;
    volunteer: number;
    shadowing: number;
  };
  courses: Course[];
  examPlan: ExamPlan;
  onUpdateHours: (type: string, value: number) => void;
  onViewChange: (view: string) => void;
  onNavigateToTrack: (tab: 'gpa' | 'mcat' | 'hours') => void;
  onTogglePriority: (id: string) => void;
}

const gradePoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

export function Dashboard({
  name,
  year,
  semester,
  planYear,
  planSemester,
  completedMilestones: _completedMilestones,
  completedPriorities,
  experienceHours,
  courses,
  examPlan,
  onUpdateHours,
  onViewChange,
  onNavigateToTrack,
  onTogglePriority,
}: DashboardProps) {
  const [showReadinessTooltip, setShowReadinessTooltip] = useState(false);
  const [showAppTooltip, setShowAppTooltip] = useState(false);

  const formatTargetDate = (value: string) => {
    if (!value) return 'TBD';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  const calculateGPA = (courseList: Course[]) => {
    if (courseList.length === 0) return 0;
    const totalPoints = courseList.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits, 0
    );
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const currentGPA = calculateGPA(courses);

  const selectedYear = planYear || year;
  const selectedSemester = planSemester || semester;

  // Current term priorities — the exact same list used in the Plan/Roadmap tab
  const termPriorities = semesterPriorities[selectedYear]?.[selectedSemester] || [];
  const termCompleted = termPriorities.filter(p => completedPriorities.includes(p.id)).length;
  const termTotal = termPriorities.length;

  // Application readiness = % of ALL priorities across all years ever completed
  const totalAllPriorities = ALL_PRIORITY_IDS.length;
  const completedAllCount = ALL_PRIORITY_IDS.filter(id => completedPriorities.includes(id)).length;
  const applicationReadiness = totalAllPriorities > 0
    ? Math.round((completedAllCount / totalAllPriorities) * 100)
    : 0;

  const totalHours =
    experienceHours.clinical +
    experienceHours.research +
    experienceHours.volunteer +
    experienceHours.shadowing;

  const isTermActive = selectedYear === year && selectedSemester === semester;

  const getProTip = () => {
    if (totalHours === 0) return 'Start logging clinical hours early to build a strong application profile';
    if (experienceHours.clinical < 50) return 'Aim for at least 200 clinical hours before applying to medical school';
    if (experienceHours.shadowing < 40) return 'Shadow at least 2 specialties — admissions committees want breadth and depth';
    return 'Keep logging — consistency in clinical experience strengthens your narrative';
  };

  const yearLabel: Record<string, string> = {
    'undergrad-freshman': 'Freshman',
    'undergrad-sophomore': 'Sophomore',
    'undergrad-junior': 'Junior',
    'undergrad-senior': 'Senior',
    'gap-year': 'Gap Year',
  };
  const semesterLabel: Record<string, string> = { fall: 'Fall', spring: 'Spring', summer: 'Summer' };

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <BadgeCheck size={22} />
          <h2 className="text-xl font-bold">Welcome, {name}!</h2>
        </div>
        <p className="text-blue-100 text-sm">
          Every med student started right here. Let's take the first step together.
        </p>
      </div>

      {/* Term Readiness — Checklist Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-gray-900">Term Readiness</h3>
            <div className="relative">
              <button
                onClick={() => setShowReadinessTooltip(v => !v)}
                onBlur={() => setShowReadinessTooltip(false)}
                className="text-gray-300 hover:text-gray-500 transition-colors focus:outline-none"
              >
                <HelpCircle size={15} />
              </button>
              {showReadinessTooltip && (
                <div className="absolute left-0 top-6 z-10 w-56 bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg leading-relaxed">
                  This tracks your progress for your current semester milestones. Check off tasks as you complete them — they sync with your Plan tab.
                </div>
              )}
            </div>
          </div>
          {isTermActive && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Your {yearLabel[selectedYear] || selectedYear} {semesterLabel[selectedSemester] || selectedSemester} Roadmap
        </p>

        {/* Fraction count — bold, prominent */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 text-center">
          <span className="text-2xl font-extrabold text-gray-900">
            {termCompleted} of {termTotal} task{termTotal !== 1 ? 's' : ''} complete
          </span>
        </div>

        {/* Checklist — same items as Plan tab */}
        {termPriorities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">No priorities for this semester.</p>
        ) : (
          <ul className="space-y-2">
            {termPriorities.map((priority) => {
              const isCompleted = completedPriorities.includes(priority.id);
              return (
                <li key={priority.id}>
                  <button
                    onClick={() => onTogglePriority(priority.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-lg transition-all text-left ${
                      isCompleted ? 'opacity-60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                      isCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {isCompleted && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm leading-snug flex-1 ${
                      isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
                    }`}>
                      {priority.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* "See full plan" link */}
        {termPriorities.length > 0 && (
          <button
            onClick={() => onViewChange('plan')}
            className="w-full mt-3 text-xs text-blue-500 hover:text-blue-700 font-medium text-center py-1 transition-colors"
          >
            See full roadmap in Plan tab →
          </button>
        )}
      </div>

      {/* GPA + MCAT row */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateToTrack('gpa')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-gray-500 mb-1 font-medium">Current GPA</div>
          <div className="text-2xl font-bold text-gray-900">
            {courses.length > 0 ? currentGPA.toFixed(2) : 'Not Set'}
          </div>
          <div className="text-xs text-gray-400 mt-1.5">
            {courses.length > 0 ? `${courses.length} courses` : '+ Add courses'}
          </div>
        </button>

        <button
          onClick={() => onNavigateToTrack('mcat')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-gray-500 mb-1 font-medium">MCAT Goal</div>
          <div className="text-2xl font-bold text-gray-900">
            {examPlan.targetScore > 0 ? examPlan.targetScore : 'Not Set'}
          </div>
          <div className="text-xs text-gray-400 mt-1.5">
            {examPlan.targetScore > 0 ? `Target: ${formatTargetDate(examPlan.targetDate)}` : '⊙ Set goal'}
          </div>
        </button>
      </div>

      {/* Total Experience + Application Readiness */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-bold text-gray-900">Total Experience</h3>
          <button
            onClick={() => onNavigateToTrack('hours')}
            className="text-gray-300 hover:text-gray-500 transition-colors"
            title="Log hours"
          >
            <BookOpen size={18} />
          </button>
        </div>
        <p className="text-3xl font-extrabold text-gray-900 mb-0.5">{totalHours}h</p>
        <p className="text-xs text-gray-400 mb-4">
          Clinical <span className="font-medium text-gray-600">{experienceHours.clinical}h</span>
          {' · '}Research <span className="font-medium text-gray-600">{experienceHours.research}h</span>
          {' · '}Service <span className="font-medium text-gray-600">{experienceHours.volunteer}h</span>
        </p>

        {/* Application Readiness bar */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-sm font-semibold text-gray-800">Application Readiness</span>
            <div className="relative">
              <button
                onClick={() => setShowAppTooltip(v => !v)}
                onBlur={() => setShowAppTooltip(false)}
                className="text-gray-300 hover:text-gray-500 transition-colors focus:outline-none"
              >
                <HelpCircle size={13} />
              </button>
              {showAppTooltip && (
                <div className="absolute left-0 top-5 z-10 w-52 bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg leading-relaxed">
                  Cumulative Progress — percentage of all roadmap priorities completed across your entire pre-med journey.
                </div>
              )}
            </div>
            <span className="ml-auto text-sm font-bold text-gray-900">{applicationReadiness}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${applicationReadiness}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {completedAllCount} of {totalAllPriorities} priorities of cumulative progress
          </p>
        </div>

        {/* Pro tip */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
          <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Pro tip:</span> {getProTip()}
          </p>
        </div>
      </div>

      {/* Experience Hours Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Experience Breakdown</h3>
        <div className="space-y-3">
          {[
            { key: 'clinical', label: 'Clinical', color: 'bg-red-500', target: 200 },
            { key: 'research', label: 'Research', color: 'bg-blue-500', target: 100 },
            { key: 'volunteer', label: 'Volunteer', color: 'bg-green-500', target: 100 },
            { key: 'shadowing', label: 'Shadowing', color: 'bg-purple-500', target: 100 },
          ].map((item) => {
            const hours = experienceHours[item.key as keyof typeof experienceHours];
            const percentage = Math.min(100, (hours / item.target) * 100);

            return (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => onUpdateHours(item.key, parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-0.5 border border-gray-200 rounded text-xs text-right focus:border-blue-400 focus:outline-none"
                      min="0"
                    />
                    <span className="text-xs text-gray-400">/ {item.target}h</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Semester Focus */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Target className="text-blue-500" size={16} />
          <h3 className="font-bold text-blue-900 text-sm">Semester Focus</h3>
        </div>
        <ul className="space-y-1.5">
          {getSemesterFocusList(selectedYear, selectedSemester).map((focus, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-400 font-bold mt-0.5 text-xs">•</span>
              <span className="flex-1 text-xs text-blue-800">{focus}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getSemesterFocusList(year: string, semester: string): string[] {
  const focuses: Record<string, Record<string, string[]>> = {
    'undergrad-freshman': {
      fall: [
        'Meet with pre-med advisor in first 2 weeks',
        'Enroll in Bio I and Gen Chem I',
        'Target 3.65+ GPA this semester',
        'Visit professors during office hours',
        'Start shadowing physicians (send 10 cold emails)',
      ],
      spring: [
        'Enroll in Bio II and Gen Chem II',
        'Maintain 3.65+ cumulative GPA',
        'Secure consistent shadowing placement',
        'Take on small responsibility in 1-2 clubs',
      ],
      summer: [
        'Retake any courses with C or below',
        'Take light summer course (Psych, Sociology, English)',
        'Aim for 40-60 total shadowing hours',
      ],
    },
    'undergrad-sophomore': {
      fall: [
        'Enroll in Organic Chemistry I',
        'Attend weekly Orgo office hours',
        'Add second shadowing specialty',
        'Take on formal leadership role in organization',
      ],
      spring: [
        'Complete Organic Chemistry II',
        'Start Physics I',
        'Target 3.65+ cumulative GPA',
        'Achieve 100 total shadowing hours',
        'Choose 3 letter of rec writers by April',
      ],
      summer: [
        'Take MCAT diagnostic test (no prep)',
        'Apply for scribe position or EMT certification',
      ],
    },
    'undergrad-junior': {
      fall: [
        'Complete Physics II and Biochemistry',
        'Register for MCAT by November (Jan-Apr test date)',
        'Start MCAT prep (6-month or 90-day plan)',
        'Aim for 150+ clinical hours by end of fall',
        'Compile list of 25-30 target schools',
      ],
      spring: [
        'Complete remaining prerequisites (Psych, Soc, English)',
        'Take MCAT (Jan-Apr window)',
        'Draft personal statement (March - plan 10+ drafts)',
        'Request letters of rec (April - 6-8 weeks advance)',
        'Fill out AMCAS activities section (May)',
      ],
      summer: [
        'Submit AMCAS on June 1 (opening day)',
        'Pre-write secondary essays',
        'Return secondaries within 14 days',
      ],
    },
    'undergrad-senior': {
      fall: [
        'Keep GPA up - schools can rescind acceptances',
        'Complete all secondaries within 14 days',
        'Prepare for MMI and traditional panel interviews',
        'Research each interview school for 4+ hours',
        'Send thank-you emails within 24 hours',
      ],
      spring: [
        'Send monthly waitlist update letters',
        'Submit deposit and decide by April 30',
        'Withdraw from other schools when you commit',
      ],
      summer: [],
    },
    'gap-year': {
      fall: [
        'Work full-time in healthcare (scribe, EMT, research)',
        'Aim for 1,000+ clinical hours during gap year',
        'Retake MCAT if below 507 (use 3-6 month plan)',
      ],
      spring: [
        'Rewrite personal statement with new experiences',
        'Expand school list to include more DO programs',
        'Build new relationships for updated letters of rec',
      ],
      summer: [
        'Submit AMCAS on June 1',
        'Complete post-bacc or SMP if needed for GPA recovery',
      ],
    },
  };

  return focuses[year]?.[semester] || ['Focus on your current semester priorities'];
}
