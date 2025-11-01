import { supabase } from '../lib/supabase';
import { Post, Comment, User } from '../types';

export const postService = {
  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(*),
        comments(*, author:users!comments_author_id_fkey(*)),
        repost_of:posts!posts_repost_of_id_fkey(*, author:users!posts_author_id_fkey(*))
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createPost(postData: {
    author_id: string;
    course_name: string;
    review: string;
    rating: number;
    image_urls?: string[];
    link_url?: string;
    field: string;
    is_community_post: boolean;
    repost_of_id?: number;
  }) {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select(`
        *,
        author:users!posts_author_id_fkey(*),
        comments(*, author:users!comments_author_id_fkey(*))
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updatePost(postId: number, updates: {
    course_name?: string;
    review?: string;
    rating?: number;
  }) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select(`
        *,
        author:users!posts_author_id_fkey(*),
        comments(*, author:users!comments_author_id_fkey(*))
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async deletePost(postId: number) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  },

  async likePost(postId: number, userId: string, currentLikes: number, likedBy: number[]) {
    const userIdNum = parseInt(userId.slice(-8), 16) % 1000000;
    const isLiked = likedBy.includes(userIdNum);

    const { data, error } = await supabase
      .from('posts')
      .update({
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        liked_by: isLiked
          ? likedBy.filter(id => id !== userIdNum)
          : [...likedBy, userIdNum]
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addComment(commentData: {
    post_id: number;
    author_id: string;
    text: string;
  }) {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        author:users!comments_author_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async likeComment(commentId: number, userId: string, currentLikes: number, likedBy: number[]) {
    const userIdNum = parseInt(userId.slice(-8), 16) % 1000000;
    const isLiked = likedBy.includes(userIdNum);

    const { data, error } = await supabase
      .from('comments')
      .update({
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        liked_by: isLiked
          ? likedBy.filter(id => id !== userIdNum)
          : [...likedBy, userIdNum]
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
