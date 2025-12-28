# 🔄 Migration Vite → Next.js - Guide Complet

## 📋 Vue d'ensemble

Cette migration convertit votre application de **Vite + React + Express** vers **Next.js 14 (App Router)** pour une compatibilité parfaite avec Vercel.

---

## ⚠️ IMPORTANT - Sauvegarde

Avant de commencer, créez une branche de sauvegarde :
```bash
git checkout -b backup-vite-version
git push origin backup-vite-version
git checkout main
```

---

## 🚀 Étapes de migration

### 1️⃣ Installer Next.js et dépendances

```bash
npm install next@14 react@18 react-dom@18
npm install --save-dev @types/node
```

### 2️⃣ Restructurer le projet

**Nouvelle structure Next.js :**
```
Kural-AI/
├── app/                    # Next.js App Router (NOUVEAU)
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil (Landing)
│   ├── learn/
│   │   └── page.tsx       # Dashboard
│   ├── lesson/
│   │   └── [id]/
│   │       └── page.tsx   # Lesson dynamique
│   ├── chat/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── leaderboard/
│   │   └── page.tsx
│   ├── quests/
│   │   └── page.tsx
│   └── api/               # API Routes Next.js
│       ├── register/
│       │   └── route.ts
│       ├── login/
│       │   └── route.ts
│       ├── logout/
│       │   └── route.ts
│       ├── user/
│       │   └── route.ts
│       ├── courses/
│       │   └── route.ts
│       └── ...
├── components/            # Composants React (garder)
├── lib/                   # Utilitaires (garder)
├── public/                # Assets statiques
├── shared/                # Code partagé (garder)
└── server/                # Logique serveur (adapter)
```

### 3️⃣ Mettre à jour package.json

**Remplacer les scripts :**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push"
  }
}
```

**Supprimer les dépendances inutiles :**
- `vite`
- `@vitejs/plugin-react`
- `wouter` (Next.js a son propre routing)
- `express` (Next.js gère le serveur)
- `express-session` (utiliser next-auth ou cookies)

**Garder :**
- Toutes les dépendances UI (Radix, TailwindCSS, etc.)
- `drizzle-orm`, `pg`
- `@tanstack/react-query`
- `bcryptjs`, `passport` (pour l'auth)

### 4️⃣ Créer les fichiers Next.js essentiels

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

#### `app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kural AI - Learn Tamil',
  description: 'Learn Tamil with AI-powered lessons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### `app/providers.tsx`
```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

### 5️⃣ Convertir les pages

**Exemple : `app/page.tsx` (Landing)**
```typescript
import Landing from '@/components/pages/Landing';

export default function HomePage() {
  return <Landing />;
}
```

**Exemple : `app/learn/page.tsx` (Dashboard)**
```typescript
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import Dashboard from '@/components/pages/Dashboard';

export default async function LearnPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/');
  }

  return <Dashboard />;
}
```

### 6️⃣ Convertir les API Routes

**Exemple : `app/api/login/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authStorage } from '@/server/authStorage';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await authStorage.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({ user });
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 7️⃣ Mettre à jour TailwindCSS

**`tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

### 8️⃣ Créer `app/globals.css`

Copiez le contenu de `client/src/index.css` vers `app/globals.css`.

### 9️⃣ Mettre à jour les imports

**Avant (Vite) :**
```typescript
import { useLocation } from 'wouter';
```

**Après (Next.js) :**
```typescript
import { useRouter, usePathname } from 'next/navigation';
```

### 🔟 Supprimer les fichiers inutiles

```bash
# Supprimer
rm -rf client/
rm -rf dist/
rm -rf api/
rm vercel.json
rm vite.config.ts
rm build.sh
```

---

## 🔐 Authentification avec Next.js

### Option 1 : NextAuth.js (Recommandé)
```bash
npm install next-auth
```

### Option 2 : Cookies + Middleware (Plus simple)
Utiliser les cookies Next.js et un middleware pour protéger les routes.

---

## 📦 Déploiement Vercel

Après la migration :

1. **Pusher le code :**
```bash
git add .
git commit -m "Migrate from Vite to Next.js"
git push origin main
```

2. **Vercel détectera automatiquement Next.js !**

3. **Configurer les variables d'environnement :**
- `DATABASE_URL`
- `SESSION_SECRET` (si vous utilisez des sessions)

---

## ✅ Checklist de migration

- [ ] Next.js installé
- [ ] Structure `app/` créée
- [ ] `layout.tsx` et `providers.tsx` créés
- [ ] Pages converties
- [ ] API Routes converties
- [ ] Routing mis à jour (wouter → Next.js)
- [ ] TailwindCSS configuré
- [ ] Authentification adaptée
- [ ] Tests locaux (`npm run dev`)
- [ ] Build réussi (`npm run build`)
- [ ] Déployé sur Vercel

---

## 🆘 Besoin d'aide ?

La migration est complexe. Je peux :
1. Créer les fichiers Next.js principaux
2. Convertir vos pages une par une
3. Adapter l'authentification

Voulez-vous que je commence la migration automatiquement ?

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Deploying to Vercel](https://nextjs.org/docs/deployment)
