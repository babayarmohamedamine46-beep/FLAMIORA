# FLAMIORA

Site vitrine et e-commerce FLAMIORA. HTML/CSS/JavaScript avec Firebase (Firestore + Auth).

## Structure

- `index.html`, `produits.html`, `produit.html`, `panier.html`, `commande.html`, `merci.html`, `a-propos.html`, `contact.html`, `404.html`
- `admin.html` — panneau d'administration (produits, catégories)
- `assets/css/style.css` — styles du site
- `assets/css/admin.css` — styles du panneau d'administration
- `assets/js/firebase-config.js` — configuration Firebase
- `assets/js/i18n.js` — traductions AR/FR
- `assets/js/products-loader.js` — chargement des produits/catégories depuis Firestore
- `assets/js/main.js` — panier, WhatsApp, logique partagée
- `assets/js/admin.js` — authentification et gestion des produits/catégories
- `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc`

## Déploiement

```
firebase deploy
```

Créez un utilisateur dans Firebase Authentication (email/mot de passe) pour accéder à `admin.html`.

