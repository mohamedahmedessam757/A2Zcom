import { supabase } from '../lib/supabase';

export const notificationService = {
  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        from_user:users!notifications_from_user_id_fkey(*),
        post:posts(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: number) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  async createNotification(data: {
    user_id: string;
    type: string;
    from_user_id: string;
    post_id?: number;
  }) {
    const { error } = await supabase
      .from('notifications')
      .insert(data);

    if (error) throw error;
  }
};
