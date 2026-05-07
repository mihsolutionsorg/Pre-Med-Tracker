import { AlertTriangle } from 'lucide-react';

interface RedFlagsAlertProps {
  currentStatus: string;
  completedMilestones: string[];
}

interface RedFlag {
  condition: (status: string, milestones: string[]) => boolean;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

const redFlagChecks: RedFlag[] = [
  // GPA Related
  {
    condition: (status) => ['undergrad-freshman', 'undergrad-sophomore', 'undergrad-junior'].includes(status),
    message: 'If your GPA is below 3.5, schedule a meeting with your pre-med advisor immediately. A strong recovery plan is critical.',
    severity: 'high'
  },

  // Office Hours
  {
    condition: (status, milestones) =>
      ['undergrad-freshman', 'undergrad-sophomore'].includes(status) && !milestones.includes('lor'),
    message: 'You haven\'t started building relationships with professors for letters of recommendation. Visit office hours regularly and introduce yourself.',
    severity: 'high'
  },

  // Clinical Hours - Freshman
  {
    condition: (status, milestones) =>
      status === 'undergrad-freshman' && !milestones.includes('clinical-hours'),
    message: 'Start shadowing early! Research 10 physicians in your area and send cold emails. Starting freshman year gives you a huge advantage.',
    severity: 'medium'
  },

  // Clinical Hours - Sophomore Critical
  {
    condition: (status, milestones) =>
      status === 'undergrad-sophomore' && !milestones.includes('clinical-hours'),
    message: 'URGENT: You need 100-200 total clinical hours. You should have 30+ hours by end of sophomore year. Increase to 4-6 hours per week immediately.',
    severity: 'high'
  },

  // Clinical Hours - Junior Critical
  {
    condition: (status, milestones) =>
      status === 'undergrad-junior' && !milestones.includes('clinical-hours'),
    message: 'CRITICAL: You need 200+ clinical hours by May of junior year for competitive applications. Consider a scribe position or EMT certification.',
    severity: 'high'
  },

  // MCAT - Not Taken
  {
    condition: (status, milestones) =>
      status === 'undergrad-junior' && !milestones.includes('mcat-taken'),
    message: 'Register for the MCAT by November for a January-April test date. Popular dates fill months in advance. Missing your target delays applications by a full year.',
    severity: 'high'
  },

  // MCAT - Not Prepared
  {
    condition: (status, milestones) =>
      status === 'undergrad-junior' && !milestones.includes('mcat-prep') && !milestones.includes('mcat-taken'),
    message: 'Start MCAT prep NOW. Take a diagnostic test to determine if you need 90 days or 6 months. Don\'t condense 6 months into 3.',
    severity: 'high'
  },

  // Prerequisites
  {
    condition: (status, milestones) =>
      ['undergrad-sophomore', 'undergrad-junior'].includes(status) && !milestones.includes('prerequisites'),
    message: 'Complete all prerequisites: Bio I & II, Chem I & II, Orgo I & II, Physics I & II, Biochemistry, English, Psych, Sociology. These are non-negotiable.',
    severity: 'high'
  },

  // Organic Chemistry Warning
  {
    condition: (status) => status === 'undergrad-sophomore',
    message: 'If you received a C or lower in Organic Chemistry, retake it next semester. A single C is not detrimental if you earn an A on retake.',
    severity: 'medium'
  },

  // Research for MD Programs
  {
    condition: (status, milestones) =>
      ['undergrad-sophomore', 'undergrad-junior'].includes(status) && !milestones.includes('research'),
    message: 'Most MD programs strongly prefer research experience. Join or start a research lab, even as an unpaid assistant. Consistent engagement matters more than publications.',
    severity: 'medium'
  },

  // Volunteering
  {
    condition: (status, milestones) =>
      ['undergrad-sophomore', 'undergrad-junior'].includes(status) && !milestones.includes('volunteering'),
    message: 'Achieve 50+ hours of non-clinical community service. Admissions committees want to see civic-mindedness and service beyond medicine.',
    severity: 'medium'
  },

  // Leadership
  {
    condition: (status, milestones) =>
      ['undergrad-sophomore', 'undergrad-junior'].includes(status) && !milestones.includes('leadership'),
    message: 'Take on a formal leadership role in at least one organization. AMCAS requires a specific title; "active member" doesn\'t qualify.',
    severity: 'medium'
  },

  // Personal Statement
  {
    condition: (status, milestones) =>
      status === 'undergrad-junior' && !milestones.includes('personal-statement'),
    message: 'Begin drafting your personal statement in March of junior year. Plan for 10+ drafts. Early drafts are too chronological or generic.',
    severity: 'high'
  },

  // Application Timing - Senior Year
  {
    condition: (status) => status === 'undergrad-senior',
    message: 'If you\'re planning to submit AMCAS after August 1, restructure your timeline NOW. Applying in August vs June costs you 30-40% of interview opportunities.',
    severity: 'high'
  },

  // No Interviews by November
  {
    condition: (status) => status === 'applying',
    message: 'If you haven\'t received interview invitations by November 1, there may be a problem with your application. Consider professional review and apply to DO schools immediately.',
    severity: 'high'
  },

  // Gap Year Strategy
  {
    condition: (status, milestones) =>
      status === 'gap-year' && !milestones.includes('clinical-hours'),
    message: 'Work full-time in healthcare during gap year: medical scribe, EMT, clinical research. Aim for 1,000+ clinical hours to dramatically strengthen your application.',
    severity: 'high'
  }
];

export function RedFlagsAlert({ currentStatus, completedMilestones }: RedFlagsAlertProps) {
  const activeRedFlags = redFlagChecks.filter(flag =>
    flag.condition(currentStatus, completedMilestones)
  );

  if (activeRedFlags.length === 0) {
    return null;
  }

  const highPriorityFlags = activeRedFlags.filter(f => f.severity === 'high');
  const mediumPriorityFlags = activeRedFlags.filter(f => f.severity === 'medium');
  const lowPriorityFlags = activeRedFlags.filter(f => f.severity === 'low');

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Action Items & Red Flags</h3>
      </div>

      {highPriorityFlags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-red-700 mb-2 uppercase tracking-wide">High Priority</h4>
          <div className="space-y-2">
            {highPriorityFlags.map((flag, idx) => (
              <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5 flex-shrink-0">⚠</span>
                  <p className="text-sm text-red-900">{flag.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediumPriorityFlags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-orange-700 mb-2 uppercase tracking-wide">Medium Priority</h4>
          <div className="space-y-2">
            {mediumPriorityFlags.map((flag, idx) => (
              <div key={idx} className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold mt-0.5 flex-shrink-0">!</span>
                  <p className="text-sm text-orange-900">{flag.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowPriorityFlags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-yellow-700 mb-2 uppercase tracking-wide">Watch These</h4>
          <div className="space-y-2">
            {lowPriorityFlags.map((flag, idx) => (
              <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-0.5 flex-shrink-0">•</span>
                  <p className="text-sm text-yellow-900">{flag.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeRedFlags.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">You're on track! Keep up the great work! 🎉</p>
        </div>
      )}
    </div>
  );
}
