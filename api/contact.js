// api/contact.js — Formulaire de contact du portfolio
import { getTransporter, emailTemplate, escapeHtml, checkRateLimit } from './_mailer.js'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!checkRateLimit(req, { max: 5, windowMs: 60_000 })) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans une minute.' })
  }

  let { name, email, subject, message } = req.body || {}

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants (name, email, message)' })
  }
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Format invalide' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return res.status(400).json({ error: 'Email invalide' })
  }
  // Bornes de longueur + échappement HTML (anti-injection dans les emails)
  const rawName    = name.slice(0, 100)               // version texte brut pour les objets d'email
  const rawSubject = String(subject || '').slice(0, 150)
  name    = escapeHtml(rawName)
  subject = escapeHtml(rawSubject)
  message = escapeHtml(message.slice(0, 5000))
  email   = escapeHtml(email) // regex déjà passée, ceinture + bretelles

  try {
    const transporter = getTransporter()

    // 1. Email à Jérémie
    await transporter.sendMail({
      from: `"Portfolio JH" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `📩 Nouveau message — ${rawSubject || 'Contact portfolio'}`,
      html: emailTemplate({
        title: '📩 Nouveau message de contact',
        subtitle: `Reçu depuis ton portfolio jeremiehenri.dev`,
        rows: [
          ['Nom',     name],
          ['Email',   `<a href="mailto:${email}" style="color:#a592ff">${email}</a>`],
          ['Sujet',   subject || '—'],
          ['Message', message.replace(/\n/g, '<br>')], // name/subject/message déjà échappés plus haut
        ],
        cta: { label: `Répondre à ${name}`, url: `mailto:${email}` },
        footer: `Message reçu le ${new Date().toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}`,
      }),
    })

    // 2. Email de confirmation au visiteur
    await transporter.sendMail({
      from: `"Jérémie Henri" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Bien reçu, ${rawName.split(' ')[0]} !`,
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
