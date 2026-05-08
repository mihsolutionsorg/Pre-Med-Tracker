import { Brain, TrendingUp, AlertTriangle, BookOpen, Calendar, RotateCcw } from 'lucide-react';

export function MCATGPAGuide() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">GPA & MCAT Reference Guide</h2>
        <p className="text-purple-100">Essential benchmarks and strategies for competitive applications</p>
      </div>

      {/* GPA Benchmarks */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">GPA Benchmarks by School Tier</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 font-semibold text-gray-900 w-[30%]">School Tier</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-900 w-[22%]">Avg Cumulative GPA</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-900 w-[22%]">Avg Science GPA</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-900 w-[26%]">Your Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 font-medium text-gray-800">Top 20 MD</td>
                <td className="py-3 px-3 text-gray-700">3.85-3.95</td>
                <td className="py-3 px-3 text-gray-700">3.80-3.92</td>
                <td className="py-3 px-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">3.75</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 font-medium text-gray-800">Top 21-50 MD</td>
                <td className="py-3 px-3 text-gray-700">3.75-3.85</td>
                <td className="py-3 px-3 text-gray-700">3.70-3.82</td>
                <td className="py-3 px-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">3.65</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 font-medium text-gray-800">Mid-Tier MD (51-100)</td>
                <td className="py-3 px-3 text-gray-700">3.65-3.75</td>
                <td className="py-3 px-3 text-gray-700">3.60-3.72</td>
                <td className="py-3 px-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">3.5</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 font-medium text-gray-800">Lower Tier MD</td>
                <td className="py-3 px-3 text-gray-700">3.50-3.65</td>
                <td className="py-3 px-3 text-gray-700">3.45-3.60</td>
                <td className="py-3 px-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">3.3</span></td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-gray-800">DO Programs</td>
                <td className="py-3 px-3 text-gray-700">3.54-3.65</td>
                <td className="py-3 px-3 text-gray-700">3.48-3.58</td>
                <td className="py-3 px-3"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">3.2</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Science GPA vs. Cumulative GPA</h4>
          <p className="text-sm text-blue-800 mb-2">
            AMCAS calculates two distinct GPAs: cumulative GPA (all courses) and science GPA (Biology, Chemistry, Physics, Math only).
          </p>
          <p className="text-sm text-blue-800">
            <strong>Goal:</strong> Keep both GPAs within 0.1 to 0.2 points of each other. A large gap (e.g., 3.8 cumulative but 3.3 science) raises red flags about your ability to handle science coursework.
          </p>
        </div>
      </div>

      {/* GPA Recovery */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-orange-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">GPA Recovery Strategy</h3>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">After Freshman Year (3.3-3.5 GPA)</h4>
            <p className="text-sm text-gray-700">
              <strong>Highly fixable.</strong> You have three years to recover. Add strategic summer courses and work with your advisor for a semester-by-semester recovery plan. Aim for 0.05-0.10 GPA increase per semester.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">After Sophomore Year (3.2-3.4 GPA)</h4>
            <p className="text-sm text-gray-700">
              <strong>Gap year becomes serious consideration.</strong> Research formal post-baccalaureate programs or Special Master's Programs (SMP). An SMP involves graduate-level coursework and is the most effective tool for GPA recovery.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">After Junior Year (Below 3.5 GPA)</h4>
            <p className="text-sm text-gray-700">
              <strong>Do not apply this cycle</strong> unless your MCAT is exceptional (518+) and you have extraordinary circumstances. Applying with weak GPA costs $3,000-$5,000 and results in rejection without interviews. Take a purposeful gap year.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">The Grade Trend Argument</h4>
          <p className="text-sm text-green-800">
            A student progressing from 3.2 → 3.5 → 3.7 → 3.8 is viewed <strong>more favorably</strong> than a consistent 3.6. This upward trajectory shows growth and self-correction. Address weak starts briefly in secondary "adversity" essays—take ownership and highlight the positive outcome.
          </p>
        </div>
      </div>

      {/* MCAT Score Benchmarks */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">MCAT Score Benchmarks</h3>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 font-semibold text-gray-900">School Tier</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Target Score</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900">Do Not Apply Below</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2 font-medium text-gray-800">Top 20 MD</td>
                <td className="py-3 px-2 text-gray-700">517-528</td>
                <td className="py-3 px-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded font-medium">515</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2 font-medium text-gray-800">Top 21-50 MD</td>
                <td className="py-3 px-2 text-gray-700">514-518</td>
                <td className="py-3 px-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded font-medium">511</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2 font-medium text-gray-800">Mid-Tier MD</td>
                <td className="py-3 px-2 text-gray-700">510-514</td>
                <td className="py-3 px-2"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">508</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-2 font-medium text-gray-800">Lower-Tier MD</td>
                <td className="py-3 px-2 text-gray-700">506-510</td>
                <td className="py-3 px-2"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">504</span></td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-medium text-gray-800">DO Programs</td>
                <td className="py-3 px-2 text-gray-700">504-510</td>
                <td className="py-3 px-2"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">500</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimal Test Windows */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Optimal Test Windows</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="font-bold text-red-700">Freshman:</span>
            <span className="text-sm text-red-800">Do not test. You haven't taken prerequisite courses yet.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="font-bold text-yellow-700">Sophomore Summer:</span>
            <span className="text-sm text-yellow-800">Diagnostic only. Take a cold baseline with no prep to gauge study timeline needed.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="font-bold text-green-700">Junior Year:</span>
            <span className="text-sm text-green-800"><strong>January through April.</strong> This is your primary window.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-bold text-blue-700">Senior Year:</span>
            <span className="text-sm text-blue-800">January through April. Fall retakes arrive too late for this cycle.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <span className="font-bold text-purple-700">Gap Year:</span>
            <span className="text-sm text-purple-800">January through April. Use the full gap to maximize your prep.</span>
          </div>
        </div>
      </div>

      {/* How Many Times */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="text-orange-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">How Many Times Is Too Many?</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold text-sm">1x</span>
            <div>
              <p className="font-medium text-gray-900">Ideal</p>
              <p className="text-sm text-gray-700">A strong score on first attempt indicates a clean application.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold text-sm">2x</span>
            <div>
              <p className="font-medium text-gray-900">Common and Acceptable</p>
              <p className="text-sm text-gray-700">An improvement is viewed positively.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-semibold text-sm">3x</span>
            <div>
              <p className="font-medium text-gray-900">Scrutinized</p>
              <p className="text-sm text-gray-700">Aim for a 4+ point improvement. Final score must be competitive.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-semibold text-sm">4+</span>
            <div>
              <p className="font-medium text-gray-900">Major Red Flag</p>
              <p className="text-sm text-gray-700">Do not retake without comprehensive overhaul of preparation and advisor consultation.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-900 font-semibold">
            <strong>The Rule:</strong> Do not retake unless you can improve by 3-4+ points. Retaking 511 → 512 is not worth the risk.
          </p>
        </div>
      </div>

      {/* Void vs Cancel */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Void vs. Cancel - Know the Difference</h3>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">VOID (Select on test day before leaving)</h4>
            <p className="text-sm text-gray-700 mb-2">
              Your score will <strong>not be calculated</strong> and there will be <strong>no record</strong> of your attempt.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Use when:</strong> Illness, panic attack, or complete mental breakdown on test day.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-1">CANCEL (Select within 72 hours after testing)</h4>
            <p className="text-sm text-gray-700 mb-2">
              You won't see your score, but your attempt will appear on your score report as <strong>"C"</strong>.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Use when:</strong> You are certain your score will be significantly lower than previous scores.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold">
            <strong>Default Advice:</strong> Wait to see your score before deciding. Most students who cancel regret it—your perception is typically worse than the actual result.
          </p>
        </div>
      </div>

      {/* Top Resources */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-green-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Top MCAT Resources Ranked</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Must Have</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span className="text-gray-700"><strong>AAMC Official Prep Bundle</strong> - Non-negotiable. Closest to real exam content.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span className="text-gray-700"><strong>AAMC Full-Lengths 1 & 2 (free)</strong> - Use early as baseline.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Highly Recommended</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-gray-700"><strong>UWorld MCAT</strong> - Best third-party question bank. More challenging than actual exam with outstanding explanations.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-gray-700"><strong>Anki with Anking MCAT Deck</strong> - 2,000+ community-built cards covering every topic.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-gray-700"><strong>Khan Academy MCAT</strong> - Excels in Psych/Soc and Biology. Uneven in Chem/Physics.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Situational</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gray-500 font-bold mt-1">○</span>
                <span className="text-gray-700"><strong>Blueprint MCAT Full-Lengths</strong> - Best third-party practice exams.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gray-500 font-bold mt-1">○</span>
                <span className="text-gray-700"><strong>Jack Westin CARS</strong> - Best standalone CARS resource.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gray-500 font-bold mt-1">○</span>
                <span className="text-gray-700"><strong>Princeton Review or Kaplan Complete Series</strong> - As reference, not primary study material.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
