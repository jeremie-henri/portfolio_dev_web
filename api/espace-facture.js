// api/espace-facture.js — Paiement de facture via Stripe (espace client)
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return res.status(500).json({ error: 'Supabase non configuré' })
  const admin = createClient(url, serviceKey)

  // Authentifier l'appelant
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non authentifié' })
  const { data: u, error: aErr } = await admin.auth.getUser(token)
  if (aErr || !u?.user) return res.status(401).json({ error: 'Session invalide' })
  const userId = u.user.id

  const { action, factureId } = req.body || {}

  const rawSite = (process.env.SITE_URL || '').replace(/\/+$/, '')
  const site = rawSite && !/^https?:\/\//i.test(rawSite) ? `https://${rawSite}` : rawSite
  const base = site || 'https://jeremiehenri.fr'

  try {
    // Récupère la facture + le projet (pour vérifier que l'appelant y a droit)
    const { data: facture, error: fErr } = await admin
      .from('factures')
      .select('*, projets(client_id)')
      .eq('id', factureId)
      .single()
    if (fErr || !facture) return res.status(404).json({ error: 'Facture introuvable' })
    if (facture.projets.client_id !== userId) {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    if (action === 'create-checkout') {
      if (facture.statut === 'payee') return res.status(400).json({ error: 'Facture déjà payée' })
      const ttc = Math.round(Number(facture.montant_ht) * (1 + Number(facture.tva_taux) / 100) * 100)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: u.user.email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: { name: `${facture.numero} — ${facture.libelle}` },
              unit_amount: ttc,
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/espace?facture=paid&fid=${facture.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/espace?facture=cancelled`,
        metadata: { facture_id: facture.id, source: 'espace-client' },
      })
      return res.status(200).json({ url: session.url })
    }

    if (action === 'confirm') {
      const { sessionId } = req.body
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.payment_status === 'paid' && session.metadata?.facture_id === facture.id) {
        await admin.from('factures').update({ statut: 'payee' }).eq('id', facture.id)
        return res.status(200).json({ success: true })
      }
      return res.status(400).json({ error: 'Paiement non confirmé' })
    }

    return res.status(400).json({ error: 'Action inconnue' })
  } catch (err) {
    console.error('espace-facture error:', err)
    return res.status(500).json({ error: 'Erreur lors du paiement.' })
  }
}
