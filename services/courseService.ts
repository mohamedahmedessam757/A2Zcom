import { supabase } from '../lib/supabase';

export const courseService = {
  async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCourse(courseData: {
    title: string;
    field: string;
    description: string;
    image_url: string;
    platform?: string;
    owner_id: string;
  }) {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourse(courseId: number, updates: {
    title?: string;
    description?: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCourse(courseId: number) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) throw error;
  }
};
