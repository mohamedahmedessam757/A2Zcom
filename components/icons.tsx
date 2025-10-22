// This file is used to re-export icons from a library for consistency.
// Assuming 'lucide-react' is available in the environment.
// In a real project, you would add "lucide-react" to your dependencies.
import React from 'react';
import { Home, Compass, MessageSquare, User, Star, ThumbsUp, MessageCircle, ArrowRight, Book, Youtube, Laptop, Mail, Lock, Users } from 'lucide-react';

export const HomeIcon = Home;
export const DiscoverIcon = Compass;
export const ChatIcon = MessageSquare;
export const ProfileIcon = User;
export const StarIcon = Star;
export const LikeIcon = ThumbsUp;
export const CommentIcon = MessageCircle;
export const ArrowRightIcon = ArrowRight;
export const BookIcon = Book;
export const YouTubeIcon = Youtube;
export const CourseIcon = Laptop;
export const MailIcon = Mail;
export const LockIcon = Lock;
export const UsersIcon = Users;

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center text-2xl font-extrabold tracking-wider ${className}`}>
    <span className="text-white">A</span>
    <span className="text-glow relative inline-block mx-px">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block relative top-[-1px]">
        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span className="text-white">Z</span>
  </div>
);
