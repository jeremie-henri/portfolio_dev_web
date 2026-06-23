// api/order.js — Commande e-commerce + Stripe Checkout (démo)
const { getTransporter, emailTemplate } = require('./_mailer')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action } = req.body || {}

  // ─── ACTION 1 : Créer une session Stripe Checkout ─────────────────────────
  if (action === 'create-checkout') {
    const { items, customerEmail } = req.body

    if (!items?.length) return res.status(400).json({ error: 'Panier vide' })

    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

      const lineItems = items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.desc || undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      }))

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: customerEmail || undefined,
        line_items: lineItems,
        success_url: `${process.env.SITE_URL || 'http://localhost:5173'}/demos/ecommerce.html?order=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${process.env.SITE_URL || 'http://localhost:5173'}/demos/ecommerce.html?order=cancelled`,
        shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
        metadata: { source: 'demo-maison-provence' },
      })

      return res.status(200).json({ sessionId: session.id, url: session.url })

    } catch (err) {
      console.error('Stripe error:', err)
      return res.status(500).json({ error: 'Erreur Stripe : ' + err.message })
    }
  }

  // ─── ACTION 2 : Confirmation de commande (après paiement Stripe) ──────────
  if (action === 'confirm') {
    const { sessionId, email, items, total } = req.body

    const refNumber = 'CMD-' + Date.now().toString(36).toUpperCase().slice(-7)

    const itemsHtml = (items || []).map(i =>
      `<tr><td style="padding:8px 16px;color:#c0bdd8;background:#1a1a28;border-bottom:1px solid #16162a">${i.name} ×${i.qty}</td><td style="padding:8px 16px;color:#f0eeff;background:#1a1a28;border-bottom:1px solid #16162a;text-align:right">${(i.price * i.qty).toFixed(2)} €</td></tr>`
    ).join('')

    try {
      const transporter = getTransporter()

      await transporter.sendMail({
        from: `"Maison Provence" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🛒 Nouvelle commande ${refNumber} — ${total ? total + ' €' : ''}`,
        html: emailTemplate({
          title: '🛒 Nouvelle commande reçue',
          subtitle: `Réf : <strong style="color:#10b981">${refNumber}</strong>`,
          rows: [
            ['Réf.',   refNumber],
            ['Email',  email || '—'],
            ['Total',  total ? `<strong style="color:#10b981">${total} €</strong>` : '—'],
            ['Stripe', sessionId ? `Session ${sessionId.slice(0,20)}...` : '—'],
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
                      <span style="color:#10b981;font-weight:700">${total || '—'} €</span>
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
