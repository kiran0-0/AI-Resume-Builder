export interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  skills: string[]
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface ExperienceEntry {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  technologies: string[]
  link?: string
}

export interface ATSScore {
  score: number
  suggestions: ATSSuggestion[]
  skillGaps: string[]
  matchedKeywords: string[]
}

export interface ATSSuggestion {
  type: 'warning' | 'improvement' | 'success'
  message: string
  category: string
}

export const COMMON_ATS_KEYWORDS = [
  // Programming Languages
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'R',
  // Web & Frameworks
  'React', 'Node.js', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot',
  // Data & ML
  'SQL', 'Machine Learning', 'Data Analysis', 'Deep Learning', 'NLP', 'Computer Vision',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Visualization',
  'Statistics', 'Data Mining', 'Big Data', 'Spark', 'Hadoop', 'ETL', 'Data Pipeline',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins',
  // Tools & Methodologies
  'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices',
  // BI & Analytics
  'Excel', 'Tableau', 'Power BI', 'Looker', 'Google Analytics',
  // Soft Skills
  'Problem Solving', 'Leadership', 'Communication', 'Project Management', 
  'Team Collaboration', 'Strategic Planning', 'Critical Thinking',
  // Enterprise
  'Salesforce', 'SAP', 'Jira', 'Confluence', 'Figma', 'UX/UI'
]

// High-value keywords that boost score more significantly
export const HIGH_VALUE_KEYWORDS = [
  'Python', 'SQL', 'Machine Learning', 'Data Analysis', 'AWS', 'React', 'JavaScript',
  'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'Data Visualization', 'Leadership'
]

export const initialResumeData: ResumeData = {
  name: '',
  email: '',
  phone: '',
  summary: '',
  skills: [],
  education: [],
  experience: [],
  projects: []
}
