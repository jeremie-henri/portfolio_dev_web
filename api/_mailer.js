// api/_mailer.js — Utilitaire Nodemailer partagé
const nodemailer = require('nodemailer')

// Échappe les caractères HTML des données utilisateur avant insertion
// dans les templates d'email (anti-injection HTML/phishing)
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Limite de débit en mémoire par IP (par instance serverless : suffisant
// contre les boucles de spam simples ; pour du trafic réel, préférer Upstash/KV)
const hits = new Map()
function checkRateLimit(req, { max = 5, windowMs = 60_000 } = {}) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const entry = hits.get(ip) || { count: 0, start: now }
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now }
  entry.count++
  hits.set(ip, entry)
  if (hits.size > 5000) hits.clear() // borne mémoire
  return entry.count <= max
}

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })
}

function emailTemplate({ title, subtitle, rows = [], cta = null, footer = '' }) {
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#7a7890;background:#1a1a28;border-bottom:1px solid #16162a;width:35%">${label}</td>
      <td style="padding:10px 16px;font-size:13px;color:#f0eeff;background:#1a1a28;border-bottom:1px solid #16162a">${value}</td>
    </tr>`).join('')

  const ctaHtml = cta ? `
    <div style="text-align:center;margin:28px 0">
      <a href="${cta.url}" style="background:linear-gradient(135deg,#6d56fa,#f059da);color:#fff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">${cta.label}</a>
    </div>` : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:28px;font-weight:900;color:#a592ff">JH.</span>
      <p style="color:#6e6b8a;font-size:12px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase">jeremiehenri.dev</p>
    </div>
    <div style="background:#12121f;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <h1 style="margin:0;color:#f0eeff;font-size:20px;font-weight:700">${title}</h1>
        <p style="margin:8px 0 0;color:#6e6b8a;font-size:14px;line-height:1.5">${subtitle}</p>
      </div>
      <table style="width:100%;border-collapse:collapse">${rowsHtml}</table>
      <div style="padding:20px 28px">
        ${ctaHtml}
        ${footer ? `<p style="color:#6e6b8a;font-size:12px;text-align:center;margin:0">${footer}</p>` : ''}
      </div>
    </div>
    <p style="text-align:center;color:#3a3850;font-size:11px;margin-top:24px">
      © ${new Date().getFullYear()} Jérémie Henri · jeremiehenri.dev
    </p>
  </div>
</body>
</html>`
}

module.exports = { getTransporter, emailTemplate, escapeHtml, checkRateLimit }