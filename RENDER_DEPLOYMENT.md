# 🚀 Déploiement sur Render.com - Guide Rapide

## ⚡ Pourquoi Render.com ?

- ✅ **Gratuit** pour commencer (750h/mois)
- ✅ **Compatible** avec Express + Node.js natif
- ✅ **PostgreSQL gratuit** inclus
- ✅ **Aucune modification** de code nécessaire
- ✅ **Déploiement en 5 minutes**

---

## 📋 Étapes de déploiement

### 1️⃣ Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **Get Started for Free**
3. Inscrivez-vous avec GitHub (recommandé)

### 2️⃣ Créer une base de données PostgreSQL

1. Dans le dashboard Render, cliquez sur **New +**
2. Sélectionnez **PostgreSQL**
3. Configuration :
   - **Name**: `kural-ai-db`
   - **Database**: `kural_ai`
   - **User**: `kural_ai_user`
   - **Region**: Choisissez le plus proche (Frankfurt pour l'Europe)
   - **Plan**: **Free** (0$/mois)
4. Cliquez sur **Create Database**
5. **Attendez 2-3 minutes** que la base soit créée
6. Une fois créée, copiez l'**Internal Database URL** (commence par `postgresql://`)

### 3️⃣ Créer le Web Service

1. Cliquez sur **New +** → **Web Service**
2. Connectez votre repository GitHub : `NathubeXX05/kural-ai0`
3. Configuration :

   **Basic Settings:**
   - **Name**: `kural-ai`
   - **Region**: Même que la base de données
   - **Branch**: `main`
   - **Root Directory**: (laisser vide)
   - **Runtime**: `Node`

   **Build & Deploy:**
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

   **Plan:**
   - Sélectionnez **Free** (0$/mois, 750h)

4. **NE CLIQUEZ PAS ENCORE SUR "Create Web Service"**

### 4️⃣ Ajouter les variables d'environnement

Avant de créer le service, ajoutez ces variables :

Cliquez sur **Advanced** → **Add Environment Variable**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | [Collez l'Internal Database URL de l'étape 2] |
| `SESSION_SECRET` | [Générez une chaîne aléatoire - voir ci-dessous] |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

**Générer SESSION_SECRET** (sur votre machine locale) :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5️⃣ Créer le service

1. Cliquez sur **Create Web Service**
2. Render va :
   - Cloner votre repo
   - Installer les dépendances
   - Exécuter le build
   - Démarrer l'application
3. **Attendez 3-5 minutes** pour le premier déploiement

### 6️⃣ Pousser le schéma de base de données

Une fois le service déployé :

**Option A : Via l'interface Render (Recommandé)**
1. Dans votre service, allez dans **Shell**
2. Exécutez :
   ```bash
   npm run db:push
   ```

**Option B : Depuis votre machine locale**
1. Copiez la `DATABASE_URL` de Render
2. Sur votre machine :
   ```bash
   # Temporairement
   set DATABASE_URL=postgresql://votre-url-render
   npm run db:push
   ```

### 7️⃣ Vérifier le déploiement

1. Render vous donnera une URL : `https://kural-ai.onrender.com`
2. Testez l'API :
   ```bash
   curl https://kural-ai.onrender.com/api/courses
   ```
3. Ouvrez l'URL dans votre navigateur

---

## 🔧 Configuration automatique des déploiements

Render redéploie automatiquement à chaque push sur `main` !

```bash
# Faire des changements
git add .
git commit -m "Update feature"
git push origin main

# Render redéploie automatiquement ! 🎉
```

---

## 📊 Monitoring

### Voir les logs en temps réel

1. Dashboard Render → Votre service
2. Onglet **Logs**
3. Vous verrez :
   ```
   serving on port 5000
   Database seeded!
   ```

### Redémarrer le service

Si besoin, cliquez sur **Manual Deploy** → **Clear build cache & deploy**

---

## 💰 Limites du plan gratuit

- ✅ 750 heures/mois (suffisant pour 1 app)
- ✅ 512 MB RAM
- ✅ PostgreSQL 1 GB stockage
- ⚠️ Le service s'endort après 15 min d'inactivité (redémarre au premier accès)
- ⚠️ Premier accès peut prendre 30-60 secondes après inactivité

**Pour éviter l'endormissement** (optionnel) :
- Upgrade vers le plan payant ($7/mois)
- Ou utilisez un service de ping (UptimeRobot)

---

## 🎯 Checklist de déploiement

- [ ] Compte Render créé
- [ ] Base de données PostgreSQL créée
- [ ] `DATABASE_URL` copiée
- [ ] `SESSION_SECRET` générée
- [ ] Web Service créé avec les bonnes variables
- [ ] Build réussi (vérifier les logs)
- [ ] Schéma de base de données poussé (`npm run db:push`)
- [ ] Application accessible sur l'URL Render
- [ ] Test de l'API réussi

---

## 🔄 Alternative : Railway.app

Si Render ne fonctionne pas, essayez Railway :

1. [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez **PostgreSQL** depuis l'onglet **New**
6. Ajoutez les variables d'environnement
7. Déployez !

Railway est encore plus simple mais avec moins d'heures gratuites.

---

## 🆘 Problèmes courants

### Build échoue
- Vérifiez que `npm run build` fonctionne localement
- Vérifiez les logs Render pour l'erreur exacte

### "DATABASE_URL must be set"
- Vérifiez que la variable est bien ajoutée dans Render
- Vérifiez qu'il n'y a pas d'espace avant/après l'URL

### Application ne démarre pas
- Vérifiez les logs
- Assurez-vous que `npm start` fonctionne localement

### 404 sur toutes les routes
- Vérifiez que le build a bien créé `dist/index.cjs`
- Vérifiez les logs de démarrage

---

## 🎉 C'est tout !

Votre application sera en ligne en **5-10 minutes** sans aucune modification de code !

**URL finale** : `https://kural-ai.onrender.com` (ou le nom que vous avez choisi)

---

## 📚 Ressources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Render PostgreSQL](https://render.com/docs/databases)
