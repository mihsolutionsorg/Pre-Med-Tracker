import { useState } from 'react';
import { Map, CheckSquare } from 'lucide-react';
import { EnhancedRoadmap } from './EnhancedRoadmap';
import { SelfAssessment } from './SelfAssessment';

interface PlanProps {
  currentYear: string;
  currentSemester: string;
  currentTrack: string;
  completedPriorities: string[];
  onTogglePriority: (id: string) => void;
  onUpdateCompletedPriorities: (ids: string[]) => void;
}

export function Plan({
  currentYear,
  currentSemester,
  currentTrack,
  completedPriorities,
  onTogglePriority,
  onUpdateCompletedPriorities,
}: PlanProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'check-in'>('roadmap');

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'roadmap'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Map size={20} />
          <span>Roadmap</span>
        </button>
        <button
          onClick={() => setActiveTab('check-in')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'check-in'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CheckSquare size={20} />
          <span>Check-in</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'roadmap' && (
        <EnhancedRoadmap
          currentYear={currentYear}
          currentSemester={currentSemester}
          currentTrack={currentTrack}
          completedPriorities={completedPriorities}
          onTogglePriority={onTogglePriority}
        />
      )}

      {activeTab === 'check-in' && (
        <SelfAssessment
          currentYear={currentYear}
          currentSemester={currentSemester}
          completedPriorities={completedPriorities}
          onUpdateCompletedPriorities={onUpdateCompletedPriorities}
        />
      )}
    </div>
  );
}
