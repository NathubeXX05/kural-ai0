# Kural AI - Tamil Learning Application

Application web d'apprentissage du Tamil, maintenant **indépendante de Replit** et fonctionnant localement.

## 🚀 Configuration

### Prérequis

- Node.js 20 LTS
- PostgreSQL 16
- npm ou yarn

### Installation

1. **Cloner le projet** (si ce n'est pas déjà fait)

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :

```bash
cp .env.example .env
```

Modifiez les valeurs dans `.env` :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/kural_ai
SESSION_SECRET=votre-secret-session-tres-securise
PORT=5000
NODE_ENV=development
```

4. **Créer la base de données**

```bash
# Créez une base de données PostgreSQL nommée 'kural_ai'
createdb kural_ai

# Ou via psql :
psql -U postgres
CREATE DATABASE kural_ai;
\q
```

5. **Pousser le schéma vers la base de données**

```bash
npm run db:push
```

### Démarrage

**Mode développement :**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5000`

**Mode production :**
```bash
npm run build
npm start
```

## 📝 Changements par rapport à Replit

### ✅ Supprimé
- Fichier `.replit` (configuration Replit)
- Dossier `server/replit_integrations/` (authentification OAuth Replit, chat, images)
- Dépendances aux variables d'environnement Replit (`REPL_ID`, `ISSUER_URL`)

### ✨ Ajouté
- **Authentification locale** avec `passport-local` et `bcryptjs`
- **Scripts cross-platform** avec `cross-env` pour Windows
- **Endpoints d'authentification** :
  - `POST /api/register` - Inscription
  - `POST /api/login` - Connexion
  - `POST /api/logout` - Déconnexion
  - `GET /api/user` - Obtenir l'utilisateur actuel

### 🔄 Modifié
- Table `users` : ajout du champ `passwordHash` pour l'authentification locale
- `server/auth.ts` : nouveau système d'authentification local
- `server/authStorage.ts` : gestion des utilisateurs avec mots de passe
- `server/routes.ts` : utilisation de `user.id` au lieu de `user.claims.sub`

## 🔐 Authentification

L'application utilise maintenant une authentification locale par email/mot de passe :

- Les mots de passe sont hachés avec `bcryptjs`
- Les sessions sont stockées dans PostgreSQL
- Les cookies de session sont sécurisés en production

## 📦 Structure du projet

```
Kural-AI/
├── client/           # Application React (frontend)
├── server/           # API Express (backend)
│   ├── auth.ts      # Authentification locale
│   ├── authStorage.ts # Gestion des utilisateurs
│   ├── routes.ts    # Routes de l'API
│   └── ...
├── shared/          # Code partagé (schémas, types)
├── .env.example     # Template de configuration
└── package.json     # Dépendances
```

## 🛠️ Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm start` - Démarre le serveur de production
- `npm run check` - Vérifie les types TypeScript
- `npm run db:push` - Pousse le schéma vers la base de données

## 📚 Technologies utilisées

- **Frontend** : React, Vite, TailwindCSS
- **Backend** : Express, Node.js
- **Base de données** : PostgreSQL, Drizzle ORM
- **Authentification** : Passport.js, bcryptjs
- **TypeScript** : Pour un code type-safe

## 🐛 Dépannage

### Erreur de connexion à la base de données
Vérifiez que PostgreSQL est démarré et que `DATABASE_URL` dans `.env` est correct.

### Erreur "cross-env not found"
Réinstallez les dépendances : `npm install`

### Erreur de session
Vérifiez que la table `sessions` existe dans votre base de données (créée par `db:push`)

## 📄 License

MIT
# kural-ai0
