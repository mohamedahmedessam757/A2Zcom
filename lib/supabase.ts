import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          username: string;
          email: string;
          avatar_url: string;
          specialization: string;
          study_year: number;
          followers: number;
          following: number;
          university: string | null;
          is_active: boolean;
          following_ids: number[];
          blocked_user_ids: number[];
          joined_communities: string[];
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          username: string;
          email: string;
          avatar_url?: string;
          specialization?: string;
          study_year?: number;
          followers?: number;
          following?: number;
          university?: string | null;
          is_active?: boolean;
          following_ids?: number[];
          blocked_user_ids?: number[];
          joined_communities?: string[];
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          username?: string;
          email?: string;
          avatar_url?: string;
          specialization?: string;
          study_year?: number;
          followers?: number;
          following?: number;
          university?: string | null;
          is_active?: boolean;
          following_ids?: number[];
          blocked_user_ids?: number[];
          joined_communities?: string[];
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: number;
          author_id: string;
          course_name: string;
          review: string;
          rating: number;
          likes: number;
          liked_by: number[];
          image_urls: string[];
          link_url: string | null;
          field: string;
          is_community_post: boolean;
          repost_of_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          author_id: string;
          course_name?: string;
          review: string;
          rating?: number;
          likes?: number;
          liked_by?: number[];
          image_urls?: string[];
          link_url?: string | null;
          field: string;
          is_community_post?: boolean;
          repost_of_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          author_id?: string;
          course_name?: string;
          review?: string;
          rating?: number;
          likes?: number;
          liked_by?: number[];
          image_urls?: string[];
          link_url?: string | null;
          field?: string;
          is_community_post?: boolean;
          repost_of_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: number;
          post_id: number;
          author_id: string;
          text: string;
          likes: number;
          liked_by: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          post_id: number;
          author_id: string;
          text: string;
          likes?: number;
          liked_by?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          post_id?: number;
          author_id?: string;
          text?: string;
          likes?: number;
          liked_by?: number[];
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: number;
          title: string;
          field: string;
          rating: number;
          platform: string;
          image_url: string;
          description: string;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          field: string;
          rating?: number;
          platform?: string;
          image_url?: string;
          description?: string;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          field?: string;
          rating?: number;
          platform?: string;
          image_url?: string;
          description?: string;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      roadmaps: {
        Row: {
          id: number;
          user_id: string;
          key: string;
          title: string;
          description: string;
          steps: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          key: string;
          title: string;
          description?: string;
          steps?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          key?: string;
          title?: string;
          description?: string;
          steps?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: number;
          user_id: string;
          type: string;
          from_user_id: string;
          post_id: number | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          type: string;
          from_user_id: string;
          post_id?: number | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          type?: string;
          from_user_id?: string;
          post_id?: number | null;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
