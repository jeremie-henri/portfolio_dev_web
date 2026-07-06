import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchProfil, saveProfil } from './data'

export default function Profil() {
  const { user } = useAuth()
  const [form, setForm] = useState({ nom: '', entreprise: '', telephone: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    fetchProfil(user.id)
      .then((p) => p && setForm({ nom: p.nom || '', entreprise: p.entreprise || '', telephone: p.telephone || '' }))
      .catch(() => {})
  }, [user.id])

  const submit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await saveProfil(user.id, form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="esp-wrap">
      <h1 className="esp-h">Mon profil</h1>
      <p className="esp-hsub">Vos coordonnées, utilisées sur vos devis et factures.</p>

      <form className="esp-card" onSubmit={submit} style={{ maxWidth: 460 }}>
        <div className="esp-field">
          <label className="esp-label">Email (identifiant)</label>
          <input className="esp-input" value={user.email} disabled style={{ opacity: 0.6 }} />
        </div>
        <div className="esp-field">
          <label className="esp-label">Nom complet</label>
          <input
            className="esp-input"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            placeholder="Marie Dupont"
          />
        </div>
        <div className="esp-field">
          <label className="esp-label">Entreprise</label>
          <input
            className="esp-input"
            value={form.entreprise}
            onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
            placeholder="Restaurant Le Jardin"
          />
        </div>
        <div className="esp-field">
          <label className="esp-label">Téléphone</label>
          <input
            className="esp-input"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            placeholder="06 12 34 56 78"
          />
        </div>
        <button className="esp-btn esp-btn-accent" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Enregistrement…' : status === 'saved' ? '✓ Enregistré' : 'Enregistrer'}
        </button>
        {status === 'error' && <div className="esp-error" style={{ marginTop: '1rem' }}>Erreur, réessayez.</div>}
      </form>
    </div>
  )
}
