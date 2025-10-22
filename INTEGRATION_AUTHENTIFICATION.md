# 🔐 Guide d'Intégration de l'Authentification - Frontend Afrizar

## ✅ Fichiers Créés

Les fichiers suivants ont été créés pour l'intégration complète de l'authentification :

1. **`src/services/authService.ts`** - Service d'authentification avec le backend
2. **`src/services/adminService.ts`** - Service pour les fonctionnalités admin
3. **`src/contexts/AuthContext.tsx`** - Contexte d'authentification mis à jour
4. **`src/config/api.ts`** - Configuration API mise à jour
5. **`src/components/ProtectedRoute.tsx`** - Composant pour les routes protégées

## 🚀 Installation et Configuration

### 1. Vérifier les Dépendances

Assurez-vous que ces packages sont installés :

```bash
npm install react-router-dom lucide-react
```

### 2. Configuration du Backend

Dans `src/config/api.ts`, vérifiez que l'URL du backend est correcte :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',  // Changer selon votre configuration
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

## 📱 Intégration dans App.tsx

Mettez à jour votre `App.tsx` pour utiliser les routes protégées :

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import des composants
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import VendorDashboard from './components/VendorDashboard';
import ClientDashboard from './components/ClientDashboard';
import SupportDashboard from './components/SupportDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              
              {/* Routes Admin uniquement */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes Vendeur */}
              <Route 
                path="/vendor/*" 
                element={
                  <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes Client */}
              <Route 
                path="/client/*" 
                element={
                  <ProtectedRoute allowedRoles={['client', 'admin']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes Support */}
              <Route 
                path="/support/*" 
                element={
                  <ProtectedRoute allowedRoles={['support', 'admin']}>
                    <SupportDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## 🔑 Utilisation de l'Authentification

### Connexion

```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    
    if (result.success) {
      // Redirection automatique vers result.redirectTo
      window.location.href = result.redirectTo;
    } else {
      alert(result.error);
    }
  };
  
  return (
    // Votre UI de connexion
  );
}
```

### Inscription Client

```typescript
import { useAuth } from '../contexts/AuthContext';

function RegisterClient() {
  const { register } = useAuth();
  
  const handleRegister = async (userData) => {
    const result = await register({
      firstName: userData.prenom,
      lastName: userData.nom,
      email: userData.email,
      password: userData.password,
      phone: userData.telephone,
      address: userData.adresse,
      city: userData.ville,
      postalCode: userData.codePostal,
      country: 'Sénégal'
    }, 'client');
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };
}
```

### Inscription Vendeur

```typescript
const handleRegisterVendor = async (vendorData) => {
  const result = await register({
    firstName: vendorData.prenom,
    lastName: vendorData.nom,
    email: vendorData.email,
    password: vendorData.password,
    phone: vendorData.telephone,
    businessName: vendorData.nomBoutique,
    description: vendorData.description,
    businessAddress: vendorData.adresseBoutique,
    specialties: vendorData.specialites
  }, 'vendor');
  
  if (result.success) {
    alert(result.message);
    // Message: "Votre compte sera vérifié par un administrateur..."
  }
};
```

### Déconnexion

```typescript
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  return <button onClick={handleLogout}>Déconnexion</button>;
}
```

### Vérifier le Rôle

```typescript
import { useAuth } from '../contexts/AuthContext';

function SomeComponent() {
  const { user, hasPermission } = useAuth();
  
  return (
    <div>
      {user?.role === 'admin' && (
        <button>Accès Admin</button>
      )}
      
      {hasPermission('manage_products') && (
        <button>Gérer les produits</button>
      )}
    </div>
  );
}
```

## 🛡️ Utilisation du Service Admin

```typescript
import adminService from '../services/adminService';

// Dans un composant Admin
const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    loadPendingProducts();
  }, []);
  
  const loadPendingProducts = async () => {
    try {
      const data = await adminService.getPendingProducts(0, 20);
      setProducts(data.content);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  const handleValidate = async (productId) => {
    try {
      await adminService.validateProduct(productId);
      alert('Produit validé !');
      loadPendingProducts(); // Recharger la liste
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };
  
  const handleReject = async (productId, motif) => {
    try {
      await adminService.rejectProduct(productId, motif);
      alert('Produit rejeté');
      loadPendingProducts();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };
  
  return (
    <div>
      <h1>Produits en Attente de Validation</h1>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.nom}</h3>
          <p>Prix: {product.prix} FCFA</p>
          <p>Vendeur: {product.nomBoutique}</p>
          <button onClick={() => handleValidate(product.id)}>
            ✅ Valider
          </button>
          <button onClick={() => handleReject(product.id, 'Raison...')}>
            ❌ Rejeter
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 📊 Dashboard Admin - Exemple Complet

```typescript
import React, { useState, useEffect } from 'react';
import adminService, { DashboardStats } from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [unverifiedVendors, setUnverifiedVendors] = useState([]);
  
  useEffect(() => {
    loadDashboard();
  }, []);
  
  const loadDashboard = async () => {
    try {
      // Charger les statistiques
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
      
      // Charger les produits en attente
      const productsData = await adminService.getPendingProducts(0, 10);
      setPendingProducts(productsData.content);
      
      // Charger les vendeurs non vérifiés
      const vendorsData = await adminService.getUnverifiedVendors();
      setUnverifiedVendors(vendorsData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      
      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Produits" 
            value={stats.produits.total}
            subtitle={`${stats.produits.enAttente} en attente`}
          />
          <StatCard 
            title="Vendeurs" 
            value={stats.vendeurs.total}
            subtitle={`${stats.vendeurs.nonVerifies} à vérifier`}
          />
          <StatCard 
            title="Clients" 
            value={stats.clients.total}
          />
          <StatCard 
            title="Utilisateurs Actifs" 
            value={stats.utilisateurs.actifs}
          />
        </div>
      )}
      
      {/* Produits en attente */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Produits en Attente ({pendingProducts.length})
        </h2>
        {/* Liste des produits... */}
      </section>
      
      {/* Vendeurs à vérifier */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Vendeurs à Vérifier ({unverifiedVendors.length})
        </h2>
        {/* Liste des vendeurs... */}
      </section>
    </div>
  );
};
```

## 🔄 Gestion des Erreurs

```typescript
import { ERROR_MESSAGES } from '../config/api';

try {
  await adminService.validateProduct(productId);
} catch (error: any) {
  if (error.message.includes('401')) {
    alert(ERROR_MESSAGES.UNAUTHORIZED);
    // Rediriger vers la page de connexion
    window.location.href = '/auth';
  } else if (error.message.includes('403')) {
    alert(ERROR_MESSAGES.FORBIDDEN);
  } else {
    alert(error.message || ERROR_MESSAGES.SERVER_ERROR);
  }
}
```

## 📝 Comptes de Test

Pour tester l'intégration, utilisez ces comptes :

### Admin
```
Email: admin@afrizar.sn
Mot de passe: Admin@123
```

### Support
```
Email: support@afrizar.sn
Mot de passe: Support@123
```

### Créer un Client/Vendeur
Utilisez le formulaire d'inscription dans votre interface

## ⚠️ Points Importants

1. **CORS** : Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173` (ou votre port Vite)

2. **Token JWT** : Le token est automatiquement stocké dans `localStorage` et ajouté aux requêtes

3. **Expiration** : Le token expire après 24h. L'utilisateur devra se reconnecter

4. **Validation** : 
   - Les vendeurs doivent être vérifiés avant de pouvoir vendre
   - Les produits doivent être validés avant d'être visibles

5. **Permissions** : Utilisez `hasPermission()` pour vérifier les permissions spécifiques

## 🐛 Débogage

### Vérifier la connexion au backend

```typescript
// Test simple
fetch('http://localhost:8080/api/auth/test')
  .then(res => res.json())
  .then(data => console.log('Backend:', data))
  .catch(err => console.error('Erreur:', err));
```

### Voir le token dans la console

```typescript
console.log('Token:', localStorage.getItem('afrizar_token'));
console.log('User:', localStorage.getItem('afrizar_user'));
```

### Logs réseau

Ouvrez les DevTools (F12) > Network pour voir toutes les requêtes API

## 📚 Prochaines Étapes

1. ✅ Tester la connexion avec le compte admin
2. ✅ Tester la validation de produits
3. ✅ Tester la vérification de vendeurs
4. ✅ Créer les composants UI manquants
5. ✅ Ajouter la gestion des erreurs
6. ✅ Implémenter la pagination
7. ✅ Ajouter les notifications/toasts

## 🆘 Support

En cas de problème :
1. Vérifiez que le backend est démarré (`mvn spring-boot:run`)
2. Vérifiez l'URL dans `api.ts`
3. Vérifiez les logs du backend
4. Vérifiez la console du navigateur

---

**Documentation complète du backend** : `../Afrizar_Back_End/GUIDE_AUTHENTIFICATION_ROLES.md`



