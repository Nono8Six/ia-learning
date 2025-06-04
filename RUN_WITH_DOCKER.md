# Lancer le projet via Docker Desktop

Ce guide explique comment construire et exécuter l'application en conteneur à l'aide de **Docker Desktop**.

## Prérequis

- Docker Desktop installé sur votre machine ([Windows/Mac](https://www.docker.com/products/docker-desktop/) ou Docker Engine sur Linux)
- Un compte [Supabase](https://supabase.com/) avec un projet configuré
- Les variables d'environnement présentes dans `.env` (copier depuis `.env.example` et renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Étapes

1. **Cloner le dépôt** (si ce n'est pas déjà fait) :
   ```bash
   git clone <url-du-repo>
   cd ia-learning
   ```

2. **Préparer le fichier `.env`** :
   - Dupliquer `.env.example` sous le nom `.env`.
   - Renseigner les URL et clé anonyme de votre projet Supabase.
   - Les autres variables sont optionnelles pour la mise en route.

3. **Construire et démarrer l'application** :
   Dans le répertoire du projet, lancez :
   ```bash
   docker compose up --build
   ```
   Les variables d'environnement définies dans `.env` sont
   automatiquement injectées au moment du build afin que Next.js
   compile correctement l'application. Cette commande télécharge les
   dépendances, génère l'application puis démarre le conteneur `web`
   exposé sur le port **3000**.

4. **Accéder à l'application** :
   Une fois le conteneur démarré, ouvrez votre navigateur sur [http://localhost:3000](http://localhost:3000).

5. **Exécuter la suite de tests (optionnel)** :
   Pour lancer les tests unitaires à l'intérieur du conteneur :
   ```bash
   docker compose exec web npm run test
   ```
   Les tests utilisent Vitest et permettent de vérifier le bon fonctionnement de l'application.

## Vérifications supplémentaires

- Vérifiez que Docker Desktop affiche bien le conteneur `ia-learning_web` en cours d'exécution.
- En cas de modification du code ou des dépendances, relancez `docker compose up --build` pour recréer l'image.
- Les logs du serveur sont visibles dans la fenêtre de terminal où `docker compose` est lancé ou via l'interface Docker Desktop.

## Arrêt des services

Pour arrêter et supprimer le conteneur :
```bash
docker compose down
```

Cette procédure vous permet de faire fonctionner le projet localement en utilisant uniquement Docker Desktop.
