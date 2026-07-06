import { useEffect, useState } from 'react'
import { STATUTS, supabase } from './supabase'
import { fetchProjets, updateProjet } from './data'

export default function AdminView({ onOpen }) {
  const [projets, setProjets] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ clientEmail: '', titre: '', description: '', budget: '', etapes: '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => fetchProjets().then(setProjets).catch(() => setProjets([]))
  useEffect(() => {
    load()
  }, [])

  const createProjet = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const { data } = await supabase.auth.getSession()
      const res = await fetch('/api/espace-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session?.access_token}`,
        },
        body: JSON.stringify({
          action: 'create-projet',
          clientEmail: form.clientEmail.trim(),
          titre: form.titre.trim(),
          description: form.description.trim(),
          budget: form.budget.trim(),
          etapes: form.etapes.split('\n').map((s) => s.trim()).filter(Boolean),
        }),
      })
      const out = await res.json()
      if (!res.ok) throw new Error(out.error || 'Erreur')
      setMsg('✅ Projet créé — le client a reçu une invitation par email.')
      setForm({ clientEmail: '', titre: '', description: '', budget: '', etapes: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  const changeStatut = async (p, statut) => {
    await updateProjet(p.id, { statut })
    load()
  }

  if (projets === null) return <div className="esp-wrap">Chargement…</div>

  return (
    <div className="esp-wrap">
      <div className="esp-row" style={{ justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <h1 className="esp-h" style={{ margin: 0 }}>
          Tous les projets
        </h1>
        <button className="esp-btn esp-btn-accent esp-btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Nouveau projet'}
        </button>
      </div>
      <p className="esp-hsub">Gérez les projets de vos clients depuis un seul endroit.</p>

      {msg && (
        <div className={msg.startsWith('✅') ? 'esp-ok' : 'esp-error'} style={{ marginBottom: '1rem' }}>
          {msg}
        </div>
      )}

      {showForm && (
        <form className="esp-card" onSubmit={createProjet}>
          <div className="esp-field">
            <label className="esp-label">Email du client</label>
            <input
              className="esp-input"
              type="email"
              required
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              placeholder="client@email.com"
            />
          </div>
          <div className="esp-field">
            <label className="esp-label">Titre du projet</label>
            <input
              className="esp-input"
              required
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              placeholder="Site vitrine restaurant"
            />
          </div>
          <div className="esp-field">
            <label className="esp-label">Description</label>
            <input
              className="esp-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Site 5 pages + réservation en ligne"
            />
          </div>
          <div className="esp-field">
            <label className="esp-label">Budget (optionnel)</label>
            <input
              className="esp-input"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="1 500 €"
            />
          </div>
          <div className="esp-field">
            <label className="esp-label">Étapes (une par ligne)</label>
            <textarea
              className="esp-input"
              rows={4}
              value={form.etapes}
              onChange={(e) => setForm({ ...form, etapes: e.target.value })}
              placeholder={'Maquette\nDéveloppement\nRecette\nMise en ligne'}
            />
          </div>
          <button className="esp-btn esp-btn-accent" type="submit" disabled={busy}>
            {busy ? 'Création…' : 'Créer le projet & inviter le client'}
          </button>
        </form>
      )}

      {projets.length === 0 ? (
        <div className="esp-empty">Aucun projet. Créez-en un pour commencer.</div>
      ) : (
        projets.map((p) => {
          const st = STATUTS[p.statut] || STATUTS.planifie
          return (
            <div key={p.id} className="esp-card">
              <div className="esp-card-top">
                <div className="esp-card-link" onClick={() => onOpen(p.id)} style={{ flex: 1 }}>
                  <h3>{p.titre}</h3>
                  <p>{p.description || '—'}</p>
                </div>
                <select
                  className="esp-input"
                  style={{ width: 'auto', color: st.color }}
                  value={p.statut}
                  onChange={(e) => changeStatut(p, e.target.value)}
                >
                  {Object.entries(STATUTS).map(([k, v]) => (
                    <option key={k} value={k} style={{ background: '#111' }}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="esp-bar">
                <div className="esp-bar-fill" style={{ width: `${p.avancement}%` }} />
              </div>
              <div className="esp-pct">
                {p.avancement}% · <span onClick={() => onOpen(p.id)} style={{ cursor: 'pointer', color: 'var(--a2)' }}>gérer →</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
