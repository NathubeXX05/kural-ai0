-- Migration pour ajouter le support de l'authentification locale
-- Ajoute la colonne password_hash à la table users

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR;

-- Rendre l'email obligatoire
ALTER TABLE users 
ALTER COLUMN email SET NOT NULL;
