# Quick Start Guide

Get your A2Z app running with Supabase backend in 5 minutes!

## Step 1: Get Supabase Credentials (2 minutes)

1. Visit https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create
5. Wait for provisioning (30-60 seconds)
6. Go to **Settings** → **API**
7. Copy:
   - **Project URL**
   - **anon/public key**

## Step 2: Configure Environment (1 minute)

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace the values with your actual credentials from Step 1.

## Step 3: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Check setup is correct
npm run check-setup

# Start the development server
npm run dev
```

## Step 4: Test It Out

1. Open http://localhost:3000
2. Click "Join Now"
3. Fill out the signup form
4. You're in! Start exploring

## What Works Now

- ✅ User authentication
- ✅ Create and edit posts
- ✅ Like and comment
- ✅ Follow users
- ✅ Join communities
- ✅ Generate AI roadmaps
- ✅ Real-time notifications
- ✅ Persistent data storage

## Database Setup

**Good news:** The database schema was automatically created when you set up Supabase!

All tables, security policies, and indexes are ready to go.

## Optional: Disable Email Confirmations

For faster testing (not required):

1. Go to **Authentication** → **Settings** in Supabase
2. Scroll to "Email Auth"
3. Disable "Enable email confirmations"
4. Click Save

Users can now sign up and log in immediately.

## Troubleshooting

### "Missing Supabase environment variables"
Your `.env` file is missing or incorrectly named. Make sure it's in the project root.

### "Cannot find module '@supabase/supabase-js'"
Run `npm install` to install dependencies.

### Build errors
Run `npm run check-setup` to diagnose issues.

### Can't sign up
Make sure your Supabase project is active and credentials are correct.

## Next Steps

1. Read `SETUP_INSTRUCTIONS.md` for detailed information
2. Check `API_REFERENCE.md` to understand the backend
3. Review `BACKEND_INTEGRATION_SUMMARY.md` for architecture details
4. Customize the app to your needs

## File Structure

```
/services          → Backend API calls
/contexts          → State management
/lib               → Supabase configuration
/components        → UI components
/pages             → App pages
```

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create an issue if you need help

That's it! Your app is now running with a production-ready backend. 🎉
