// api/booking.js — Prise de RDV salon (démo)
import Stripe from 'stripe'
import { getTransporter, emailTemplate, escapeHtml, checkRateLimit } from './_mailer.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!checkRateLimit(req, { max: 8, windowMs: 60_000 })) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans une minute.' })
  }

  const body = req.body || {}
  const rawName = String(body.name || '').slice(0, 100)

  if (!body.name || !body.email || !body.service || !body.date || !body.time) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return res.status(400).json({ error: 'Email invalide' })
  }

  // ─── ACTION : Créer une session Stripe pour l'acompte (20%) ───────────────
  if (body.action === 'create-checkout') {
    const total = Number(body.price)
    if (!Number.isFinite(total) || total < 1 || total > 10000) {
      return res.status(400).json({ error: 'Montant invalide' })
    }
    const deposit = Math.round(total * 0.2 * 100) // acompte 20% en centimes
    try {
      const rawSite = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/+$/, '')
      const siteUrl = /^https?:\/\//i.test(rawSite) ? rawSite : `https://${rawSite}`
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: body.email,
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: { name: `Acompte — ${String(body.service).slice(0, 100)}` },
            unit_amount: deposit,
          },
          quantity: 1,
        }],
        success_url: `${siteUrl}/demos/rdv.html?booking=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/demos/rdv.html?booking=cancelled`,
        metadata: { source: 'demo-salon-eclat' },
      })
      return res.status(200).json({ url: session.url })
    } catch (err) {
      console.error('Booking Stripe error:', err)
      return res.status(500).json({ error: 'Erreur lors de la création du paiement.' })
    }
  }

  // Échappement HTML de toutes les données utilisateur (anti-injection email)
  const name         = escapeHtml(rawName)
  const email        = escapeHtml(String(body.email).slice(0, 200))
  const phone        = escapeHtml(String(body.phone || '').slice(0, 30))
  const service      = escapeHtml(String(body.service).slice(0, 100))
  const duration     = body.duration
  const price        = escapeHtml(String(body.price || '').slice(0, 12))
  const date         = escapeHtml(String(body.date).slice(0, 40))
  const time         = escapeHtml(String(body.time).slice(0, 10))
  const practitioner = escapeHtml(String(body.practitioner || '').slice(0, 60))

  const refNumber = 'RDV-' + Date.now().toString(36).toUpperCase().slice(-6)

  // Calcul fin du RDV
  const [h, m] = time.split(':').map(Number)
  const durMin = parseInt(duration) || 45
  const endH = Math.floor((h * 60 + m + durMin) / 60)
  const endM = (h * 60 + m + durMin) % 60
  const endTime = `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`

  try {
    const transporter = getTransporter()

    // Email au salon
    await transporter.sendMail({
      from: `"Salon Éclat" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `💇 Nouveau RDV ${refNumber} — ${date} ${time}`,
      html: emailTemplate({
        title: '💇 Nouveau rendez-vous',
        subtitle: `Référence : <strong style="color:#c084fc">${refNumber}</strong>`,
        rows: [
          ['Réf.',        refNumber],
          ['Client',      name],
          ['Email',       `<a href="mailto:${email}" style="color:#a592ff">${email}</a>`],
          ['Téléphone',   phone || '—'],
          ['Prestation',  service],
          ['Durée',       `${durMin} min (${time} → ${endTime})`],
          ['Prix',        price ? `${price} €` : '—'],
          ['Praticienne', practitioner || 'Non précisée'],
          ['Date',        date],
          ['Heure',       time],
        ],
        footer: `RDV enregistré le ${new Date().toLocaleString('fr-FR')} — Démo Salon Éclat`,
      }),
    })

    // Email de confirmation client
    await transporter.sendMail({
      from: `"Salon Éclat" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ RDV confirmé — ${service} le ${date} à ${time}`,
      html: emailTemplate({
        title: `Votre rendez-vous est confirmé !`,
        subtitle: `À très bientôt au Salon Éclat, ${name.split(' ')[0]} 💇`,
        rows: [
          ['Référence',   `<strong style="color:#c084fc">${refNumber}</strong>`],
          ['Prestation',  service],
          ['Date',        date],
          ['Horaire',     `${time} → ${endTime} (${durMin} min)`],
          ['Prix',        price ? `${price} €` : '—'],
          ['Praticienne', practitioner || 'Attribution automatique'],
          ['Adresse',     '12 rue de la Paix, 75001 Paris'],
        ],
        cta: { label: 'Annuler ce RDV', url: `mailto:${process.env.GMAIL_USER}?subject=Annulation RDV ${refNumber}` },
        footer: `Annulation possible jusqu'à 24h avant. Merci de nous prévenir ! · Salon Éclat`,
      }),
    })

    return res.status(200).json({ success: true, ref: refNumber, endTime })

  } catch (err) {
    console.error('Booking error:', err)
    return res.status(500).json({ error: 'Erreur lors de la prise de RDV' })
  }
}
