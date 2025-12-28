# 🚀 Guide de déploiement Vercel - Kural AI

## ⚠️ Problème actuel

Le build fonctionne mais l'application ne démarre pas car :
1. ❌ Pas de fichier `vercel.json` (maintenant créé ✅)
2. ❌ Variables d'environnement manquantes sur Vercel
3. ❌ Base de données PostgreSQL non configurée

---

## 📋 Étapes de déploiement

### 1️⃣ Configurer les variables d'environnement sur Vercel

Allez sur votre projet Vercel → **Settings** → **Environment Variables**

Ajoutez ces variables :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | URL de votre base PostgreSQL |
| `SESSION_SECRET` | `votre-secret-aleatoire-tres-long` | Secret pour les sessions |
| `NODE_ENV` | `production` | Environnement |
| `PORT` | `5000` | Port (optionnel sur Vercel) |

**Important** : Pour `SESSION_SECRET`, générez une chaîne aléatoire sécurisée :
```bash
# Sur votre machine locale
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 2️⃣ Configurer une base de données PostgreSQL

Vous avez plusieurs options :

#### Option A : Vercel Postgres (Recommandé) ✅

1. Sur Vercel, allez dans votre projet
2. Cliquez sur **Storage** → **Create Database**
3. Choisissez **Postgres**
4. Suivez les instructions
5. Vercel ajoutera automatiquement `DATABASE_URL` à vos variables d'environnement

#### Option B : Supabase (Gratuit) 🆓

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **Settings** → **Database**
4. Copiez la **Connection String** (mode "Session")
5. Ajoutez-la comme `DATABASE_URL` sur Vercel

#### Option C : Neon (Gratuit) ⚡

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la connection string
4. Ajoutez-la comme `DATABASE_URL` sur Vercel

---

### 3️⃣ Pousser le schéma de base de données

Une fois la base de données configurée :

**Localement**, avec la `DATABASE_URL` de production :

```bash
# Créez un fichier .env.production
DATABASE_URL=postgresql://votre-url-de-production

# Poussez le schéma
npm run db:push
```

**OU** utilisez l'interface de votre provider (Supabase, Neon, etc.) pour exécuter le SQL :

```sql
-- Voir le fichier migration_add_password_hash.sql
-- Ou utilisez Drizzle Kit pour générer le SQL
```

---

### 4️⃣ Redéployer sur Vercel

Après avoir :
- ✅ Créé `vercel.json`
- ✅ Ajouté les variables d'environnement
- ✅ Configuré la base de données

**Commitez et pushez :**

```bash
git add vercel.json
git commit -m "Add Vercel configuration"
git push origin main
```

Vercel redéploiera automatiquement.

---

## 🔍 Vérifier le déploiement

### Logs en temps réel

1. Allez sur Vercel Dashboard
2. Cliquez sur votre déploiement
3. Allez dans **Functions** → **Logs**
4. Vous devriez voir :
   ```
   serving on port 5000
   Database seeded!
   ```

### Tester l'API

```bash
# Remplacez YOUR_APP_URL par votre URL Vercel
curl https://YOUR_APP_URL.vercel.app/api/courses
```

---

## ⚠️ Problèmes courants

### Erreur : "DATABASE_URL must be set"

**Solution** : Ajoutez `DATABASE_URL` dans les variables d'environnement Vercel

### Erreur : "Cannot connect to database"

**Solutions** :
1. Vérifiez que votre base de données est accessible depuis Internet
2. Vérifiez que l'URL de connexion est correcte
3. Certains providers nécessitent `?sslmode=require` à la fin de l'URL

### Erreur : "Table does not exist"

**Solution** : Exécutez `npm run db:push` avec la `DATABASE_URL` de production

### L'application ne démarre pas

**Solution** : Vérifiez les logs dans Vercel Dashboard → Functions → Logs

---

## 📝 Fichier vercel.json créé

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.cjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.cjs"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

Ce fichier indique à Vercel :
- 📦 Où se trouve votre application (`dist/index.cjs`)
- 🔄 Comment router les requêtes (tout vers l'app Express)
- 🌍 L'environnement de production

---

## 🎯 Checklist finale

Avant de déployer, vérifiez :

- [ ] `vercel.json` créé et commité
- [ ] Variables d'environnement configurées sur Vercel :
  - [ ] `DATABASE_URL`
  - [ ] `SESSION_SECRET`
  - [ ] `NODE_ENV=production`
- [ ] Base de données PostgreSQL provisionnée
- [ ] Schéma de base de données poussé (`npm run db:push`)
- [ ] Code commité et pushé sur GitHub
- [ ] Vérifier les logs Vercel après déploiement

---

## 🔗 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/docs)
- [Neon](https://neon.tech/docs)

---

## 🆘 Besoin d'aide ?

Si vous voyez toujours "aucun output" après ces étapes :

1. Vérifiez les **Function Logs** sur Vercel
2. Vérifiez que toutes les variables d'environnement sont définies
3. Testez localement avec `npm run build && npm start`

Bonne chance ! 🚀
