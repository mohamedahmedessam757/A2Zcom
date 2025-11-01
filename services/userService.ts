import { supabase } from '../lib/supabase';

export const userService = {
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: {
    name?: string;
    specialization?: string;
    study_year?: number;
    avatar_url?: string;
    followers?: number;
    following?: number;
    following_ids?: number[];
    blocked_user_ids?: number[];
    joined_communities?: string[];
    is_active?: boolean;
  }) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async followUser(currentUserId: string, targetUserId: string, isFollowing: boolean) {
    const { data: currentUser } = await supabase
      .from('users')
      .select('following, following_ids')
      .eq('id', currentUserId)
      .single();

    const { data: targetUser } = await supabase
      .from('users')
      .select('followers')
      .eq('id', targetUserId)
      .single();

    if (!currentUser || !targetUser) throw new Error('User not found');

    const targetUserIdNum = parseInt(targetUserId.slice(-8), 16) % 1000000;

    const newFollowingIds = isFollowing
      ? currentUser.following_ids.filter((id: number) => id !== targetUserIdNum)
      : [...currentUser.following_ids, targetUserIdNum];

    await supabase
      .from('users')
      .update({
        following: isFollowing ? currentUser.following - 1 : currentUser.following + 1,
        following_ids: newFollowingIds
      })
      .eq('id', currentUserId);

    await supabase
      .from('users')
      .update({
        followers: isFollowing ? targetUser.followers - 1 : targetUser.followers + 1
      })
      .eq('id', targetUserId);

    if (!isFollowing) {
      await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
          type: 'follow',
          from_user_id: currentUserId
        });
    }
  },

  async joinCommunity(userId: string, field: string, isJoined: boolean) {
    const { data: user } = await supabase
      .from('users')
      .select('joined_communities')
      .eq('id', userId)
      .single();

    if (!user) throw new Error('User not found');

    const newCommunities = isJoined
      ? user.joined_communities.filter((c: string) => c !== field)
      : [...user.joined_communities, field];

    const { data, error } = await supabase
      .from('users')
      .update({ joined_communities: newCommunities })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
