# 🚀 Démarrage Rapide - Intégration Authentification

## 📝 Checklist de Mise en Place

### ✅ Étape 1: Vérifier que le Backend est Démarré

```bash
cd Afrizar_Back_End
mvn spring-boot:run
```

Vérifiez dans les logs que vous voyez :
```
✅ Compte admin créé avec succès !
   Email: admin@afrizar.sn
   Mot de passe: Admin@123
```

### ✅ Étape 2: Installer les Dépendances Frontend

```bash
cd afrizar-frontEnd
npm install
```

### ✅ Étape 3: Vérifier la Configuration API

Ouvrez `src/config/api.ts` et vérifiez que l'URL est correcte :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',  // ✅ Devrait correspondre à votre backend
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

### ✅ Étape 4: Tester la Connexion Backend

Créez un fichier de test rapide : `test-backend.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Backend</title>
</head>
<body>
  <h1>Test de Connexion Backend</h1>
  <button onclick="testConnection()">Tester</button>
  <pre id="result"></pre>

  <script>
    async function testConnection() {
      try {
        const response = await fetch('http://localhost:8080/api/auth/test');
        const data = await response.json();
        document.getElementById('result').textContent = 
          'Connexion réussie! ✅\n' + JSON.stringify(data, null, 2);
      } catch (error) {
        document.getElementById('result').textContent = 
          'Erreur de connexion ❌\n' + error.message;
      }
    }
  </script>
</body>
</html>
```

Ouvrez ce fichier dans un navigateur et cliquez sur "Tester".

### ✅ Étape 5: Mettre à Jour App.tsx

Remplacez ou mettez à jour votre `src/App.tsx` :

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your components
import Auth from './components/Auth';
import AdminDashboardNew from './components/AdminDashboardNew';
// ... autres imports

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route de connexion */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Route Admin protégée */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardNew />
              </ProtectedRoute>
            } 
          />
          
          {/* Autres routes... */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### ✅ Étape 6: Démarrer le Frontend

```bash
npm run dev
```

### ✅ Étape 7: Tester la Connexion

1. Ouvrez votre navigateur : `http://localhost:5173` (ou votre port)
2. Allez sur `/auth`
3. Connectez-vous avec :
   ```
   Email: admin@afrizar.sn
   Mot de passe: Admin@123
   ```
4. Vous devriez être redirigé vers `/admin/dashboard`

## 🔍 Tests Rapides

### Test 1: Connexion Admin

```javascript
// Dans la console du navigateur
fetch('http://localhost:8080/api/auth/connexion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@afrizar.sn',
    motDePasse: 'Admin@123'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Connexion réussie:', data))
.catch(err => console.error('❌ Erreur:', err));
```

### Test 2: Récupérer les Produits en Attente

```javascript
// Après connexion, avec le token
const token = localStorage.getItem('afrizar_token');

fetch('http://localhost:8080/api/admin/produits/en-attente', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Produits en attente:', data))
.catch(err => console.error('❌ Erreur:', err));
```

### Test 3: Valider un Produit

```javascript
// Remplacez 1 par l'ID d'un vrai produit
const token = localStorage.getItem('afrizar_token');
const productId = 1;

fetch(`http://localhost:8080/api/admin/produits/${productId}/valider`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Produit validé:', data))
.catch(err => console.error('❌ Erreur:', err));
```

## 🔧 Configuration CORS (si nécessaire)

Si vous avez des erreurs CORS, vérifiez dans le backend `SecurityConfig.java` :

```java
configuration.setAllowedOriginPatterns(List.of(
    "http://localhost:*",           // ✅ Devrait être présent
    "http://127.0.0.1:*"
));
```

Redémarrez le backend après modification.

## 📊 Utilisation Basique

### Dans un Composant React

```typescript
import { useAuth } from '../contexts/AuthContext';
import adminService from '../services/adminService';

function MyAdminComponent() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await adminService.getPendingProducts();
      setProducts(data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleValidate = async (productId) => {
    try {
      await adminService.validateProduct(productId);
      alert('Produit validé!');
      loadProducts(); // Recharger
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Hello {user?.firstName}!</h1>
      <button onClick={logout}>Déconnexion</button>
      
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.nom}</h3>
          <button onClick={() => handleValidate(product.id)}>
            Valider
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🐛 Problèmes Courants

### Problème 1: "Network Error" ou "Failed to fetch"

**Cause:** Backend non démarré ou CORS mal configuré

**Solution:**
1. Vérifiez que le backend tourne : `http://localhost:8080/api/auth/test`
2. Vérifiez les logs du backend
3. Vérifiez la configuration CORS

### Problème 2: "401 Unauthorized"

**Cause:** Token manquant ou invalide

**Solution:**
1. Vérifiez que le token est dans localStorage : `localStorage.getItem('afrizar_token')`
2. Reconnectez-vous pour obtenir un nouveau token
3. Vérifiez que le token est bien envoyé dans le header

### Problème 3: "403 Forbidden"

**Cause:** Vous n'avez pas les permissions pour cette action

**Solution:**
1. Vérifiez votre rôle : `localStorage.getItem('afrizar_user')`
2. Connectez-vous avec le compte admin

### Problème 4: Le Dashboard est vide

**Cause:** Pas de données dans la base

**Solution:**
1. Créez un vendeur via l'inscription
2. Le vendeur crée des produits
3. Connectez-vous en admin pour les voir en attente

## 📱 Flux Complet de Test

### Scénario: Admin Valide un Produit

1. **Créer un Vendeur**
   - Allez sur `/auth`
   - Inscrivez-vous en tant que vendeur
   - Notez : le vendeur n'est pas vérifié

2. **Vérifier le Vendeur (Admin)**
   - Connectez-vous en admin
   - Allez sur le dashboard
   - Cliquez sur "Vérifier" pour le nouveau vendeur

3. **Créer un Produit (Vendeur)**
   - Reconnectez-vous avec le compte vendeur
   - Créez un produit
   - Le produit est en attente de validation

4. **Valider le Produit (Admin)**
   - Reconnectez-vous en admin
   - Allez sur le dashboard
   - Voyez le produit en attente
   - Cliquez sur "Valider"
   - Le produit devient visible !

## 🎯 Objectifs Atteints

- ✅ Connexion avec le backend réel
- ✅ Gestion des rôles (Admin, Vendeur, Client, Support)
- ✅ Validation des produits
- ✅ Vérification des vendeurs
- ✅ Dashboard admin fonctionnel
- ✅ Routes protégées par rôle
- ✅ Token JWT automatiquement géré

## 📚 Documentation Complète

- **Guide d'intégration détaillé:** `INTEGRATION_AUTHENTIFICATION.md`
- **Documentation backend:** `../Afrizar_Back_End/GUIDE_AUTHENTIFICATION_ROLES.md`
- **API Swagger:** `http://localhost:8080/swagger-ui.html`

## 🆘 Besoin d'Aide ?

1. Vérifiez les logs du backend (terminal où tourne le backend)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez l'onglet Network (F12 > Network) pour voir les requêtes HTTP
4. Consultez `INTEGRATION_AUTHENTIFICATION.md` pour plus de détails

---

**Bon développement ! 🚀**

