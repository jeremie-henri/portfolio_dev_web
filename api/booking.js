// api/booking.js — Prise de RDV salon (démo)
const { getTransporter, emailTemplate } = require('./_mailer')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, phone, service, duration, price, date, time, practitioner } = req.body || {}

  if (!name || !email || !service || !date || !time) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }

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
