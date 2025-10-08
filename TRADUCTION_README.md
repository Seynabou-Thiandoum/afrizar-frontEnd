# Guide de Traduction - Afrizar

## ✅ Système de traduction installé avec succès !

Votre site Afrizar dispose maintenant d'un système complet de traduction français/anglais.

## 🌍 Langues supportées

- **Français** (FR) - Langue par défaut
- **English** (EN)

## 🎯 Fonctionnalités

### 1. Changement de langue
Les utilisateurs peuvent changer la langue via :
- Le bouton Globe (🌐) dans le header qui bascule entre FR et EN
- Le sélecteur de langue avancé (LanguageSelector) avec drapeaux

### 2. Pages traduites
Les pages suivantes sont maintenant entièrement traduites :
- ✅ Header (Navigation)
- ✅ Footer
- ✅ Page Contact
- ✅ Hero (textes de base)
- ✅ Catégories

## 📝 Comment utiliser les traductions dans vos composants

### Importer le hook
```tsx
import { useI18n } from '../contexts/InternationalizationContext';
```

### Utiliser dans un composant
```tsx
const MonComposant = () => {
  const { t, language, switchLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>Langue actuelle: {language}</p>
      <button onClick={switchLanguage}>
        Changer de langue
      </button>
    </div>
  );
};
```

## 🔑 Clés de traduction disponibles

### Navigation
- `home`, `clothes`, `accessories`, `vendors`, `contact`, `trends`
- `search`, `login`, `logout`, `categories`

### Page Contact
- `contact.title`, `contact.subtitle`
- `contact.address`, `contact.phone`, `contact.email`, `contact.hours`
- `contact.form_title`, `contact.name`, `contact.message`, `contact.send`
- Et plus...

### Footer
- `footer.about`, `footer.about_text`
- `footer.quick_links`, `footer.contact`
- `footer.copyright`, `footer.made_with_love`

## ➕ Ajouter de nouvelles traductions

Ouvrez le fichier : `src/contexts/InternationalizationContext.tsx`

Ajoutez vos traductions dans l'objet `translations` :

```typescript
const translations: Translations = {
  fr: {
    // ... traductions existantes
    'ma_nouvelle_cle': 'Mon texte en français',
  },
  
  en: {
    // ... traductions existantes
    'ma_nouvelle_cle': 'My text in English',
  }
};
```

Puis utilisez-la dans vos composants :
```tsx
{t('ma_nouvelle_cle')}
```

## 🌐 Fonctionnalités internationales avancées

Le système inclut également :

### Support multi-pays
- Plus de 60 pays supportés (Afrique, Europe, Amérique)
- Gestion automatique des devises (FCFA, USD, EUR, CAD...)
- Zones de livraison (Sénégal, Afrique, International)

### Conversion de devises
```tsx
const { formatPrice, convertPrice } = useI18n();

// Formater un prix dans la devise actuelle
formatPrice(10000); // "10,000 FCFA" ou "$16.00" selon la langue

// Convertir entre devises
convertPrice(10000, 'XOF', 'USD'); // 16
```

### Sélecteur de pays
Le composant `LanguageSelector` permet aux utilisateurs de :
- Choisir leur langue préférée
- Sélectionner leur pays pour une meilleure expérience
- Voir automatiquement les prix dans leur devise locale

## 🔧 Test du système

Pour tester le changement de langue :
1. Lancez votre application : `npm run dev`
2. Cliquez sur le bouton Globe (🌐) dans le header
3. La langue devrait basculer entre français et anglais
4. Toutes les pages traduites devraient changer instantanément

## 💾 Persistance

La langue choisie par l'utilisateur est automatiquement sauvegardée dans le `localStorage` et sera restaurée lors de sa prochaine visite.

## 📚 Bonnes pratiques

1. **Utilisez toujours les clés de traduction** au lieu du texte en dur
2. **Ajoutez les deux langues** (FR et EN) en même temps
3. **Utilisez des clés descriptives** : `contact.form_title` plutôt que `text1`
4. **Groupez par catégorie** : utilisez des préfixes comme `nav.`, `footer.`, `contact.`

## ⚠️ Pages à compléter

Certaines pages contiennent encore du texte en dur qui devrait être traduit :
- Page Vêtements (Vetements.tsx)
- Page Accessoires (AccessoiresPage.tsx)
- Page Vendeurs (Vendeurs.tsx)
- Dashboard Vendeur

Pour les traduire, suivez le même processus :
1. Ajoutez les traductions dans `InternationalizationContext.tsx`
2. Importez `useI18n()` dans le composant
3. Remplacez le texte en dur par `{t('cle')}`

## 🎨 Exemple complet

Voici un exemple complet de composant traduit :

```tsx
import React from 'react';
import { useI18n } from '../contexts/InternationalizationContext';

const MaPage = () => {
  const { t, language, switchLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{t('page.description')}</p>
      <button onClick={switchLanguage}>
        {language === 'fr' ? 'Switch to English' : 'Passer en français'}
      </button>
    </div>
  );
};

export default MaPage;
```

## 🚀 Prochaines étapes suggérées

1. Traduire les pages restantes (Vêtements, Accessoires, etc.)
2. Ajouter d'autres langues si nécessaire (Wolof, Arabe...)
3. Traduire les messages d'erreur et de succès
4. Traduire les catégories de produits
5. Traduire les descriptions de produits

---

**Fait avec ❤️ pour Afrizar**
