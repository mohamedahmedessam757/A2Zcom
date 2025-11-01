# A2Z Backend Setup Instructions

Your A2Z application has been successfully integrated with Supabase backend! Follow these steps to get everything running.

## Prerequisites

- Node.js installed
- A Supabase account (free tier available at https://supabase.com)

## Step 1: Set Up Supabase Project

1. Go to https://supabase.com and sign up or log in
2. Create a new project
3. Wait for the project to be provisioned
4. Once ready, go to Project Settings > API
5. Copy your:
   - Project URL
   - Anon/Public Key

## Step 2: Configure Environment Variables

Create a `.env` file in the project root and add:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## Step 3: Database Setup

The database schema has already been created via migrations. Your database includes:

### Tables:
- **users** - User profiles and authentication
- **posts** - Course reviews and content
- **comments** - Post comments
- **courses** - Community/course information
- **roadmaps** - Learning roadmaps
- **notifications** - User notifications

### Security:
- Row Level Security (RLS) enabled on all tables
- Authenticated users can only access their own data
- Secure policies prevent unauthorized access

## Step 4: Authentication Setup

The app uses Supabase Auth with email/password authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Make sure "Enable email confirmations" is **DISABLED** for testing
3. Users can now sign up and log in immediately

## Step 5: Install Dependencies & Run

```bash
npm install
npm run dev
```

## Features Integrated with Backend

### Authentication
- Sign up with email/password
- Sign in
- Sign out
- Session management
- Profile creation on signup

### Posts
- Create posts with images and links
- Like posts
- Comment on posts
- Edit/Delete own posts
- Repost functionality
- Real-time updates

### Users
- Follow/unfollow users
- View user profiles
- Update own profile
- Block users
- User activity status

### Communities
- Create communities
- Join/leave communities
- Community posts
- Edit/Delete own communities

### Roadmaps
- AI-generated roadmaps
- Custom roadmap creation
- Save and share roadmaps
- Pin posts to roadmap steps

### Notifications
- Follow notifications
- Like notifications
- Comment notifications
- Mark as read functionality

## API Services

The backend is organized into service files:

- `services/authService.ts` - Authentication operations
- `services/postService.ts` - Post CRUD operations
- `services/userService.ts` - User profile management
- `services/courseService.ts` - Community management
- `services/roadmapService.ts` - Roadmap operations
- `services/notificationService.ts` - Notification handling

## Context Provider

The app uses React Context for state management:
- `contexts/AppContext.tsx` - Global app state
- Automatic data refresh on auth changes
- Centralized data fetching

## Database Schema

### Users Table
```sql
- id (uuid, primary key)
- name, username, email
- avatar_url
- specialization, study_year
- followers, following
- following_ids[], blocked_user_ids[]
- joined_communities[]
- is_admin
```

### Posts Table
```sql
- id (bigserial, primary key)
- author_id (references users)
- course_name, review, rating
- likes, liked_by[]
- image_urls[], link_url
- field, is_community_post
- repost_of_id
```

### Comments Table
```sql
- id (bigserial, primary key)
- post_id (references posts)
- author_id (references users)
- text
- likes, liked_by[]
```

## Troubleshooting

### "Missing Supabase environment variables"
Make sure your `.env` file exists and contains the correct variables.

### Database connection errors
Verify your Supabase project is active and the credentials are correct.

### Auth errors
Check that email confirmations are disabled in Supabase Auth settings.

### Build errors
Run `npm install` to ensure all dependencies are installed.

## Security Best Practices

1. Never commit `.env` to version control
2. Use RLS policies for all data access
3. Validate user input on both client and server
4. Keep Supabase credentials secure
5. Regularly update dependencies

## Next Steps

1. Customize the UI to match your brand
2. Add more RLS policies as needed
3. Implement email confirmations (optional)
4. Add social auth providers (optional)
5. Set up Supabase Storage for file uploads
6. Configure backup policies

## Support

For Supabase-specific issues, visit:
- Documentation: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

Your A2Z application is now fully integrated with a production-ready backend!
