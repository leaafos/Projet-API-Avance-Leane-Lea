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
- **Papa Parse** : Conversion CSV
- **xml2js** : Conversion XML

### Modèles
- **Users** : Utilisateurs
- **Books** : Livres avec traduction
- **Authors** : Auteurs  
- **Categories** : Catégories avec traduction

### Fonctionnalités
- **API CRUD complète** pour tous les modèles
- **Traduction automatique** via header `Accept-Language`
- **4 langues supportées** : fr, en, es, pl
- **Formats multiples** : JSON, XML, CSV via header `Accept`
- **HATEOAS** : Navigation et pagination automatique
- **Gestion d'erreurs centralisée** : Erreurs formatées et traduites
- **Validation Sequelize** : Contraintes de données avec messages d'erreur
- **Données de test** pré-chargées

## Structure

```
├── controllers/    # Logique métier
├── models/        # Modèles Sequelize + associations
├── routes/        # Routes Express + fichiers .http de test
├── middlewares/   # Middlewares (traduction, format, HATEOAS, erreur)
├── locales/       # Fichiers de traduction JSON
├── lib/           # Configuration i18next + versioning
└── compose.yml    # Configuration Docker
```

## Middlewares Implémentés

### 1. Traduction (`translateMiddleware.js`)
- Détecte la langue via header `Accept-Language`
- Traduit automatiquement les champs texte
- Supporte : `fr`, `en`, `es`, `pl`

### 2. Formatage (`formatingMiddleware.js`)
- Multiple formats de sortie via header `Accept`
- **JSON** : `application/json` (défaut)
- **CSV** : `text/csv` 
- **XML** : `text/xml`

### 3. HATEOAS (`hateoasMiddleware.js`)
- Links de navigation automatiques
- Pagination avec headers `Link`
- Paramètres : `page`, `itemsPerPage`

### 4. Gestion d'erreurs (`errorHandler.js`)
- Centralisation des erreurs
- Erreurs formatées (status + message)
- Messages d'erreur traduits

## Exemples d'utilisation

### Traduction
```bash
# Français
curl -H "Accept-Language: fr" http://localhost:3000/categories

# Espagnol  
curl -H "Accept-Language: es" http://localhost:3000/categories
```

### Formats
```bash
# CSV
curl -H "Accept: text/csv" http://localhost:3000/authors

# XML
curl -H "Accept: text/xml" http://localhost:3000/books

# JSON (défaut)
curl http://localhost:3000/users
```

### Pagination HATEOAS
```bash
curl -I "http://localhost:3000/authors?page=1&itemsPerPage=5"
# Retourne des headers Link avec first, last, next, prev
```