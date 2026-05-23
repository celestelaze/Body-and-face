# Body & Face — Luxe Beauty E-Commerce

## 🚀 Déploiement Vercel

1. **Télécharger & extraire l'archive**
2. **Créer un repo GitHub** : github.com → New repository → "body-and-face"
3. **Pousser le code** :
   ```bash
   cd body-and-face
   git init
   git add .
   git commit -m "Body & Face - Initial commit"
   git branch -M main
   git remote add origin https://github.com/TON_USERNAME/body-and-face.git
   git push -u origin main
   ```
4. **Déployer sur Vercel** :
   - Aller sur vercel.com → Add New Project
   - Importer le repo GitHub
   - Dans **Environment Variables**, ajouter :
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://ppmkwqoojlmxpfcaxpxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
     NEXT_PUBLIC_WHATSAPP_NUMBER=242064731996
     NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/body_and_face_congo...
     ```
   - Cliquer **Deploy** ✅

## 🔐 Accès Admin

URL: `/admin` (non liée nulle part sur le site public)

**Pour devenir admin :**
1. Créer un compte sur le site (inscription normale)
2. Aller dans Supabase Dashboard → SQL Editor → Exécuter :
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'ton@email.com';
   ```
3. Se connecter sur `/admin` avec ce compte ✓

**Fonctionnalités admin :**
- ✅ Gérer catégories (créer, modifier, supprimer)
- ✅ Gérer produits avec variantes (couleur, volume, format...)
- ✅ Badges Nouveau / Bestseller / Promo
- ✅ Marquer produits en vedette
- ✅ Tableau de bord avec statistiques
- ✅ Suivi des commandes

## 🛒 Checkout WhatsApp

Quand un client valide son panier → redirigé vers WhatsApp du numéro +242064731996 avec le récapitulatif complet de la commande.

## 📱 Fonctionnalités site

- 🔐 Inscription / Connexion (Supabase Auth)
- ❤️ Wishlist (sauvegardée dans Supabase)
- 🛒 Panier persistant (sauvegardé dans Supabase)
- 🔍 Recherche produits
- 📦 Filtres par catégorie + tri par prix
- 📲 Instagram @body_and_face_congo lié
- 📱 Design responsive mobile/desktop

## 🗄️ Supabase

- **Projet**: body-and-face
- **URL**: https://ppmkwqoojlmxpfcaxpxx.supabase.co
- **Région**: eu-west-3 (Paris)
- **Tables**: profiles, categories, products, wishlist, cart, orders
- **Sécurité**: RLS activé sur toutes les tables
