export type ThemeMode =
  | 'midnight-blue'
  | 'emerald'
  | 'violet'
  | 'dark-professional'
  | 'light-professional';

export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'de';

export type CareerRole =
  | 'Software Developer'
  | 'Full Stack Developer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Data Scientist'
  | 'AI/ML Engineer'
  | 'Cybersecurity Engineer'
  | 'Cloud Engineer'
  | 'DevOps Engineer';

export type ExperienceLevel = 'Student' | 'Junior' | 'Mid-Level' | 'Senior';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetCareer: CareerRole;
  experienceLevel: ExperienceLevel;
  bio: string;
  skills: string[];
  careerScore: number;
  totalQuizzesTaken: number;
  resumesAnalyzedCount: number;
  roadmapsCompletedCount: number;
  applicationsCount: number;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  rationale: string;
}

export interface ResumeAnalysisData {
  candidateName: string;
  atsScore: number;
  summary: string;
  scoreBreakdown: {
    impactAndMetrics: number;
    skillsMatch: number;
    brevityAndFormat: number;
    experienceRelevance: number;
  };
  education: string[];
  detectedSkills: string[];
  missingSkills: string[];
  topStrengths: string[];
  areasForImprovement: string[];
  bulletImprovements: BulletImprovement[];
  recommendedCertifications: string[];
  fileName?: string;
  analyzedAt?: string;
}

export interface MissingSkillDetail {
  name: string;
  priority: 'Critical' | 'Recommended' | 'Good to have';
  description: string;
  estimatedHours: number;
}

export interface SkillGapData {
  targetRole: string;
  matchPercentage: number;
  existingSkillsMatching: string[];
  missingSkills: MissingSkillDetail[];
  priorityAreas: { area: string; rationale: string }[];
  learningRoadmap: {
    phase: string;
    goal: string;
    keyTopics: string[];
  }[];
  recommendedProjects: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: 'Intermediate' | 'Advanced';
    resumeImpact: string;
  }[];
  careerAdvice: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
}

export interface QuizQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'System Design' | 'Frontend' | 'Backend';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Borderline' | 'Needs Improvement';
  technicalAccuracy: number;
  structureAndClarity: number;
  strengths: string[];
  areasForImprovement: string[];
  modelAnswer: string;
  actionableTip: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  focus: string;
  milestones: string[];
  recommendedResources: string[];
  deliverable: string;
  completed?: boolean;
}

export interface PersonalizedRoadmap {
  title: string;
  estimatedWeeklyHours: number;
  weeks: RoadmapWeek[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote';
  status: 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  appliedDate: string;
  notes: string;
  salaryRange?: string;
}
