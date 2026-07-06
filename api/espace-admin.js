// api/espace-admin.js — Actions admin protégées (clé de service Supabase)
// La clé SERVICE_ROLE ne quitte JAMAIS le serveur. On vérifie d'abord que
// l'appelant est bien l'admin via son token, avant toute opération sensible.
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'jeremiehenri99@gmail.com'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return res.status(500).json({ error: 'Supabase non configuré côté serveur' })

  const admin = createClient(url, serviceKey)

  // 1) Vérifier que l'appelant est bien l'admin
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non authentifié' })
  const { data: userData, error: authErr } = await admin.auth.getUser(token)
  if (authErr || userData?.user?.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Accès refusé' })
  }

  const { action } = req.body || {}

  try {
    // 2a) Inviter un nouveau client (Supabase envoie un email d'invitation)
    if (action === 'invite-client') {
      const { email } = req.body
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) {
        return res.status(400).json({ error: 'Email invalide' })
      }
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.SITE_URL || ''}/espace`,
      })
      if (error && !/already/i.test(error.message)) throw error
      // si l'utilisateur existe déjà, on le retrouve
      let userId = data?.user?.id
      if (!userId) {
        const list = await admin.auth.admin.listUsers()
        userId = list.data.users.find((u) => u.email === email)?.id
      }
      return res.status(200).json({ userId, email })
    }

    // 2b) Créer un projet pour un client (par email) + ses étapes
    if (action === 'create-projet') {
      const { clientEmail, titre, description, budget, etapes } = req.body
      if (!clientEmail || !titre) return res.status(400).json({ error: 'Champs requis manquants' })

      // Trouver l'id du client (ou l'inviter s'il n'existe pas)
      const list = await admin.auth.admin.listUsers()
      let client = list.data.users.find((u) => u.email === clientEmail)
      if (!client) {
        const inv = await admin.auth.admin.inviteUserByEmail(clientEmail, {
          redirectTo: `${process.env.SITE_URL || ''}/espace`,
        })
        client = inv.data?.user
      }
      if (!client) return res.status(400).json({ error: 'Client introuvable' })

      const { data: projet, error: pErr } = await admin
        .from('projets')
        .insert({
          client_id: client.id,
          titre: String(titre).slice(0, 200),
          description: description ? String(description).slice(0, 2000) : null,
          budget: budget ? String(budget).slice(0, 40) : null,
          statut: 'planifie',
        })
        .select()
        .single()
      if (pErr) throw pErr

      if (Array.isArray(etapes) && etapes.length) {
        const rows = etapes
          .filter((t) => t && t.trim())
          .map((titre, i) => ({ projet_id: projet.id, titre: titre.slice(0, 200), ordre: i }))
        if (rows.length) await admin.from('etapes').insert(rows)
      }
      return res.status(200).json({ projet })
    }

    return res.status(400).json({ error: 'Action inconnue' })
  } catch (err) {
    console.error('espace-admin error:', err)
    return res.status(500).json({ error: err.message || 'Erreur serveur' })
  }
}
