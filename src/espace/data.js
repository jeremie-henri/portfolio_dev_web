import { supabase } from './supabase'

// ── Projets ──
export async function fetchProjets() {
  const { data, error } = await supabase
    .from('projets')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchProjet(id) {
  const { data, error } = await supabase.from('projets').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createProjet(p) {
  const { data, error } = await supabase.from('projets').insert(p).select().single()
  if (error) throw error
  return data
}

export async function updateProjet(id, patch) {
  const { error } = await supabase.from('projets').update(patch).eq('id', id)
  if (error) throw error
}

// ── Étapes ──
export async function fetchEtapes(projetId) {
  const { data, error } = await supabase
    .from('etapes')
    .select('*')
    .eq('projet_id', projetId)
    .order('ordre', { ascending: true })
  if (error) throw error
  return data
}

export async function addEtape(projetId, titre, ordre) {
  const { error } = await supabase.from('etapes').insert({ projet_id: projetId, titre, ordre })
  if (error) throw error
}

export async function toggleEtape(id, fait) {
  const { error } = await supabase.from('etapes').update({ fait }).eq('id', id)
  if (error) throw error
}

// ── Messages ──
export async function fetchMessages(projetId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('projet_id', projetId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(projetId, auteurId, contenu, deAdmin) {
  const { error } = await supabase
    .from('messages')
    .insert({ projet_id: projetId, auteur_id: auteurId, contenu, de_admin: deAdmin })
  if (error) throw error
}

// ── Fichiers ──
export async function fetchFichiers(projetId) {
  const { data, error } = await supabase
    .from('fichiers')
    .select('*')
    .eq('projet_id', projetId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadFichier(projetId, file) {
  const chemin = `${projetId}/${Date.now()}-${file.name}`
  const up = await supabase.storage.from('livrables').upload(chemin, file)
  if (up.error) throw up.error
  const { error } = await supabase
    .from('fichiers')
    .insert({ projet_id: projetId, nom: file.name, chemin, taille: file.size })
  if (error) throw error
}

export async function downloadUrl(chemin) {
  const { data, error } = await supabase.storage.from('livrables').createSignedUrl(chemin, 300)
  if (error) throw error
  return data.signedUrl
}

// ── Factures ──
export async function fetchFactures(projetId) {
  let q = supabase.from('factures').select('*').order('created_at', { ascending: false })
  if (projetId) q = q.eq('projet_id', projetId)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function createFacture(f) {
  const { error } = await supabase.from('factures').insert(f)
  if (error) throw error
}

// Signature électronique d'un devis par le client (bon pour accord)
export async function signerDocument(docId, nom) {
  const { error } = await supabase.rpc('signer_document', { doc_id: docId, nom })
  if (error) throw error
}

// ── Profil ──
export async function fetchProfil(userId) {
  const { data, error } = await supabase.from('profils').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data
}

export async function saveProfil(userId, patch) {
  const { error } = await supabase
    .from('profils')
    .upsert({ id: userId, ...patch, updated_at: new Date().toISOString() })
  if (error) throw error
}

