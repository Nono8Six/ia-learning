# Formation IA Fondations - Système d'Authentification

Ce projet utilise Supabase pour l'authentification des utilisateurs avec les fonctionnalités suivantes :

## Fonctionnalités d'authentification

- **Inscription par email/mot de passe**
- **Connexion par email/mot de passe**
- **Authentification avec Google**
- **Réinitialisation de mot de passe**
- **Gestion de profil utilisateur**
- **Protection des routes**

## Configuration de Supabase

1. Créez un compte sur [Supabase](https://supabase.com/)
2. Créez un nouveau projet
3. Copiez les informations d'API (URL et clé anonyme) dans le fichier `.env`
4. Exécutez les scripts de migration dans votre base de données Supabase:
   - Allez dans le [SQL Editor](https://app.supabase.com/project/_/sql) de votre projet Supabase
   - Créez une nouvelle requête
   - Exécutez les migrations dans l'ordre suivant:
     1. `20250603073720_fragrant_island.sql`
     2. `20250603134253_azure_disk.sql`
     3. `20250603135953_rapid_palace.sql`
     4. `20250603140252_pink_firefly.sql`
     5. `20250604043209_twilight_resonance.sql`
     6. `20250604043754_pale_oasis.sql`
     7. `20250604050552_pink_jungle.sql`

## Développement

1. Installez les dépendances :
```bash
npm install
```

2. Copiez `.env.example` en `.env` et remplissez les variables d'environnement :
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

## Structure du projet

- `/components/auth` - Composants d'authentification (formulaires de connexion, inscription, etc.)
- `/contexts/AuthContext.tsx` - Contexte React pour gérer l'état d'authentification
- `/lib/supabase.ts` - Client Supabase
- `/middleware.ts` - Middleware Next.js pour protéger les routes
- `/app/auth` - Pages d'authentification

## codex/créer-tests-pour-supabase.ts-avec-jest-ou-vitest
## Tests

Pour lancer les tests unitaires Vitest :
```bash
npm run test
```
=======

## Licence

Ce projet est distribué sous licence [MIT](LICENSE).
# main
