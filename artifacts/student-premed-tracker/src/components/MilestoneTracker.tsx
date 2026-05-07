import { Check } from 'lucide-react';

interface Milestone {
  id: string;
  label: string;
  description: string;
}

interface MilestoneTrackerProps {
  completedMilestones: string[];
  onToggleMilestone: (id: string) => void;
}

const milestones: Milestone[] = [
  { id: 'gpa', label: 'Competitive GPA (3.5+)', description: 'Maintaining strong academic performance' },
  { id: 'prerequisites', label: 'Pre-med Prerequisites', description: 'Biology, Chemistry, Physics, Math courses' },
  { id: 'mcat-prep', label: 'MCAT Preparation', description: 'Studying for the MCAT exam' },
  { id: 'mcat-taken', label: 'MCAT Taken', description: 'Completed the MCAT exam' },
  { id: 'clinical-hours', label: 'Clinical Experience (100+ hrs)', description: 'Shadowing, volunteering, or working in healthcare' },
  { id: 'research', label: 'Research Experience', description: 'Lab work or clinical research' },
  { id: 'volunteering', label: 'Community Service', description: 'Non-clinical volunteer work' },
  { id: 'leadership', label: 'Leadership Roles', description: 'Club leadership, organizations, mentoring' },
  { id: 'lor', label: 'Letters of Recommendation', description: 'Building relationships with professors/mentors' },
  { id: 'personal-statement', label: 'Personal Statement', description: 'Crafting your story and motivation' },
];

export function MilestoneTracker({ completedMilestones, onToggleMilestone }: MilestoneTrackerProps) {
  const progress = (completedMilestones.length / milestones.length) * 100;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-gray-700 mb-2">Your Milestones</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {completedMilestones.length}/{milestones.length}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {milestones.map((milestone) => {
          const isCompleted = completedMilestones.includes(milestone.id);

          return (
            <button
              key={milestone.id}
              onClick={() => onToggleMilestone(milestone.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                isCompleted
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
              >
                {isCompleted && <Check size={16} className="text-white" />}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                  {milestone.label}
                </div>
                <div className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {milestone.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
