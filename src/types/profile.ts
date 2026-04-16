export interface Experience {
  company: string;
  location: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  level: string;
  coursework: string[];
}

export interface Certificate {
  name: string;
  year: string;
  issuer: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline?: string;
  cvUrl?: string;
  location: string;
  email: string;
  linkedIn: string;
  summary: string;
  coreCompetencies: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  experience: Experience[];
  education: Education;
  certificates: Certificate[];
}
