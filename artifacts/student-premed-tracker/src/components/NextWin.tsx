import { Target, TrendingUp, Zap, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  isBCPM: boolean;
}

interface ExperienceHours {
  clinical: number;
  research: number;
  volunteer: number;
  shadowing: number;
}

interface NextWinProps {
  currentYear: string;
  currentSemester: string;
  completedPriorities: string[];
  experienceHours: ExperienceHours;
  courses: Course[];
  examPlan: {
    targetDate: string;
    targetScore: number;
  };
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

export function NextWin({
  currentYear,
  currentSemester,
  completedPriorities,
  experienceHours,
  courses,
  examPlan,
}: NextWinProps) {
  const [showWatchItems, setShowWatchItems] = useState(false);

  // Calculate GPA
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
  const totalHours = experienceHours.clinical + experienceHours.research + experienceHours.volunteer + experienceHours.shadowing;

  // Identify what's going well
  const wins = [];
  if (currentGPA >= 3.65) wins.push(`GPA: ${currentGPA.toFixed(2)} (above target!)`);
  if (experienceHours.shadowing >= 100) wins.push(`Shadowing: ${experienceHours.shadowing}h (competitive tier)`);
  if (experienceHours.clinical >= 200) wins.push(`Clinical: ${experienceHours.clinical}h (strong!)`);
  if (experienceHours.research >= 100) wins.push(`Research: ${experienceHours.research}h (great!)`);
  if (totalHours >= 400) wins.push(`Total Experience: ${totalHours}h (exceptional!)`);

  // Identify next power move (most critical action)
  const getPowerMove = () => {
    // MCAT timing
    if (currentYear === 'undergrad-junior' && currentSemester === 'fall' && !examPlan.targetDate) {
      return {
        title: 'Register for MCAT by November 15',
        reason: 'Dates fill up fast. Missing your target window delays applications by a full year.',
        urgency: 'high'
      };
    }

    if (currentYear === 'undergrad-junior' && currentSemester === 'spring' && !examPlan.targetScore) {
      return {
        title: 'Set your MCAT target score this week',
        reason: 'Having a clear goal shapes your entire study strategy.',
        urgency: 'high'
      };
    }

    // Clinical hours
    if (currentYear === 'undergrad-sophomore' && experienceHours.clinical < 50) {
      return {
        title: 'Add 20 clinical hours this month',
        reason: 'You need 100-200 total by junior spring. Starting now prevents stress later.',
        urgency: 'medium'
      };
    }

    if (currentYear === 'undergrad-junior' && experienceHours.clinical < 150) {
      return {
        title: 'Boost clinical hours to 200 by May',
        reason: 'Most competitive applicants hit 200+ clinical hours by junior spring.',
        urgency: 'high'
      };
    }

    // GPA
    if (currentGPA > 0 && currentGPA < 3.5) {
      return {
        title: 'Schedule advisor meeting this week',
        reason: 'Your GPA needs a recovery plan. Early intervention is critical.',
        urgency: 'high'
      };
    }

    // Shadowing
    if (currentYear === 'undergrad-freshman' && experienceHours.shadowing === 0) {
      return {
        title: 'Send 10 cold emails for shadowing',
        reason: 'Starting freshman year gives you a huge advantage. Most students wait too long.',
        urgency: 'medium'
      };
    }

    if (experienceHours.shadowing < 100) {
      return {
        title: 'Reach 100 shadowing hours',
        reason: 'This is the baseline for competitive MD applications.',
        urgency: 'medium'
      };
    }

    // Default
    return {
      title: 'Complete 3 roadmap priorities this week',
      reason: 'Consistent progress beats last-minute cramming every time.',
      urgency: 'medium'
    };
  };

  const powerMove = getPowerMove();

  // Identify quick wins
  const quickWins = [];
  if (experienceHours.clinical > 0 && experienceHours.clinical < 200) {
    quickWins.push(`Add 10 clinical hours this month (currently at ${experienceHours.clinical}h)`);
  }
  if (experienceHours.research === 0 && currentYear !== 'undergrad-freshman') {
    quickWins.push('Join a research lab (even unpaid)');
  }
  if (currentYear === 'undergrad-sophomore' && completedPriorities.length < 5) {
    quickWins.push('Complete 2 roadmap priorities this week');
  }
  if (courses.length === 0) {
    quickWins.push('Add your courses to track GPA');
  }

  // Items to watch
  const watchItems = [];
  if (currentGPA > 0 && currentGPA < 3.65) {
    watchItems.push({ text: 'GPA below competitive range. Focus on earning A\'s in upcoming courses.', severity: 'medium' });
  }
  if (experienceHours.volunteer < 50 && currentYear !== 'undergrad-freshman') {
    watchItems.push({ text: 'Non-clinical volunteering under 50 hours. Add community service.', severity: 'low' });
  }
  if (currentYear === 'undergrad-junior' && experienceHours.shadowing < 100) {
    watchItems.push({ text: 'Shadowing hours below 100. Aim for 150+ by junior spring.', severity: 'medium' });
  }

  return (
    <div className="space-y-6">
      {/* Power Move */}
      <div className={`rounded-xl shadow-md overflow-hidden ${
        powerMove.urgency === 'high' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
      }`}>
        <div className="p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Target size={28} className="flex-shrink-0" />
            <h2 className="text-2xl font-bold">This Week's Power Move</h2>
          </div>
          <h3 className="text-xl font-bold mb-2">{powerMove.title}</h3>
          <p className="text-white text-opacity-90">
            <strong>Why it matters:</strong> {powerMove.reason}
          </p>
        </div>
      </div>

      {/* You're Crushing */}
      {wins.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={28} />
            <h3 className="text-xl font-bold text-gray-900">You're Crushing It! 🎉</h3>
          </div>
          <div className="space-y-2">
            {wins.map((win, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-green-900 font-medium">{win}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-500" size={28} />
            <h3 className="text-xl font-bold text-gray-900">Quick Wins</h3>
          </div>
          <p className="text-gray-600 mb-3 text-sm">Pick one to tackle this week:</p>
          <div className="space-y-2">
            {quickWins.slice(0, 3).map((win, idx) => (
              <button
                key={idx}
                className="w-full flex items-start gap-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all text-left"
              >
                <div className="w-5 h-5 rounded border-2 border-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-blue-900 font-medium">{win}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Watch These */}
      {watchItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowWatchItems(!showWatchItems)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="text-orange-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">
                Watch These ({watchItems.length})
              </h3>
            </div>
            {showWatchItems ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {showWatchItems && (
            <div className="px-6 pb-6">
              <div className="space-y-2">
                {watchItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                      item.severity === 'medium'
                        ? 'bg-orange-50 border-orange-400'
                        : 'bg-yellow-50 border-yellow-400'
                    }`}
                  >
                    <span className={`font-bold mt-0.5 ${
                      item.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
                    }`}>
                      !
                    </span>
                    <span className={`text-sm ${
                      item.severity === 'medium' ? 'text-orange-900' : 'text-yellow-900'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Encouragement when everything is good */}
      {wins.length >= 3 && watchItems.length === 0 && (
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">You're In Great Shape! 🌟</h3>
          <p className="text-green-100">
            Keep up this momentum. You're building exactly the profile med schools want to see.
          </p>
        </div>
      )}
    </div>
  );
}
