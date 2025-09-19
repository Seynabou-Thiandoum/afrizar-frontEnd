# Intégration Backend - Afrizar Frontend

## Vue d'ensemble

Ce document décrit l'intégration complète du backend Spring Boot avec le frontend React pour la gestion des vendeurs dans l'application Afrizar.

## Architecture

### Backend (Spring Boot)
- **Contrôleur**: `VendeurController` - Gestion complète des vendeurs
- **Base URL**: `http://localhost:8080/api/vendeurs`
- **Documentation**: Swagger/OpenAPI disponible

### Frontend (React + TypeScript)
- **Types**: `src/types/vendor.ts` - Interfaces TypeScript pour les vendeurs
- **Service**: `src/services/vendorService.ts` - Service API pour communiquer avec le backend
- **Hooks**: `src/hooks/useVendors.ts` - Hooks React Query pour la gestion d'état
- **Composants**: Composants mis à jour pour utiliser les vraies données

## Fonctionnalités Intégrées

### 1. Gestion des Vendeurs
- ✅ Création de vendeurs
- ✅ Lecture et affichage des vendeurs
- ✅ Mise à jour des informations
- ✅ Suppression de vendeurs
- ✅ Vérification des vendeurs
- ✅ Gestion des vendeurs vedettes

### 2. Recherche et Filtrage
- ✅ Recherche par nom, email, spécialités
- ✅ Filtrage par spécialité, ville, rating
- ✅ Pagination des résultats
- ✅ Tri par différents critères

### 3. Statistiques
- ✅ Statistiques globales
- ✅ Statistiques par vendeur
- ✅ Comptage des vendeurs vérifiés
- ✅ Métriques de performance

### 4. Gestion d'État
- ✅ Cache intelligent avec React Query
- ✅ Gestion des états de chargement
- ✅ Gestion des erreurs
- ✅ Invalidation automatique du cache

## Structure des Fichiers

```
src/
├── types/
│   └── vendor.ts                 # Types TypeScript pour les vendeurs
├── services/
│   └── vendorService.ts          # Service API pour les vendeurs
├── hooks/
│   └── useVendors.ts             # Hooks React Query
├── lib/
│   └── queryClient.ts            # Configuration React Query
├── components/
│   ├── VendorsPage.tsx           # Page des vendeurs (mise à jour)
│   ├── VendorDashboard.tsx       # Dashboard vendeur
│   └── ApiTestComponent.tsx      # Composant de test API
└── main.tsx                      # Point d'entrée avec QueryClient
```

## Configuration

### Variables d'Environnement
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_DEVTOOLS=true
```

### Dépendances Ajoutées
```json
{
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-query-devtools": "^5.0.0"
}
```

## Utilisation

### 1. Démarrer le Backend
```bash
# Dans le projet Spring Boot
./mvnw spring-boot:run
```

### 2. Démarrer le Frontend
```bash
# Dans le projet React
npm install
npm run dev
```

### 3. Tester la Connexion
- Accédez au composant `ApiTestComponent` pour vérifier la connectivité
- Utilisez les DevTools React Query pour inspecter les requêtes

## Endpoints API Utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/vendeurs` | Liste paginée des vendeurs |
| GET | `/api/vendeurs/{id}` | Détails d'un vendeur |
| GET | `/api/vendeurs/verifies` | Vendeurs vérifiés |
| GET | `/api/vendeurs/vedettes` | Vendeurs vedettes |
| GET | `/api/vendeurs/recherche` | Recherche de vendeurs |
| POST | `/api/vendeurs` | Créer un vendeur |
| PUT | `/api/vendeurs/{id}` | Mettre à jour un vendeur |
| DELETE | `/api/vendeurs/{id}` | Supprimer un vendeur |
| PATCH | `/api/vendeurs/{id}/verifier` | Vérifier un vendeur |
| PATCH | `/api/vendeurs/{id}/vedette` | Marquer comme vedette |

## Gestion des Erreurs

### Types d'Erreurs
- **Erreurs réseau**: Connexion au serveur impossible
- **Erreurs 4xx**: Erreurs client (données invalides, non trouvé)
- **Erreurs 5xx**: Erreurs serveur

### Gestion dans le Frontend
- Affichage d'erreurs utilisateur-friendly
- Retry automatique pour les erreurs temporaires
- Fallback vers des données par défaut si nécessaire

## Performance

### Optimisations
- **Cache intelligent**: React Query gère le cache automatiquement
- **Pagination**: Chargement par pages pour de grandes listes
- **Lazy loading**: Chargement à la demande
- **Debouncing**: Recherche avec délai pour éviter trop de requêtes

### Métriques
- Temps de réponse des API
- Taux de succès des requêtes
- Utilisation du cache

## Tests

### Composant de Test
Le composant `ApiTestComponent` permet de :
- Tester tous les endpoints principaux
- Vérifier la connectivité
- Mesurer les temps de réponse
- Afficher l'état des hooks React Query

### Tests Automatisés
```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration
```

## Déploiement

### Production
1. Configurer les variables d'environnement
2. Build du frontend: `npm run build`
3. Déployer le backend sur le serveur
4. Servir les fichiers statiques du frontend

### Variables d'Environnement Production
```env
REACT_APP_API_URL=https://api.afrizar.com
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_DEVTOOLS=false
```

## Maintenance

### Monitoring
- Surveiller les logs du backend
- Utiliser les DevTools React Query
- Monitorer les performances API

### Mises à Jour
- Synchroniser les types TypeScript avec le backend
- Mettre à jour les endpoints si nécessaire
- Tester la compatibilité après chaque mise à jour

## Support

Pour toute question ou problème :
1. Vérifier les logs du backend
2. Utiliser le composant de test API
3. Consulter la documentation Swagger
4. Vérifier la configuration des variables d'environnement

## Prochaines Étapes

- [ ] Intégration des produits
- [ ] Gestion des commandes
- [ ] Système d'authentification
- [ ] Notifications en temps réel
- [ ] Tests automatisés complets
