export interface WebsiteSection {
  _id: string;
  key: string;
  type: 'hero' | 'banner' | 'about-image' | 'portfolio' | 'team' | 'achievements' | 'psychometric';
  title: string;
  content: any; // Dynamic content based on type
  meta?: Record<string, any>;
}

export interface HeroSectionContent {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: string;
  secondaryButton?: string;
}

export interface ImageSectionContent {
  imageUrl: string;
}

export interface TeamMember {
  imageUrl: string;
}

export interface TeamSectionContent {
  members: TeamMember[];
}

export interface AchievementCard {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface AchievementSectionContent {
  cards: AchievementCard[]; // Should be exactly 4
}

// Psychometric Types (UI Only)
export interface QuestionOption {
  id: string;
  label: string; // A, B, C, D
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface PsychometricTab {
  id: string;
  label: string;
  questions: Question[]; // For UI demo
}

export interface LaunchCareerItem {
  _id: string;
  title: string;
  image: string;
  category: 'student' | 'school';
  status: string;
}
