# 🚀 Migration Plan: Kural-AI → Next.js + Supabase

## 📊 État actuel

### Kural-AI (source)
- **Stack**: Vite + React + Express + PostgreSQL + Drizzle ORM
- **Auth**: Passport.js (local)
- **Features**: Courses, Units, Lessons, Progress tracking, Chat

### kuralai-main (destination)
- **Stack**: Next.js 16 + Supabase
- **Auth**: Supabase Auth
- **Features**: Landing page, Auth page

---

## 🎯 Objectifs

1. ✅ Migrer toute la logique métier vers Next.js
2. ✅ Utiliser Supabase pour la base de données et l'auth
3. ✅ Déployer sur Vercel sans problèmes
4. ✅ Garder toutes les fonctionnalités existantes

---

## 📋 Étapes de migration

### Phase 1: Configuration Supabase (30 min)

#### 1.1 Créer le schéma de base de données
- [ ] Créer les tables dans Supabase :
  - `users` (géré par Supabase Auth)
  - `courses`
  - `units`
  - `lessons`
  - `user_progress`
  - `sessions` (si nécessaire)

#### 1.2 Configurer les variables d'environnement
- [ ] `.env.local` :
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```

---

### Phase 2: Créer les API Routes Next.js (45 min)

#### 2.1 API Routes à créer
- [ ] `app/api/courses/route.ts` - GET all courses
- [ ] `app/api/courses/[id]/route.ts` - GET course by ID
- [ ] `app/api/courses/[id]/units/route.ts` - GET units for course
- [ ] `app/api/lessons/[id]/route.ts` - GET lesson by ID
- [ ] `app/api/progress/route.ts` - GET/POST user progress
- [ ] `app/api/progress/[lessonId]/route.ts` - Update progress

#### 2.2 Utilitaires Supabase
- [ ] `lib/supabase/server.ts` - Server-side Supabase client
- [ ] `lib/supabase/client.ts` - Client-side Supabase client
- [ ] `lib/supabase/middleware.ts` - Auth middleware

---

### Phase 3: Migrer les composants UI (60 min)

#### 3.1 Pages à créer
- [ ] `app/(app)/learn/page.tsx` - Dashboard (liste des cours)
- [ ] `app/(app)/lesson/[id]/page.tsx` - Page de leçon
- [ ] `app/(app)/chat/page.tsx` - Chat AI
- [ ] `app/(app)/profile/page.tsx` - Profil utilisateur
- [ ] `app/(app)/leaderboard/page.tsx` - Classement
- [ ] `app/(app)/quests/page.tsx` - Quêtes

#### 3.2 Composants à migrer
- [ ] Copier tous les composants UI de `Kural-AI/client/src/components`
- [ ] Adapter les imports pour Next.js
- [ ] Remplacer `wouter` par `next/navigation`
- [ ] Adapter les appels API pour utiliser les routes Next.js

---

### Phase 4: Authentification (30 min)

#### 4.1 Configurer Supabase Auth
- [ ] Mettre à jour `app/auth/page.tsx`
- [ ] Ajouter login/signup avec Supabase
- [ ] Configurer les redirections
- [ ] Protéger les routes avec middleware

#### 4.2 Hooks d'authentification
- [ ] Créer `hooks/use-auth.ts` avec Supabase
- [ ] Remplacer les appels Passport par Supabase

---

### Phase 5: Seed de données (15 min)

#### 5.1 Script de seed
- [ ] Créer `scripts/seed-supabase.ts`
- [ ] Migrer les données de seed existantes
- [ ] Exécuter le seed sur Supabase

---

### Phase 6: Tests et déploiement (30 min)

#### 6.1 Tests locaux
- [ ] Tester toutes les pages
- [ ] Tester l'authentification
- [ ] Tester les API routes
- [ ] Vérifier la progression utilisateur

#### 6.2 Déploiement Vercel
- [ ] Connecter le repo GitHub
- [ ] Configurer les variables d'environnement
- [ ] Déployer
- [ ] Tester en production

---

## 🗂️ Structure finale

```
kuralai-main/
├── src/
│   ├── app/
│   │   ├── (app)/              # Routes protégées
│   │   │   ├── layout.tsx
│   │   │   ├── learn/
│   │   │   ├── lesson/[id]/
│   │   │   ├── chat/
│   │   │   ├── profile/
│   │   │   ├── leaderboard/
│   │   │   └── quests/
│   │   ├── api/                # API Routes
│   │   │   ├── courses/
│   │   │   ├── lessons/
│   │   │   └── progress/
│   │   ├── auth/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing
│   ├── components/
│   │   ├── ui/                 # Composants UI de base
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   └── pages/              # Composants spécifiques aux pages
│   ├── lib/
│   │   ├── supabase/
│   │   ├── utils.ts
│   │   └── types.ts
│   └── hooks/
│       └── use-auth.ts
├── public/
├── .env.local
└── package.json
```

---

## 📝 Checklist finale

- [ ] Toutes les pages fonctionnent
- [ ] L'authentification fonctionne
- [ ] Les données sont sauvegardées
- [ ] Le déploiement Vercel réussit
- [ ] Pas d'erreurs en production
- [ ] Performance optimale

---

## 🎉 Résultat attendu

Une application Next.js complète, déployée sur Vercel, avec :
- ✅ Toutes les fonctionnalités de Kural-AI
- ✅ Authentification Supabase
- ✅ Base de données Supabase
- ✅ Performance optimale
- ✅ SEO-friendly
- ✅ Déploiement en 1 clic

---

**Temps estimé total : 3-4 heures**
