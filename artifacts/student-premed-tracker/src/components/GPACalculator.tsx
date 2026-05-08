import { useState } from 'react';
import { Plus, Trash2, Printer, TrendingUp, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  isBCPM: boolean;
}

interface GPACalculatorProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

const gradePoints: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

export function GPACalculator({ courses, onUpdateCourses }: GPACalculatorProps) {
  const [showCourseList, setShowCourseList] = useState(false);
  const [showProjection, setShowProjection] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [projectionCredits, setProjectionCredits] = useState(12);
  const [projectionGrade, setProjectionGrade] = useState('A');
  const [newCourse, setNewCourse] = useState({
    name: '',
    grade: 'A',
    credits: 3,
    isBCPM: false,
  });

  const calculateGPA = (courseList: Course[], bcpmOnly: boolean = false) => {
    const filteredCourses = bcpmOnly
      ? courseList.filter(c => c.isBCPM)
      : courseList;

    if (filteredCourses.length === 0) return 0;

    const totalPoints = filteredCourses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const scienceGPA = calculateGPA(courses, true);
  const cumulativeGPA = calculateGPA(courses, false);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const bcpmCredits = courses.filter(c => c.isBCPM).reduce((sum, c) => sum + c.credits, 0);
  const gpaGap = Math.abs(scienceGPA - cumulativeGPA);

  // GPA Trend Analysis
  const getTrendIndicator = () => {
    if (courses.length < 3) return null;

    const recentCourses = courses.slice(-3);
    const olderCourses = courses.slice(0, -3);

    if (olderCourses.length === 0) return null;

    const recentGPA = calculateGPA(recentCourses, false);
    const olderGPA = calculateGPA(olderCourses, false);
    const diff = recentGPA - olderGPA;

    if (diff > 0.1) {
      return { trend: 'improving', text: 'Improving', icon: '↑', color: 'text-green-600', bgColor: 'bg-green-50 border-green-300' };
    } else if (diff < -0.1) {
      return { trend: 'declining', text: 'Declining', icon: '↓', color: 'text-red-600', bgColor: 'bg-red-50 border-red-300' };
    } else {
      return { trend: 'steady', text: 'Steady', icon: '→', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-300' };
    }
  };

  const trendIndicator = getTrendIndicator();

  const addCourse = () => {
    if (newCourse.name.trim() === '') return;

    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
    };

    const updatedCourses = [...courses, course];
    onUpdateCourses(updatedCourses);

    setNewCourse({
      name: '',
      grade: 'A',
      credits: 3,
      isBCPM: false,
    });
  };

  const updateCourseCredits = (value: string) => {
    const parsed = value === '' ? 0 : Number(value);
    setNewCourse({
      ...newCourse,
      credits: Number.isNaN(parsed) ? 0 : parsed,
    });
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    onUpdateCourses(updatedCourses);
  };

  const handlePrint = () => {
    if (courses.length === 0) return;

    const rows = [
      ['Name', 'Grade', 'Credits'],
      ...courses.map(course => [course.name, course.grade, String(course.credits)]),
    ];

    const csv = rows
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gpa-courses.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSchoolTierColor = (avgGPA: number, applyThreshold: number) => {
    if (cumulativeGPA >= avgGPA) {
      return 'bg-green-100 text-green-800';
    } else if (cumulativeGPA >= applyThreshold) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getSchoolTierStatus = (avgGPA: number, applyThreshold: number) => {
    if (cumulativeGPA >= avgGPA) {
      return 'Competitive';
    } else if (cumulativeGPA >= applyThreshold) {
      return `Apply if ${cumulativeGPA.toFixed(2)}`;
    } else {
      return `Below ${applyThreshold.toFixed(2)}`;
    }
  };

  const getDOStatus = () => {
    if (cumulativeGPA >= 3.54) {
      return 'Competitive';
    }

    if (cumulativeGPA >= 3.2) {
      return `Apply if ${cumulativeGPA.toFixed(2)}`;
    }

    return 'Below 3.20';
  };

  const getDOBadgeColor = () => {
    if (cumulativeGPA >= 3.54) {
      return 'bg-green-100 text-green-800';
    }

    if (cumulativeGPA >= 3.2) {
      return 'bg-yellow-100 text-yellow-800';
    }

    return 'bg-red-100 text-red-800';
  };

  // GPA Projection
  const calculateProjectedGPA = () => {
    if (courses.length === 0) return cumulativeGPA;

    const currentPoints = courses.reduce((sum, c) => sum + gradePoints[c.grade] * c.credits, 0);
    const futurePoints = gradePoints[projectionGrade] * projectionCredits;
    const totalPoints = currentPoints + futurePoints;
    const totalNewCredits = totalCredits + projectionCredits;

    return totalNewCredits > 0 ? totalPoints / totalNewCredits : 0;
  };

  const projectedGPA = calculateProjectedGPA();
  const gpaChange = projectedGPA - cumulativeGPA;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">GPA Calculator</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-green-100 mb-1">Science GPA (BCPM)</div>
            <div className="text-4xl font-bold">{scienceGPA.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-green-100 mb-1">Cumulative GPA</div>
            <div className="text-4xl font-bold">{cumulativeGPA.toFixed(2)}</div>
          </div>
        </div>

        {/* Trend Indicator */}
        {trendIndicator && (
          <div className="mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg">
            <span className="text-white text-sm font-medium">Trend:</span>
            <span className="text-white text-lg font-bold">
              {trendIndicator.icon} {trendIndicator.text}
            </span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-green-400">
          <div>
            <div className="text-xs text-green-100">Total Courses</div>
            <div className="text-lg font-semibold">{courses.length}</div>
          </div>
          <div>
            <div className="text-xs text-green-100">Total Credits</div>
            <div className="text-lg font-semibold">{totalCredits}</div>
          </div>
          <div>
            <div className="text-xs text-green-100">BCPM Credits</div>
            <div className="text-lg font-semibold">{bcpmCredits}</div>
          </div>
        </div>

        {gpaGap > 0.3 && (
          <div className="mt-3 flex items-start gap-2 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>GPA Gap Alert:</strong> {gpaGap.toFixed(2)} point difference between Science and Cumulative GPA may raise concerns.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Trend Analysis */}
      {trendIndicator && courses.length >= 3 && (
        <div className={`rounded-xl shadow-md p-5 border-2 ${trendIndicator.bgColor}`}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className={trendIndicator.color} size={24} />
            <h3 className="text-lg font-semibold text-gray-900">GPA Trend Analysis</h3>
          </div>

          <div className="space-y-3">
            {trendIndicator.trend === 'improving' && (
              <>
                <p className="text-sm text-gray-800">
                  <strong className="text-green-700">Great news!</strong> Your recent courses show improvement over earlier performance.
                </p>
                <p className="text-sm text-gray-700">
                  💡 Keep up the momentum! Study habits that led to this improvement are working.
                </p>
              </>
            )}

            {trendIndicator.trend === 'declining' && (
              <>
                <p className="text-sm text-gray-800">
                  <strong className="text-red-700">Heads up:</strong> Your recent grades are lower than earlier courses.
                </p>
                <p className="text-sm text-gray-700">
                  💡 Consider meeting with academic advisor or joining study groups. GPA recovery becomes harder over time.
                </p>
              </>
            )}

            {trendIndicator.trend === 'steady' && (
              <>
                <p className="text-sm text-gray-800">
                  <strong className="text-blue-700">Consistent performance:</strong> Your GPA has remained stable across recent courses.
                </p>
                <p className="text-sm text-gray-700">
                  💡 {cumulativeGPA >= 3.65
                    ? 'Great work maintaining a competitive GPA!'
                    : 'To improve, focus on earning A\'s in upcoming courses.'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* GPA Projection Tool */}
      {courses.length > 0 && (
        <div className="rounded-xl">
          <button
            onClick={() => setShowProjection(!showProjection)}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">GPA Projection Tool</h3>
            </div>
            {showProjection ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {showProjection && (
            <div className="px-5 pb-5 space-y-4">
              <p className="text-sm text-gray-600">See how future courses will impact your GPA</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits to Take</label>
                  <input
                    type="number"
                    value={projectionCredits}
                    onChange={(e) => setProjectionCredits(parseInt(e.target.value) || 0)}
                    min="1"
                    max="24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">If You Get...</label>
                  <select
                    value={projectionGrade}
                    onChange={(e) => setProjectionGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {Object.keys(gradePoints).map((grade) => (
                      <option key={grade} value={grade}>
                        {grade} ({gradePoints[grade].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-5">
                <div className="text-center mb-3">
                  <div className="text-sm text-purple-700 font-medium mb-1">Projected Cumulative GPA</div>
                  <div className="text-4xl font-bold text-purple-900">{projectedGPA.toFixed(2)}</div>
                </div>

                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="text-gray-600">Current: {cumulativeGPA.toFixed(2)}</span>
                  <span className={`font-bold ${gpaChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {gpaChange >= 0 ? '↑' : '↓'} {Math.abs(gpaChange).toFixed(2)}
                  </span>
                </div>

                {projectedGPA >= 3.65 && cumulativeGPA < 3.65 && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg text-center">
                    <p className="text-sm text-green-900 font-semibold">
                      🎯 This would bring you into competitive range!
                    </p>
                  </div>
                )}

                {projectedGPA < 3.5 && (
                  <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-lg text-center">
                    <p className="text-sm text-orange-900 font-semibold">
                      Consider retaking courses or extending your timeline to improve GPA
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                This is a projection based on {projectionCredits} credits at {projectionGrade} grade.
                Actual GPA depends on your performance.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setShowAddCourse(!showAddCourse)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Course</h3>
            <p className="text-sm text-gray-600">Expand to add a new class</p>
          </div>
          {showAddCourse ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </button>

        {showAddCourse && (
          <div className="px-5 pb-5">
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="e.g., General Chemistry I"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Grade</label>
                  <select
                    value={newCourse.grade}
                    onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {Object.keys(gradePoints).map((grade) => (
                      <option key={grade} value={grade}>
                        {grade} ({gradePoints[grade].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Credits</label>
                  <input
                    type="number"
                    value={newCourse.credits}
                    onChange={(e) => updateCourseCredits(e.target.value)}
                    min="0"
                    max="6"
                    step="1"
                    inputMode="numeric"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bcpm"
                  checked={newCourse.isBCPM}
                  onChange={(e) => setNewCourse({ ...newCourse, isBCPM: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="bcpm" className="text-sm text-gray-700">
                  BCPM Course (Biology, Chemistry, Physics, Math)
                </label>
              </div>

              <button
                onClick={addCourse}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Course
              </button>
            </div>
          </div>
        )}
      </div>

      {courses.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowCourseList(!showCourseList)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Courses ({courses.length})</h3>
              <p className="text-sm text-gray-600">{totalCredits} credits total</p>
            </div>
            {showCourseList ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
          </button>

          {showCourseList && (
            <div className="px-5 pb-5 space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{course.name}</div>
                    <div className="text-sm text-gray-600">
                      {course.grade} • {course.credits} credits • {course.isBCPM ? 'BCPM' : 'Other'}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700 p-1 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          )}
        </div>
      )}

      {courses.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gray-600">No courses added yet. Add your first course above to start tracking your GPA.</p>
        </div>
      )}
    </div>
  );
}
