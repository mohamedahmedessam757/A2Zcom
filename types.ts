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
}

export interface Post {
  id: number;
  author: User;
  courseName: string;
  review: string;
  rating: number;
  likes: number;
  commentsCount: number;
  timestamp: string;
  likedBy: number[];
}

export interface Course {
  id: number;
  title: string;
  field: string;
  rating: number;
  platform: string;
  imageUrl: string;
}

export interface RoadmapStep {
  id: number;
  stage: string;
  title: string;
  description: string;
  resources: {
    name: string;
    type: 'Book' | 'YouTube' | 'Course';
  }[];
}

export interface ChatMessage {
  id: number;
  sender: User;
  text: string;
  timestamp: string;
}

export type Page = 'landing' | 'home' | 'discover' | 'roadmap' | 'profile' | 'about' | 'privacy' | 'terms' | 'support';