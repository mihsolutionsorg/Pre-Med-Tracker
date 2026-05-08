import { useState } from 'react';
import { GraduationCap, Brain, Clock } from 'lucide-react';
import { GPACalculator } from './GPACalculator';
import { MCATGuide } from './MCATGuide';
import { HoursTracker } from './HoursTracker';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  isBCPM: boolean;
}

interface PracticeTest {
  id: string;
  date: string;
  score: number;
  source: string;
}

interface ExamPlan {
  targetDate: string;
  targetScore: number;
  currentPhase: string;
  weeklyHours: number;
}

interface TrackProps {
  courses: Course[];
  examPlan: ExamPlan;
  practiceTests: PracticeTest[];
  experienceHours: {
    clinical: number;
    research: number;
    volunteer: number;
    shadowing: number;
  };
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateExamPlan: (plan: ExamPlan) => void;
  onAddPracticeTest: (test: PracticeTest) => void;
  onDeletePracticeTest: (id: string) => void;
  onUpdateHours: (type: string, value: number) => void;
}

interface TrackPropsExtended extends TrackProps {
  initialTab?: 'gpa' | 'mcat' | 'hours';
}

export function Track({
  courses,
  examPlan,
  practiceTests,
  experienceHours,
  onUpdateCourses,
  onUpdateExamPlan,
  onAddPracticeTest,
  onDeletePracticeTest,
  onUpdateHours,
  initialTab = 'gpa',
}: TrackPropsExtended) {
  const [activeTab, setActiveTab] = useState<'gpa' | 'mcat' | 'hours'>(initialTab);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('gpa')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'gpa'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <GraduationCap size={20} />
          <span>GPA</span>
        </button>
        <button
          onClick={() => setActiveTab('mcat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'mcat'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Brain size={20} />
          <span>MCAT</span>
        </button>
        <button
          onClick={() => setActiveTab('hours')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'hours'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Clock size={20} />
          <span>Hours</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'gpa' && (
        <div className="space-y-4">
          <GPACalculator courses={courses} onUpdateCourses={onUpdateCourses} />
        </div>
      )}

      {activeTab === 'mcat' && (
        <MCATGuide
          examPlan={examPlan}
          practiceTests={practiceTests}
          onUpdateExamPlan={onUpdateExamPlan}
          onAddPracticeTest={onAddPracticeTest}
          onDeletePracticeTest={onDeletePracticeTest}
        />
      )}

      {activeTab === 'hours' && (
        <HoursTracker
          experienceHours={experienceHours}
          onUpdateHours={onUpdateHours}
        />
      )}
    </div>
  );
}
