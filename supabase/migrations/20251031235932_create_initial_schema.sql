/*
  # Initial A2Z Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `username` (text, unique)
      - `email` (text, unique)
      - `avatar_url` (text)
      - `specialization` (text)
      - `study_year` (integer)
      - `followers` (integer, default 0)
      - `following` (integer, default 0)
      - `university` (text, nullable)
      - `is_active` (boolean, default true)
      - `following_ids` (integer array, default empty)
      - `blocked_user_ids` (integer array, default empty)
      - `joined_communities` (text array, default empty)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `posts`
      - `id` (bigserial, primary key)
      - `author_id` (uuid, foreign key to users)
      - `course_name` (text)
      - `review` (text)
      - `rating` (integer)
      - `likes` (integer, default 0)
      - `liked_by` (integer array, default empty)
      - `image_urls` (text array, nullable)
      - `link_url` (text, nullable)
      - `field` (text)
      - `is_community_post` (boolean, default false)
      - `repost_of_id` (bigint, nullable, foreign key to posts)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `comments`
      - `id` (bigserial, primary key)
      - `post_id` (bigint, foreign key to posts)
      - `author_id` (uuid, foreign key to users)
      - `text` (text)
      - `likes` (integer, default 0)
      - `liked_by` (integer array, default empty)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `courses`
      - `id` (bigserial, primary key)
      - `title` (text)
      - `field` (text)
      - `rating` (numeric, default 0)
      - `platform` (text)
      - `image_url` (text)
      - `description` (text)
      - `owner_id` (uuid, nullable, foreign key to users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `roadmaps`
      - `id` (bigserial, primary key)
      - `user_id` (uuid, foreign key to users)
      - `key` (text, unique)
      - `title` (text)
      - `description` (text)
      - `steps` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `notifications`
      - `id` (bigserial, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text)
      - `from_user_id` (uuid, foreign key to users)
      - `post_id` (bigint, nullable, foreign key to posts)
      - `read` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text DEFAULT '',
  specialization text DEFAULT '',
  study_year integer DEFAULT 1,
  followers integer DEFAULT 0,
  following integer DEFAULT 0,
  university text,
  is_active boolean DEFAULT true,
  following_ids integer[] DEFAULT '{}',
  blocked_user_ids integer[] DEFAULT '{}',
  joined_communities text[] DEFAULT '{}',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id bigserial PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_name text DEFAULT '',
  review text NOT NULL,
  rating integer DEFAULT 0,
  likes integer DEFAULT 0,
  liked_by integer[] DEFAULT '{}',
  image_urls text[] DEFAULT '{}',
  link_url text,
  field text NOT NULL,
  is_community_post boolean DEFAULT false,
  repost_of_id bigint REFERENCES posts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id bigserial PRIMARY KEY,
  post_id bigint NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text text NOT NULL,
  likes integer DEFAULT 0,
  liked_by integer[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  field text NOT NULL,
  rating numeric DEFAULT 0,
  platform text DEFAULT '',
  image_url text DEFAULT '',
  description text DEFAULT '',
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  steps jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, key)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  from_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id bigint REFERENCES posts(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_field ON posts(field);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_courses_field ON courses(field);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Courses policies
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Course owners can update their courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Course owners can delete their courses"
  ON courses FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Roadmaps policies
CREATE POLICY "Users can view own roadmaps"
  ON roadmaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own roadmaps"
  ON roadmaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps"
  ON roadmaps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps"
  ON roadmaps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
