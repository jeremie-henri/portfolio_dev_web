// Client Supabase partagé — Espace client/admin
// Les clés VITE_* sont publiques par nature : la sécurité des données
// repose sur les politiques RLS définies dans supabase/schema.sql
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

export const supabase = isConfigured ? createClient(url, anonKey) : null

// Libellés de statut de projet partagés
export const STATUTS = {
  planifie: { label: 'Planifié', color: '#eab308' },
  en_cours: { label: 'En cours', color: '#7c6af7' },
  en_pause: { label: 'En pause', color: '#f97316' },
  livre: { label: 'Livré', color: '#22c55e' },
}
