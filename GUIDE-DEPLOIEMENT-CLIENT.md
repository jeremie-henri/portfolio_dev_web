# 🚀 Guide de déploiement d'un site client

> Checklist réutilisable pour chaque nouveau projet client.
> Basée sur le déploiement de jeremiehenri.fr (juillet 2026).

---

## 1. Avant le déploiement — audit du code

```bash
npm run validate     # typecheck + lint → doit passer à 0 erreur
npm run build        # doit réussir, surveiller la taille des chunks (<500KB idéal)
```

**Checklist code :**
- [ ] Aucun fichier mort / doublon (composants non importés, anciens fichiers `.bak`)
- [ ] Aucune clé API ou secret en dur dans le code (chercher `sk_`, `password`, `secret`)
- [ ] Les grosses libs (Three.js, charts...) sont en `lazy(() => import(...))`
- [ ] Images optimisées en WebP (< 200KB chacune idéalement)
- [ ] `console.log` de debug supprimés

**Checklist SEO (dans le `<head>` de chaque page) :**
- [ ] `<title>` unique, 50-60 caractères
- [ ] `<meta name="description">` 150-160 caractères
- [ ] `<link rel="canonical">` avec l'URL finale du client
- [ ] Open Graph : `og:title`, `og:description`, `og:image` (l'image doit EXISTER, 1200×630px), `og:url`, `og:locale`
- [ ] JSON-LD adapté au métier : `LocalBusiness`, `Restaurant`, `HairSalon`, `Store`...
- [ ] `<html lang="fr">`, favicon, un seul `<h1>` par page
- [ ] `loading="lazy"` sur les images hors écran d'accueil
- [ ] `sitemap.xml` + `robots.txt` avec le bon domaine

**Checklist légal (OBLIGATOIRE France) :**
- [ ] Page mentions légales : nom/raison sociale, SIRET, adresse, contact, hébergeur
- [ ] Politique de confidentialité si formulaire de contact ou tracking (RGPD)
- [ ] CGV si vente en ligne
- [ ] Bannière cookies UNIQUEMENT si cookies tiers (analytics sans cookies = pas de bannière)
- [ ] Liens vers ces pages dans le footer

---

## 2. Vercel — mise en ligne

1. Push le code sur GitHub (repo du client ou le tien)
2. [vercel.com](https://vercel.com) → **Add New Project** → importer le repo
3. Framework auto-détecté (Vite/Next...) → **Deploy**
4. Le site est en ligne sur `xxx.vercel.app`

### Variables d'environnement

**Settings → Environment Variables**, pour chaque variable :
Key exacte + Value + environnements "Production and Preview" → Save.

| Variable type | Exemple | Règle |
|---|---|---|
| Secrets serveur | `GMAIL_PASS`, `STRIPE_SECRET_KEY` | JAMAIS de préfixe `VITE_` — reste côté serveur |
| Valeurs publiques | `VITE_EMAILJS_PUBLIC_KEY` | Préfixe `VITE_` = visible par les visiteurs |
| URL du site | `SITE_URL=https://domaine.fr` | Sans `/` final, à mettre à jour après le domaine |

**⚠️ Piège Gmail :** `GMAIL_PASS` = un **mot de passe d'application**
(myaccount.google.com/apppasswords, nécessite la validation 2 étapes), PAS le mot de passe du compte.

**⚠️ Après tout changement de variable → Deployments → ⋯ → Redeploy** (sinon rien ne s'applique).

---

## 3. Nom de domaine — connexion à Vercel

1. Acheter le domaine (OVH ~7-10€/an) — ou le client l'a déjà
2. Vercel → Settings → **Domains** → Add → taper `domaine.fr` ET `www.domaine.fr`
3. Vercel affiche les enregistrements DNS requis

### Chez OVH (zone DNS du domaine)

**⚠️ Règle d'or : SUPPRIMER les enregistrements en conflit AVANT d'ajouter les nouveaux.**
OVH pré-remplit la zone avec des enregistrements de "parking" qui bloquent tout.

| Action | Enregistrement |
|---|---|
| ❌ Supprimer | `@` A `213.186.33.5` (parking OVH) |
| ❌ Supprimer | `www` A `213.186.33.5` + `www` TXT `"3\|welcome"` (parking) |
| ✅ Ajouter | `@` A → l'IP donnée par Vercel (ex: `216.198.79.1`) |
| ✅ Ajouter | `www` CNAME → la cible donnée par Vercel (ex: `xxxx.vercel-dns-017.com.`) |
| 🚫 Ne pas toucher | NS, MX, SPF (emails et fonctionnement du domaine) |

**Rappels :**
- Un CNAME doit être SEUL sur son nom → supprimer TOUT ce qui existe sur `www` d'abord
- Il ne doit rester qu'UN seul enregistrement A sur `@`
- Champ sous-domaine vide = racine du domaine (ne pas mettre `@` chez OVH)
- Si le formulaire OVH bloque → lien "Mode d'édition avancé" en haut à droite

4. Propagation : 5 min à quelques heures → bouton **Refresh** dans Vercel jusqu'au ✅
5. HTTPS : automatique une fois validé
6. **Mettre à jour `SITE_URL`** avec le vrai domaine → **Redeploy**

---

## 4. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) → type **Domaine** → `domaine.fr`
2. Google donne un code `google-site-verification=...` → Copier
3. Zone DNS OVH → Ajouter une entrée → **TXT** → sous-domaine vide → coller le code
   (vérifier l'aperçu : `domaine.fr. IN TXT "google-site-verification=..."`)
4. Attendre 10-15 min → **Valider** chez Google (recliquable à volonté)
5. Menu **Sitemaps** → soumettre `sitemap.xml`
6. Inspecter l'URL d'accueil → **Demander une indexation** (accélère à 24-48h)
7. Vérifier l'indexation quelques jours après : taper `site:domaine.fr` dans Google

---

## 5. Tests finaux en production

- [ ] `https://domaine.fr` s'ouvre avec le cadenas 🔒
- [ ] `www.domaine.fr` redirige vers le domaine nu
- [ ] Formulaire de contact : s'envoyer un message test → bien reçu
- [ ] Si e-commerce : paiement test Stripe avec carte `4242 4242 4242 4242` (date future, CVC 123)
- [ ] Pages légales accessibles depuis le footer
- [ ] Test mobile réel (pas juste le devtools) : hero, menus, formulaires
- [ ] Partage du lien sur WhatsApp/LinkedIn → l'aperçu (og:image) s'affiche
- [ ] Lighthouse (devtools Chrome → onglet Lighthouse) : viser 90+ en SEO et Accessibilité

---

## 6. Livraison au client

- [ ] Transférer la propriété ou inviter le client sur Vercel (Settings → Members)
- [ ] Lui remettre : accès domaine, identifiants des services (EmailJS, Stripe...)
- [ ] Lui montrer ses statistiques (analytics embarqué ou Vercel Analytics)
- [ ] Facture 😎 (SIRET obligatoire dessus)

---

## Cartes de test Stripe (mode test uniquement)

| Carte | Résultat |
|---|---|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0000 0000 9995` | Fonds insuffisants |
| `4000 0025 0000 3155` | 3D Secure demandé |
