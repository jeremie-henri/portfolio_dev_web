-- ═══════════════════════════════════════════════════════════════════
-- ClientSpace — Schéma Supabase (à coller dans SQL Editor de Supabase)
-- ═══════════════════════════════════════════════════════════════════
-- Sécurité : Row Level Security (RLS) — chaque client ne voit QUE ses données.
-- L'admin (toi) est identifié par son email dans la fonction is_admin().

-- ── Qui est admin ? (mets TON email ici) ─────────────────────────────
create or replace function is_admin() returns boolean as $$
  select auth.jwt() ->> 'email' = 'jeremiehenri99@gmail.com';
$$ language sql stable;

-- ── PROJETS ──────────────────────────────────────────────────────────
create table if not exists projets (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references auth.users(id) on delete cascade,
  titre        text not null,
  description  text,
  statut       text not null default 'planifie',   -- planifie | en_cours | en_pause | livre
  avancement   int  not null default 0,            -- 0 à 100
  budget       text,
  created_at   timestamptz not null default now()
);

-- ── ÉTAPES (timeline d'avancement) ───────────────────────────────────
create table if not exists etapes (
  id          uuid primary key default gen_random_uuid(),
  projet_id   uuid not null references projets(id) on delete cascade,
  titre       text not null,
  fait        boolean not null default false,
  ordre       int not null default 0
);

-- ── MESSAGES ─────────────────────────────────────────────────────────
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  projet_id   uuid not null references projets(id) on delete cascade,
  auteur_id   uuid not null references auth.users(id) on delete cascade,
  de_admin    boolean not null default false,
  contenu     text not null,
  created_at  timestamptz not null default now()
);

-- ── FICHIERS (métadonnées ; le binaire est dans le Storage bucket "livrables") ──
create table if not exists fichiers (
  id          uuid primary key default gen_random_uuid(),
  projet_id   uuid not null references projets(id) on delete cascade,
  nom         text not null,
  chemin      text not null,          -- chemin dans le bucket Storage
  taille      bigint,
  created_at  timestamptz not null default now()
);

-- ── FACTURES ─────────────────────────────────────────────────────────
create table if not exists factures (
  id          uuid primary key default gen_random_uuid(),
  projet_id   uuid not null references projets(id) on delete cascade,
  numero      text not null,               -- ex. FAC-2026-001
  libelle     text not null,
  montant_ht  numeric(10,2) not null,      -- en euros
  tva_taux    numeric(4,2) not null default 20,
  statut      text not null default 'en_attente',  -- en_attente | payee
  echeance    date,
  created_at  timestamptz not null default now()
);

-- ── PROFIL client (nom, entreprise, téléphone) ───────────────────────
create table if not exists profils (
  id          uuid primary key references auth.users(id) on delete cascade,
  nom         text,
  entreprise  text,
  telephone   text,
  updated_at  timestamptz not null default now()
);

-- ═══ ROW LEVEL SECURITY ══════════════════════════════════════════════
alter table projets  enable row level security;
alter table etapes   enable row level security;
alter table messages enable row level security;
alter table fichiers enable row level security;
alter table factures enable row level security;
alter table profils  enable row level security;

-- Factures : lecture selon accès au projet ; écriture admin
drop policy if exists "factures_select" on factures;
create policy "factures_select" on factures for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
drop policy if exists "factures_admin_write" on factures;
create policy "factures_admin_write" on factures for all
  using (is_admin()) with check (is_admin());

-- Profil : chacun gère le sien, l'admin voit tout
drop policy if exists "profils_select" on profils;
create policy "profils_select" on profils for select
  using (id = auth.uid() or is_admin());
drop policy if exists "profils_upsert" on profils;
create policy "profils_upsert" on profils for all
  using (id = auth.uid()) with check (id = auth.uid());

-- Projets : le client voit les siens, l'admin voit tout
drop policy if exists "projets_select" on projets;
create policy "projets_select" on projets for select
  using (client_id = auth.uid() or is_admin());
drop policy if exists "projets_admin_write" on projets;
create policy "projets_admin_write" on projets for all
  using (is_admin()) with check (is_admin());

-- Étapes : lecture si le projet appartient au client (ou admin) ; écriture admin
drop policy if exists "etapes_select" on etapes;
create policy "etapes_select" on etapes for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
drop policy if exists "etapes_admin_write" on etapes;
create policy "etapes_admin_write" on etapes for all
  using (is_admin()) with check (is_admin());

-- Messages : lecture selon accès au projet ; le client ET l'admin peuvent écrire
drop policy if exists "messages_select" on messages;
create policy "messages_select" on messages for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
drop policy if exists "messages_insert" on messages;
create policy "messages_insert" on messages for insert
  with check (auteur_id = auth.uid() and exists (
         select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));

-- Fichiers : lecture selon accès au projet ; écriture admin
drop policy if exists "fichiers_select" on fichiers;
create policy "fichiers_select" on fichiers for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
drop policy if exists "fichiers_admin_write" on fichiers;
create policy "fichiers_admin_write" on fichiers for all
  using (is_admin()) with check (is_admin());

-- ═══ SIGNATURE ÉLECTRONIQUE (devis « bon pour accord ») ══════════════
alter table factures add column if not exists type       text not null default 'facture'; -- devis | facture
alter table factures add column if not exists signe_par  text;
alter table factures add column if not exists signe_le   timestamptz;

-- Le client signe SON document via cette fonction (il ne peut PAS toucher au montant).
create or replace function signer_document(doc_id uuid, nom text)
returns void as $$
begin
  update factures f
     set signe_par = nom, signe_le = now()
   from projets p
  where f.id = doc_id
    and f.projet_id = p.id
    and p.client_id = auth.uid()
    and f.signe_par is null;
  if not found then
    raise exception 'Document introuvable ou déjà signé';
  end if;
end;
$$ language plpgsql security definer;

-- ═══ STORAGE ═════════════════════════════════════════════════════════
-- Crée un bucket privé "livrables" dans Supabase → Storage, puis ces règles :
insert into storage.buckets (id, name, public) values ('livrables', 'livrables', false)
  on conflict (id) do nothing;

drop policy if exists "livrables_read" on storage.objects;
create policy "livrables_read" on storage.objects for select
  using (bucket_id = 'livrables' and (is_admin() or exists (
    select 1 from fichiers f join projets p on p.id = f.projet_id
    where f.chemin = name and p.client_id = auth.uid())));
drop policy if exists "livrables_admin_write" on storage.objects;
create policy "livrables_admin_write" on storage.objects for all
  using (bucket_id = 'livrables' and is_admin())
  with check (bucket_id = 'livrables' and is_admin());
