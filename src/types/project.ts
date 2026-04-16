export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  tags: string[];
  problemStatement?: string;
  solution?: string;
  techStack?: string[];
  role?: string;
  testingApproach?: string;
  screenshots?: string[];
}
