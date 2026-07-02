// api/reservation.js — Réservation restaurant (démo)
const { getTransporter, emailTemplate, escapeHtml, checkRateLimit } = require('./_mailer')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!checkRateLimit(req, { max: 5, windowMs: 60_000 })) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans une minute.' })
  }

  const body = req.body || {}
  const rawName = String(body.name || '').slice(0, 100)

  if (!body.name || !body.email || !body.date || !body.time || !body.guests) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return res.status(400).json({ error: 'Email invalide' })
  }

  // Échappement HTML de toutes les données utilisateur (anti-injection email)
  const name   = escapeHtml(rawName)
  const email  = escapeHtml(String(body.email).slice(0, 200))
  const phone  = escapeHtml(String(body.phone || '').slice(0, 30))
  const date   = escapeHtml(String(body.date).slice(0, 40))
  const time   = escapeHtml(String(body.time).slice(0, 10))
  const guests = escapeHtml(String(body.guests).slice(0, 5))
  const notes  = escapeHtml(String(body.notes || '').slice(0, 500))

  // Numéro de réservation unique
  const refNumber = 'RES-' + Date.now().toString(36).toUpperCase().slice(-6)

  try {
    const transporter = getTransporter()

    // Email au restaurateur (Jérémie pour la démo)
    await transporter.sendMail({
      from: `"Le Jardin Secret" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `🍽️ Nouvelle réservation ${refNumber} — ${date} à ${time}`,
      html: emailTemplate({
        title: '🍽️ Nouvelle réservation',
        subtitle: `Référence : <strong style="color:#fbbf24">${refNumber}</strong>`,
        rows: [
          ['Réf.',          refNumber],
          ['Client',        name],
          ['Email',         `<a href="mailto:${email}" style="color:#a592ff">${email}</a>`],
          ['Téléphone',     phone || '—'],
          ['Date',          date],
          ['Heure',         time],
          ['Couverts',      `${guests} personne(s)`],
          ['Demandes',      notes || 'Aucune'],
        ],
        footer: `Réservation reçue le ${new Date().toLocaleString('fr-FR')} — Démo Le Jardin Secret`,
      }),
    })

    // Email de confirmation au client
    await transporter.sendMail({
      from: `"Le Jardin Secret" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Réservation confirmée — ${refNumber}`,
      html: emailTemplate({
        title: `🎉 Réservation confirmée !`,
        subtitle: `Nous vous attendons avec impatience, ${name.split(' ')[0]}.`,
        rows: [
          ['Référence',  `<strong style="color:#fbbf24">${refNumber}</strong>`],
          ['Date',       date],
          ['Heure',      time],
          ['Couverts',   `${guests} personne(s)`],
          ['Adresse',    '14 rue des Abbesses, 75018 Paris'],
          ['Téléphone',  '01 42 54 XX XX'],
        ],
        cta: { label: 'Annuler / Modifier ma réservation', url: `mailto:${process.env.GMAIL_USER}?subject=Modification réservation ${refNumber}` },
        footer: `En cas d'empêchement, merci de nous prévenir 24h à l'avance. · Le Jardin Secret`,
      }),
    })

    return res.status(200).json({ success: true, ref: refNumber })

  } catch (err) {
    console.error('Reservation error:', err)
    return res.status(500).json({ error: 'Erreur serveur lors de la réservation' })
  }
}
