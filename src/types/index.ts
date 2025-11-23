// Application & Candidate Types
export interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  linkedIn?: string;
  position: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  aiScore: number;
  scoreBreakdown: ScoreBreakdown;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export type ApplicationStatus = 
  | "new" 
  | "reviewed" 
  | "interview_scheduled" 
  | "rejected" 
  | "hired";

export interface ScoreBreakdown {
  overall: number;
  skills: number;
  experience: number;
  education: number;
  culture: number;
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
}

// Form Types
export interface ApplicationFormData {
  candidateName: string;
  email: string;
  phone: string;
  linkedIn?: string;
  position: string;
  resume: File | null;
  coverLetter?: string;
}

// Position Types
export interface Position {
  id: string;
  title: string;
  department: string;
  isActive: boolean;
}

// Analytics Types
export interface DashboardMetrics {
  totalApplications: number;
  averageScore: number;
  pendingReview: number;
  interviewsScheduled: number;
}

export interface TrendData {
  date: string;
  applications: number;
  avgScore: number;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  action: WorkflowAction;
  isActive: boolean;
  triggeredCount: number;
}

export interface WorkflowTrigger {
  type: "score_threshold" | "status_change";
  condition: string;
  value: number | string;
}

export interface WorkflowAction {
  type: "email" | "slack" | "webhook";
  config: Record<string, unknown>;
}

// Filter Types
export interface CandidateFilters {
  search?: string;
  position?: string;
  status?: ApplicationStatus;
  minScore?: number;
  maxScore?: number;
  dateFrom?: string;
  dateTo?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}