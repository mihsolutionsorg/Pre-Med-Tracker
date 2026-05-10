import { useEffect, useState } from 'react';
import { BookOpen, Stethoscope, Users, FileText, Brain, Heart, Check } from 'lucide-react';
import { semesterPriorities } from '../data/semesterPriorities';

interface EnhancedRoadmapProps {
  currentYear: string;
  currentSemester: string;
  currentTrack: string;
  completedPriorities: string[];
  onTogglePriority: (id: string) => void;
  onUpdateCompletedPriorities: (ids: string[]) => void;
}

export function EnhancedRoadmap({
  currentYear,
  currentSemester,
  currentTrack: _currentTrack,
  completedPriorities,
  onTogglePriority,
  onUpdateCompletedPriorities: _onUpdateCompletedPriorities,
}: EnhancedRoadmapProps) {
  const storageKey = 'premed-roadmap-timeframe';
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.year) setSelectedYear(parsed.year);
      if (parsed.semester) setSelectedSemester(parsed.semester);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ year: selectedYear, semester: selectedSemester }));
    window.dispatchEvent(new CustomEvent('premed-roadmap-timeframe-change', {
      detail: { year: selectedYear, semester: selectedSemester }
    }));
  }, [selectedYear, selectedSemester]);

  const priorities = semesterPriorities[selectedYear]?.[selectedSemester] || [];
  const completedCount = priorities.filter(p => completedPriorities.includes(p.id)).length;

  const categories = Array.from(new Set(priorities.map(p => p.category)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic': return BookOpen;
      case 'Clinical': return Stethoscope;
      case 'MCAT': return Brain;
      case 'Research': return FileText;
      case 'Extracurricular': return Users;
      case 'Application':
      case 'Interview': return FileText;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'text-blue-600';
      case 'Clinical': return 'text-red-600';
      case 'MCAT': return 'text-orange-600';
      case 'Research': return 'text-purple-600';
      case 'Extracurricular': return 'text-green-600';
      case 'Application':
      case 'Interview': return 'text-indigo-600';
      default: return 'text-pink-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-1">Your Roadmap</h2>
        <p className="text-blue-100 text-sm">
          {selectedSemester.charAt(0).toUpperCase() + selectedSemester.slice(1)} Semester —{' '}
          {selectedYear === 'undergrad-freshman' && 'Freshman Year'}
          {selectedYear === 'undergrad-sophomore' && 'Sophomore Year'}
          {selectedYear === 'undergrad-junior' && 'Junior Year'}
          {selectedYear === 'undergrad-senior' && 'Senior Year'}
          {selectedYear === 'gap-year' && 'Gap Year'}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
          <span className="text-2xl font-bold">{completedCount}</span>
          <span className="text-blue-100 text-sm">of {priorities.length} tasks complete</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Select Timeframe</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="undergrad-freshman">Freshman</option>
              <option value="undergrad-sophomore">Sophomore</option>
              <option value="undergrad-junior">Junior</option>
              <option value="undergrad-senior">Senior</option>
              <option value="gap-year">Gap Year</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="fall">Fall</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
            </select>
          </div>
        </div>
      </div>

      {priorities.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">No priorities for this semester. Enjoy your break or focus on ongoing commitments!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryPriorities = priorities.filter(p => p.category === category);
            const Icon = getCategoryIcon(category);
            const color = getCategoryColor(category);
            const catCompleted = categoryPriorities.filter(p => completedPriorities.includes(p.id)).length;

            return (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={color} size={18} />
                  <h3 className="font-semibold text-gray-900 text-sm">{category}</h3>
                  <span className="ml-auto text-xs text-gray-400">{catCompleted} / {categoryPriorities.length}</span>
                </div>
                <div className="space-y-2">
                  {categoryPriorities.map((priority) => {
                    const isCompleted = completedPriorities.includes(priority.id);
                    return (
                      <button
                        key={priority.id}
                        onClick={() => onTogglePriority(priority.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm block leading-snug transition-all ${
                            isCompleted ? 'text-green-700 line-through opacity-60' : 'text-gray-800'
                          }`}>
                            {priority.text}
                          </span>
                          {priority.timeEstimate && (
                            <span className="text-xs text-gray-400 mt-0.5 inline-block">
                              ⏱ {priority.timeEstimate}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
