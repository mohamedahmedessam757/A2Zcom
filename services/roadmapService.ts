import { supabase } from '../lib/supabase';
import { Roadmap } from '../types';

export const roadmapService = {
  async getUserRoadmaps(userId: string) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const roadmapsMap: { [key: string]: Roadmap } = {};
    data?.forEach(roadmap => {
      roadmapsMap[roadmap.key] = {
        title: roadmap.title,
        description: roadmap.description,
        steps: roadmap.steps
      };
    });

    return roadmapsMap;
  },

  async getRoadmapByKey(userId: string, key: string) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .eq('key', key)
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    return {
      title: data.title,
      description: data.description,
      steps: data.steps
    };
  },

  async saveRoadmap(userId: string, key: string, roadmap: Roadmap) {
    const { data: existing } = await supabase
      .from('roadmaps')
      .select('id')
      .eq('user_id', userId)
      .eq('key', key)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('roadmaps')
        .update({
          title: roadmap.title,
          description: roadmap.description,
          steps: roadmap.steps
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('roadmaps')
        .insert({
          user_id: userId,
          key,
          title: roadmap.title,
          description: roadmap.description,
          steps: roadmap.steps
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async deleteRoadmap(userId: string, key: string) {
    const { error } = await supabase
      .from('roadmaps')
      .delete()
      .eq('user_id', userId)
      .eq('key', key);

    if (error) throw error;
  }
};
