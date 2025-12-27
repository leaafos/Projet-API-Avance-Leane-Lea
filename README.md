# API Avancée - Librairie 

API Node.js/Express pour la gestion d'une librairie.

## Démarrage

```bash
docker compose up
```

L'API est disponible sur `http://localhost:3000`

## Composants

### Technologies
- **Node.js/Express** : Serveur API
- **PostgreSQL** : Base de données
- **Sequelize** : ORM avec migrations automatiques
- **i18next** : Système de traduction
// ajouter quand update des middlewares

### Modèles
- **Users** : Utilisateurs
- **Books** : Livres avec traduction
- **Authors** : Auteurs  
- **Categories** : Catégories avec traduction

### Fonctionnalités
- **API CRUD complète** pour tous les modèles
- **Traduction automatique** via header `Accept-Language`
- **4 langues supportées** : fr, en, es, pl
- **Données de test** pré-chargées
// ajouter quand update des middlewares

## Structure

```
├── controllers/    # Logique métier
├── models/        # Modèles Sequelize + associations
├── routes/        # Routes Express + fichiers .http de test
├── middlewares/   # Middleware de traduction
├── locales/       # Fichiers de traduction JSON
├── lib/           # Configuration i18next
└── compose.yml    # Configuration Docker
```