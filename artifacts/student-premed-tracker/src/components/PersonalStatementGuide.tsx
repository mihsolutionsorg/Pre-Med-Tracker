import { FileText, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';

export function PersonalStatementGuide() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={28} />
          <h2 className="text-2xl font-bold">Personal Statement Guide</h2>
        </div>
        <p className="text-purple-100 mt-2">
          Your personal statement is your story. Make it compelling, authentic, and memorable.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="text-green-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">The Formula That Works</h3>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">1. The Hook (Opening Paragraph)</h4>
            <p className="text-sm text-gray-700">
              Start with ONE specific moment, scene, or experience. Not your entire life story. Drop the reader into a vivid moment that captures why medicine matters to you.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">2. The Journey (Middle Paragraphs)</h4>
            <p className="text-sm text-gray-700">
              Connect 2-3 key experiences that built your understanding of medicine. Show growth and self-reflection. Don't just list activities—explain what you learned and how you changed.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">3. The Vision (Closing Paragraph)</h4>
            <p className="text-sm text-gray-700">
              Connect your past to your future. Show how your experiences prepared you specifically for medical school and the kind of physician you want to become.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-red-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">What NOT to Do</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm">
            <span className="text-red-600 font-bold mt-0.5">✗</span>
            <div>
              <strong className="text-gray-900">Don't say "I want to help people"</strong>
              <p className="text-gray-700">This is the weakest, most generic answer. Every applicant wants to help people. Show HOW and WHY medicine specifically.</p>
            </div>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-red-600 font-bold mt-0.5">✗</span>
            <div>
              <strong className="text-gray-900">Don't write chronologically</strong>
              <p className="text-gray-700">"I've always wanted to be a doctor since I was 5..." is boring. Start with impact, not timeline.</p>
            </div>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-red-600 font-bold mt-0.5">✗</span>
            <div>
              <strong className="text-gray-900">Don't list your resume</strong>
              <p className="text-gray-700">They already have your activities list. Use the statement to tell the story BEHIND the activities.</p>
            </div>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-red-600 font-bold mt-0.5">✗</span>
            <div>
              <strong className="text-gray-900">Don't try to sound like a doctor</strong>
              <p className="text-gray-700">Medical jargon doesn't impress anyone. Write like a human, not a textbook.</p>
            </div>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-red-600 font-bold mt-0.5">✗</span>
            <div>
              <strong className="text-gray-900">Don't submit your first draft</strong>
              <p className="text-gray-700">Plan for 10+ drafts. Early drafts are always too long, too generic, or focused on the wrong story.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Pro Tips</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Show, don't tell:</strong> Instead of "I learned compassion," describe the moment you felt it and what you did.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Be specific:</strong> Names, details, dialogue make your story memorable. Generic statements fade instantly.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Focus on ONE central story:</strong> Don't try to fit everything in. Pick your most transformative experience and go deep.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Address weaknesses briefly:</strong> If you have a gap year or GPA issue, acknowledge it in 1-2 sentences showing growth, then move on.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Read it aloud:</strong> If it doesn't sound like you talking, rewrite it. Authenticity beats polish.</span>
          </li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h3 className="font-semibold text-green-900 mb-3">Timeline for Personal Statement</h3>
        <div className="space-y-2 text-sm text-green-800">
          <div className="flex items-start gap-2">
            <span className="font-bold">March (Junior Year):</span>
            <span>Begin first draft. Brain dump your experiences and stories.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">April:</span>
            <span>Revise for structure. Pick your central story. Cut everything else.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">May:</span>
            <span>Polish language, flow, and transitions. Get feedback from advisors and peers.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">June 1:</span>
            <span>Submit with AMCAS on opening day. Final version ready.</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-2">Remember</h3>
        <p className="text-sm text-blue-800">
          Your personal statement won't get you in by itself, but a bad one can keep you out. Admissions committees read thousands of these. Make yours stand out by being genuine, specific, and focused on transformation—not achievement.
        </p>
      </div>
    </div>
  );
}
