import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { Plan } from './components/Plan';
import { Track } from './components/Track';
import { NextWin } from './components/NextWin';
import { Profile } from './components/Profile';

interface UserProfile {
  name: string;
  school: string;
  year: string;
  semester: string;
  planYear?: string;
  planSemester?: string;
  track: string;
}

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

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    school: '',
    year: 'undergrad-freshman',
    semester: 'fall',
    planYear: 'undergrad-freshman',
    planSemester: 'fall',
    track: 'both',
  });
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [completedPriorities, setCompletedPriorities] = useState<string[]>([]);
  const [experienceHours, setExperienceHours] = useState({
    clinical: 0,
    research: 0,
    volunteer: 0,
    shadowing: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [examPlan, setExamPlan] = useState<ExamPlan>({
    targetDate: '',
    targetScore: 0,
    currentPhase: '',
    weeklyHours: 0,
  });
  const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [trackInitialTab, setTrackInitialTab] = useState<'gpa' | 'mcat' | 'hours'>('gpa');

  useEffect(() => {
    const savedOnboarding = localStorage.getItem('premed-onboarding-complete');
    const savedProfile = localStorage.getItem('premed-profile');
    const savedMilestones = localStorage.getItem('premed-milestones');
    const savedPriorities = localStorage.getItem('premed-priorities');
    const savedHours = localStorage.getItem('premed-hours');
    const savedCourses = localStorage.getItem('premed-courses');
    const savedExamPlan = localStorage.getItem('premed-exam-plan');
    const savedPracticeTests = localStorage.getItem('premed-practice-tests');

    if (savedOnboarding === 'true' && savedProfile) {
      setHasCompletedOnboarding(true);
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedMilestones) setCompletedMilestones(JSON.parse(savedMilestones));
    if (savedPriorities) setCompletedPriorities(JSON.parse(savedPriorities));
    if (savedHours) setExperienceHours(JSON.parse(savedHours));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedExamPlan) setExamPlan(JSON.parse(savedExamPlan));
    if (savedPracticeTests) setPracticeTests(JSON.parse(savedPracticeTests));
  }, []);

  const handleOnboardingComplete = (data: UserProfile) => {
    const profile = {
      ...data,
      planYear: data.year,
      planSemester: data.semester,
    };
    setUserProfile(profile);
    setHasCompletedOnboarding(true);
    localStorage.setItem('premed-onboarding-complete', 'true');
    localStorage.setItem('premed-profile', JSON.stringify(profile));
  };

  const handleToggleMilestone = (id: string) => {
    const updated = completedMilestones.includes(id)
      ? completedMilestones.filter(m => m !== id)
      : [...completedMilestones, id];

    setCompletedMilestones(updated);
    localStorage.setItem('premed-milestones', JSON.stringify(updated));
  };

  const handleTogglePriority = (id: string) => {
    const updated = completedPriorities.includes(id)
      ? completedPriorities.filter(p => p !== id)
      : [...completedPriorities, id];

    setCompletedPriorities(updated);
    localStorage.setItem('premed-priorities', JSON.stringify(updated));
  };

  const handleUpdateHours = (type: string, value: number) => {
    const updated = { ...experienceHours, [type]: value };
    setExperienceHours(updated);
    localStorage.setItem('premed-hours', JSON.stringify(updated));
  };

  const handleUpdateCourses = (updatedCourses: Course[]) => {
    setCourses(updatedCourses);
    localStorage.setItem('premed-courses', JSON.stringify(updatedCourses));
  };

  const handleUpdateExamPlan = (plan: ExamPlan) => {
    setExamPlan(plan);
    localStorage.setItem('premed-exam-plan', JSON.stringify(plan));
  };

  const handleAddPracticeTest = (test: PracticeTest) => {
    const updated = [...practiceTests, test];
    setPracticeTests(updated);
    localStorage.setItem('premed-practice-tests', JSON.stringify(updated));
  };

  const handleDeletePracticeTest = (id: string) => {
    const updated = practiceTests.filter(t => t.id !== id);
    setPracticeTests(updated);
    localStorage.setItem('premed-practice-tests', JSON.stringify(updated));
  };

  const handleNavigateToTrack = (tab: 'gpa' | 'mcat' | 'hours') => {
    setTrackInitialTab(tab);
    setCurrentView('track');
  };

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <Dashboard
            name={userProfile.name}
            year={userProfile.planYear || userProfile.year}
            semester={userProfile.planSemester || userProfile.semester}
            completedMilestones={completedMilestones}
            completedPriorities={completedPriorities}
            experienceHours={experienceHours}
            courses={courses}
            examPlan={examPlan}
            onUpdateHours={handleUpdateHours}
            onViewChange={setCurrentView}
            onNavigateToTrack={handleNavigateToTrack}
          />
        )}

        {currentView === 'plan' && (
          <Plan
            currentYear={userProfile.planYear || userProfile.year}
            currentSemester={userProfile.planSemester || userProfile.semester}
            currentTrack={userProfile.track}
            completedPriorities={completedPriorities}
            onTogglePriority={handleTogglePriority}
          />
        )}

        {currentView === 'track' && (
          <Track
            courses={courses}
            examPlan={examPlan}
            practiceTests={practiceTests}
            experienceHours={experienceHours}
            onUpdateCourses={handleUpdateCourses}
            onUpdateExamPlan={handleUpdateExamPlan}
            onAddPracticeTest={handleAddPracticeTest}
            onDeletePracticeTest={handleDeletePracticeTest}
            onUpdateHours={handleUpdateHours}
            initialTab={trackInitialTab}
          />
        )}

        {currentView === 'focus' && (
          <NextWin
            currentYear={userProfile.planYear || userProfile.year}
            currentSemester={userProfile.planSemester || userProfile.semester}
            completedPriorities={completedPriorities}
            experienceHours={experienceHours}
            courses={courses}
            examPlan={examPlan}
          />
        )}

        {currentView === 'profile' && (
          <Profile userProfile={userProfile} />
        )}
      </div>

      <BottomNav activeView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}