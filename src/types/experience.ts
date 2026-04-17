export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  impact: string[];
  techStack: string[];
  order?: number;
}
