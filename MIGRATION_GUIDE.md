# Migration de Replit vers Application Standalone

## ✅ Changements effectués

### 1. Fichiers supprimés/à supprimer
- ❌ `.replit` - Configuration spécifique à Replit
- ❌ `server/replit_integrations/` - Dossier complet des intégrations Replit

### 2. Nouveaux fichiers créés
- ✅ `server/auth.ts` - Système d'authentification locale avec Passport.js
- ✅ `server/authStorage.ts` - Gestion des utilisateurs avec mots de passe
- ✅ `.env.example` - Template de configuration
- ✅ `README.md` - Documentation complète
- ✅ `migration_add_password_hash.sql` - Migration SQL pour la base de données

### 3. Fichiers modifiés
- ✅ `package.json` - Scripts Windows-compatibles + nouvelles dépendances
- ✅ `shared/models/auth.ts` - Ajout du champ `passwordHash`
- ✅ `server/routes.ts` - Utilisation de l'authentification locale
- ✅ `server/routes.ts` - Changement de `user.claims.sub` vers `user.id`

### 4. Dépendances ajoutées
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

## 📋 Étapes pour finaliser la migration

### Étape 1 : Activer l'exécution de scripts PowerShell (si nécessaire)

Ouvrez PowerShell en tant qu'administrateur et exécutez :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

Cela installera automatiquement :
- `bcryptjs` - Pour le hachage des mots de passe
- `cross-env` - Pour les variables d'environnement cross-platform
- `@types/bcryptjs` - Types TypeScript pour bcryptjs

### Étape 3 : Configurer l'environnement

1. Créez un fichier `.env` :
```bash
copy .env.example .env
```

2. Modifiez `.env` avec vos valeurs :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/kural_ai
SESSION_SECRET=changez-moi-en-production
PORT=5000
NODE_ENV=development
```

### Étape 4 : Mettre à jour la base de données

**Option A : Utiliser Drizzle (recommandé)**
```bash
npm run db:push
```

**Option B : Exécuter la migration SQL manuellement**
```bash
psql -U postgres -d kural_ai -f migration_add_password_hash.sql
```

### Étape 5 : Supprimer les fichiers Replit (optionnel)

```bash
# Supprimer le fichier de configuration Replit
del .replit

# Supprimer le dossier des intégrations Replit
rmdir /s server\replit_integrations
```

### Étape 6 : Démarrer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5000`

## 🔐 Nouveaux endpoints d'authentification

### Inscription
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123",
  "firstName": "Prénom",
  "lastName": "Nom"
}
```

### Connexion
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

### Déconnexion
```http
POST /api/logout
```

### Obtenir l'utilisateur actuel
```http
GET /api/user
```

## 🔄 Différences clés

| Avant (Replit) | Après (Standalone) |
|----------------|-------------------|
| OAuth Replit | Email/Password local |
| `user.claims.sub` | `user.id` |
| Variables env Replit | Fichier `.env` local |
| Scripts Unix | Scripts cross-platform |
| Dépendance Replit | Totalement indépendant |

## ⚠️ Points d'attention

1. **Sécurité** : Changez `SESSION_SECRET` en production
2. **Base de données** : Assurez-vous que PostgreSQL est installé et démarré
3. **Migration** : Les utilisateurs existants devront se réinscrire (pas de migration de mots de passe depuis Replit)
4. **HTTPS** : En production, utilisez HTTPS pour sécuriser les cookies de session

## 🎉 Résultat

Votre application est maintenant **100% indépendante de Replit** et peut fonctionner sur n'importe quel système (Windows, Mac, Linux) avec Node.js et PostgreSQL !
