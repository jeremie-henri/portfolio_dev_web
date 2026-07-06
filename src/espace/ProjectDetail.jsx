import { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { STATUTS } from './supabase'
import {
  fetchProjet,
  fetchEtapes,
  fetchMessages,
  fetchFichiers,
  toggleEtape,
  sendMessage,
  uploadFichier,
  downloadUrl,
  updateProjet,
  addEtape,
} from './data'

export default function ProjectDetail({ projetId, onBack }) {
  const { user, isAdmin } = useAuth()
  const [projet, setProjet] = useState(null)
  const [etapes, setEtapes] = useState([])
  const [messages, setMessages] = useState([])
  const [fichiers, setFichiers] = useState([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const chatRef = useRef(null)

  const load = async () => {
    setProjet(await fetchProjet(projetId))
    setEtapes(await fetchEtapes(projetId))
    setMessages(await fetchMessages(projetId))
    setFichiers(await fetchFichiers(projetId))
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
    </div>
  )
}
