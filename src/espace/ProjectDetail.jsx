import { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { STATUTS } from './supabase'
import { supabase } from './supabase'
import SignaturePad from './SignaturePad'
import { imprimerDocument } from './DocumentPrint'
import { fetchProfil } from './data'
import {
  fetchProjet,
  fetchEtapes,
  fetchMessages,
  fetchFichiers,
  fetchFactures,
  createFacture,
  signerDocument,
  toggleEtape,
  sendMessage,
  uploadFichier,
  downloadUrl,
  updateProjet,
  addEtape,
} from './data'

function ttc(f) {
  return (Number(f.montant_ht) * (1 + Number(f.tva_taux) / 100)).toFixed(2)
}

async function payerFacture(factureId) {
  const { data } = await supabase.auth.getSession()
  const res = await fetch('/api/espace-facture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}` },
    body: JSON.stringify({ action: 'create-checkout', factureId }),
  })
  const out = await res.json()
  if (out.url) window.location.assign(out.url)
  else alert(out.error || 'Paiement indisponible.')
}

export default function ProjectDetail({ projetId, onBack }) {
  const { user, isAdmin } = useAuth()
  const [projet, setProjet] = useState(null)
  const [etapes, setEtapes] = useState([])
  const [messages, setMessages] = useState([])
  const [fichiers, setFichiers] = useState([])
  const [factures, setFactures] = useState([])
  const [signing, setSigning] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const chatRef = useRef(null)

  const load = async () => {
    setProjet(await fetchProjet(projetId))
    setEtapes(await fetchEtapes(projetId))
    setMessages(await fetchMessages(projetId))
    setFichiers(await fetchFichiers(projetId))
    setFactures(await fetchFactures(projetId))
  }

  const handleAddDoc = async (type) => {
    const libelle = prompt(`Libellé du ${type} (ex : ${type === 'devis' ? 'Création site vitrine' : 'Acompte 30%'}) :`)
    if (!libelle) return
    const montant = prompt('Montant HT en euros (ex : 450) :')
    if (!montant || isNaN(Number(montant))) return
    const prefix = type === 'devis' ? 'DEV' : 'FAC'
    const numero = `${prefix}-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`
    try {
      await createFacture({
        projet_id: projetId,
        numero,
        libelle,
        montant_ht: Number(montant),
        tva_taux: 0, // micro-entreprise : franchise en base de TVA (art. 293 B du CGI)
        statut: 'en_attente',
        type,
      })
      setFactures(await fetchFactures(projetId))
    } catch (err) {
      alert(`Création impossible : ${err.message}\n\n(Vérifie que le schéma SQL est à jour dans Supabase.)`)
    }
  }

  const handlePrint = async (f) => {
    let profil = null
    try {
      profil = await fetchProfil(projet.client_id)
    } catch {
      /* profil non rempli : le document sortira avec l'email seul */
    }
    imprimerDocument(f, projet, profil, isAdmin ? null : user.email)
  }

  const confirmSignature = async (nom, img) => {
    try {
      await signerDocument(signing.id, nom, img)
      setSigning(null)
      setFactures(await fetchFactures(projetId))
    } catch (err) {
      alert('Signature impossible : ' + err.message)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    // load() est asynchrone : tous les setState surviennent après await
    void load().catch(console.error)
  }, [projetId])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  if (!projet) return <div className="esp-wrap">Chargement…</div>

  const st = STATUTS[projet.statut] || STATUTS.planifie

  const handleSend = async (e) => {
    e.preventDefault()
    if (!msg.trim()) return
    setBusy(true)
    try {
      await sendMessage(projetId, user.id, msg.trim(), isAdmin)
      setMsg('')
      setMessages(await fetchMessages(projetId))
    } finally {
      setBusy(false)
    }
  }

  const saveCoords = async () => {
    await updateProjet(projetId, {
      client_nom: projet.client_nom || null,
      client_adresse: projet.client_adresse || null,
    })
    setProjet(await fetchProjet(projetId))
  }

  const handleToggle = async (etape) => {
    if (!isAdmin) return
    await toggleEtape(etape.id, !etape.fait)
    const next = await fetchEtapes(projetId)
    setEtapes(next)
    // recalcule l'avancement automatiquement
    const pct = next.length ? Math.round((next.filter((e) => e.fait).length / next.length) * 100) : 0
    await updateProjet(projetId, { avancement: pct })
    setProjet(await fetchProjet(projetId))
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await uploadFichier(projetId, file)
      setFichiers(await fetchFichiers(projetId))
    } catch (err) {
      alert('Erreur upload : ' + err.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const handleDownload = async (chemin) => {
    try {
      window.open(await downloadUrl(chemin), '_blank', 'noopener')
    } catch {
      alert('Lien de téléchargement indisponible.')
    }
  }

  const handleAddEtape = async () => {
    const titre = prompt('Titre de l’étape :')
    if (!titre) return
    await addEtape(projetId, titre, etapes.length)
    setEtapes(await fetchEtapes(projetId))
  }

  return (
    <div className="esp-wrap">
      <button className="esp-link-btn" onClick={onBack} style={{ marginTop: 0, marginBottom: '1rem' }}>
        ← Retour
      </button>

      <div className="esp-card-top">
        <div>
          <h1 className="esp-h">{projet.titre}</h1>
          <p className="esp-hsub">{projet.description || 'Projet en cours'}</p>
        </div>
        <span
          className="esp-badge"
          style={{ background: st.color + '22', color: st.color, border: `1px solid ${st.color}55` }}
        >
          {st.label}
        </span>
      </div>

      <div className="esp-bar">
        <div className="esp-bar-fill" style={{ width: `${projet.avancement}%` }} />
      </div>
      <div className="esp-pct">{projet.avancement}% réalisé</div>

      {/* Étapes */}
      <div className="esp-section">
        <div className="esp-row" style={{ justifyContent: 'space-between' }}>
          <div className="esp-section-title">Étapes du projet</div>
          {isAdmin && (
            <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={handleAddEtape}>
              + Étape
            </button>
          )}
        </div>
        {etapes.length === 0 ? (
          <div className="esp-empty">Aucune étape définie pour l’instant.</div>
        ) : (
          <ul className="esp-steps">
            {etapes.map((et) => (
              <li key={et.id} className={`esp-step${et.fait ? ' done' : ''}`}>
                <span
                  className={`esp-dot${et.fait ? ' done' : ''}`}
                  onClick={() => handleToggle(et)}
                  style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                >
                  {et.fait ? '✓' : ''}
                </span>
                <span>{et.titre}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fichiers */}
      <div className="esp-section">
        <div className="esp-row" style={{ justifyContent: 'space-between' }}>
          <div className="esp-section-title">Livrables</div>
          {isAdmin && (
            <label className="esp-btn esp-btn-ghost esp-btn-sm" style={{ cursor: 'pointer' }}>
              {busy ? 'Envoi…' : '+ Fichier'}
              <input type="file" hidden onChange={handleUpload} disabled={busy} />
            </label>
          )}
        </div>
        {fichiers.length === 0 ? (
          <div className="esp-empty">Aucun fichier disponible pour l’instant.</div>
        ) : (
          fichiers.map((f) => (
            <div key={f.id} className="esp-file">
              <span>📎 {f.nom}</span>
              <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={() => handleDownload(f.chemin)}>
                Télécharger
              </button>
            </div>
          ))
        )}
      </div>

      {/* Coordonnées de facturation (admin) — apparaissent sur les devis/factures PDF */}
      {isAdmin && (
        <div className="esp-section">
          <div className="esp-section-title">Coordonnées de facturation du client</div>
          <div className="esp-row" style={{ gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label className="esp-label">Nom / Raison sociale</label>
              <input
                className="esp-input"
                value={projet.client_nom || ''}
                onChange={(e) => setProjet({ ...projet, client_nom: e.target.value })}
                placeholder="Restaurant Le Jardin"
              />
            </div>
            <div style={{ flex: '2 1 260px' }}>
              <label className="esp-label">Adresse</label>
              <input
                className="esp-input"
                value={projet.client_adresse || ''}
                onChange={(e) => setProjet({ ...projet, client_adresse: e.target.value })}
                placeholder="12 rue du Port, 83000 Toulon"
              />
            </div>
            <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={saveCoords}>
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Devis & factures */}
      <div className="esp-section">
        <div className="esp-row" style={{ justifyContent: 'space-between' }}>
          <div className="esp-section-title">Devis & factures</div>
          {isAdmin && (
            <div className="esp-row">
              <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={() => handleAddDoc('devis')}>
                + Devis
              </button>
              <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={() => handleAddDoc('facture')}>
                + Facture
              </button>
            </div>
          )}
        </div>
        {factures.length === 0 ? (
          <div className="esp-empty">Aucun document pour l’instant.</div>
        ) : (
          factures.map((f) => {
            const estDevis = f.type === 'devis'
            const icone = estDevis ? '📝' : '🧾'
            return (
              <div key={f.id} className="esp-file">
                <span>
                  {icone} {f.numero} — {f.libelle}
                  <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{ttc(f)} € TTC</span>
                  {f.signe_le && (
                    <>
                      <span style={{ display: 'block', fontSize: 11, color: '#22c55e', marginTop: 2 }}>
                        ✓ Signé par {f.signe_par} le{' '}
                        {new Date(f.signe_le).toLocaleDateString('fr-FR')}
                      </span>
                      {f.signature_img && (
                        <img src={f.signature_img} alt="Signature" className="esp-sign-preview" />
                      )}
                    </>
                  )}
                </span>

                <span className="esp-row" style={{ gap: 8, flexShrink: 0 }}>
                  <button
                    className="esp-btn esp-btn-ghost esp-btn-sm"
                    title="Télécharger en PDF"
                    onClick={() => handlePrint(f)}
                  >
                    🖨 PDF
                  </button>
                  {estDevis ? (
                    f.signe_le ? (
                      <span className="esp-badge" style={{ background: '#22c55e22', color: '#22c55e' }}>
                        Signé
                      </span>
                    ) : isAdmin ? (
                      <span className="esp-badge" style={{ background: '#eab30822', color: '#eab308' }}>
                        À signer
                      </span>
                    ) : (
                      <button className="esp-btn esp-btn-accent esp-btn-sm" onClick={() => setSigning(f)}>
                        Signer (bon pour accord)
                      </button>
                    )
                  ) : f.statut === 'payee' ? (
                    <span className="esp-badge" style={{ background: '#22c55e22', color: '#22c55e' }}>
                      Payée
                    </span>
                  ) : isAdmin ? (
                    <span className="esp-badge" style={{ background: '#eab30822', color: '#eab308' }}>
                      En attente
                    </span>
                  ) : (
                    <button className="esp-btn esp-btn-accent esp-btn-sm" onClick={() => payerFacture(f.id)}>
                      Payer {ttc(f)} €
                    </button>
                  )}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Messagerie */}
      <div className="esp-section">
        <div className="esp-section-title">Messages</div>
        <div className="esp-chat" ref={chatRef}>
          {messages.length === 0 && <div className="esp-empty">Aucun message. Écrivez le premier !</div>}
          {messages.map((m) => {
            const mine = m.auteur_id === user.id
            return (
              <div key={m.id} className={`esp-msg ${mine ? 'me' : 'them'}`}>
                {m.contenu}
                <span className="esp-msg-time">
                  {m.de_admin ? 'Jérémie' : 'Client'} ·{' '}
                  {new Date(m.created_at).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )
          })}
        </div>
        <form className="esp-chat-form" onSubmit={handleSend}>
          <input
            className="esp-input"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Votre message…"
          />
          <button className="esp-btn esp-btn-accent esp-btn-sm" type="submit" disabled={busy}>
            Envoyer
          </button>
        </form>
      </div>

      {signing && (
        <SignaturePad doc={signing} onCancel={() => setSigning(null)} onConfirm={confirmSignature} />
      )}
    </div>
  )
}
