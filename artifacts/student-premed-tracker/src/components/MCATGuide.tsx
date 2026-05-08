import { useState } from 'react';
import { Brain, Calendar, Plus, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

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

interface MCATGuideProps {
  examPlan: ExamPlan;
  practiceTests: PracticeTest[];
  onUpdateExamPlan: (plan: ExamPlan) => void;
  onAddPracticeTest: (test: PracticeTest) => void;
  onDeletePracticeTest: (id: string) => void;
}

export function MCATGuide({
  examPlan,
  practiceTests,
  onUpdateExamPlan,
  onAddPracticeTest,
  onDeletePracticeTest,
}: MCATGuideProps) {
  const [showLogTestModal, setShowLogTestModal] = useState(false);
  const [showTestWindows, setShowTestWindows] = useState(false);
  const [showStudyGuidelines, setShowStudyGuidelines] = useState(false);
  const [draftExamPlan, setDraftExamPlan] = useState(examPlan);
  const [newTest, setNewTest] = useState({
    date: '',
    score: '',
    source: 'AAMC',
  });

  const saveExamPlan = () => {
    onUpdateExamPlan(draftExamPlan);
  };

  const updateDraftExamPlan = (updates: Partial<ExamPlan>) => {
    setDraftExamPlan({ ...draftExamPlan, ...updates });
  };

  const handleSaveTest = () => {
    const score = Number(newTest.score);
    if (!newTest.date || Number.isNaN(score) || score < 472 || score > 528) return;

    const test: PracticeTest = {
      id: Date.now().toString(),
      date: newTest.date,
      score,
      source: newTest.source,
    };

    onAddPracticeTest(test);
    setNewTest({ date: '', score: '', source: 'AAMC' });
    setShowLogTestModal(false);
  };

  const hasNotTakenTest = practiceTests.length === 0;
  const latestScore = practiceTests.length > 0
    ? Math.max(...practiceTests.map(t => t.score))
    : null;

  // Sort tests by date for chart
  const sortedTests = [...practiceTests].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const maxChartScore = 528;
  const minChartScore = 472;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Brain size={24} />
            <div>
              <h2 className="text-2xl font-bold">MCAT Prep Tracker</h2>
              <div className="text-sm text-orange-100">
                Target {examPlan.targetScore || '---'} • {hasNotTakenTest ? 'Not Tested Yet' : `Latest: ${latestScore}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowLogTestModal(true)}
            className="flex-shrink-0 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-orange-50 transition-colors pl-[5px] pr-[5px] pt-[5px] pb-[5px]"
          >
            <Plus size={18} />
            Log Test
          </button>
        </div>
        <p className="text-orange-100">
          The MCAT screens applications before a human reads them. Your latest score matters most.
        </p>
      </div>
      {/* Log Test Modal */}
      {showLogTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Log Practice Test</h3>
              <button
                onClick={() => setShowLogTestModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Test</label>
                <input
                  type="date"
                  value={newTest.date}
                  onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (472-528)</label>
                <input
                  type="number"
                  value={newTest.score}
                  onChange={(e) => setNewTest({ ...newTest, score: e.target.value })}
                  min="472"
                  max="528"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test From</label>
                <select
                  value={newTest.source}
                  onChange={(e) => setNewTest({ ...newTest, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="AAMC">AAMC</option>
                  <option value="UWorld">UWorld</option>
                  <option value="Blueprint">Blueprint</option>
                  <option value="Kaplan">Kaplan</option>
                  <option value="Princeton">Princeton Review</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveTest}
                  disabled={!newTest.date || newTest.score < 472 || newTest.score > 528}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLogTestModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      {/* Exam Plan */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Plan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Test Date</label>
            <input
              type="date"
              value={draftExamPlan.targetDate}
              onChange={(e) => updateDraftExamPlan({ targetDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Score</label>
            <input
              type="number"
              value={draftExamPlan.targetScore || ''}
              onChange={(e) => updateDraftExamPlan({ targetScore: parseInt(e.target.value) || 0 })}
              min="472"
              max="528"
              placeholder="510"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Phase</label>
            <select
              value={draftExamPlan.currentPhase}
              onChange={(e) => updateDraftExamPlan({ currentPhase: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select phase...</option>
              <option value="Content Review">Content Review</option>
              <option value="Practice Problems">Practice Problems</option>
              <option value="Full-Length Tests">Full-Length Tests</option>
              <option value="Final Review">Final Review</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Hour Goal</label>
            <input
              type="number"
              value={draftExamPlan.weeklyHours || ''}
              onChange={(e) => updateDraftExamPlan({ weeklyHours: parseInt(e.target.value) || 0 })}
              min="0"
              max="80"
              placeholder="25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={saveExamPlan}
          className="mt-4 w-full flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-semibold"
        >
          Save
        </button>
      </div>
      {/* Practice Test History Chart - Vertical Bars */}
      {sortedTests.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Test History</h3>

          {/* Vertical Bar Chart */}
          <div className="mb-6">
            <div className="flex items-end justify-between gap-2 h-64 border-b-2 border-gray-300 pb-2">
              {sortedTests.map((test, index) => {
                const barHeight = 18 + ((test.score - minChartScore) / (maxChartScore - minChartScore)) * 82;
                const isImprovement = index > 0 && test.score > sortedTests[index - 1].score;
                const isDecline = index > 0 && test.score < sortedTests[index - 1].score;

                return (
                  <div key={test.id} className="flex-1 flex flex-col items-center gap-2">
                    <button
                      onClick={() => onDeletePracticeTest(test.id)}
                      className="text-red-600 hover:text-red-700 transition-opacity"
                      aria-label={`Delete ${test.source} test on ${test.date}`}
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex-1 flex flex-col justify-end items-center w-full">
                      {(isImprovement || isDecline) && (
                        <div className={`text-xs mb-1 font-bold ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                          {isImprovement ? '↑' : '↓'}{Math.abs(test.score - sortedTests[index - 1].score)}
                        </div>
                      )}
                      <div className="relative w-full flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-900 mb-1">{test.score}</span>
                        <div
                          className={`w-full rounded-t-lg transition-all shadow-md ${
                            test.score >= 515
                              ? 'bg-gradient-to-t from-green-500 to-green-400'
                              : test.score >= 510
                              ? 'bg-gradient-to-t from-blue-500 to-blue-400'
                              : test.score >= 505
                              ? 'bg-gradient-to-t from-yellow-500 to-yellow-400'
                              : 'bg-gradient-to-t from-orange-500 to-orange-400'
                          }`}
                          style={{ height: `${barHeight}%`, minHeight: '40px', maxHeight: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="text-center mt-2">
                      <div className="text-xs text-gray-600 whitespace-nowrap">
                        {new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {test.source}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score Scale */}
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
              <span>472</span>
              <span>500</span>
              <span>528</span>
            </div>
          </div>

          {/* Target Info */}
          {examPlan.targetScore > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Target Score:</span>
                <span className="font-bold text-blue-600">{examPlan.targetScore}</span>
              </div>
              {latestScore && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Gap to Target:</span>
                  <span className={`font-bold ${latestScore >= examPlan.targetScore ? 'text-green-600' : 'text-orange-600'}`}>
                    {latestScore >= examPlan.targetScore ? '✓ Goal Met!' : `${examPlan.targetScore - latestScore} points`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-gray-600">515+ (Top 20)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-gray-600">510-514 (Competitive)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-gray-600">505-509 (Mid-tier)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-gray-600">&lt;505 (Needs work)</span>
            </div>
          </div>
        </div>
      )}
      {/* Smart Recommendations */}
      {sortedTests.length >= 2 && (
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
          </div>

          {(() => {
            const recentTests = sortedTests.slice(-3);
            const recentScores = recentTests.map(t => t.score);
            const averageRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
            const isPlateauing = recentTests.length >= 3 && Math.max(...recentScores) - Math.min(...recentScores) < 3;
            const isImproving = sortedTests.length >= 2 && sortedTests[sortedTests.length - 1].score > sortedTests[sortedTests.length - 2].score;
            const isDeclining = sortedTests.length >= 2 && sortedTests[sortedTests.length - 1].score < sortedTests[sortedTests.length - 2].score;
            const aamcCount = sortedTests.filter(t => t.source === 'AAMC').length;
            const totalTests = sortedTests.length;

            return (
              <div className="space-y-3">
                {/* Plateauing */}
                {isPlateauing && (
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                    <p className="font-semibold text-orange-900 mb-2">📊 Scores Plateauing</p>
                    <p className="text-sm text-orange-800 mb-2">
                      Your last 3 tests are within 3 points of each other. This suggests you've hit a ceiling with your current study approach.
                    </p>
                    <p className="text-sm text-orange-900 font-medium">
                      → Try a new resource or focus on your weakest section
                    </p>
                  </div>
                )}

                {/* Improving */}
                {isImproving && !isPlateauing && (
                  <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <p className="font-semibold text-green-900 mb-2">📈 Upward Trend!</p>
                    <p className="text-sm text-green-800 mb-2">
                      Your scores are improving. Whatever you're doing is working!
                    </p>
                    <p className="text-sm text-green-900 font-medium">
                      → Keep up your current study routine
                    </p>
                  </div>
                )}

                {/* Declining */}
                {isDeclining && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="font-semibold text-red-900 mb-2">⚠️ Score Drop Detected</p>
                    <p className="text-sm text-red-800 mb-2">
                      Your most recent test was lower than the previous one. This could indicate burnout or content gaps.
                    </p>
                    <p className="text-sm text-red-900 font-medium">
                      → Take a 2-3 day break and review weak areas before the next test
                    </p>
                  </div>
                )}

                {/* AAMC tests */}
                {aamcCount < 3 && totalTests >= 3 && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="font-semibold text-blue-900 mb-2">🎯 Prioritize AAMC Materials</p>
                    <p className="text-sm text-blue-800 mb-2">
                      You've taken {totalTests} tests but only {aamcCount} from AAMC. AAMC materials are the most predictive of your real score.
                    </p>
                    <p className="text-sm text-blue-900 font-medium">
                      → Save AAMC full-lengths for the final 4-6 weeks before test day
                    </p>
                  </div>
                )}

                {/* Variety recommendation */}
                {totalTests >= 4 && new Set(sortedTests.map(t => t.source)).size === 1 && (
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                    <p className="font-semibold text-purple-900 mb-2">🔄 Add Test Variety</p>
                    <p className="text-sm text-purple-800 mb-2">
                      All your tests are from {sortedTests[0].source}. Mixing sources helps expose different question styles.
                    </p>
                    <p className="text-sm text-purple-900 font-medium">
                      → Try UWorld, Blueprint, or AAMC for your next test
                    </p>
                  </div>
                )}

                {/* Target gap analysis */}
                {examPlan.targetScore > 0 && latestScore && latestScore < examPlan.targetScore && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <p className="font-semibold text-yellow-900 mb-2">🎯 Gap to Target: {examPlan.targetScore - latestScore} points</p>
                    <p className="text-sm text-yellow-800 mb-2">
                      Projected score: {Math.round(averageRecent)}-{Math.round(averageRecent + 3)} based on recent average.
                    </p>
                    <p className="text-sm text-yellow-900 font-medium">
                      {examPlan.targetScore - latestScore > 5
                        ? '→ Consider extending your study timeline by 4-6 weeks'
                        : "→ You're close! Focus on high-yield weak areas"}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
      {/* Collapsible Sections */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setShowTestWindows(!showTestWindows)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Optimal Test Windows</h3>
          </div>
          {showTestWindows ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {showTestWindows && (
          <div className="px-5 pb-5">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold text-red-700 min-w-[120px]">Freshman:</span>
                <span className="text-sm text-red-800">Do not test. You haven't taken prerequisite courses yet.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="font-bold text-yellow-700 min-w-[120px]">Soph. Summer:</span>
                <span className="text-sm text-yellow-800">Diagnostic only. Take a cold baseline with no prep to gauge study timeline needed.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="font-bold text-green-700 min-w-[120px]">Junior Year:</span>
                <span className="text-sm text-green-800"><strong>January through April.</strong> This is your primary window.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-bold text-blue-700 min-w-[120px]">Senior Year:</span>
                <span className="text-sm text-blue-800">January through April. Fall retakes arrive too late for this cycle.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="font-bold text-purple-700 min-w-[120px]">Gap Year:</span>
                <span className="text-sm text-purple-800">January through April. Use the full gap to maximize your prep.</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setShowStudyGuidelines(!showStudyGuidelines)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Study Timeline Guidelines</h3>
          </div>
          {showStudyGuidelines ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {showStudyGuidelines && (
          <div className="px-5 pb-5">
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="font-bold text-purple-900 mb-2">Diagnostic Score &lt;500:</div>
                <p className="text-sm text-purple-800">Plan for 6-month preparation (20-25 hours/week)</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-bold text-blue-900 mb-2">Diagnostic Score 500-508:</div>
                <p className="text-sm text-blue-800">Plan for 90-day preparation (25-30 hours/week)</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-bold text-green-900 mb-2">Diagnostic Score 509+:</div>
                <p className="text-sm text-green-800">Plan for 60-90 day preparation (20-25 hours/week)</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-900 font-semibold">
                  <strong>⚠️ Never condense a 6-month plan into 3 months.</strong> This is the most common MCAT mistake.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
