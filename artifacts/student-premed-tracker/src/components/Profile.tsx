import { useState } from 'react';
import { User, Trash2, Info, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ProfileProps {
  userProfile: {
    name: string;
    school: string;
    year: string;
    semester: string;
    track: string;
  };
}

export function Profile({ userProfile }: ProfileProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportExcel = () => {
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0,
    };

    // Parse data from localStorage
    const coursesData = JSON.parse(localStorage.getItem('premed-courses') || '[]');
    const hoursData = JSON.parse(localStorage.getItem('premed-hours') || '{"clinical":0,"research":0,"volunteer":0,"shadowing":0}');
    const examPlanData = JSON.parse(localStorage.getItem('premed-exam-plan') || '{"targetDate":"","targetScore":0,"currentPhase":"","weeklyHours":0}');
    const practiceTestsData = JSON.parse(localStorage.getItem('premed-practice-tests') || '[]');
    const prioritiesData = JSON.parse(localStorage.getItem('premed-priorities') || '[]');

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Profile
    const profileData = [
      ['Pre-Med Journey - Data Export'],
      ['Export Date:', new Date().toLocaleDateString()],
      [],
      ['Profile Information'],
      ['Name:', userProfile.name],
      ['School:', userProfile.school],
      ['Year:', getYearLabel(userProfile.year)],
      ['Semester:', userProfile.semester.charAt(0).toUpperCase() + userProfile.semester.slice(1)],
      ['Track:', getTrackLabel(userProfile.track)],
    ];
    const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
    XLSX.utils.book_append_sheet(wb, wsProfile, 'Profile');

    // Sheet 2: Courses & GPA
    if (coursesData.length > 0) {
      const courseHeaders = [['Course Name', 'Grade', 'Credits', 'Grade Points', 'Quality Points', 'BCPM']];
      const courseRows = coursesData.map((course: any) => [
        course.name,
        course.grade,
        course.credits,
        gradePoints[course.grade] || 0,
        (gradePoints[course.grade] || 0) * course.credits,
        course.isBCPM ? 'Yes' : 'No'
      ]);

      // Calculate GPA
      const totalCredits = coursesData.reduce((sum: number, c: any) => sum + c.credits, 0);
      const totalPoints = coursesData.reduce((sum: number, c: any) => sum + (gradePoints[c.grade] || 0) * c.credits, 0);
      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

      // BCPM GPA
      const bcpmCourses = coursesData.filter((c: any) => c.isBCPM);
      const bcpmCredits = bcpmCourses.reduce((sum: number, c: any) => sum + c.credits, 0);
      const bcpmPoints = bcpmCourses.reduce((sum: number, c: any) => sum + (gradePoints[c.grade] || 0) * c.credits, 0);
      const bcpmGPA = bcpmCredits > 0 ? bcpmPoints / bcpmCredits : 0;

      const summaryRows = [
        [],
        ['GPA Summary'],
        ['Total Credits:', totalCredits],
        ['Cumulative GPA:', gpa.toFixed(2)],
        ['BCPM Credits:', bcpmCredits],
        ['BCPM GPA:', bcpmGPA.toFixed(2)],
      ];

      const wsCourses = XLSX.utils.aoa_to_sheet([...courseHeaders, ...courseRows, ...summaryRows]);
      XLSX.utils.book_append_sheet(wb, wsCourses, 'Courses & GPA');
    }

    // Sheet 3: Experience Hours
    const hoursHeaders = [['Experience Type', 'Hours', 'Target', 'Progress']];
    const hoursRows = [
      ['Clinical', hoursData.clinical, 200, `${Math.min(100, (hoursData.clinical / 200) * 100).toFixed(0)}%`],
      ['Research', hoursData.research, 100, `${Math.min(100, (hoursData.research / 100) * 100).toFixed(0)}%`],
      ['Volunteer', hoursData.volunteer, 100, `${Math.min(100, (hoursData.volunteer / 100) * 100).toFixed(0)}%`],
      ['Shadowing', hoursData.shadowing, 100, `${Math.min(100, (hoursData.shadowing / 100) * 100).toFixed(0)}%`],
      [],
      ['Total Hours:', hoursData.clinical + hoursData.research + hoursData.volunteer + hoursData.shadowing],
    ];
    const wsHours = XLSX.utils.aoa_to_sheet([...hoursHeaders, ...hoursRows]);
    XLSX.utils.book_append_sheet(wb, wsHours, 'Experience Hours');

    // Sheet 4: MCAT Plan & Practice Tests
    const mcatData = [
      ['MCAT Exam Plan'],
      ['Target Date:', examPlanData.targetDate || 'Not Set'],
      ['Target Score:', examPlanData.targetScore || 'Not Set'],
      ['Current Phase:', examPlanData.currentPhase || 'Not Set'],
      ['Weekly Study Hours:', examPlanData.weeklyHours || 0],
      [],
    ];

    if (practiceTestsData.length > 0) {
      mcatData.push(['Practice Tests']);
      mcatData.push(['Date', 'Score', 'Source']);
      practiceTestsData.forEach((test: any) => {
        mcatData.push([test.date, test.score, test.source]);
      });

      // Calculate average
      const avgScore = practiceTestsData.reduce((sum: number, t: any) => sum + t.score, 0) / practiceTestsData.length;
      mcatData.push([]);
      mcatData.push(['Average Score:', avgScore.toFixed(1)]);
      mcatData.push(['Total Practice Tests:', practiceTestsData.length]);
    } else {
      mcatData.push(['No practice tests recorded yet']);
    }

    const wsMCAT = XLSX.utils.aoa_to_sheet(mcatData);
    XLSX.utils.book_append_sheet(wb, wsMCAT, 'MCAT');

    // Sheet 5: Roadmap Progress
    const prioritiesCount = prioritiesData.length;
    const progressData = [
      ['Roadmap Progress'],
      ['Completed Priorities:', prioritiesCount],
      [],
      ['Note: Detailed priority checklist available in the app'],
    ];
    const wsProgress = XLSX.utils.aoa_to_sheet(progressData);
    XLSX.utils.book_append_sheet(wb, wsProgress, 'Roadmap Progress');

    // Generate Excel file
    XLSX.writeFile(wb, `premed-data-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getYearLabel = (year: string) => {
    const labels: Record<string, string> = {
      'undergrad-freshman': 'Freshman',
      'undergrad-sophomore': 'Sophomore',
      'undergrad-junior': 'Junior',
      'undergrad-senior': 'Senior',
      'gap-year': 'Gap Year',
    };
    return labels[year] || year;
  };

  const getTrackLabel = (track: string) => {
    const labels: Record<string, string> = {
      'both': 'MD & DO',
      'md': 'MD Only',
      'do': 'DO Only',
    };
    return labels[track] || track;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <User size={28} />
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <p className="text-purple-100">Manage your account and data</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Name</span>
            <span className="font-medium text-gray-900">{userProfile.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">School</span>
            <span className="font-medium text-gray-900">{userProfile.school}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Year</span>
            <span className="font-medium text-gray-900">
              {getYearLabel(userProfile.year)} - {userProfile.semester.charAt(0).toUpperCase() + userProfile.semester.slice(1)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Track</span>
            <span className="font-medium text-gray-900">{getTrackLabel(userProfile.track)}</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <button
            onClick={handleExportExcel}
            className="w-full flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="text-green-600" size={24} />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Export to Excel</div>
                <div className="text-sm text-gray-600">Download formatted spreadsheet for analysis</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="text-red-600" size={24} />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Clear All Data</div>
                <div className="text-sm text-gray-600">Reset app and start over</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Clear all data?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This will permanently delete everything saved in this app on this device.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Clear all data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-gray-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">About</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Pre-Med Journey</strong> helps you track your progress toward medical school acceptance.
          </p>
          <p>
            All data is stored locally on your device. Nothing is sent to external servers.
          </p>
          <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            Based on "Med School Bound - The Year-by-Year Roadmap Nobody Gave You"
          </p>
        </div>
      </div>
    </div>
  );
}
