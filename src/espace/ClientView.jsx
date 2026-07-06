import { useEffect, useState } from 'react'
import { STATUTS } from './supabase'
import { fetchProjets } from './data'

export default function ClientView({ onOpen }) {
  const [projets, setProjets] = useState(null)

  useEffect(() => {
    fetchProjets().then(setProjets).catch(() => setProjets([]))
  }, [])

  if (projets === null) return <div className="esp-wrap">Chargement…</div>

  return (
    <div className="esp-wrap">
      <h1 className="esp-h">Vos projets</h1>
      <p className="esp-hsub">Suivez l’avancement en temps réel et échangez avec moi directement.</p>

      {projets.length === 0 ? (
        <div className="esp-empty">
          Aucun projet pour l’instant. Il apparaîtra ici dès que nous démarrons.
        </div>
      ) : (
        projets.map((p) => {
          const st = STATUTS[p.statut] || STATUTS.planifie
          return (
            <div key={p.id} className="esp-card esp-card-link" onClick={() => onOpen(p.id)}>
              <div className="esp-card-top">
                <div>
                  <h3>{p.titre}</h3>
                  <p>{p.description || 'Projet en cours'}</p>
                </div>
                <span
                  className="esp-badge"
                  style={{
                    background: st.color + '22',
                    color: st.color,
                    border: `1px solid ${st.color}55`,
                  }}
                >
                  {st.label}
                </span>
              </div>
              <div className="esp-bar">
                <div className="esp-bar-fill" style={{ width: `${p.avancement}%` }} />
              </div>
              <div className="esp-pct">{p.avancement}% réalisé</div>
            </div>
          )
        })
      )}
    </div>
  )
}
