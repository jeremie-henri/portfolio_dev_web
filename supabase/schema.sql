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

-- ═══ ROW LEVEL SECURITY ══════════════════════════════════════════════
alter table projets  enable row level security;
alter table etapes   enable row level security;
alter table messages enable row level security;
alter table fichiers enable row level security;

-- Projets : le client voit les siens, l'admin voit tout
create policy "projets_select" on projets for select
  using (client_id = auth.uid() or is_admin());
create policy "projets_admin_write" on projets for all
  using (is_admin()) with check (is_admin());

-- Étapes : lecture si le projet appartient au client (ou admin) ; écriture admin
create policy "etapes_select" on etapes for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
create policy "etapes_admin_write" on etapes for all
  using (is_admin()) with check (is_admin());

-- Messages : lecture selon accès au projet ; le client ET l'admin peuvent écrire
create policy "messages_select" on messages for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
create policy "messages_insert" on messages for insert
  with check (auteur_id = auth.uid() and exists (
         select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));

-- Fichiers : lecture selon accès au projet ; écriture admin
create policy "fichiers_select" on fichiers for select
  using (exists (select 1 from projets p where p.id = projet_id
         and (p.client_id = auth.uid() or is_admin())));
create policy "fichiers_admin_write" on fichiers for all
  using (is_admin()) with check (is_admin());

-- ═══ STORAGE ═════════════════════════════════════════════════════════
-- Crée un bucket privé "livrables" dans Supabase → Storage, puis ces règles :
insert into storage.buckets (id, name, public) values ('livrables', 'livrables', false)
  on conflict (id) do nothing;

create policy "livrables_read" on storage.objects for select
  using (bucket_id = 'livrables' and (is_admin() or exists (
    select 1 from fichiers f join projets p on p.id = f.projet_id
    where f.chemin = name and p.client_id = auth.uid())));
create policy "livrables_admin_write" on storage.objects for all
  using (bucket_id = 'livrables' and is_admin())
  with check (bucket_id = 'livrables' and is_admin());
