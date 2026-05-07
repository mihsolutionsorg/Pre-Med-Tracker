import { Heart, Sparkles, Target } from 'lucide-react';

interface AffirmationCardProps {
  status: string;
  completedMilestones: string[];
}

const affirmations: Record<string, { message: string; nextSteps: string[] }> = {
  'high-school': {
    message: "You're taking the first steps toward an amazing journey! Starting early gives you a huge advantage. Focus on building strong study habits and exploring the medical field.",
    nextSteps: [
      "Excel in your science and math courses",
      "Start volunteering at a local hospital or clinic",
      "Join science or health-related clubs",
      "Build relationships with teachers for future recommendations"
    ]
  },
  'undergrad-freshman': {
    message: "Welcome to college! This is your foundation year. Remember, it's not a sprint—pace yourself and build strong habits that will serve you throughout your journey.",
    nextSteps: [
      "Ace your intro science courses (Bio, Chem)",
      "Get involved in campus pre-med organizations",
      "Start building study groups and support networks",
      "Explore different areas of healthcare through shadowing"
    ]
  },
  'undergrad-sophomore': {
    message: "You're building momentum! This is the time to deepen your experiences and start preparing for the MCAT. You're on track—keep pushing forward!",
    nextSteps: [
      "Continue excelling in pre-med prerequisites",
      "Gain consistent clinical experience (aim for 100+ hours)",
      "Start MCAT content review",
      "Seek out research opportunities if interested"
    ]
  },
  'undergrad-junior': {
    message: "This is your power year! You're in the heart of your journey. Stay focused, manage your time wisely, and remember—every successful doctor was once in your shoes.",
    nextSteps: [
      "Take the MCAT (spring or summer)",
      "Build strong relationships for letters of recommendation",
      "Accumulate meaningful clinical and volunteer hours",
      "Start drafting your personal statement"
    ]
  },
  'undergrad-senior': {
    message: "You're so close! The finish line is in sight. Whether you're applying now or planning a gap year, trust in the journey you've walked so far. You've got this!",
    nextSteps: [
      "Submit applications (AMCAS opens in May)",
      "Prepare for interviews",
      "Continue clinical experiences",
      "Plan for gap year activities if taking time off"
    ]
  },
  'gap-year': {
    message: "Gap years are golden opportunities! Use this time to strengthen your application, gain real-world experience, and grow as a person. You're not behind—you're preparing to soar!",
    nextSteps: [
      "Work in healthcare (scribe, EMT, clinical research)",
      "Retake MCAT if needed",
      "Continue volunteering and building experiences",
      "Perfect your application materials"
    ]
  },
};

export function AffirmationCard({ status, completedMilestones }: AffirmationCardProps) {
  const content = affirmations[status] || affirmations['undergrad-freshman'];
  const progress = completedMilestones.length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="fill-white" size={24} />
          <h2 className="font-semibold">Your Daily Affirmation</h2>
        </div>
        <p className="leading-relaxed">
          {content.message}
        </p>
        {progress >= 5 && (
          <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-lg p-3">
            <Sparkles size={20} />
            <span className="text-sm">
              You've completed {progress} milestones! You're making incredible progress!
            </span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-blue-600" size={22} />
          <h3 className="font-semibold text-blue-900">Your Next Steps</h3>
        </div>
        <ul className="space-y-2">
          {content.nextSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-2 text-blue-800">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
