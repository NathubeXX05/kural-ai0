# 🚀 Quick Start Guide

## ✅ Checklist

### 1. Supabase Setup
- [ ] Created Supabase project
- [ ] Executed `supabase-schema.sql` in SQL Editor
- [ ] Executed `supabase-seed.sql` in SQL Editor
- [ ] Copied API keys from Settings → API

### 2. Environment Variables
- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`

### 3. Install & Run
```bash
cd kuralai-main
npm install
npm run dev
```

### 4. Test the App
- [ ] Open http://localhost:3000
- [ ] Click "Get Started Free"
- [ ] Sign up with email/password
- [ ] Navigate to /learn
- [ ] Click on "Tamil Basics" course
- [ ] Start a lesson
- [ ] Complete an exercise

---

## 📋 Your `.env.local` should look like:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

---

## 🎯 Next Steps After Local Testing

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Migrated to Next.js + Supabase"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### API routes not working
- Check that `.env.local` exists and has correct values
- Restart dev server: `npm run dev`

### Auth not working
- Enable Email provider in Supabase: Authentication → Providers → Email
- Check environment variables

### Database errors
- Make sure you ran both SQL files in Supabase
- Check Supabase logs: Dashboard → Logs

---

## ✨ Features Implemented

- ✅ Landing page
- ✅ Authentication (Supabase Auth)
- ✅ Course listing
- ✅ Course details with units/lessons
- ✅ Interactive lesson page with exercises
- ✅ Progress tracking
- ✅ Score calculation
- ✅ Locked lessons (sequential unlock)

---

## 🚧 TODO (Optional Enhancements)

- [ ] Chat page with AI
- [ ] Profile page
- [ ] Leaderboard
- [ ] Quests/Achievements
- [ ] Voice practice
- [ ] Thirukkural section

---

**Ready to deploy? Follow the deployment guide in README.md!**
