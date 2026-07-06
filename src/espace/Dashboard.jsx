import { useEffect, useState } from 'react'
import { fetchProjets, fetchFactures } from './data'

function ttc(f) {
  return Number(f.montant_ht) * (1 + Number(f.tva_taux) / 100)
}

export default function Dashboard({ onOpen }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([fetchProjets(), fetchFactures(null)])
      .then(([projets, factures]) => setData({ projets, factures }))
      .catch(() => setData({ projets: [], factures: [] }))
  }, [])

  if (!data) return <div className="esp-wrap">Chargement…</div>

  const enCours = data.projets.filter((p) => p.statut === 'en_cours').length
  const aPayer = data.factures.filter((f) => f.statut !== 'payee')
  const totalAPayer = aPayer.reduce((s, f) => s + ttc(f), 0)
  const totalPaye = data.factures.filter((f) => f.statut === 'payee').reduce((s, f) => s + ttc(f), 0)

  const kpis = [
    { label: 'Projets en cours', value: enCours, color: 'var(--accent)' },
    { label: 'À régler', value: totalAPayer.toFixed(0) + ' €', color: '#eab308' },
    { label: 'Total payé', value: totalPaye.toFixed(0) + ' €', color: '#22c55e' },
    { label: 'Projets au total', value: data.projets.length, color: 'var(--a2)' },
  ]

  return (
    <div className="esp-wrap">
      <h1 className="esp-h">Tableau de bord</h1>
      <p className="esp-hsub">Vue d’ensemble de vos projets et de votre facturation.</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: '2rem',
        }}
      >
        {kpis.map((k) => (
          <div key={k.label} className="esp-card" style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: k.color, letterSpacing: '-0.02em' }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {aPayer.length > 0 && (
        <div className="esp-section">
          <div className="esp-section-title">Factures à régler</div>
          {aPayer.map((f) => (
            <div
              key={f.id}
              className="esp-file esp-card-link"
              onClick={() => onOpen(f.projet_id)}
              style={{ cursor: 'pointer' }}
            >
              <span>
                🧾 {f.numero} — {f.libelle}
              </span>
              <span className="esp-badge" style={{ background: '#eab30822', color: '#eab308' }}>
                {ttc(f).toFixed(2)} € →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
