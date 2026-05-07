import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen, Stethoscope, Users, FileText, Brain, Heart } from 'lucide-react';

interface RoadmapViewProps {
  currentStatus: string;
}

interface RoadmapItem {
  text: string;
}

interface SemesterSection {
  title: string;
  icon: any;
  color: string;
  items: RoadmapItem[];
}

interface Semester {
  season: string;
  sections: SemesterSection[];
}

interface YearData {
  year: string;
  progress: number;
  subtitle: string;
  semesters: Semester[];
  redFlags?: string[];
}

const roadmapData: Record<string, YearData> = {
  'undergrad-freshman': {
    year: 'Freshman Year',
    progress: 25,
    subtitle: 'Build The Foundation',
    semesters: [
      {
        season: 'Fall',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Meet with your pre-med advisor within the first two weeks of school. Advisors control the committee letters at many schools, so start this relationship in the first month.' },
              { text: 'Enroll in Biology I and General Chemistry I together. These courses are co-requisites, and completing them simultaneously ensures you stay on track.' },
              { text: 'Strive for a GPA of 3.65 or higher in your first semester. Your freshman GPA establishes the maximum limit for your cumulative GPA.' },
              { text: 'Make sure to visit every science professor during office hours at least once before the first exam. They are your future letter writers.' },
              { text: 'Do not take more than 16 credit hours. Taking on too many credits during freshman year is the leading cause of GPA declines.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Research ten physicians in your area and send cold emails requesting shadowing opportunities. Starting now gives you a significant advantage.' },
              { text: 'Use the subject line: "Pre-Med Student Requesting Shadowing at [Your University]." Specific subject lines receive responses.' }
            ]
          },
          {
            title: 'Extracurriculars & Volunteering',
            icon: Users,
            color: 'text-green-600',
            items: [
              { text: 'Join a maximum of 1–2 organizations. Admissions committees value depth and leadership over a long list of activities.' },
              { text: 'Choose at least one community service organization that is unrelated to medicine.' }
            ]
          },
          {
            title: 'Application Awareness',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'Create a free AMCAS account at aamc.org. Explore the application structure during your freshman year.' },
              { text: 'Begin a document to track your accomplishments and experiences. Update it monthly.' }
            ]
          },
          {
            title: 'Mindset & Logistics',
            icon: Heart,
            color: 'text-pink-600',
            items: [
              { text: 'Establish a weekly schedule that ensures 8 hours of sleep and a full day off. Burnout during freshman year can derail students.' }
            ]
          }
        ]
      },
      {
        season: 'Spring',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Enroll in Biology II and General Chemistry II. Completing both full sequences during your freshman year will keep you on schedule.' },
              { text: 'Maintain a cumulative GPA of 3.65 or higher. Admissions committees review every semester.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Secure at least one consistent shadowing placement. Spending 1–2 hours each week adds up to 50–100 hours annually.' },
              { text: 'Document each session by date, physician, specialty, hours, and one observation note. You will need specific stories for your personal statement.' }
            ]
          },
          {
            title: 'Extracurriculars & Volunteering',
            icon: Users,
            color: 'text-green-600',
            items: [
              { text: 'Consistently attend and take on a small responsibility within your organization. Leadership positions go to those who show up.' }
            ]
          },
          {
            title: 'Mindset & Logistics',
            icon: Heart,
            color: 'text-pink-600',
            items: [
              { text: 'Discuss the full financial commitment of this path with your family. The costs can exceed $300,000.' },
              { text: 'Investigate what a DO degree entails and how it aligns with your goals. DO schools are legitimate, competitive, and a strong strategic option.' }
            ]
          }
        ]
      },
      {
        season: 'Summer',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Retake any course in which you earned a grade of C or below; do not wait. AMCAS averages all grades.' },
              { text: 'Enroll in a light summer course, such as English, Psychology, or Sociology. Earning easy credits helps maintain your GPA.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Aim for 40–60 cumulative shadowing hours by the end of your freshman year. Competitive applicants typically have 100–200 hours in total.' }
            ]
          }
        ]
      }
    ],
    redFlags: [
      'If your GPA at the end of the first year is below 3.5, schedule a meeting with your advisor this week. A 3.4 is recoverable, but a 3.2 after sophomore year is concerning.',
      'You have not visited any professors\' office hours by midterms. Go this week. Bring a question and introduce yourself by name.'
    ]
  },
  'undergrad-sophomore': {
    year: 'Sophomore Year',
    progress: 50,
    subtitle: 'Clinical Foundation & Orgo Survival',
    semesters: [
      {
        season: 'Fall',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Enroll in Organic Chemistry I. Organic Chemistry is a key filter. Schools closely evaluate that grade.' },
              { text: 'Attend weekly Organic Chemistry office hours, not just before exams. The material is cumulative.' },
              { text: 'Maintain a cumulative GPA of 3.6 or higher. Below 3.6 will require nearly perfect grades to regain eligibility for top schools.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Add a second shadowing specialty. Aim for primary care and one other. Shadowing only one specialty appears limited.' },
              { text: 'Consider volunteering at a hospital as an addition to physician shadowing. Hospital volunteering provides direct patient contact.' }
            ]
          },
          {
            title: 'Extracurriculars & Volunteering',
            icon: Users,
            color: 'text-green-600',
            items: [
              { text: 'Take on a specific leadership role in at least one organization. The AMCAS application requires a specific title.' }
            ]
          },
          {
            title: 'Mindset & Logistics',
            icon: Heart,
            color: 'text-pink-600',
            items: [
              { text: 'Schedule a meeting with your pre-med advisor before the semester begins. Advisors can identify off-track patterns.' },
              { text: 'Practice your "Why Medicine" story. Can you explain it in two minutes without using "helping people"?' }
            ]
          }
        ]
      },
      {
        season: 'Spring',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Complete Organic Chemistry II, required for nearly all MD and DO programs.' },
              { text: 'Start with Physics I. Physics is tested on the MCAT and is a prerequisite for nearly all MD programs.' },
              { text: 'Cumulative GPA target by end of sophomore year: 3.65 or higher. This is the competitive minimum for mid-tier MD programs.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Achieve a total of 100 shadowing hours by the end of your sophomore year. This is the minimum acceptable by most admissions committees.' },
              { text: 'Engage your shadowing physician: "What do you wish you\'d known before medical school?" These discussions make personal statements memorable.' }
            ]
          },
          {
            title: 'Extracurriculars & Volunteering',
            icon: Users,
            color: 'text-green-600',
            items: [
              { text: 'Consider joining or starting a research lab, even as an unpaid assistant. Most MD programs strongly prefer research experience.' },
              { text: 'Achieve over 50 hours of non-clinical community service by the end of your sophomore year.' }
            ]
          },
          {
            title: 'Application Awareness',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'Choose three writers for your letters of recommendation by April. You will request these letters in April/May of junior year.' },
              { text: 'Investigate whether your school requires a pre-med committee letter and understand the process involved.' }
            ]
          }
        ]
      },
      {
        season: 'Summer',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Take a free MCAT diagnostic test (AAMC free sample) without preparation. Your diagnostic score indicates how long your prep needs to be.' },
              { text: 'If diagnostic is below 500, plan for 6-month prep. If 500-508, plan for 90 days. Don\'t condense 6 months into 3.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Apply for a scribe position, clinical internship, or EMT certification. Scribing offers 400–600 clinical hours during one summer.' }
            ]
          }
        ]
      }
    ],
    redFlags: [
      'You received a grade of C or lower in Organic Chemistry. Retake the course in the next available semester. Assess whether your study methods need adjustment.',
      'You have less than 30 shadowing hours by end of sophomore year. This is urgent. You need 100–200 hours total. Increase to 4–6 hours per week immediately.'
    ]
  },
  'undergrad-junior': {
    year: 'Junior Year',
    progress: 75,
    subtitle: 'Build Your Application',
    semesters: [
      {
        season: 'Fall',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Simultaneously complete Physics II and Biochemistry. Biochemistry offers the highest yield for the MCAT.' },
              { text: 'Maintain a cumulative GPA of 3.65 or higher. Senior year first-semester grades arrive after most secondary deadlines.' }
            ]
          },
          {
            title: 'MCAT',
            icon: Brain,
            color: 'text-orange-600',
            items: [
              { text: 'Register for the MCAT by November to target a January, March, or April test date. Popular dates fill up months in advance.' },
              { text: 'Start MCAT prep in October for a 6-month plan or January for a 90-day plan. Structure around your exam dates.' },
              { text: 'Purchase the AAMC Official Prep Bundle. This is non-negotiable, as AAMC materials are closest to real exam content.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'By end of junior fall, aim for 150+ cumulative clinical hours. When applying, ensure you have at least 200 hours.' },
              { text: 'Identify your most significant clinical experience. This will anchor your personal statement.' }
            ]
          },
          {
            title: 'Extracurriculars & Volunteering',
            icon: Users,
            color: 'text-green-600',
            items: [
              { text: 'Confirm that you hold a formal leadership title in at least one activity. AMCAS requires a specific name and description.' },
              { text: 'Non-clinical volunteer hours should exceed 80 by end of junior fall. Admissions committees seek sustained involvement.' }
            ]
          },
          {
            title: 'Application Mechanics',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'Compile a list of 25-30 target schools using the MSAR (AAMC.org). Applying to schools where your stats fall below their 10th percentile is costly.' },
              { text: 'Organize your list: 5–7 reach schools, 10–12 target schools, 5–7 safety schools, 3–5 DO programs.' }
            ]
          }
        ]
      },
      {
        season: 'Spring',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Complete any remaining prerequisites: English, Sociology, and Psychology. Psych and Soc make up 25% of the MCAT.' },
              { text: 'Final GPA check: If below 3.5, seriously consider taking a gap year. Applying with a 3.4 GPA and getting rejected wastes $3,000-$5,000.' }
            ]
          },
          {
            title: 'MCAT',
            icon: Brain,
            color: 'text-orange-600',
            items: [
              { text: 'Complete all six AAMC full-length practice exams under timed conditions. Students who complete all six score 3-5 points higher.' },
              { text: 'Target scores: 511-515 for competitive MD, 517+ for top 20 schools. MCAT is used to screen before a human reviews your file.' },
              { text: 'If practice scores consistently fall below 507, extend your prep time. Do not take the test yet. Low scores create a hard-to-overcome record.' }
            ]
          },
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Achieve 200 cumulative clinical hours by May of junior year. 200 hours is competitive; 300+ is comfortable; 500+ is exceptional.' }
            ]
          },
          {
            title: 'Application Mechanics',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'MARCH: Begin drafting your personal statement. Plan for 10+ drafts. Early drafts are too chronological or generic. Iteration is the process.' },
              { text: 'APRIL: Request letters of recommendation 6–8 weeks in advance. Rushed letters are generic. Give writers a Brag Sheet: resume, personal statement draft, specific moments.' },
              { text: 'MAY: AMCAS opens for data entry. Start filling activities section — 15 slots, 700 characters each. This takes 15–20 hours to complete correctly. Designate three Most Meaningful activities.' }
            ]
          },
          {
            title: 'Mindset & Logistics',
            icon: Heart,
            color: 'text-pink-600',
            items: [
              { text: 'Establish your backup plan before applying. Options: gap year, post-bacc program, special master\'s program, or DO school. Students with Plan B interview better.' },
              { text: 'Research Special Master\'s Programs if you need to strengthen your GPA. SMPs are the most effective tool for replacing a GPA.' }
            ]
          }
        ]
      },
      {
        season: 'Summer',
        sections: [
          {
            title: 'Application Mechanics',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'JUNE 1: Submit your AMCAS application on opening day. This is the single most important deadline. June 1 submitters are verified by mid-July. August submitters are 2–3 months behind.' },
              { text: 'Pre-write your secondary essays using prior-year prompts from StudentDoctor.net. Schools expect secondaries returned within 14 days.' }
            ]
          }
        ]
      }
    ],
    redFlags: [
      'If you haven\'t registered for the MCAT by February, visit aamc.org immediately. Popular test dates fill months in advance. Missing your target date delays your application by an entire year.',
      'Planning to submit AMCAS after August 1? Restructure your timeline now. Applying in August vs June can cost you 30–40% of your interview opportunities.'
    ]
  },
  'undergrad-senior': {
    year: 'Senior Year',
    progress: 100,
    subtitle: 'Execute, Interview, Decide',
    semesters: [
      {
        season: 'Fall',
        sections: [
          {
            title: 'Academic',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'Keep your GPA up. Do not slack off. Schools can rescind acceptances if you experience academic decline.' },
              { text: 'If you haven\'t completed Biochemistry, take it now. Some programs may not grant an interview without completing prerequisites.' }
            ]
          },
          {
            title: 'MCAT',
            icon: Brain,
            color: 'text-orange-600',
            items: [
              { text: 'If your score is below your target range, decide by October 1 whether to retake. A fall retake score arrives too late for this cycle.' },
              { text: 'Maximum recommended attempts: 3. After 3 attempts, each will face increasing scrutiny.' }
            ]
          },
          {
            title: 'Application Mechanics',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'Complete all secondary applications within 14 days of receipt. Schools monitor response times.' },
              { text: 'Prepare for both interview formats: MMI and Traditional Panel. 40% of MD programs use the MMI.' },
              { text: 'Research each interview school for at least 4 hours before arriving. "Why our school?" is asked in every interview.' },
              { text: 'Send a thank-you email within 24 hours of each interview. Small details indicate professionalism.' }
            ]
          }
        ]
      },
      {
        season: 'Spring',
        sections: [
          {
            title: 'Application Mechanics',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'If waitlisted, send one update letter per school each month, no more. Monthly updates demonstrate interest; weekly communication reflects poor judgment.' },
              { text: 'If accepted to multiple schools, submit your deposit and decide by April 30. Missing this deadline could result in loss of acceptance.' },
              { text: 'Withdraw from all other schools the day you commit. Holding multiple spots prevents other students from securing positions.' }
            ]
          }
        ]
      }
    ],
    redFlags: [
      'If you haven\'t received any interview invitations by November 1, it suggests a problem with your application. Consider professional review. Submit to DO schools through AACOMAS immediately.',
      'By March 1, if you have interview invitations but no acceptances, you\'re probably on waitlists. Send a Letter of Intent to your top choice and quarterly update letters to all waitlisted schools.'
    ]
  },
  'gap-year': {
    year: 'Gap Year / Post-Bacc',
    progress: 80,
    subtitle: 'Strengthen & Reapply',
    semesters: [
      {
        season: 'Current Priorities',
        sections: [
          {
            title: 'Clinical Experience',
            icon: Stethoscope,
            color: 'text-red-600',
            items: [
              { text: 'Work full-time in healthcare: medical scribe, EMT, clinical research coordinator, or patient care assistant.' },
              { text: 'Aim for 1,000+ clinical hours during your gap year. This dramatically strengthens your application.' },
              { text: 'Choose paid positions when possible. Gap year income helps offset application costs.' }
            ]
          },
          {
            title: 'Academic (If Needed)',
            icon: BookOpen,
            color: 'text-blue-600',
            items: [
              { text: 'If your GPA is below 3.5, enroll in a Special Master\'s Program (SMP) or post-baccalaureate program.' },
              { text: 'If your MCAT is below 507, retake it. Use a structured 3-6 month study plan.' },
              { text: 'Take additional upper-level science courses to demonstrate academic capability.' }
            ]
          },
          {
            title: 'Application Refinement',
            icon: FileText,
            color: 'text-purple-600',
            items: [
              { text: 'Completely rewrite your personal statement with your new experiences and maturity.' },
              { text: 'Expand your school list to include more DO programs and mid-tier MD programs.' },
              { text: 'Get professional feedback on your application from advisors or consulting services.' },
              { text: 'Build new relationships for updated letters of recommendation that reflect your gap year growth.' }
            ]
          },
          {
            title: 'Mindset',
            icon: Heart,
            color: 'text-pink-600',
            items: [
              { text: 'Remember: gap years are extremely common. 60% of matriculants take at least one gap year.' },
              { text: 'Use this time to become a more complete applicant and a more mature person.' },
              { text: 'Stay connected to the pre-med community and maintain your motivation.' }
            ]
          }
        ]
      }
    ]
  },
};

