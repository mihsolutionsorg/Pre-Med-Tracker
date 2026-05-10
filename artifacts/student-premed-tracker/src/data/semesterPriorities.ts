export interface Priority {
  id: string;
  text: string;
  category: string;
  timeEstimate?: string;
}

export const semesterPriorities: Record<string, Record<string, Priority[]>> = {
  'undergrad-freshman': {
    fall: [
      { id: 'fr-f-1', text: 'Meet with pre-med advisor within first 2 weeks', category: 'Academic', timeEstimate: '30-45 min' },
      { id: 'fr-f-2', text: 'Enroll in Biology I and General Chemistry I together', category: 'Academic', timeEstimate: '1 hour' },
      { id: 'fr-f-3', text: 'Strive for GPA of 3.65+ in first semester', category: 'Academic', timeEstimate: 'Full semester' },
      { id: 'fr-f-4', text: 'Visit every science professor during office hours before first exam', category: 'Academic', timeEstimate: '2-3 hours' },
      { id: 'fr-f-5', text: 'Do not take more than 16 credit hours', category: 'Academic', timeEstimate: '15 min' },
      { id: 'fr-f-6', text: 'Research 10 physicians and send cold emails for shadowing', category: 'Clinical', timeEstimate: '1-2 hours' },
      { id: 'fr-f-7', text: 'Join 1-2 organizations (quality over quantity)', category: 'Extracurricular', timeEstimate: '2-3 hours' },
      { id: 'fr-f-8', text: 'Choose at least one non-medical community service organization', category: 'Extracurricular', timeEstimate: '1 hour' },
      { id: 'fr-f-9', text: 'Create free AMCAS account at aamc.org', category: 'Application', timeEstimate: '10 min' },
      { id: 'fr-f-10', text: 'Begin tracking accomplishments document (update monthly)', category: 'Application', timeEstimate: '30 min' },
      { id: 'fr-f-11', text: 'Establish schedule with 8 hours sleep and full day off', category: 'Wellness', timeEstimate: 'Ongoing' },
    ],
    spring: [
      { id: 'fr-s-1', text: 'Enroll in Biology II and General Chemistry II', category: 'Academic' },
      { id: 'fr-s-2', text: 'Maintain cumulative GPA of 3.65+', category: 'Academic' },
      { id: 'fr-s-3', text: 'Secure at least one consistent shadowing placement', category: 'Clinical' },
      { id: 'fr-s-4', text: 'Document each shadowing session with date, specialty, hours, observation', category: 'Clinical' },
      { id: 'fr-s-5', text: 'Consistently attend and take on small responsibility in organization', category: 'Extracurricular' },
      { id: 'fr-s-6', text: 'Discuss full financial commitment with family ($300k+)', category: 'Planning' },
      { id: 'fr-s-7', text: 'Investigate what DO degree entails and how it aligns with goals', category: 'Planning' },
    ],
    summer: [
      { id: 'fr-su-1', text: 'Retake any course with grade C or below', category: 'Academic' },
      { id: 'fr-su-2', text: 'Enroll in light summer course (English, Psych, Sociology)', category: 'Academic' },
      { id: 'fr-su-3', text: 'Aim for 40-60 cumulative shadowing hours by end of freshman year', category: 'Clinical' },
    ],
  },
  'undergrad-sophomore': {
    fall: [
      { id: 'so-f-1', text: 'Enroll in Organic Chemistry I', category: 'Academic' },
      { id: 'so-f-2', text: 'Attend weekly Organic Chemistry office hours (not just before exams)', category: 'Academic' },
      { id: 'so-f-3', text: 'Maintain cumulative GPA of 3.6+', category: 'Academic' },
      { id: 'so-f-4', text: 'Add a second shadowing specialty (primary care + one other)', category: 'Clinical' },
      { id: 'so-f-5', text: 'Consider volunteering at hospital in addition to shadowing', category: 'Clinical' },
      { id: 'so-f-6', text: 'Take on specific leadership role in at least one organization', category: 'Extracurricular' },
      { id: 'so-f-7', text: 'Schedule meeting with pre-med advisor before semester begins', category: 'Planning' },
      { id: 'so-f-8', text: 'Practice "Why Medicine" story (2 min without saying "helping people")', category: 'Planning' },
    ],
    spring: [
      { id: 'so-s-1', text: 'Complete Organic Chemistry II', category: 'Academic' },
      { id: 'so-s-2', text: 'Start Physics I', category: 'Academic' },
      { id: 'so-s-3', text: 'Target cumulative GPA of 3.65+ by end of sophomore year', category: 'Academic' },
      { id: 'so-s-4', text: 'Achieve total of 100 shadowing hours by end of sophomore year', category: 'Clinical' },
      { id: 'so-s-5', text: 'Ask shadowing physician: "What do you wish you\'d known before med school?"', category: 'Clinical' },
      { id: 'so-s-6', text: 'Join or start research lab (even as unpaid assistant)', category: 'Research' },
      { id: 'so-s-7', text: 'Achieve 50+ hours non-clinical community service', category: 'Extracurricular' },
      { id: 'so-s-8', text: 'Choose 3 letter of rec writers by April', category: 'Application' },
      { id: 'so-s-9', text: 'Understand school\'s pre-med committee letter process', category: 'Application' },
    ],
    summer: [
      { id: 'so-su-1', text: 'Take free MCAT diagnostic test without preparation', category: 'MCAT' },
      { id: 'so-su-2', text: 'Plan MCAT prep timeline based on diagnostic (6-month if <500, 90-day if 500-508)', category: 'MCAT' },
      { id: 'so-su-3', text: 'Apply for scribe position, clinical internship, or EMT certification', category: 'Clinical' },
    ],
  },
  'undergrad-junior': {
    fall: [
      { id: 'ju-f-1', text: 'Complete Physics II and Biochemistry simultaneously', category: 'Academic' },
      { id: 'ju-f-2', text: 'Maintain cumulative GPA of 3.65+', category: 'Academic' },
      { id: 'ju-f-3', text: 'Register for MCAT by November (target Jan-Apr test date)', category: 'MCAT' },
      { id: 'ju-f-4', text: 'Start MCAT prep in October (6-month) or January (90-day)', category: 'MCAT' },
      { id: 'ju-f-5', text: 'Purchase AAMC Official Prep Bundle', category: 'MCAT' },
      { id: 'ju-f-6', text: 'Aim for 150+ cumulative clinical hours by end of fall', category: 'Clinical' },
      { id: 'ju-f-7', text: 'Identify most significant clinical experience for personal statement', category: 'Clinical' },
      { id: 'ju-f-8', text: 'Confirm formal leadership title in at least one activity', category: 'Extracurricular' },
      { id: 'ju-f-9', text: 'Achieve 80+ non-clinical volunteer hours', category: 'Extracurricular' },
      { id: 'ju-f-10', text: 'Compile list of 25-30 target schools using MSAR', category: 'Application' },
      { id: 'ju-f-11', text: 'Organize school list: 5-7 reach, 10-12 target, 5-7 safety, 3-5 DO', category: 'Application' },
    ],
    spring: [
      { id: 'ju-s-1', text: 'Complete remaining prerequisites (English, Sociology, Psychology)', category: 'Academic' },
      { id: 'ju-s-2', text: 'Final GPA check: if below 3.5, seriously consider gap year', category: 'Academic' },
      { id: 'ju-s-3', text: 'Complete all 6 AAMC full-length practice exams under timed conditions', category: 'MCAT' },
      { id: 'ju-s-4', text: 'Target MCAT scores: 511-515 competitive MD, 517+ top 20', category: 'MCAT' },
      { id: 'ju-s-5', text: 'If practice scores below 507, extend prep time - do not test yet', category: 'MCAT' },
      { id: 'ju-s-6', text: 'Achieve 200 cumulative clinical hours by May', category: 'Clinical' },
      { id: 'ju-s-7', text: 'MARCH: Begin drafting personal statement (plan for 10+ drafts)', category: 'Application' },
      { id: 'ju-s-8', text: 'APRIL: Request letters of rec 6-8 weeks in advance with Brag Sheet', category: 'Application' },
      { id: 'ju-s-9', text: 'MAY: Start filling AMCAS activities section (15 slots, 700 chars each)', category: 'Application' },
      { id: 'ju-s-10', text: 'Designate 3 Most Meaningful activities (1,325 chars each)', category: 'Application' },
      { id: 'ju-s-11', text: 'Establish backup plan (gap year, post-bacc, SMP, DO schools)', category: 'Planning' },
    ],
    summer: [
      { id: 'ju-su-1', text: 'JUNE 1: Submit AMCAS application on opening day', category: 'Application' },
      { id: 'ju-su-2', text: 'Pre-write secondary essays using prior-year prompts', category: 'Application' },
      { id: 'ju-su-3', text: 'Return all secondaries within 14 days of receipt', category: 'Application' },
    ],
  },
  'undergrad-senior': {
    fall: [
      { id: 'se-f-1', text: 'Keep GPA up - schools can rescind acceptances for academic decline', category: 'Academic' },
      { id: 'se-f-2', text: 'Complete Biochemistry if not done yet', category: 'Academic' },
      { id: 'se-f-3', text: 'Decide by Oct 1 whether to retake MCAT (fall retake too late for cycle)', category: 'MCAT' },
      { id: 'se-f-4', text: 'Complete all secondaries within 14 days of receipt', category: 'Application' },
      { id: 'se-f-5', text: 'Prepare for both MMI and Traditional Panel interview formats', category: 'Interview' },
      { id: 'se-f-6', text: 'Research each interview school for 4+ hours before arriving', category: 'Interview' },
      { id: 'se-f-7', text: 'Send thank-you email within 24 hours of each interview', category: 'Interview' },
    ],
    spring: [
      { id: 'se-s-1', text: 'If waitlisted, send ONE update letter per school per month', category: 'Application' },
      { id: 'se-s-2', text: 'If accepted to multiple schools, decide by April 30', category: 'Application' },
      { id: 'se-s-3', text: 'Withdraw from all other schools the day you commit', category: 'Application' },
    ],
    summer: [],
  },
  'gap-year': {
    fall: [
      { id: 'gap-f-1', text: 'Work full-time in healthcare (scribe, EMT, clinical research coordinator)', category: 'Clinical' },
      { id: 'gap-f-2', text: 'Aim for 1,000+ clinical hours during gap year', category: 'Clinical' },
      { id: 'gap-f-3', text: 'Choose paid positions when possible to offset application costs', category: 'Clinical' },
      { id: 'gap-f-4', text: 'If GPA below 3.5, enroll in SMP or post-bacc program', category: 'Academic' },
      { id: 'gap-f-5', text: 'If MCAT below 507, retake with structured 3-6 month study plan', category: 'MCAT' },
    ],
    spring: [
      { id: 'gap-s-1', text: 'Completely rewrite personal statement with new experiences and maturity', category: 'Application' },
      { id: 'gap-s-2', text: 'Expand school list to include more DO and mid-tier MD programs', category: 'Application' },
      { id: 'gap-s-3', text: 'Get professional feedback on application from advisors or consultants', category: 'Application' },
      { id: 'gap-s-4', text: 'Build new relationships for updated letters of rec reflecting gap year growth', category: 'Application' },
    ],
    summer: [
      { id: 'gap-su-1', text: 'Submit AMCAS on June 1 (opening day)', category: 'Application' },
      { id: 'gap-su-2', text: 'Complete post-bacc or SMP if enrolled for GPA recovery', category: 'Academic' },
    ],
  },
};

export const ALL_PRIORITY_IDS: string[] = Object.values(semesterPriorities)
  .flatMap(yearData => Object.values(yearData))
  .flatMap(termList => termList.map(p => p.id));
