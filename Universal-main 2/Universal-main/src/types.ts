export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'CURATOR' | 'MENTOR';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  callsign: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  links?: { title: string; url: string }[];
  achievements?: string[];
  stats?: {
    xp: number;
    level: number;
    completedMissions: number;
    completedLabs: number;
  };
  academicInfo?: {
    realName: string;
    surname: string;
    course: string;
    group: string;
  };
  ctfEnabled: boolean;
  externalAccounts?: {
    thm?: string;
    htb?: string;
    picoctf?: string;
    rootme?: string;
    cyberdefenders?: string;
  };
  roadmapProgress: Record<string, number>; // roadmapRefId -> percentage
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  levels: RoadmapLevel[];
  certifications: string[];
}

export interface RoadmapLevel {
  id: string;
  title: string;
  description: string;
  missions: string[]; // mission/task IDs
  labs: string[]; // lab IDs
  milestones: string[];
  skillRequirements: string[];
}

export interface ResearchWork {
  id: string;
  authorId: string;
  authorName: string;
  type: 'THESIS' | 'ARTICLE' | 'WORK';
  title: string;
  abstract: string;
  content: string;
  attachmentUrl?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  createdAt: any;
  updatedAt: any;
  tags: string[];
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  requirements: {
    roadmapId: string;
    minProgress: number;
    minXP?: number;
  };
  deadline: any;
  status: 'ACTIVE' | 'EXPIRED';
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  userId: string;
  status: 'PENDING' | 'REJECTED' | 'APPROVED';
  createdAt: any;
  statement: string;
}

export interface CTFEvent {
  id: string;
  title: string;
  description: string;
  url: string;
  dateStart: any;
  dateEnd: any;
  isLocal: boolean; // Ukrainian/local event
  source?: string; // e.g. 'CTFtime'
}

export interface ExternalStats {
  userId: string;
  platform: string; // 'TryHackMe', 'HackTheBox', etc.
  rank?: string;
  solved?: number;
  badges?: string[];
  score?: number;
  lastUpdated: any;
}
