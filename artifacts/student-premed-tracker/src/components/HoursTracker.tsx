import { useState } from 'react';
import { Clock, TrendingUp, ChevronDown, ChevronUp, Plus, Lightbulb, Target } from 'lucide-react';

interface HoursTrackerProps {
  experienceHours: {
    clinical: number;
    research: number;
    volunteer: number;
    shadowing: number;
  };
  onUpdateHours: (type: string, value: number) => void;
}

export function HoursTracker({ experienceHours, onUpdateHours }: HoursTrackerProps) {
  const [showProTips, setShowProTips] = useState(false);
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});

  const totalHours = experienceHours.clinical + experienceHours.research + experienceHours.volunteer + experienceHours.shadowing;

  const toggleExamples = (key: string) => {
    setShowExamples(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addHours = (category: string, amount: number) => {
    const currentHours = experienceHours[category as keyof typeof experienceHours];
    onUpdateHours(category, currentHours + amount);
  };

  const hourCategories = [
    {
      key: 'clinical',
      label: 'Clinical Experience',
      description: 'Scribing, EMT, hospital volunteering, patient contact',
      color: 'bg-red-500',
      target: 200,
      competitive: 300,
      exceptional: 500,
      examples: [
        'Medical Scribe (10-40 hrs/week)',
        'EMT/Paramedic',
        'Hospital Volunteer (patient contact)',
        'Nursing Home Volunteer',
        'Medical Assistant',
        'Patient Care Technician'
      ]
    },
    {
      key: 'shadowing',
      label: 'Physician Shadowing',
      description: 'Following physicians in various specialties',
      color: 'bg-purple-500',
      target: 100,
      competitive: 150,
      exceptional: 200,
      examples: [
        'Primary Care (Family Med, Internal Med)',
        'Surgery (General, Ortho, Neuro)',
        'Emergency Medicine',
        'Pediatrics',
        'OB/GYN',
        'Psychiatry',
        'Multiple specialties recommended'
      ]
    },
    {
      key: 'research',
      label: 'Research Experience',
      description: 'Lab work, clinical research, publications',
      color: 'bg-blue-500',
      target: 100,
      competitive: 200,
      exceptional: 500,
      examples: [
        'Lab Research (wet/dry lab)',
        'Clinical Research Coordinator',
        'Data Analysis',
        'Research Assistant',
        'Publications/Posters',
        'Conference Presentations'
      ]
    },
    {
      key: 'volunteer',
      label: 'Non-Clinical Volunteering',
      description: 'Community service unrelated to medicine',
      color: 'bg-green-500',
      target: 100,
      competitive: 150,
      exceptional: 200,
      examples: [
        'Food Bank/Soup Kitchen',
        'Tutoring/Mentoring',
        'Habitat for Humanity',
        'Crisis Hotline',
        'Community Outreach',
        'Religious/Cultural Organizations'
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={28} />
          <h2 className="text-2xl font-bold">Experience Hours Tracker</h2>
        </div>
        <div className="mt-4">
          <div className="text-4xl font-bold">{totalHours}</div>
          <div className="text-blue-100">Total experience hours logged</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Hour Benchmarks</h3>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span><strong>Target:</strong> Minimum competitive for most MD programs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span><strong>Competitive:</strong> Strong for mid-tier MD programs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span><strong>Exceptional:</strong> Competitive for top-tier programs</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {hourCategories.map((category) => {
          const hours = experienceHours[category.key as keyof typeof experienceHours];
          const targetPercentage = Math.min(100, (hours / category.target) * 100);

          let status = 'Below Target';
          let statusColor = 'text-gray-600';
          let nextMilestone = category.target;
          let nextMilestoneName = 'Target';

          if (hours >= category.exceptional) {
            status = 'Exceptional';
            statusColor = 'text-blue-600';
            nextMilestone = 0;
            nextMilestoneName = '';
          } else if (hours >= category.competitive) {
            status = 'Competitive';
            statusColor = 'text-green-600';
            nextMilestone = category.exceptional;
            nextMilestoneName = 'Exceptional';
          } else if (hours >= category.target) {
            status = 'Target Met';
            statusColor = 'text-yellow-600';
            nextMilestone = category.competitive;
            nextMilestoneName = 'Competitive';
          }

          const hoursToNext = nextMilestone > 0 ? nextMilestone - hours : 0;

          // Milestone badges
          const getMilestoneBadges = () => {
            const badges = [];
            if (hours >= 50) badges.push({ text: '50+ hours', emoji: '🌟' });
            if (hours >= 100) badges.push({ text: '100 club', emoji: '💯' });
            if (hours >= 200) badges.push({ text: '200 club', emoji: '🏆' });
            if (hours >= 500) badges.push({ text: 'Elite 500', emoji: '👑' });
            return badges;
          };

          const milestoneBadges = getMilestoneBadges();
          const justHitMilestone = hours === category.target || hours === category.competitive || hours === category.exceptional;

          return (
            <div key={category.key} className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
              </div>

              {/* Milestone Badges */}
              {milestoneBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {milestoneBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-full text-xs font-semibold text-yellow-800"
                    >
                      {badge.emoji} {badge.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Just Hit Milestone Celebration */}
              {justHitMilestone && (
                <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg animate-pulse">
                  <p className="text-sm font-bold text-green-900 text-center">
                    🎉 Milestone achieved! {status} tier reached!
                  </p>
                </div>
              )}

              {/* Hour Input and Quick Add Buttons */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => onUpdateHours(category.key, parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold text-center"
                  min="0"
                />
                <span className="text-sm text-gray-600">hours</span>
                <div className="flex gap-1 ml-auto">
                  <button
                    onClick={() => addHours(category.key, 5)}
                    className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => addHours(category.key, 10)}
                    className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => addHours(category.key, 25)}
                    className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium"
                  >
                    +25
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-3">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${category.color} h-full transition-all duration-500`}
                    style={{ width: `${targetPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0</span>
                  <span className="text-yellow-600 font-medium">Target: {category.target}h</span>
                  <span className="text-green-600 font-medium">Competitive: {category.competitive}h</span>
                  <span className="text-blue-600 font-medium">Exceptional: {category.exceptional}h</span>
                </div>
              </div>

              {/* Next Milestone */}
              {hoursToNext > 0 && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                  <Target size={16} className="text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>{hoursToNext} hours</strong> to reach {nextMilestoneName} ({nextMilestone}h)
                  </span>
                </div>
              )}

              {/* Examples (Collapsible) */}
              <button
                onClick={() => toggleExamples(category.key)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Lightbulb size={16} />
                <span>What counts as {category.label}?</span>
                {showExamples[category.key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showExamples[category.key] && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {category.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Collapsible Pro Tips */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setShowProTips(!showProTips)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Pro Tips</h3>
          </div>
          {showProTips ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {showProTips && (
          <div className="px-5 pb-5">
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span><strong>Start early:</strong> Begin clinical experience freshman/sophomore year to accumulate hours without stress.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span><strong>Quality over quantity:</strong> 100 hours of meaningful engagement beats 500 hours of passive observation.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span><strong>Document everything:</strong> Keep a log with dates, activities, and reflection notes for your personal statement.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-600 font-bold mt-0.5">•</span>
                <span><strong>Scribing is gold:</strong> 400-600 hours in one summer + paid position. One of the best clinical experiences.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <span className="text-red-600 font-bold mt-0.5">•</span>
                <span><strong>Diversify shadowing:</strong> Shadow at least 2-3 different specialties to show genuine curiosity.</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
