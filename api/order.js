// api/order.js — Commande e-commerce + Stripe Checkout (démo)
import Stripe from 'stripe'
import { getTransporter, emailTemplate, escapeHtml, checkRateLimit } from './_mailer.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!checkRateLimit(req, { max: 10, windowMs: 60_000 })) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans une minute.' })
  }

  const { action } = req.body || {}

  // ─── ACTION 1 : Créer une session Stripe Checkout ─────────────────────────
  if (action === 'create-checkout') {
    const { items, customerEmail } = req.body

    if (!Array.isArray(items) || !items.length || items.length > 50) {
      return res.status(400).json({ error: 'Panier invalide' })
    }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ error: 'Email invalide' })
    }

    // Validation stricte : prix et quantités bornés côté serveur.
    // Un client malveillant ne peut pas envoyer un prix négatif/nul ou une quantité absurde.
    for (const item of items) {
      const price = Number(item.price)
      const qty = Number(item.qty)
      if (typeof item.name !== 'string' || !item.name.trim() || item.name.length > 120) {
        return res.status(400).json({ error: 'Nom de produit invalide' })
      }
      if (!Number.isFinite(price) || price < 0.5 || price > 10000) {
        return res.status(400).json({ error: 'Prix invalide' })
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        return res.status(400).json({ error: 'Quantité invalide' })
      }
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

      const lineItems = items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name.slice(0, 120),
            description: item.desc ? String(item.desc).slice(0, 300) : undefined,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.qty),
      }))

      // Normalise SITE_URL : ajoute https:// si absent, retire le / final
      // (Stripe exige un schéma explicite sur success_url/cancel_url)
      const rawSite = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/+$/, '')
      const siteUrl = /^https?:\/\//i.test(rawSite) ? rawSite : `https://${rawSite}`

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: customerEmail || undefined,
        line_items: lineItems,
        success_url: `${siteUrl}/demos/ecommerce.html?order=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${siteUrl}/demos/ecommerce.html?order=cancelled`,
        shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
        metadata: { source: 'demo-maison-provence' },
      })

      return res.status(200).json({ sessionId: session.id, url: session.url })

    } catch (err) {
      console.error('Stripe error:', err)
      // Message générique : ne pas divulguer les détails internes Stripe au client
      return res.status(500).json({ error: 'Erreur lors de la création du paiement. Réessayez.' })
    }
  }

  // ─── ACTION 2 : Confirmation de commande (après paiement Stripe) ──────────
  if (action === 'confirm') {
    const { sessionId, email, items, total } = req.body

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' })
    }

    const refNumber = 'CMD-' + Date.now().toString(36).toUpperCase().slice(-7)
    const safeTotal = escapeHtml(String(total || '').slice(0, 20))

    const itemsHtml = (items || []).slice(0, 50).map(i =>
      `<tr><td style="padding:8px 16px;color:#c0bdd8;background:#1a1a28;border-bottom:1px solid #16162a">${escapeHtml(String(i.name).slice(0, 120))} ×${escapeHtml(String(i.qty).slice(0, 5))}</td><td style="padding:8px 16px;color:#f0eeff;background:#1a1a28;border-bottom:1px solid #16162a;text-align:right">${(Number(i.price) * Number(i.qty) || 0).toFixed(2)} €</td></tr>`
    ).join('')

    try {
      const transporter = getTransporter()

      await transporter.sendMail({
        from: `"Maison Provence" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🛒 Nouvelle commande ${refNumber} — ${total ? String(total).slice(0, 20) + ' €' : ''}`,
        html: emailTemplate({
          title: '🛒 Nouvelle commande reçue',
          subtitle: `Réf : <strong style="color:#10b981">${refNumber}</strong>`,
          rows: [
            ['Réf.',   refNumber],
            ['Email',  email || '—'],
            ['Total',  total ? `<strong style="color:#10b981">${safeTotal} €</strong>` : '—'],
            ['Stripe', sessionId ? `Session ${escapeHtml(String(sessionId).slice(0, 20))}...` : '—'],
          ],
          footer: `Commande reçue le ${new Date().toLocaleString('fr-FR')} · Démo Maison Provence`,
        }),
      })

      if (email) {
        await transporter.sendMail({
          from: `"Maison Provence" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: `✅ Commande ${refNumber} confirmée — Maison Provence`,
          html: `
            <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#0a0a14;font-family:Helvetica,Arial,sans-serif">
              <div style="max-width:560px;margin:0 auto;padding:40px 20px">
                <div style="background:#12121f;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden">
                  <div style="padding:24px 28px;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(109,86,250,0.08))">
                    <h1 style="margin:0;color:#f0eeff;font-size:20px">🎉 Commande confirmée !</h1>
                    <p style="color:#6e6b8a;margin:8px 0 0;font-size:14px">Merci pour votre commande. La Provence arrive chez vous !</p>
                  </div>
                  <div style="padding:20px 28px">
                    <p style="color:#10b981;font-weight:700;margin:0 0 12px">Réf. ${refNumber}</p>
                    <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
                    <div style="margin-top:12px;padding:12px 16px;background:#1a1a28;border-radius:8px;display:flex;justify-content:space-between">
                      <span style="color:#f0eeff;font-weight:700">Total payé</span>
                      <span style="color:#10b981;font-weight:700">${safeTotal || '—'} €</span>
                    </div>
                    <p style="color:#6e6b8a;font-size:13px;margin-top:16px;line-height:1.6">
                      ⏱ Livraison estimée : <strong style="color:#f0eeff">3 à 5 jours ouvrés</strong><br>
                      📦 Emballage soigné, produits frais garantis
                    </p>
                  </div>
                </div>
              </div>
            </body></html>`,
        })
      }

      return res.status(200).json({ success: true, ref: refNumber })

    } catch (err) {
      console.error('Order confirm error:', err)
      return res.status(500).json({ error: 'Erreur lors de la confirmation' })
    }
  }

  return res.status(400).json({ error: 'Action inconnue' })
}
