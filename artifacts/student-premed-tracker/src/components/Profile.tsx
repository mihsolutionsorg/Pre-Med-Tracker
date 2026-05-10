import { useState } from 'react';
import { Pencil, X, Check, Trash2, Info, FileSpreadsheet, FileText, FileDown, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserProfile {
  name: string;
  school: string;
  year: string;
  semester: string;
  track: string;
}

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

function getYearLabel(year: string) {
  const labels: Record<string, string> = {
    'undergrad-freshman': 'Freshman',
    'undergrad-sophomore': 'Sophomore',
    'undergrad-junior': 'Junior',
    'undergrad-senior': 'Senior',
    'gap-year': 'Gap Year',
  };
  return labels[year] ?? year;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function Profile({ userProfile, onUpdateProfile }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: userProfile.name, school: userProfile.school });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const isProfileIncomplete = !userProfile.name.trim() || !userProfile.school.trim();

  const handleStartEdit = () => {
    setDraft({ name: userProfile.name, school: userProfile.school });
    setEditing(true);
  };

  const handleSave = () => {
    onUpdateProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ name: userProfile.name, school: userProfile.school });
    setEditing(false);
  };

  // ── Shared data loaders ───────────────────────────────────────────────────
  const loadData = () => {
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0,
    };
    const courses: { name: string; grade: string; credits: number; isBCPM: boolean }[] =
      JSON.parse(localStorage.getItem('premed-courses') || '[]');
    const hours: { clinical: number; research: number; volunteer: number; shadowing: number } =
      JSON.parse(localStorage.getItem('premed-hours') || '{"clinical":0,"research":0,"volunteer":0,"shadowing":0}');
    const examPlan: { targetDate: string; targetScore: number; currentPhase: string; weeklyHours: number } =
      JSON.parse(localStorage.getItem('premed-exam-plan') || '{"targetDate":"","targetScore":0,"currentPhase":"","weeklyHours":0}');
    const practiceTests: { date: string; score: number; source: string }[] =
      JSON.parse(localStorage.getItem('premed-practice-tests') || '[]');
    const completedPriorities: string[] =
      JSON.parse(localStorage.getItem('premed-priorities') || '[]');

    const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
    const totalPoints = courses.reduce((s, c) => s + (gradePoints[c.grade] || 0) * c.credits, 0);
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';

    const bcpm = courses.filter((c) => c.isBCPM);
    const bcpmCredits = bcpm.reduce((s, c) => s + c.credits, 0);
    const bcpmPoints = bcpm.reduce((s, c) => s + (gradePoints[c.grade] || 0) * c.credits, 0);
    const bcpmGpa = bcpmCredits > 0 ? (bcpmPoints / bcpmCredits).toFixed(2) : 'N/A';

    const avgScore =
      practiceTests.length > 0
        ? (practiceTests.reduce((s, t) => s + t.score, 0) / practiceTests.length).toFixed(1)
        : 'N/A';

    return { courses, hours, examPlan, practiceTests, completedPriorities, gpa, bcpmGpa, avgScore, gradePoints };
  };

  // ── Excel export ──────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    const { courses, hours, examPlan, practiceTests, completedPriorities, gpa, bcpmGpa, avgScore, gradePoints } = loadData();
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Pre-Med Journey - Data Export'],
      ['Export Date:', new Date().toLocaleDateString()],
      [],
      ['Profile Information'],
      ['Name:', userProfile.name || 'Not set'],
      ['School:', userProfile.school || 'Not set'],
      ['Year:', getYearLabel(userProfile.year)],
      ['Semester:', userProfile.semester.charAt(0).toUpperCase() + userProfile.semester.slice(1)],
    ]), 'Profile');

    if (courses.length > 0) {
      const rows = courses.map((c) => [c.name, c.grade, c.credits, gradePoints[c.grade] || 0, (gradePoints[c.grade] || 0) * c.credits, c.isBCPM ? 'Yes' : 'No']);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
        ['Course Name', 'Grade', 'Credits', 'Grade Points', 'Quality Points', 'BCPM'],
        ...rows,
        [], ['GPA Summary'], ['Cumulative GPA:', gpa], ['BCPM GPA:', bcpmGpa],
      ]), 'Courses & GPA');
    }

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Experience Type', 'Hours', 'Target', 'Progress'],
      ['Clinical', hours.clinical, 200, `${Math.min(100, (hours.clinical / 200) * 100).toFixed(0)}%`],
      ['Research', hours.research, 100, `${Math.min(100, (hours.research / 100) * 100).toFixed(0)}%`],
      ['Volunteer', hours.volunteer, 100, `${Math.min(100, (hours.volunteer / 100) * 100).toFixed(0)}%`],
      ['Shadowing', hours.shadowing, 100, `${Math.min(100, (hours.shadowing / 100) * 100).toFixed(0)}%`],
      [], ['Total Hours:', hours.clinical + hours.research + hours.volunteer + hours.shadowing],
    ]), 'Experience Hours');

    const mcatRows: (string | number)[][] = [
      ['MCAT Exam Plan'],
      ['Target Date:', examPlan.targetDate || 'Not Set'],
      ['Target Score:', examPlan.targetScore || 'Not Set'],
      ['Current Phase:', examPlan.currentPhase || 'Not Set'],
      ['Weekly Study Hours:', examPlan.weeklyHours || 0],
      [],
    ];
    if (practiceTests.length > 0) {
      mcatRows.push(['Practice Tests'], ['Date', 'Score', 'Source']);
      practiceTests.forEach((t) => mcatRows.push([t.date, t.score, t.source]));
      mcatRows.push([], ['Average Score:', avgScore]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mcatRows), 'MCAT');

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Roadmap Progress'],
      ['Completed Priorities:', completedPriorities.length],
      [],
      ['Note: Detailed priority checklist available in the app'],
    ]), 'Roadmap Progress');

    XLSX.writeFile(wb, `premed-data-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // ── CSV export ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const { hours, examPlan, gpa, bcpmGpa, avgScore, completedPriorities } = loadData();
    const date = new Date().toLocaleDateString();

    const rows = [
      ['Pre-Med Journey Progress Export', date],
      [],
      ['PROFILE'],
      ['Name', userProfile.name || 'Not set'],
      ['School', userProfile.school || 'Not set'],
      ['Year', getYearLabel(userProfile.year)],
      ['Semester', userProfile.semester.charAt(0).toUpperCase() + userProfile.semester.slice(1)],
      [],
      ['GPA SUMMARY'],
      ['Cumulative GPA', gpa],
      ['BCPM GPA', bcpmGpa],
      [],
      ['EXPERIENCE HOURS'],
      ['Type', 'Hours', 'Target', '% Complete'],
      ['Clinical', hours.clinical, 200, `${Math.min(100, (hours.clinical / 200) * 100).toFixed(0)}%`],
      ['Research', hours.research, 100, `${Math.min(100, (hours.research / 100) * 100).toFixed(0)}%`],
      ['Volunteer', hours.volunteer, 100, `${Math.min(100, (hours.volunteer / 100) * 100).toFixed(0)}%`],
      ['Shadowing', hours.shadowing, 100, `${Math.min(100, (hours.shadowing / 100) * 100).toFixed(0)}%`],
      ['Total Hours', hours.clinical + hours.research + hours.volunteer + hours.shadowing],
      [],
      ['MCAT PLAN'],
      ['Target Date', examPlan.targetDate || 'Not Set'],
      ['Target Score', examPlan.targetScore || 'Not Set'],
      ['Current Phase', examPlan.currentPhase || 'Not Set'],
      ['Weekly Study Hours', examPlan.weeklyHours || 0],
      ['Practice Test Avg', avgScore],
      [],
      ['ROADMAP PROGRESS'],
      ['Completed Priorities', completedPriorities.length],
    ];

    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadBlob(csv, `premed-progress-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  // ── PDF export ────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    const { hours, examPlan, gpa, bcpmGpa, avgScore, practiceTests, completedPriorities } = loadData();
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    let y = 20;

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Pre-Med Journey', 14, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Progress Report', 14, 22);
    doc.text(`Generated: ${dateStr}`, 140, 22);
    doc.setTextColor(30, 30, 30);
    y = 44;

    // Profile
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Profile', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [],
      body: [
        ['Name', userProfile.name || 'Not set'],
        ['School', userProfile.school || 'Not set'],
        ['Year', getYearLabel(userProfile.year)],
        ['Semester', userProfile.semester.charAt(0).toUpperCase() + userProfile.semester.slice(1)],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2.5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40, textColor: [100, 100, 100] } },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // GPA
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('GPA Summary', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Cumulative GPA', gpa],
        ['BCPM GPA', bcpmGpa],
      ],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Experience Hours
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Experience Hours', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [['Type', 'Hours', 'Target', '% Complete']],
      body: [
        ['Clinical', hours.clinical, 200, `${Math.min(100, (hours.clinical / 200) * 100).toFixed(0)}%`],
        ['Research', hours.research, 100, `${Math.min(100, (hours.research / 100) * 100).toFixed(0)}%`],
        ['Volunteer', hours.volunteer, 100, `${Math.min(100, (hours.volunteer / 100) * 100).toFixed(0)}%`],
        ['Shadowing', hours.shadowing, 100, `${Math.min(100, (hours.shadowing / 100) * 100).toFixed(0)}%`],
        ['Total', hours.clinical + hours.research + hours.volunteer + hours.shadowing, '—', '—'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // MCAT
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('MCAT Plan', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [],
      body: [
        ['Target Date', examPlan.targetDate || 'Not Set'],
        ['Target Score', examPlan.targetScore ? String(examPlan.targetScore) : 'Not Set'],
        ['Current Phase', examPlan.currentPhase || 'Not Set'],
        ['Weekly Study Hours', String(examPlan.weeklyHours || 0)],
        ['Practice Test Average', avgScore],
        ['Total Practice Tests', String(practiceTests.length)],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2.5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60, textColor: [100, 100, 100] } },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // Roadmap progress
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Roadmap Progress', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [],
      body: [['Completed Priorities', String(completedPriorities.length)]],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2.5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60, textColor: [100, 100, 100] } },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('© 2026 SERH Solutions LLC. All data stored locally on device.', 14, 290);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    doc.save(`premed-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="size-12 border border-white/30 bg-white/10">
            <AvatarImage
              src={`data:image/svg+xml;utf8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
                  <rect width="96" height="96" rx="48" fill="#FFFFFF"/>
                  <circle cx="48" cy="38" r="16" fill="#C084FC"/>
                  <path d="M22 78c5-14 18-22 26-22s21 8 26 22" fill="#A855F7"/>
                </svg>
              `)}`}
            />
            <AvatarFallback className="bg-white/10 text-white">PM</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {userProfile.name.trim() ? userProfile.name : 'Your Profile'}
            </h2>
            <p className="text-purple-100">
              {userProfile.school.trim() ? userProfile.school : 'Manage your account and data'}
            </p>
          </div>
        </div>
      </div>

      {/* Incomplete profile banner */}
      {isProfileIncomplete && !editing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Your profile is incomplete</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Add your name and school to personalize your roadmap and exports.
            </p>
          </div>
          <button
            onClick={handleStartEdit}
            className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Complete
          </button>
        </div>
      )}

      {/* Your Information */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
          {!editing ? (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Pencil size={14} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Check size={14} />
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Name */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100 gap-3">
            <span className="text-sm text-gray-500 shrink-0 w-20">Name</span>
            {editing ? (
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Your first name"
                className="flex-1 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:outline-none text-right"
              />
            ) : (
              <span className={`font-medium text-right ${userProfile.name.trim() ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                {userProfile.name.trim() || 'Not set'}
              </span>
            )}
          </div>

          {/* School */}
          <div className="flex items-center justify-between py-2 gap-3">
            <span className="text-sm text-gray-500 shrink-0 w-20">School</span>
            {editing ? (
              <input
                type="text"
                value={draft.school}
                onChange={(e) => setDraft({ ...draft, school: e.target.value })}
                placeholder="e.g., UCLA"
                className="flex-1 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:outline-none text-right"
              />
            ) : (
              <span className={`font-medium text-right ${userProfile.school.trim() ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                {userProfile.school.trim() || 'Not set'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Data Management</h3>
        <p className="text-xs text-gray-500 mb-4">Export your full progress as a file you can save or share.</p>
        <div className="space-y-3">
          {/* PDF */}
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="text-blue-600 shrink-0" size={24} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Export as PDF</div>
              <div className="text-sm text-gray-600">Formatted progress report — great for printing or sharing</div>
            </div>
          </button>

          {/* CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center gap-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileDown className="text-purple-600 shrink-0" size={24} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Export as CSV</div>
              <div className="text-sm text-gray-600">Lightweight summary — opens in any spreadsheet app</div>
            </div>
          </button>

          {/* Excel */}
          <button
            onClick={handleExportExcel}
            className="w-full flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet className="text-green-600 shrink-0" size={24} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Export as Excel</div>
              <div className="text-sm text-gray-600">Full multi-tab workbook with courses, MCAT, and hours</div>
            </div>
          </button>

          {/* Clear */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center gap-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="text-red-600 shrink-0" size={24} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Clear All Data</div>
              <div className="text-sm text-gray-600">Reset app and start over</div>
            </div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-gray-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">About</h3>
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-gray-500">
          <p>
            Pre-Med Journey helps you track your progress toward medical school acceptance. All data is stored locally on your device. Nothing is sent to external servers.
          </p>
          <p>
            Disclaimer: This tool is for educational and organizational purposes only. It does not guarantee admission to any medical school or specific exam results. Always verify benchmarks with official AAMC or AACOMAS resources.
          </p>
          <p>Based on &apos;Med School Bound – The Year-by-Year Roadmap Nobody Gave You&apos;</p>
          <p>© 2026 SERH Solutions LLC. All Rights Reserved.</p>
          <p className="pt-2">
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View Full Terms &amp; Conditions
            </button>
          </p>
        </div>
      </div>

      {/* Clear confirm modal */}
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

      {/* Terms modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Terms and Conditions</h3>
                <p className="mt-1 text-sm text-gray-500">Pre-Med Tracker &amp; Med School Bound Roadmap</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="mt-6 space-y-5 text-sm leading-relaxed text-gray-700">
              <section>
                <h4 className="font-semibold text-gray-900">1. Scope of Service &amp; No Guarantee</h4>
                <p className="mt-2">
                  The Pre-Med Tracker and the Med School Bound Roadmap are educational tools designed to help students organize their application journey. SERH Solutions LLC does not guarantee admission to any medical school, specific test scores (MCAT), or academic outcomes. Admissions decisions are made solely by the respective institutions. Users are responsible for verifying all deadlines and requirements with official bodies like the AAMC (AMCAS) or AACOMAS.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-gray-900">2. Privacy &amp; Data Storage</h4>
                <p className="mt-2">We value your privacy. The Pre-Med Tracker is designed as a "local-first" application. This means:</p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>All data you enter (GPA, hours, scores) is stored locally on your own device&apos;s browser.</li>
                  <li>SERH Solutions LLC does not collect, store, or have access to your personal data or academic records.</li>
                  <li>Clearing your browser cache or data may result in the loss of entered information. We recommend exporting your data regularly.</li>
                </ul>
              </section>
              <section>
                <h4 className="font-semibold text-gray-900">3. Digital Sales &amp; Intellectual Property</h4>
                <p className="mt-2">By purchasing access to these tools, you are granted a single-user license.</p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li><strong>No Refunds:</strong> Due to the digital nature of these products, all sales are final once access is provided.</li>
                  <li><strong>Property Rights:</strong> The code, design, and content of the Roadmap and Tracker are the intellectual property of SERH Solutions LLC. Unauthorized distribution, reselling, or "cloning" of these tools is strictly prohibited.</li>
                  <li><strong>Support:</strong> SERH Solutions LLC provides the tool "as-is" and is not responsible for technical issues arising from the user's hardware or browser compatibility.</li>
                </ul>
              </section>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
              © 2026 SERH Solutions LLC. All Rights Reserved.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
