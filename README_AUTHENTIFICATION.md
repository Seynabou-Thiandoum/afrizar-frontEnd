# 🔐 Authentification Afrizar - Frontend

## 📌 Résumé

L'intégration de l'authentification avec le backend Spring Boot est maintenant **complète et opérationnelle** !

## 🎯 Ce Qui Fonctionne

✅ Connexion avec email/mot de passe  
✅ Inscription Client et Vendeur  
✅ Gestion des 4 rôles (Admin, Client, Vendeur, Support)  
✅ Token JWT automatique  
✅ Routes protégées par rôle  
✅ Dashboard Admin fonctionnel  
✅ Validation de produits  
✅ Vérification de vendeurs  
✅ Statistiques en temps réel  

## 🚀 Démarrage en 3 Étapes

### 1️⃣ Démarrer le Backend
```bash
cd Afrizar_Back_End
mvn spring-boot:run
```

### 2️⃣ Démarrer le Frontend
```bash
cd afrizar-frontEnd
npm run dev
```

### 3️⃣ Se Connecter
```
URL: http://localhost:5173/auth
Email: admin@afrizar.sn
Password: Admin@123
```

## 📁 Nouveaux Fichiers Créés

```
afrizar-frontEnd/
├── src/
│   ├── services/
│   │   ├── authService.ts          ✅ Service d'authentification
│   │   └── adminService.ts         ✅ Service admin
│   ├── contexts/
│   │   └── AuthContext.tsx         🔄 Mis à jour
│   ├── config/
│   │   └── api.ts                  🔄 Mis à jour
│   └── components/
│       ├── ProtectedRoute.tsx      ✅ Routes protégées
│       └── AdminDashboardNew.tsx   ✅ Dashboard admin
│
├── INTEGRATION_AUTHENTIFICATION.md  ✅ Guide détaillé
├── QUICK_START.md                   ✅ Démarrage rapide
├── RESUME_INTEGRATION.md            ✅ Résumé
└── README_AUTHENTIFICATION.md       ✅ Ce fichier
```

## 🎮 Utilisation Rapide

### Connexion
```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    const result = await login('admin@afrizar.sn', 'Admin@123');
    if (result.success) {
      window.location.href = result.redirectTo; // '/admin/dashboard'
    }
  };
}
```

### Vérifier le Rôle
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  return (
    <>
      {user?.role === 'admin' && <AdminPanel />}
      {user?.role === 'vendor' && <VendorPanel />}
      {user?.role === 'client' && <ClientPanel />}
    </>
  );
}
```

### Appeler une API Admin
```typescript
import adminService from '../services/adminService';

