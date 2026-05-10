export interface Priority {
  id: string;
  label: string;
  text: string;
  category: string;
  timeEstimate?: string;
}

export const semesterPriorities: Record<string, Record<string, Priority[]>> = {
  'undergrad-freshman': {
    fall: [
      { id: 'fr-f-1',  label: 'Meet Pre-Med Advisor',       text: 'Meet with pre-med advisor within first 2 weeks', category: 'Academic', timeEstimate: '30-45 min' },
      { id: 'fr-f-2',  label: 'Enroll in Bio I & Chem I',   text: 'Enroll in Biology I and General Chemistry I together', category: 'Academic', timeEstimate: '1 hour' },
      { id: 'fr-f-3',  label: 'Target 3.65+ GPA',           text: 'Strive for GPA of 3.65+ in first semester', category: 'Academic', timeEstimate: 'Full semester' },
      { id: 'fr-f-4',  label: 'Office Hours Check-In',      text: 'Visit every science professor during office hours before first exam', category: 'Academic', timeEstimate: '2-3 hours' },
      { id: 'fr-f-5',  label: 'Cap at 16 Credit Hours',     text: 'Do not take more than 16 credit hours', category: 'Academic', timeEstimate: '15 min' },
      { id: 'fr-f-6',  label: 'Shadowing Outreach',         text: 'Research 10 physicians and send cold emails for shadowing', category: 'Clinical', timeEstimate: '1-2 hours' },
      { id: 'fr-f-7',  label: 'Join 1–2 Organizations',     text: 'Join 1-2 organizations (quality over quantity)', category: 'Extracurricular', timeEstimate: '2-3 hours' },
      { id: 'fr-f-8',  label: 'Community Service Org',      text: 'Choose at least one non-medical community service organization', category: 'Extracurricular', timeEstimate: '1 hour' },
      { id: 'fr-f-9',  label: 'Create AMCAS Account',       text: 'Create free AMCAS account at aamc.org', category: 'Application', timeEstimate: '10 min' },
      { id: 'fr-f-10', label: 'Start Accomplishments Doc',  text: 'Begin tracking accomplishments document (update monthly)', category: 'Application', timeEstimate: '30 min' },
      { id: 'fr-f-11', label: 'Sustainable Schedule',       text: 'Establish schedule with 8 hours sleep and full day off', category: 'Wellness', timeEstimate: 'Ongoing' },
    ],
    spring: [
      { id: 'fr-s-1', label: 'Enroll in Bio II & Chem II',    text: 'Enroll in Biology II and General Chemistry II', category: 'Academic' },
      { id: 'fr-s-2', label: 'Maintain 3.65+ GPA',            text: 'Maintain cumulative GPA of 3.65+', category: 'Academic' },
      { id: 'fr-s-3', label: 'Secure Shadowing Placement',    text: 'Secure at least one consistent shadowing placement', category: 'Clinical' },
      { id: 'fr-s-4', label: 'Log Shadowing Sessions',        text: 'Document each shadowing session with date, specialty, hours, observation', category: 'Clinical' },
      { id: 'fr-s-5', label: 'Take on Club Responsibility',   text: 'Consistently attend and take on small responsibility in organization', category: 'Extracurricular' },
      { id: 'fr-s-6', label: 'Financial Reality Check',       text: 'Discuss full financial commitment with family ($300k+)', category: 'Planning' },
      { id: 'fr-s-7', label: 'Research DO vs MD',             text: 'Investigate what DO degree entails and how it aligns with goals', category: 'Planning' },
    ],
    summer: [
      { id: 'fr-su-1', label: 'Retake Low-Grade Courses',   text: 'Retake any course with grade C or below', category: 'Academic' },
      { id: 'fr-su-2', label: 'Light Summer Course',        text: 'Enroll in light summer course (English, Psych, Sociology)', category: 'Academic' },
      { id: 'fr-su-3', label: 'Hit 40–60 Shadowing Hours', text: 'Aim for 40-60 cumulative shadowing hours by end of freshman year', category: 'Clinical' },
    ],
  },
  'undergrad-sophomore': {
    fall: [
      { id: 'so-f-1', label: 'Enroll in Orgo I',             text: 'Enroll in Organic Chemistry I', category: 'Academic' },
      { id: 'so-f-2', label: 'Weekly Orgo Office Hours',     text: 'Attend weekly Organic Chemistry office hours (not just before exams)', category: 'Academic' },
      { id: 'so-f-3', label: 'Maintain 3.6+ GPA',           text: 'Maintain cumulative GPA of 3.6+', category: 'Academic' },
      { id: 'so-f-4', label: 'Add Shadowing Specialty',     text: 'Add a second shadowing specialty (primary care + one other)', category: 'Clinical' },
      { id: 'so-f-5', label: 'Hospital Volunteering',       text: 'Consider volunteering at hospital in addition to shadowing', category: 'Clinical' },
      { id: 'so-f-6', label: 'Take Leadership Role',        text: 'Take on specific leadership role in at least one organization', category: 'Extracurricular' },
      { id: 'so-f-7', label: 'Meet Pre-Med Advisor',        text: 'Schedule meeting with pre-med advisor before semester begins', category: 'Planning' },
      { id: 'so-f-8', label: 'Practice "Why Medicine"',     text: 'Practice "Why Medicine" story (2 min without saying "helping people")', category: 'Planning' },
    ],
    spring: [
      { id: 'so-s-1', label: 'Complete Orgo II',              text: 'Complete Organic Chemistry II', category: 'Academic' },
      { id: 'so-s-2', label: 'Start Physics I',               text: 'Start Physics I', category: 'Academic' },
      { id: 'so-s-3', label: 'Target 3.65+ Cumulative GPA',  text: 'Target cumulative GPA of 3.65+ by end of sophomore year', category: 'Academic' },
      { id: 'so-s-4', label: 'Reach 100 Shadowing Hours',    text: 'Achieve total of 100 shadowing hours by end of sophomore year', category: 'Clinical' },
      { id: 'so-s-5', label: 'Deep Shadowing Conversation',  text: 'Ask shadowing physician: "What do you wish you\'d known before med school?"', category: 'Clinical' },
      { id: 'so-s-6', label: 'Join Research Lab',            text: 'Join or start research lab (even as unpaid assistant)', category: 'Research' },
      { id: 'so-s-7', label: '50+ Community Service Hours',  text: 'Achieve 50+ hours non-clinical community service', category: 'Extracurricular' },
      { id: 'so-s-8', label: 'Choose LOR Writers',           text: 'Choose 3 letter of rec writers by April', category: 'Application' },
      { id: 'so-s-9', label: 'Understand Committee Letter',  text: 'Understand school\'s pre-med committee letter process', category: 'Application' },
    ],
    summer: [
      { id: 'so-su-1', label: 'Take MCAT Diagnostic',        text: 'Take free MCAT diagnostic test without preparation', category: 'MCAT' },
      { id: 'so-su-2', label: 'Build MCAT Prep Timeline',    text: 'Plan MCAT prep timeline based on diagnostic (6-month if <500, 90-day if 500-508)', category: 'MCAT' },
      { id: 'so-su-3', label: 'Apply for Clinical Position', text: 'Apply for scribe position, clinical internship, or EMT certification', category: 'Clinical' },
    ],
  },
  'undergrad-junior': {
    fall: [
      { id: 'ju-f-1',  label: 'Physics II & Biochemistry',        text: 'Complete Physics II and Biochemistry simultaneously', category: 'Academic' },
      { id: 'ju-f-2',  label: 'Maintain 3.65+ GPA',              text: 'Maintain cumulative GPA of 3.65+', category: 'Academic' },
      { id: 'ju-f-3',  label: 'Register for MCAT',               text: 'Register for MCAT by November (target Jan-Apr test date)', category: 'MCAT' },
      { id: 'ju-f-4',  label: 'Start MCAT Prep',                 text: 'Start MCAT prep in October (6-month) or January (90-day)', category: 'MCAT' },
      { id: 'ju-f-5',  label: 'Buy AAMC Prep Bundle',            text: 'Purchase AAMC Official Prep Bundle', category: 'MCAT' },
      { id: 'ju-f-6',  label: '150+ Clinical Hours',             text: 'Aim for 150+ cumulative clinical hours by end of fall', category: 'Clinical' },
      { id: 'ju-f-7',  label: 'Identify Key Clinical Experience', text: 'Identify most significant clinical experience for personal statement', category: 'Clinical' },
      { id: 'ju-f-8',  label: 'Confirm Leadership Title',        text: 'Confirm formal leadership title in at least one activity', category: 'Extracurricular' },
      { id: 'ju-f-9',  label: '80+ Volunteer Hours',             text: 'Achieve 80+ non-clinical volunteer hours', category: 'Extracurricular' },
      { id: 'ju-f-10', label: 'Compile School List',             text: 'Compile list of 25-30 target schools using MSAR', category: 'Application' },
      { id: 'ju-f-11', label: 'Organize Reach/Target/Safety',    text: 'Organize school list: 5-7 reach, 10-12 target, 5-7 safety, 3-5 DO', category: 'Application' },
    ],
    spring: [
      { id: 'ju-s-1',  label: 'Finish Prerequisites',         text: 'Complete remaining prerequisites (English, Sociology, Psychology)', category: 'Academic' },
      { id: 'ju-s-2',  label: 'Final GPA Check',              text: 'Final GPA check: if below 3.5, seriously consider gap year', category: 'Academic' },
      { id: 'ju-s-3',  label: '6 AAMC Full-Length Exams',     text: 'Complete all 6 AAMC full-length practice exams under timed conditions', category: 'MCAT' },
      { id: 'ju-s-4',  label: 'Know Your Target Score',       text: 'Target MCAT scores: 511-515 competitive MD, 517+ top 20', category: 'MCAT' },
      { id: 'ju-s-5',  label: 'Extend Prep If Needed',        text: 'If practice scores below 507, extend prep time - do not test yet', category: 'MCAT' },
      { id: 'ju-s-6',  label: '200 Clinical Hours by May',    text: 'Achieve 200 cumulative clinical hours by May', category: 'Clinical' },
      { id: 'ju-s-7',  label: 'Draft Personal Statement',     text: 'MARCH: Begin drafting personal statement (plan for 10+ drafts)', category: 'Application' },
      { id: 'ju-s-8',  label: 'Request Letters of Rec',       text: 'APRIL: Request letters of rec 6-8 weeks in advance with Brag Sheet', category: 'Application' },
      { id: 'ju-s-9',  label: 'Fill AMCAS Activities',        text: 'MAY: Start filling AMCAS activities section (15 slots, 700 chars each)', category: 'Application' },
      { id: 'ju-s-10', label: 'Most Meaningful Activities',   text: 'Designate 3 Most Meaningful activities (1,325 chars each)', category: 'Application' },
      { id: 'ju-s-11', label: 'Establish Backup Plan',        text: 'Establish backup plan (gap year, post-bacc, SMP, DO schools)', category: 'Planning' },
    ],
    summer: [
      { id: 'ju-su-1', label: 'Submit AMCAS June 1',       text: 'JUNE 1: Submit AMCAS application on opening day', category: 'Application' },
      { id: 'ju-su-2', label: 'Pre-Write Secondaries',     text: 'Pre-write secondary essays using prior-year prompts', category: 'Application' },
      { id: 'ju-su-3', label: 'Return Secondaries in 14d', text: 'Return all secondaries within 14 days of receipt', category: 'Application' },
    ],
  },
  'undergrad-senior': {
    fall: [
      { id: 'se-f-1', label: 'Protect Your GPA',         text: 'Keep GPA up - schools can rescind acceptances for academic decline', category: 'Academic' },
      { id: 'se-f-2', label: 'Complete Biochemistry',    text: 'Complete Biochemistry if not done yet', category: 'Academic' },
      { id: 'se-f-3', label: 'MCAT Retake Decision',     text: 'Decide by Oct 1 whether to retake MCAT (fall retake too late for cycle)', category: 'MCAT' },
      { id: 'se-f-4', label: 'Complete All Secondaries', text: 'Complete all secondaries within 14 days of receipt', category: 'Application' },
      { id: 'se-f-5', label: 'Interview Format Prep',    text: 'Prepare for both MMI and Traditional Panel interview formats', category: 'Interview' },
      { id: 'se-f-6', label: 'Research Interview Schools', text: 'Research each interview school for 4+ hours before arriving', category: 'Interview' },
      { id: 'se-f-7', label: 'Send Thank-You Emails',    text: 'Send thank-you email within 24 hours of each interview', category: 'Interview' },
    ],
    spring: [
      { id: 'se-s-1', label: 'Waitlist Update Letters',       text: 'If waitlisted, send ONE update letter per school per month', category: 'Application' },
      { id: 'se-s-2', label: 'Decide by April 30',            text: 'If accepted to multiple schools, decide by April 30', category: 'Application' },
      { id: 'se-s-3', label: 'Withdraw from Other Schools',   text: 'Withdraw from all other schools the day you commit', category: 'Application' },
    ],
    summer: [],
  },
  'gap-year': {
    fall: [
      { id: 'gap-f-1', label: 'Full-Time Healthcare Work',  text: 'Work full-time in healthcare (scribe, EMT, clinical research coordinator)', category: 'Clinical' },
      { id: 'gap-f-2', label: '1,000+ Clinical Hours Goal', text: 'Aim for 1,000+ clinical hours during gap year', category: 'Clinical' },
      { id: 'gap-f-3', label: 'Prioritize Paid Positions',  text: 'Choose paid positions when possible to offset application costs', category: 'Clinical' },
      { id: 'gap-f-4', label: 'Enroll in SMP / Post-Bacc', text: 'If GPA below 3.5, enroll in SMP or post-bacc program', category: 'Academic' },
      { id: 'gap-f-5', label: 'Retake MCAT If Needed',     text: 'If MCAT below 507, retake with structured 3-6 month study plan', category: 'MCAT' },
    ],
    spring: [
      { id: 'gap-s-1', label: 'Rewrite Personal Statement', text: 'Completely rewrite personal statement with new experiences and maturity', category: 'Application' },
      { id: 'gap-s-2', label: 'Expand School List',         text: 'Expand school list to include more DO and mid-tier MD programs', category: 'Application' },
      { id: 'gap-s-3', label: 'Get Application Feedback',   text: 'Get professional feedback on application from advisors or consultants', category: 'Application' },
      { id: 'gap-s-4', label: 'New LOR Relationships',      text: 'Build new relationships for updated letters of rec reflecting gap year growth', category: 'Application' },
    ],
    summer: [
      { id: 'gap-su-1', label: 'Submit AMCAS June 1',    text: 'Submit AMCAS on June 1 (opening day)', category: 'Application' },
      { id: 'gap-su-2', label: 'Complete Post-Bacc/SMP', text: 'Complete post-bacc or SMP if enrolled for GPA recovery', category: 'Academic' },
    ],
  },
};

export const ALL_PRIORITY_IDS: string[] = Object.values(semesterPriorities)
  .flatMap(yearData => Object.values(yearData))
  .flatMap(termList => termList.map(p => p.id));
