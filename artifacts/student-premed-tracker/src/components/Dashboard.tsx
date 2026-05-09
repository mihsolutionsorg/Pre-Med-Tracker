import { TrendingUp, Target, BadgeCheck, BookOpen, Info } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

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
}

const gradePoints: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

const semesterPriorities: Record<string, Record<string, { id: string }[]>> = {
  'undergrad-freshman': {
    fall: Array.from({ length: 11 }, (_, i) => ({ id: `fr-f-${i + 1}` })),
    spring: Array.from({ length: 7 }, (_, i) => ({ id: `fr-s-${i + 1}` })),
    summer: Array.from({ length: 3 }, (_, i) => ({ id: `fr-su-${i + 1}` })),
  },
  'undergrad-sophomore': {
    fall: Array.from({ length: 8 }, (_, i) => ({ id: `so-f-${i + 1}` })),
    spring: Array.from({ length: 9 }, (_, i) => ({ id: `so-s-${i + 1}` })),
    summer: Array.from({ length: 3 }, (_, i) => ({ id: `so-su-${i + 1}` })),
  },
  'undergrad-junior': {
    fall: Array.from({ length: 11 }, (_, i) => ({ id: `ju-f-${i + 1}` })),
    spring: Array.from({ length: 11 }, (_, i) => ({ id: `ju-s-${i + 1}` })),
    summer: Array.from({ length: 3 }, (_, i) => ({ id: `ju-su-${i + 1}` })),
  },
  'undergrad-senior': {
    fall: Array.from({ length: 7 }, (_, i) => ({ id: `se-f-${i + 1}` })),
    spring: Array.from({ length: 3 }, (_, i) => ({ id: `se-s-${i + 1}` })),
    summer: [],
  },
  'gap-year': {
    fall: Array.from({ length: 5 }, (_, i) => ({ id: `gap-f-${i + 1}` })),
    spring: Array.from({ length: 4 }, (_, i) => ({ id: `gap-s-${i + 1}` })),
    summer: Array.from({ length: 2 }, (_, i) => ({ id: `gap-su-${i + 1}` })),
  },
};

