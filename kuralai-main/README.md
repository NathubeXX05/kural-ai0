# Kural AI - Next.js + Supabase

Learn Tamil with AI-powered lessons and interactive exercises.

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))

### 2. Setup Supabase

1. Create a new project on Supabase
2. Go to **SQL Editor** and run:
   - First: `supabase-schema.sql` (creates tables)
   - Then: `supabase-seed.sql` (adds demo data)

### 3. Environment Variables

1. Copy `env.local.template` to `.env.local`
2. Fill in your Supabase credentials from **Settings** → **API**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 4. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/              # Protected routes (requires auth)
│   │   ├── learn/          # Dashboard - course list
│   │   ├── lesson/[id]/    # Lesson page with exercises
│   │   ├── chat/           # AI chat practice
│   │   ├── profile/        # User profile
│   │   ├── leaderboard/    # Leaderboard
│   │   └── quests/         # Daily quests
│   ├── api/                # API Routes
│   │   ├── courses/        # GET courses
│   │   ├── lessons/[id]/   # GET lesson with exercises
│   │   └── progress/       # GET/POST user progress
│   ├── auth/               # Authentication page
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Base UI components
│   └── layout/             # Header, Footer, Sidebar
├── lib/
│   ├── supabase/           # Supabase clients
│   └── types/              # TypeScript types
└── hooks/                  # Custom React hooks
```

---

## 🗄️ Database Schema

### Tables

- **courses** - Tamil learning courses
- **units** - Units within courses
- **lessons** - Lessons within units
- **exercises** - Exercises within lessons (MCQ or Assist type)
- **user_progress** - User progress tracking

### Row Level Security (RLS)

- ✅ Courses, units, lessons, exercises: Public read access
- ✅ User progress: Users can only see/modify their own data

---

## 🔑 API Routes

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/[id]` - Get course with units and lessons

### Lessons

- `GET /api/lessons/[id]` - Get lesson with exercises

### Progress

- `GET /api/progress` - Get user's progress (requires auth)
- `POST /api/progress` - Update progress (requires auth)
  ```json
  {
    "lesson_id": 1,
    "completed": true,
    "score": 100
  }
  ```

---

## 🎨 Features

- ✅ **Next.js 16** with App Router
- ✅ **Supabase** for database and auth
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Framer Motion** for animations
- ✅ **Row Level Security** for data protection
- ✅ **Server Components** for optimal performance

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

---

## 📝 Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🔐 Authentication

Uses Supabase Auth with email/password. Users are automatically created in the `auth.users` table.

To enable email auth in Supabase:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 Troubleshooting

### "relation does not exist" error
- Make sure you ran `supabase-schema.sql` in Supabase SQL Editor

### Auth not working
- Check that environment variables are set correctly
- Verify Supabase email provider is enabled

### API routes returning 500
- Check Supabase logs in Dashboard → Logs
- Verify RLS policies are set correctly

---

## 📄 License

MIT
