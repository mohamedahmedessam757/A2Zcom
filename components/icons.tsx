// This file is used to re-export icons from a library for consistency.
// Assuming 'lucide-react' is available in the environment.
// In a real project, you would add "lucide-react" to your dependencies.
import React from 'react';
import { Home, Compass, MessageSquare, User, Star, ThumbsUp, MessageCircle, ArrowRight, Book, Youtube, Laptop, Mail, Lock, Users, ArrowLeft, Send, X, Sun, Moon, Bell, Check, CheckCheck, Pencil, Search, Trash2, UploadCloud, MoreHorizontal, Flag, UserX, Paperclip, Link, Repeat, Bot, PlusCircle, ClipboardCheck, Pin, Shield, Share2, Copy } from 'lucide-react';

export const HomeIcon = Home;
export const DiscoverIcon = Compass;
export const ChatIcon = MessageSquare;
export const ProfileIcon = User;
export const StarIcon = Star;
export const LikeIcon = ThumbsUp;
export const ThumbsUpIcon = ThumbsUp;
export const CommentIcon = MessageCircle;
export const MessageSquareIcon = MessageSquare;
export const ArrowRightIcon = ArrowRight;
export const BookIcon = Book;
export const YouTubeIcon = Youtube;
export const CourseIcon = Laptop;
export const MailIcon = Mail;
export const LockIcon = Lock;
export const UsersIcon = Users;
export const ArrowLeftIcon = ArrowLeft;
export const SendIcon = Send;
export const XIcon = X;
export const SunIcon = Sun;
export const MoonIcon = Moon;
export const BellIcon = Bell;
export const CheckIcon = Check;
export const CheckCheckIcon = CheckCheck;
export const EditIcon = Pencil;
export const SearchIcon = Search;
export const TrashIcon = Trash2;
export const UploadCloudIcon = UploadCloud;
export const MoreHorizontalIcon = MoreHorizontal;
export const FlagIcon = Flag;
export const BlockUserIcon = UserX;
export const AttachmentIcon = Paperclip;
export const LinkIcon = Link;
export const RepostIcon = Repeat;
export const BotIcon = Bot;
export const PlusCircleIcon = PlusCircle;
export const ClipboardCheckIcon = ClipboardCheck;
export const PinIcon = Pin;
export const AdminIcon = Shield;
export const ShareIcon = Share2;
export const CopyIcon = Copy;


export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center text-2xl font-extrabold tracking-wider ${className}`}>
    <span className="text-[var(--text-primary)]">A</span>
    <span className="text-glow relative inline-block mx-px">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block relative top-[-1px]">
        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span className="text-[var(--text-primary)]">Z</span>
  </div>
);