function SectionCard({ section }: { section: SemesterSection }) {
  const Icon = section.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={section.color} size={20} />
        <h4 className="font-semibold text-gray-900">{section.title}</h4>
      </div>
      <ul className="space-y-2">
        {section.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RoadmapView({ currentStatus }: RoadmapViewProps) {
  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({ '0': true });

  const data = roadmapData[currentStatus] || roadmapData['undergrad-freshman'];

  const toggleSemester = (index: number) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{data.year}</h2>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{data.progress}% Complete</span>
        </div>
        <p className="text-blue-100">{data.subtitle}</p>
      </div>

      {data.semesters.map((semester, semesterIdx) => {
        const isExpanded = expandedSemesters[semesterIdx];

        return (
          <div key={semesterIdx} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <button
              onClick={() => toggleSemester(semesterIdx)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">{semester.season} Semester</h3>
              {isExpanded ? (
                <ChevronUp className="text-gray-500" size={24} />
              ) : (
                <ChevronDown className="text-gray-500" size={24} />
              )}
            </button>

            {isExpanded && (
              <div className="p-5 pt-0 space-y-4">
                {semester.sections.map((section, sectionIdx) => (
                  <SectionCard key={sectionIdx} section={section} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {data.redFlags && data.redFlags.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="font-bold text-red-900">Red Flags to Watch</h3>
          </div>
          <ul className="space-y-3">
            {data.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                <span className="text-red-600 font-bold mt-1 flex-shrink-0">⚠</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