async function validateProduct(productId: number) {
  try {
    await adminService.validateProduct(productId);
    alert('✅ Produit validé !');
  } catch (error) {
    alert('❌ Erreur: ' + error.message);
  }
}
```

## 🔑 Comptes Disponibles

| Rôle | Email | Password |
|------|-------|----------|
| Admin | admin@afrizar.sn | Admin@123 |
| Support | support@afrizar.sn | Support@123 |
| Client | *S'inscrire* | - |
| Vendeur | *S'inscrire* | - |

## 📖 Documentation

| Fichier | Description | Pour Qui |
|---------|-------------|----------|
| **QUICK_START.md** | Guide de démarrage rapide | 🚀 Commencer vite |
| **INTEGRATION_AUTHENTIFICATION.md** | Guide complet | 📚 Apprendre en détail |
| **RESUME_INTEGRATION.md** | Vue d'ensemble | 👁️ Comprendre l'architecture |

## 🛠️ Services Créés

### authService.ts
Gère toute l'authentification :
```typescript
- login(email, password)
- register(userData, userType)
- logout()
- getToken()
- getUser()
- isAuthenticated()
- hasRole(role)
```

### adminService.ts
Fonctionnalités admin :
```typescript
- getPendingProducts()
- validateProduct(id)
- rejectProduct(id, motif)
- getUnverifiedVendors()
- verifyVendor(id)
- getDashboardStats()
```

## 🎯 Flux Typique

### Pour un Client
```
1. S'inscrire (rôle CLIENT)
2. Naviguer dans les produits
3. Passer une commande
4. Suivre sa commande
```

### Pour un Vendeur
```
1. S'inscrire (rôle VENDEUR)
2. Attendre vérification admin ⏳
3. Créer des produits
4. Produits en attente de validation ⏳
5. Admin valide ✅
6. Produits visibles !
```

### Pour un Admin
```
1. Se connecter (admin@afrizar.sn)
2. Dashboard → Voir les stats
3. Vérifier les vendeurs en attente
4. Valider les produits en attente
5. Gérer les utilisateurs
```

## 🔒 Sécurité

- ✅ Token JWT (24h d'expiration)
- ✅ Stockage sécurisé (localStorage)
- ✅ Routes protégées par rôle
- ✅ Validation côté serveur
- ✅ CORS configuré
- ✅ Headers d'authentification automatiques

## 🐛 Dépannage Rapide

### Erreur: "Network Error"
```bash
# Le backend n'est pas démarré
cd Afrizar_Back_End
mvn spring-boot:run
```

### Erreur: "401 Unauthorized"
```javascript
// Token expiré ou invalide, reconnectez-vous
localStorage.clear();
window.location.href = '/auth';
```

### Erreur: "403 Forbidden"
```javascript
// Vous n'avez pas les permissions
// Connectez-vous avec le bon compte (admin pour /admin/*)
```

### Le dashboard est vide
```bash
# Créez des données de test :
1. Inscrivez un vendeur
2. Connectez-vous en admin
3. Vérifiez le vendeur
4. Le vendeur crée un produit
5. Connectez-vous en admin pour le valider
```

## 🧪 Tests

### Test Backend
```bash
curl http://localhost:8080/api/auth/test
# Devrait retourner: { "message": "✅ Backend Afrizar est accessible !" }
```

### Test Connexion
```javascript
// Dans la console du navigateur
fetch('http://localhost:8080/api/auth/connexion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@afrizar.sn',
    motDePasse: 'Admin@123'
  })
}).then(r => r.json()).then(console.log);
```

### Test API Admin
```javascript
// Après connexion
const token = localStorage.getItem('afrizar_token');
fetch('http://localhost:8080/api/admin/statistiques/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

## 📊 Exemple Complet

```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import adminService from '../services/adminService';

function AdminPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const statsData = await adminService.getDashboardStats();
    const productsData = await adminService.getPendingProducts();
    setStats(statsData);
    setProducts(productsData.content);
  };

  const handleValidate = async (productId) => {
    await adminService.validateProduct(productId);
    alert('✅ Produit validé !');
    loadData(); // Recharger
  };

  return (
    <div className="p-6">
      <h1>Bonjour {user?.firstName} !</h1>
      <button onClick={logout}>Déconnexion</button>

      {stats && (
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-white p-4 rounded shadow">
            <h3>Produits</h3>
            <p className="text-3xl">{stats.produits.total}</p>
            <small>{stats.produits.enAttente} en attente</small>
          </div>
          {/* ... autres stats ... */}
        </div>
      )}

      <h2>Produits en Attente ({products.length})</h2>
      {products.map(product => (
        <div key={product.id} className="border p-4 my-2">
          <h3>{product.nom}</h3>
          <p>{product.prix} FCFA</p>
          <button 
            onClick={() => handleValidate(product.id)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            ✅ Valider
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🎉 C'est Prêt !

Votre système d'authentification est **100% fonctionnel** !

### Prochaines Étapes

1. ✅ Testez avec les comptes fournis
2. 📱 Créez vos propres composants UI
3. 🎨 Personnalisez le design
4. 🚀 Déployez en production

## 📚 Ressources

- **Swagger Backend:** http://localhost:8080/swagger-ui.html
- **Documentation Backend:** ../Afrizar_Back_End/GUIDE_AUTHENTIFICATION_ROLES.md
- **Guide Intégration:** ./INTEGRATION_AUTHENTIFICATION.md
- **Démarrage Rapide:** ./QUICK_START.md

## 🆘 Support

Questions ? Consultez :
1. `QUICK_START.md` - Pour les problèmes de démarrage
2. `INTEGRATION_AUTHENTIFICATION.md` - Pour les détails techniques
3. Les logs du backend - Pour les erreurs serveur
4. La console du navigateur - Pour les erreurs frontend

---

**Happy Coding! 🚀**

*Système développé pour Afrizar - Octobre 2025*





