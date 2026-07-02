# 🚀 Déployer un site pour un client — procédure complète

> Mode d'emploi à dérouler dans l'ordre pour chaque nouveau projet client.
> Temps estimé une fois rodé : 2-3h (hors développement du site).

---

## Phase 0 — Informations à collecter auprès du client (AVANT tout)

À demander dès la signature du devis, sinon tu seras bloqué en cours de route :

| Info | Pourquoi |
|---|---|
| Raison sociale, SIRET, adresse du siège | Mentions légales (obligatoire) |
| Nom de domaine souhaité (ou existant + accès registrar) | Connexion du site |
| Email professionnel du client | Réception des formulaires de contact / commandes |
| Textes : présentation, services, tarifs, photos | Contenu du site |
| Compte Stripe (si paiement en ligne) | Le compte doit être AU NOM DU CLIENT, jamais au tien |
| Numéro de téléphone, horaires, adresse physique | JSON-LD LocalBusiness + page contact |

**Règle d'or : tout ce qui touche à l'argent et à l'identité légale (domaine, Stripe,
compte email pro) appartient au client.** Toi tu configures, lui il possède.
Ça t'évite d'être responsable juridiquement et de devoir gérer ses accès à vie.

---

## Phase 1 — Préparer le code

```bash
npm run validate     # 0 erreur exigé (typecheck + lint)
npm run build        # doit réussir, chunks < 500KB (sinon lazy-load les grosses libs)
```

- [ ] Aucun secret/clé API en dur dans le code
- [ ] Images optimisées (WebP, < 200KB)
- [ ] SEO de chaque page : title (50-60 car.), meta description (150-160 car.),
      canonical avec le domaine du client, Open Graph avec une og:image qui existe (1200×630)
- [ ] JSON-LD adapté au métier du client (`LocalBusiness`, `Restaurant`, `Store`...)
- [ ] `sitemap.xml` et `robots.txt` avec le domaine du client
- [ ] Mentions légales + politique de confidentialité avec les infos du client, liées au footer
- [ ] Push sur un repo GitHub dédié au projet

---

## Phase 2 — Mettre en ligne sur Vercel

1. Vercel → **Add New Project** → importer le repo → **Deploy**
2. Le site est accessible sur `xxx.vercel.app` → montre-le au client pour validation finale

### Variables d'environnement (Settings → Environment Variables)

- Secrets serveur (mots de passe email, `STRIPE_SECRET_KEY`) : **sans** préfixe `VITE_`
- Valeurs publiques (clés publiques) : **avec** préfixe `VITE_`
- `SITE_URL` : d'abord l'URL `.vercel.app`, à changer une fois le domaine actif

**Pièges :**
- Email d'envoi via Gmail → utiliser un **mot de passe d'application**
  (myaccount.google.com/apppasswords, exige la validation 2 étapes), jamais le mot de passe du compte
- Toute modification de variable → **Redeploy** obligatoire pour prendre effet

---

## Phase 3 — Connecter le domaine du client

1. Vercel → Settings → **Domains** → ajouter `domaine.fr` ET `www.domaine.fr`
2. Vercel affiche les enregistrements DNS à créer
3. Aller dans la **zone DNS** chez le registrar du client (souvent OVH)

### ⚠️ Le piège classique chez OVH : le "parking"

OVH pré-remplit la zone avec des enregistrements qui BLOQUENT la configuration.
**Toujours supprimer avant d'ajouter :**

| Action | Enregistrement |
|---|---|
| ❌ Supprimer | `@` A `213.186.33.5` (parking OVH) |
| ❌ Supprimer | tout ce qui existe sur `www` (A + TXT parking) — un CNAME doit être SEUL sur son nom |
| ✅ Ajouter | `@` A → l'IP donnée par Vercel |
| ✅ Ajouter | `www` CNAME → la cible donnée par Vercel |
| 🚫 Ne pas toucher | NS, MX, SPF (sinon tu casses les emails du client !) |

**Astuces OVH :** champ sous-domaine vide = racine (ne pas mettre `@`) ·
si le formulaire bloque → "Mode d'édition avancé" en haut à droite ·
vérifier l'« Aperçu de l'enregistrement » avant d'ajouter.

4. Propagation 5 min - quelques heures → bouton **Refresh** dans Vercel jusqu'aux ✅
5. HTTPS automatique une fois validé
6. Mettre à jour `SITE_URL` avec le vrai domaine → **Redeploy**

---

## Phase 4 — Google Search Console (référencement)

1. search.google.com/search-console → propriété type **Domaine** → `domaine.fr`
2. Copier le code `google-site-verification=...`
3. Zone DNS → ajouter un **TXT** sur la racine (sous-domaine vide) avec ce code
4. Attendre 10-15 min → **Valider** (recliquable à volonté si ça échoue)
5. Menu **Sitemaps** → soumettre `sitemap.xml`
6. Inspecter l'URL d'accueil → **Demander une indexation**
7. Contrôle quelques jours plus tard : taper `site:domaine.fr` dans Google

Bonus visibilité locale : créer/optimiser la **fiche Google Business Profile** du client
(gratuit, indispensable pour un commerce physique).

---

## Phase 5 — Recette finale (tests en production)

- [ ] `https://domaine.fr` s'ouvre avec le cadenas, `www` redirige vers le domaine nu
- [ ] Formulaire de contact : envoyer un message test → le CLIENT le reçoit bien
- [ ] Paiement (si e-commerce) : test avec la carte Stripe `4242 4242 4242 4242`
- [ ] Pages légales accessibles depuis le footer
- [ ] Test sur un vrai téléphone : navigation, formulaires, vitesse
- [ ] Partager le lien sur WhatsApp → l'aperçu (image + titre) s'affiche correctement
- [ ] Lighthouse (Chrome devtools) : viser 90+ en SEO et Accessibilité

---

## Phase 6 — Livraison et clôture

- [ ] Passer Stripe du mode test au mode live (clés `sk_live_`) si paiement réel
- [ ] Inviter le client sur le projet Vercel (Settings → Members) ou transférer la propriété
- [ ] Remettre au client un document récap : URLs, accès, qui possède quoi
- [ ] Lui montrer comment consulter ses statistiques et son panel admin
- [ ] Proposer un contrat de maintenance (mises à jour, sauvegardes, support) → revenu récurrent
- [ ] Facturer (SIRET obligatoire sur la facture) et demander un avis Google / témoignage

---

## Aide-mémoire

**Cartes de test Stripe :** `4242 4242 4242 4242` = succès ·
`4000 0000 0000 9995` = fonds insuffisants · `4000 0025 0000 3155` = 3D Secure

**Commandes :** `npm run validate` · `npm run build` · `npm run preview`

**Liens :** vercel.com · search.google.com/search-console ·
myaccount.google.com/apppasswords · dashboard.stripe.com
