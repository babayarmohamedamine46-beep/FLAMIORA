# FLAMIORA

Site vitrine et e-commerce FLAMIORA. HTML/CSS/JavaScript vanilla avec Firebase (Firestore + Authentication). Aucune étape de build : le site s'exécute directement depuis ces fichiers statiques.

## Structure

- `index.html`, `produits.html`, `produit.html`, `panier.html`, `commande.html`, `merci.html`, `a-propos.html`, `contact.html`, `404.html`
- `admin.html` — panneau d'administration (produits, catégories, commandes)
- `assets/css/style.css` — styles du site
- `assets/css/admin.css` — styles du panneau d'administration
- `assets/js/firebase-config.js` — configuration Firebase (clé publique, non secrète)
- `assets/js/i18n.js` — traductions AR/FR
- `assets/js/products-loader.js` — chargement des produits/catégories depuis Firestore (avec repli sur des données de démarrage si Firestore est vide ou injoignable)
- `assets/js/main.js` — panier (localStorage), WhatsApp, logique partagée entre les pages
- `assets/js/admin.js` — authentification et gestion des produits, catégories et commandes
- `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc` — configuration Firebase Hosting / Firestore (projet `flamiora-f0062`)

## Configuration requise avant le premier lancement

1. **Créer le compte administrateur** — Dans la Console Firebase du projet `flamiora-f0062` → *Authentication* → *Users* → ajoutez un utilisateur avec l'adresse `babayarmohamedamine4@gmail.com` et un mot de passe. C'est la seule adresse autorisée par `firestore.rules` et par `admin.js`.
2. **Vérifier l'adresse e-mail de ce compte** — Les règles Firestore exigent `email_verified == true`. Depuis la Console Firebase, ouvrez le compte créé et marquez l'e-mail comme vérifié (ou envoyez le lien de vérification et cliquez dessus). Sans cette étape, la connexion au panneau `admin.html` sera refusée par les règles de sécurité même avec le bon mot de passe.
3. **Déployer les règles et index Firestore** :
   ```
   firebase deploy --only firestore:rules,firestore:indexes
   ```
4. **Ajouter les catégories et produits réels** dans Firestore via `admin.html` (les données visibles au premier chargement sont des données de secours locales, utilisées uniquement si Firestore est vide).

## Déploiement du site

```
firebase deploy
```

Cela publie l'ensemble du dossier (Firebase Hosting) ainsi que les règles/index Firestore, selon `firebase.json`.

Le site fonctionne aussi tel quel sur GitHub Pages (tous les chemins sont relatifs), mais dans ce cas seul l'hébergement des fichiers statiques est assuré par GitHub — Firestore/Authentication restent gérés par le projet Firebase `flamiora-f0062`.

## Fonctionnement des commandes

Le paiement se fait uniquement à la livraison (COD). Au moment de la commande :
- Le panier est vérifié, puis la commande est enregistrée dans la collection Firestore `orders` (visible et gérable depuis `admin.html` → *Commandes*).
- Le message récapitulatif est envoyé au commerçant via WhatsApp (numéro configuré dans `assets/js/main.js`), qui reste le canal de confirmation garanti même si l'écriture Firestore échoue (ex. cliente hors ligne).

