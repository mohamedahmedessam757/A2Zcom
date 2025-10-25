
export interface User {
  id: number;
  name: string; // Full Name
  username: string;
  email: string;
  avatarUrl: string;
  specialization: string; // Major
  studyYear: number;
  followers: number;
  following: number;
  university?: string;
  isActive: boolean;
  followingIds: number[];
  blockedUserIds: number[];
  joinedCommunities: string[];
  isAdmin?: boolean;
}

export interface Comment {
  id: number;
  author: User;
  text: string;
  timestamp: string;
  likes: number;
  likedBy: number[];
}

export interface Post {
  id: number;
  author: User;
  courseName: string;
  review: string;
  rating: number;
  likes: number;
  comments: Comment[];
  timestamp:string;
  likedBy: number[];
  imageUrls?: string[];
  linkUrl?: string;
  field: string;
  isCommunityPost: boolean;
  repostOf?: Post;
}

export interface Course {
  id: number;
  title: string;
  field: string;
  rating: number;
  platform: string;
  imageUrl: string;
  description: string;
  ownerId?: number;
}

export interface RoadmapResource {
  name: string;
  type: 'Book' | 'YouTube' | 'Course' | 'Post';
  postId?: number;
}

export interface RoadmapStep {
  id: number;
  stage: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
}

export interface Roadmap {
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export type Roadmaps = { [key: string]: Roadmap };

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizAttempt extends QuizQuestion {
  userAnswerIndex?: number;
  isCorrect?: boolean;
}


export type Theme = 'light' | 'dark';

export type Page = 'landing' | 'home' | 'discover' | 'roadmap' | 'profile' | 'about' | 'privacy' | 'terms' | 'support' | 'community' | 'admin';

export type NotificationType = 'comment' | 'follow' | 'like';

export interface Notification {
  id: number;
  type: NotificationType;
  user: User;
  post?: Post;
  timestamp: string;
  read: boolean;
}