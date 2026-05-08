import { Heart, TrendingUp, Clock, Target } from 'lucide-react';

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

// Import semester priorities structure from EnhancedRoadmap
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

    return parsed.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
  };

  // Calculate GPA from courses
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

  const getSemesterReadiness = (yearKey: string, semesterKey: string) => {
    const priorities = semesterPriorities[yearKey]?.[semesterKey] || [];
    if (priorities.length === 0) return 0;

    const completed = priorities.filter((priority) => completedPriorities.includes(priority.id)).length;
    return Math.round((completed / priorities.length) * 100);
  };

  // Calculate cumulative readiness from ALL semester priorities up to current position
  const calculateApplicationReadiness = () => {
    const yearOrder = ['undergrad-freshman', 'undergrad-sophomore', 'undergrad-junior', 'undergrad-senior', 'gap-year'];
    const semesterOrder = ['fall', 'spring', 'summer'];

    const roadmapIds: string[] = [];

    for (const yearKey of yearOrder) {
      const yearData = semesterPriorities[yearKey];
      if (!yearData) continue;

      for (const semesterKey of semesterOrder) {
        const priorities = yearData[semesterKey] || [];
        roadmapIds.push(...priorities.map((priority) => priority.id));
      }
    }

    if (roadmapIds.length === 0) return 0;

    const completedCount = roadmapIds.filter((id) => completedPriorities.includes(id)).length;
    return Math.round((completedCount / roadmapIds.length) * 100);
  };

  const overallReadiness = getSemesterReadiness(year, semester);
  const applicationReadiness = calculateApplicationReadiness();
  const semesterFocus = getSemesterFocusList(year, semester);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="fill-white" size={24} />
          <h2 className="text-2xl font-bold">Welcome, {name}!</h2>
        </div>
        <p className="text-blue-100">
          Every med student started right here. Let's take the first step together.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Overall Readiness</h3>
          <span className="text-2xl font-bold text-blue-600">{overallReadiness}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${overallReadiness}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Current semester only
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigateToTrack('gpa')}
          className="bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div className="text-sm text-gray-600 mb-1">Current GPA</div>
          <div className="text-2xl font-bold text-gray-900">
            {courses.length > 0 ? currentGPA.toFixed(2) : 'Not Set'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {courses.length > 0 ? `${courses.length} courses` : 'Tap to add courses'}
          </div>
        </button>

        <button
          onClick={() => onNavigateToTrack('mcat')}
          className="bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div className="text-sm text-gray-600 mb-1">MCAT Goal</div>
          <div className="text-2xl font-bold text-gray-900">
            {examPlan.targetScore > 0 ? examPlan.targetScore : 'Not Set'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {examPlan.targetScore > 0 ? `Target: ${formatTargetDate(examPlan.targetDate)}` : 'Tap to set goal'}
          </div>
        </button>

        <button
          onClick={() => onNavigateToTrack('hours')}
          className="bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div className="text-sm text-gray-600 mb-1">Total Experience</div>
          <div className="text-2xl font-bold text-gray-900">
            {experienceHours.clinical + experienceHours.research + experienceHours.volunteer + experienceHours.shadowing}h
          </div>
          <div className="text-xs text-gray-500 mt-1">Clinical + Research + Service</div>
        </button>

        <button
          onClick={() => onViewChange('plan')}
          className="bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-shadow"
        >
          <div className="text-sm text-gray-600 mb-1">Application Readiness</div>
          <div className="text-2xl font-bold text-gray-900">{applicationReadiness}%</div>
          <div className="text-xs text-gray-500 mt-1">4-year cumulative progress</div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Experience Hours Breakdown</h3>
        <div className="space-y-4">
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => onUpdateHours(item.key, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                      min="0"
                    />
                    <span className="text-sm text-gray-600">/ {item.target}h</span>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${item.color} h-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-blue-600" size={22} />
          <h3 className="font-semibold text-blue-900">Semester Focus</h3>
        </div>
        <ul className="space-y-2">
          {semesterFocus.map((focus, idx) => (
            <li key={idx} className="flex items-start gap-2 text-blue-800">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className="flex-1 text-sm">{focus}</span>
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
