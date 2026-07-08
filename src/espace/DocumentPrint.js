import { ENTREPRISE } from './entreprise'

// Échappe le HTML des données dynamiques (noms, libellés…)
function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Ouvre une fenêtre d'impression (→ « Enregistrer en PDF ») avec un devis ou
// une facture conforme : identités, numéro, date, mentions TVA et pénalités.
export function imprimerDocument(doc, projet, clientProfil, clientEmail) {
  const estDevis = doc.type === 'devis'
  const titre = estDevis ? 'DEVIS' : 'FACTURE'
  const ht = Number(doc.montant_ht)
  const taux = Number(doc.tva_taux) || 0
  const tva = ht * (taux / 100)
  const ttc = ht + tva
  const eur = (n) => n.toFixed(2).replace('.', ',') + ' €'
  const dateDoc = new Date(doc.created_at).toLocaleDateString('fr-FR')

  const clientNom = clientProfil?.nom || clientEmail || 'Client'
  const clientLignes = [
    clientProfil?.entreprise,
    clientNom,
    clientEmail,
    clientProfil?.telephone,
  ].filter(Boolean)

  const signatureHtml = estDevis
    ? doc.signe_le
      ? `<div class="sign">
           <strong>Bon pour accord</strong><br>
           Signé par ${esc(doc.signe_par)} le ${new Date(doc.signe_le).toLocaleDateString('fr-FR')}
           ${doc.signature_img ? `<br><img src="${doc.signature_img}" alt="Signature" style="height:60px;margin-top:6px">` : ''}
         </div>`
      : `<div class="sign muted">
           <strong>Bon pour accord</strong> — date et signature du client :<br><br><br>
           <em>Devis valable 30 jours à compter de sa date d'émission.</em>
         </div>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>${titre} ${esc(doc.numero)}</title>
<style>
  body{font-family:Inter,Helvetica,Arial,sans-serif;color:#111;margin:0;padding:48px;font-size:13px;line-height:1.55}
  .head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px}
  h1{font-size:26px;letter-spacing:.04em;margin:0 0 4px}
  .num{color:#555;font-size:13px}
  .brand{font-weight:800;font-size:18px}
  .blocks{display:flex;justify-content:space-between;gap:24px;margin-bottom:32px}
  .block{font-size:12.5px}
  .block h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#777;margin:0 0 6px}
  table{width:100%;border-collapse:collapse;margin-bottom:8px}
  th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#777;border-bottom:2px solid #111;padding:8px 10px}
  td{padding:12px 10px;border-bottom:1px solid #ddd}
  td:last-child,th:last-child{text-align:right}
  .totals{margin-left:auto;width:260px}
  .totals td{padding:6px 10px;border:none}
  .totals .grand td{border-top:2px solid #111;font-weight:800;font-size:15px}
  .tva-note{font-size:12px;color:#555;margin:4px 0 24px}
  .sign{margin:32px 0;padding:16px;border:1px solid #ccc;border-radius:8px;width:280px}
  .muted{color:#555}
  footer{margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:10.5px;color:#777;line-height:1.6}
  @media print{body{padding:24px}}
</style></head>
<body>
  <div class="head">
    <div>
      <h1>${titre}</h1>
      <div class="num">N° ${esc(doc.numero)} · Émis le ${dateDoc}</div>
    </div>
    <div style="text-align:right">
      <div class="brand">JH.</div>
      <div>${esc(ENTREPRISE.site)}</div>
    </div>
  </div>

  <div class="blocks">
    <div class="block">
      <h3>Émetteur</h3>
      <strong>${esc(ENTREPRISE.nom)}</strong> — ${esc(ENTREPRISE.formeJuridique)}<br>
      ${esc(ENTREPRISE.activite)}<br>
      ${esc(ENTREPRISE.adresse)}<br>
      SIREN : ${esc(ENTREPRISE.siren)}<br>
      ${esc(ENTREPRISE.email)}
    </div>
    <div class="block" style="text-align:right">
      <h3>Client</h3>
      ${clientLignes.map((l) => esc(l)).join('<br>') || '—'}
    </div>
  </div>

  <table>
    <tr><th>Désignation</th><th>Montant HT</th></tr>
    <tr>
      <td>${esc(doc.libelle)}<br><span class="muted" style="font-size:11.5px">Projet : ${esc(projet?.titre || '')}</span></td>
      <td>${eur(ht)}</td>
    </tr>
  </table>

  <table class="totals">
    <tr><td>Total HT</td><td>${eur(ht)}</td></tr>
    ${taux > 0 ? `<tr><td>TVA (${taux}%)</td><td>${eur(tva)}</td></tr>` : ''}
    <tr class="grand"><td>Total ${taux > 0 ? 'TTC' : ''}</td><td>${eur(ttc)}</td></tr>
  </table>
  ${taux === 0 ? `<div class="tva-note">${esc(ENTREPRISE.mentionTva)}</div>` : ''}

  ${signatureHtml}

  <footer>
    ${esc(ENTREPRISE.nom)} — ${esc(ENTREPRISE.formeJuridique)} · SIREN ${esc(ENTREPRISE.siren)} · ${esc(ENTREPRISE.adresse)}<br>
    ${taux === 0 ? esc(ENTREPRISE.mentionTva) + '<br>' : ''}
    ${estDevis ? '' : esc(ENTREPRISE.mentionPaiement)}
  </footer>
  <script>window.onload=function(){window.print()}</script>
</body></html>`

  const w = window.open('', '_blank', 'width=800,height=1000')
  if (!w) {
    alert('Autorisez les fenêtres pop-up pour générer le PDF.')
    return
  }
  w.document.write(html)
  w.document.close()
}
