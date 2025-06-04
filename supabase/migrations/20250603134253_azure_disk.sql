/*
  # Création des rôles et mise à jour du schéma pour l'administration

  1. Nouvelles Tables
    - `user_roles` - Stocke les rôles des utilisateurs (admin, instructor, student)
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence aux profiles.id)
      - `role` (text, enum de rôles)
      - `created_at` (timestamp avec fuseau horaire)
  
  2. Sécurité
    - Activer RLS sur la table `user_roles`
    - Ajouter des politiques pour que seuls les administrateurs puissent gérer les rôles
    - Ajouter des politiques pour que les utilisateurs puissent voir leur propre rôle
  
  3. Fonctions
    - Créer une fonction pour vérifier si un utilisateur est administrateur
    - Créer une fonction pour attribuer un rôle à un utilisateur
*/

-- Créer un type pour les rôles d'utilisateurs
CREATE TYPE user_role_type AS ENUM ('admin', 'instructor', 'student');

-- Créer la table des rôles utilisateurs
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role_type NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Activer RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politique: les admins peuvent tout faire
CREATE POLICY "Les administrateurs peuvent gérer tous les rôles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Politique: les utilisateurs peuvent voir leur propre rôle
CREATE POLICY "Les utilisateurs peuvent voir leurs propres rôles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Créer la table des cours
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL,
  duration TEXT,
  order_index INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Activer RLS sur la table des cours
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Politique: les admins peuvent tout faire avec les cours
CREATE POLICY "Les administrateurs peuvent gérer tous les cours"
  ON courses
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Politique: tous les utilisateurs authentifiés peuvent voir les cours publiés
CREATE POLICY "Les utilisateurs peuvent voir les cours publiés"
  ON courses
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Créer la table des modules (sous-parties de cours)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  duration TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Activer RLS sur la table des modules
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Politique: les admins peuvent tout faire avec les modules
CREATE POLICY "Les administrateurs peuvent gérer tous les modules"
  ON modules
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Politique: les utilisateurs authentifiés peuvent voir les modules des cours publiés
CREATE POLICY "Les utilisateurs peuvent voir les modules des cours publiés"
  ON modules
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = modules.course_id AND courses.status = 'published'
  ));

-- Créer la table de progression des utilisateurs
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  last_accessed TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, course_id, module_id)
);

-- Activer RLS sur la table de progression
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Politique: les admins peuvent tout voir
CREATE POLICY "Les administrateurs peuvent voir toutes les progressions"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Politique: les utilisateurs peuvent voir leur propre progression
CREATE POLICY "Les utilisateurs peuvent voir leur propre progression"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Politique: les utilisateurs peuvent mettre à jour leur propre progression
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre progression"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Politique: les utilisateurs peuvent insérer leur propre progression
CREATE POLICY "Les utilisateurs peuvent insérer leur propre progression"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Créer la table des codes promo
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0 NOT NULL,
  valid_from TIMESTAMPTZ DEFAULT now() NOT NULL,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Activer RLS sur la table des codes promo
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Politique: les admins peuvent tout faire avec les codes promo
CREATE POLICY "Les administrateurs peuvent gérer tous les codes promo"
  ON coupons
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Insérer un utilisateur admin par défaut pour le développement
-- À exécuter dans le SQL Editor de Supabase avec le user_id de l'utilisateur de test
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::user_role_type
FROM profiles
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;