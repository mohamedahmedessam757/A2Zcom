import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, Post, Course, Roadmaps, Notification } from '../types';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { userService } from '../services/userService';
import { courseService } from '../services/courseService';
import { roadmapService } from '../services/roadmapService';
import { notificationService } from '../services/notificationService';

interface AppContextType {
  currentUser: User | null;
  allUsers: User[];
  posts: Post[];
  courses: Course[];
  roadmaps: Roadmaps;
  notifications: Notification[];
  loading: boolean;
  refreshData: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmaps>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const transformDbUserToUser = (dbUser: any): User => {
    const userIdNum = parseInt(dbUser.id.slice(-8), 16) % 1000000;
    return {
      id: userIdNum,
      name: dbUser.name,
      username: dbUser.username,
      email: dbUser.email,
      avatarUrl: dbUser.avatar_url,
      specialization: dbUser.specialization,
      studyYear: dbUser.study_year,
      followers: dbUser.followers,
      following: dbUser.following,
      university: dbUser.university,
      isActive: dbUser.is_active,
      followingIds: dbUser.following_ids,
      blockedUserIds: dbUser.blocked_user_ids,
      joinedCommunities: dbUser.joined_communities,
      isAdmin: dbUser.is_admin,
    };
  };

  const transformDbPostToPost = (dbPost: any, usersMap: Map<string, User>): Post => {
    const author = usersMap.get(dbPost.author_id) || transformDbUserToUser(dbPost.author);

    const comments = dbPost.comments?.map((comment: any) => ({
      id: comment.id,
      author: usersMap.get(comment.author_id) || transformDbUserToUser(comment.author),
      text: comment.text,
      timestamp: formatTimestamp(comment.created_at),
      likes: comment.likes,
      likedBy: comment.liked_by,
    })) || [];

    let repostOf = undefined;
    if (dbPost.repost_of) {
      const repostAuthor = usersMap.get(dbPost.repost_of.author_id) || transformDbUserToUser(dbPost.repost_of.author);
      repostOf = {
        id: dbPost.repost_of.id,
        author: repostAuthor,
        courseName: dbPost.repost_of.course_name,
        review: dbPost.repost_of.review,
        rating: dbPost.repost_of.rating,
        likes: dbPost.repost_of.likes,
        comments: [],
        timestamp: formatTimestamp(dbPost.repost_of.created_at),
        likedBy: dbPost.repost_of.liked_by,
        imageUrls: dbPost.repost_of.image_urls,
        linkUrl: dbPost.repost_of.link_url,
        field: dbPost.repost_of.field,
        isCommunityPost: dbPost.repost_of.is_community_post,
      };
    }

    return {
      id: dbPost.id,
      author,
      courseName: dbPost.course_name,
      review: dbPost.review,
      rating: dbPost.rating,
      likes: dbPost.likes,
      comments,
      timestamp: formatTimestamp(dbPost.created_at),
      likedBy: dbPost.liked_by,
      imageUrls: dbPost.image_urls,
      linkUrl: dbPost.link_url,
      field: dbPost.field,
      isCommunityPost: dbPost.is_community_post,
      repostOf,
    };
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const refreshData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const [profileData, usersData, postsData, coursesData] = await Promise.all([
        authService.getUserProfile(user.id),
        userService.getAllUsers(),
        postService.getAllPosts(),
        courseService.getAllCourses(),
      ]);

      if (profileData) {
        const transformedUser = transformDbUserToUser(profileData);
        setCurrentUser(transformedUser);

        const [roadmapsData, notificationsData] = await Promise.all([
          roadmapService.getUserRoadmaps(user.id),
          notificationService.getUserNotifications(user.id),
        ]);

        setRoadmaps(roadmapsData);

        const transformedNotifications = notificationsData.map((notif: any) => ({
          id: notif.id,
          type: notif.type,
          user: transformDbUserToUser(notif.from_user),
          post: notif.post ? { courseName: notif.post.course_name } : undefined,
          timestamp: formatTimestamp(notif.created_at),
          read: notif.read,
        })) as Notification[];

        setNotifications(transformedNotifications);
      }

      const transformedUsers = usersData.map(transformDbUserToUser);
      setAllUsers(transformedUsers);

      const usersMap = new Map(transformedUsers.map(u => [u.id.toString(), u]));
      const transformedPosts = postsData.map((post: any) => transformDbPostToPost(post, usersMap));
      setPosts(transformedPosts);

      const transformedCourses = coursesData.map((course: any) => ({
        id: course.id,
        title: course.title,
        field: course.field,
        rating: course.rating,
        platform: course.platform,
        imageUrl: course.image_url,
        description: course.description,
        ownerId: course.owner_id ? parseInt(course.owner_id.slice(-8), 16) % 1000000 : undefined,
      }));
      setCourses(transformedCourses);

    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshData();
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setAllUsers([]);
        setPosts([]);
        setCourses([]);
        setRoadmaps({});
        setNotifications([]);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        posts,
        courses,
        roadmaps,
        notifications,
        loading,
        refreshData,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
