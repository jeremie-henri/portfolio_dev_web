// api/contact.js — Formulaire de contact du portfolio
const { getTransporter, emailTemplate } = require('./_mailer')

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, subject, message } = req.body || {}

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants (name, email, message)' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide' })
  }

  try {
    const transporter = getTransporter()

    // 1. Email à Jérémie
    await transporter.sendMail({
      from: `"Portfolio JH" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `📩 Nouveau message — ${subject || 'Contact portfolio'}`,
      html: emailTemplate({
        title: '📩 Nouveau message de contact',
        subtitle: `Reçu depuis ton portfolio jeremiehenri.dev`,
        rows: [
          ['Nom',     name],
          ['Email',   `<a href="mailto:${email}" style="color:#a592ff">${email}</a>`],
          ['Sujet',   subject || '—'],
          ['Message', message.replace(/\n/g, '<br>')],
        ],
        cta: { label: `Répondre à ${name}`, url: `mailto:${email}` },
        footer: `Message reçu le ${new Date().toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}`,
      }),
    })

    // 2. Email de confirmation au visiteur
    await transporter.sendMail({
      from: `"Jérémie Henri" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Bien reçu, ${name.split(' ')[0]} !`,
      html: emailTemplate({
        title: `Merci pour votre message !`,
        subtitle: `Je reviens vers vous sous 24h maximum.`,
        rows: [
          ['Votre nom',    name],
          ['Sujet',        subject || '—'],
          ['Délai réponse','Sous 24h (souvent bien moins 😄)'],
        ],
        cta: { label: 'Voir mes services', url: 'https://jeremiehenri.dev#services' },
        footer: `En attendant, n'hésitez pas à consulter mes projets et démos en ligne.`,
      }),
    })

    return res.status(200).json({ success: true, message: 'Message envoyé avec succès !' })

  } catch (err) {
    console.error('Contact error:', err)
    return res.status(500).json({ error: 'Erreur serveur. Réessayez ou contactez directement jeremiehenri99@gmail.com' })
  }
}