export function Dashboard({
  name,
  year,
  semester,
  planYear,
  planSemester,
  roadmapCompletedPriorities,
  completedMilestones,
  completedPriorities,
  experienceHours,
  courses,
  examPlan,
  onUpdateHours,
  onViewChange,
  onNavigateToTrack,
}: DashboardProps) {
  const formatTargetDate = (value: string) => {
    if (!value) return 'TBD';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  const calculateGPA = (courseList: Course[]) => {
    if (courseList.length === 0) return 0;
    const totalPoints = courseList.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const currentGPA = calculateGPA(courses);

  const calculateApplicationReadiness = () => {
    const yearOrder = ['undergrad-freshman', 'undergrad-sophomore', 'undergrad-junior', 'undergrad-senior', 'gap-year'];
    const semesterOrder = ['fall', 'spring', 'summer'];
    const roadmapIds: string[] = [];

    for (const yearKey of yearOrder) {
      const yearData = semesterPriorities[yearKey];
      if (!yearData) continue;
      for (const semesterKey of semesterOrder) {
        const priorities = yearData[semesterKey] || [];
        roadmapIds.push(...priorities.map((p) => p.id));
      }
    }

    if (roadmapIds.length === 0) return 0;
    const completedCount = roadmapIds.filter((id) => completedPriorities.includes(id)).length;
    return Math.round((completedCount / roadmapIds.length) * 100);
  };

  const selectedYear = planYear || year;
  const selectedSemester = planSemester || semester;
  const semesterPrioritiesList = semesterPriorities[selectedYear]?.[selectedSemester] || [];
  const selectedSemesterCompleted = semesterPrioritiesList.filter((p) =>
    completedPriorities.includes(p.id)
  ).length;
  const overallReadiness = semesterPrioritiesList.length > 0
    ? Math.round((selectedSemesterCompleted / semesterPrioritiesList.length) * 100)
    : 0;

  const applicationReadiness = calculateApplicationReadiness();
  const semesterFocus = getSemesterFocusList(selectedYear, selectedSemester);

  const readinessData = [
    { name: 'Completed', value: overallReadiness },
    { name: 'Remaining', value: 100 - overallReadiness },
  ];

  const totalHours =
    experienceHours.clinical +
    experienceHours.research +
    experienceHours.volunteer +
    experienceHours.shadowing;

  const isTermActive = selectedYear === year && selectedSemester === semester;

  // Determine pro tip
  const getProTip = () => {
    if (totalHours === 0) return 'Start logging clinical hours early to build a strong application profile';
    if (experienceHours.clinical < 50) return 'Aim for at least 200 clinical hours before applying to medical school';
    if (experienceHours.shadowing < 40) return 'Shadow at least 2 specialties — admissions committees want breadth and depth';
    return 'Keep logging — consistency in clinical experience strengthens your narrative';
  };

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

      {/* Term Readiness */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Term Readiness</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Selected term: <span className="font-medium text-gray-700">{formatYearSemester(selectedYear, selectedSemester)}</span>
            </p>
          </div>
          {isTermActive && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center justify-center pt-1 pb-3">
          <div className="relative h-28 w-28">
            <PieChart width={112} height={112}>
              <Pie
                data={readinessData}
                dataKey="value"
                nameKey="name"
                innerRadius={38}
                outerRadius={52}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill="#2563eb" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{overallReadiness}%</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        {overallReadiness === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-3.5 mt-1">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={15} className="text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Ready to begin?</span>
            </div>
            <p className="text-xs text-gray-600 mb-3 ml-9">
              Add your courses and set goals to start tracking your progress
            </p>
            <button
              onClick={() => onNavigateToTrack('gpa')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              + Get Started
            </button>
          </div>
        )}
      </div>

      {/* GPA + MCAT row */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateToTrack('gpa')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-gray-500 mb-1">Current GPA</div>
          <div className="text-2xl font-bold text-gray-900">
            {courses.length > 0 ? currentGPA.toFixed(2) : 'Not Set'}
          </div>
          <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            {courses.length > 0 ? `${courses.length} courses` : (
              <>
                <span className="text-blue-500">+</span> Add courses
              </>
            )}
          </div>
        </button>

        <button
          onClick={() => onNavigateToTrack('mcat')}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-gray-500 mb-1">MCAT Goal</div>
          <div className="text-2xl font-bold text-gray-900">
            {examPlan.targetScore > 0 ? examPlan.targetScore : 'Not Set'}
          </div>
          <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            {examPlan.targetScore > 0 ? `Target: ${formatTargetDate(examPlan.targetDate)}` : (
              <>
                <span className="text-blue-500">⊙</span> Set goal
              </>
            )}
          </div>
        </button>
      </div>

      {/* Combined Total Experience + Application Readiness */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Total Experience</h3>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalHours}h</p>
            <p className="text-xs text-gray-400 mt-0.5">Clinical + Research + Service</p>
          </div>
          <button
            onClick={() => onNavigateToTrack('hours')}
            className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
            title="Log hours"
          >
            <BookOpen size={20} />
          </button>
        </div>

        {/* Application Readiness bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700">Application Readiness</span>
            <span className="text-sm font-bold text-gray-900">{applicationReadiness}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${applicationReadiness}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {completedPriorities.length} {completedPriorities.length === 1 ? 'priority' : 'priorities'} of cumulative progress completed
          </p>
        </div>

        {/* Pro tip */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
          <Info size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Pro tip:</span> {getProTip()}
          </p>
        </div>
      </div>

      {/* Experience Hours Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Experience Breakdown</h3>
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
          <Target className="text-blue-500" size={18} />
          <h3 className="font-semibold text-blue-900 text-sm">Semester Focus</h3>
        </div>
        <ul className="space-y-1.5">
          {semesterFocus.map((focus, idx) => (
            <li key={idx} className="flex items-start gap-2 text-blue-800">
              <span className="text-blue-400 font-bold mt-0.5 text-xs">•</span>
              <span className="flex-1 text-xs">{focus}</span>
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

function formatYearSemester(year: string, semester: string) {
  const yearLabel: Record<string, string> = {
    'undergrad-freshman': 'Freshman',
    'undergrad-sophomore': 'Sophomore',
    'undergrad-junior': 'Junior',
    'undergrad-senior': 'Senior',
    'gap-year': 'Gap Year',
  };

  const semesterLabel: Record<string, string> = {
    fall: 'Fall',
    spring: 'Spring',
    summer: 'Summer',
  };

  return `${yearLabel[year] || year}, ${semesterLabel[semester] || semester}`;
}
