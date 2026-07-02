import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi'

export default function ROICalculator() {
  const [clients, setClients] = useState(5)
  const [panier, setPanier] = useState(80)

  const perMonth = clients * panier
  const perYear = perMonth * 12
  const sitePrice = 500
  const roi = Math.round((perYear / sitePrice) * 100)

  return (
    <section
      id="roi"
      style={{
        padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,5rem)',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(109,86,250,0.08), rgba(240,89,218,0.06))',
            border: '1px solid rgba(109,86,250,0.2)',
            borderRadius: 24,
            padding: 'clamp(2rem,4vw,3rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Orb déco */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(109,86,250,0.12), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Gauche : sliders */}
            <div>
              <p className="section-eyebrow">Calculateur ROI</p>
              <h2
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 'clamp(1.6rem,3vw,2.2rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  marginBottom: '0.75rem',
                  color: '#f0eeff',
                  letterSpacing: '-0.03em',
                }}
              >
                Combien vous coûte
                <br />
                <span
                  style={{
                    fontFamily: "'Inter',serif",
                    fontStyle: 'italic',
                    fontWeight: 300,
                    background: 'linear-gradient(135deg,#ef4444,#f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  l'absence de site ?
                </span>
              </h2>
              <p
                style={{
                  color: '#6e6b8a',
                  fontSize: 14,
                  fontWeight: 300,
                  marginBottom: '2rem',
                  lineHeight: 1.6,
                }}
              >
                Ajustez les curseurs selon votre activité.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                  >
                    <label style={{ fontSize: 13, color: '#f0eeff', fontWeight: 500 }}>
                      Nouveaux clients/mois potentiels
                    </label>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#a592ff' }}>
                      {clients}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={clients}
                    onChange={e => setClients(+e.target.value)}
                    style={{ width: '100%', accentColor: '#6d56fa' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 10,
                      color: '#6e6b8a',
                      marginTop: 3,
                    }}
                  >
                    <span>1</span>
                    <span>30</span>
                  </div>
                </div>
                <div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                  >
                    <label style={{ fontSize: 13, color: '#f0eeff', fontWeight: 500 }}>
                      Panier moyen par client
                    </label>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#05e8c8' }}>
                      {panier} €
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={panier}
                    onChange={e => setPanier(+e.target.value)}
                    style={{ width: '100%', accentColor: '#05e8c8' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 10,
                      color: '#6e6b8a',
                      marginTop: 3,
                    }}
                  >
                    <span>20 €</span>
                    <span>500 €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Droite : résultats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1.25rem',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: '#6e6b8a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  Revenu mensuel manqué
                </p>
                <p
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#ef4444',
                  }}
                >
                  −{perMonth.toLocaleString('fr-FR')} €
                </p>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1.25rem',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: '#6e6b8a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  Revenu annuel manqué
                </p>
                <p
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#f97316',
                  }}
                >
                  −{perYear.toLocaleString('fr-FR')} €
                </p>
              </div>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(109,86,250,0.15), rgba(5,232,200,0.08))',
                  border: '1px solid rgba(109,86,250,0.3)',
                  borderRadius: 16,
                  padding: '1.25rem',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: '#a592ff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  ROI d'un site à 500 € en 1 an
                </p>
                <p
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#05e8c8',
                  }}
                >
                  ×{Math.round(perYear / sitePrice)}
                </p>
                <p style={{ fontSize: 12, color: '#6e6b8a', marginTop: 4 }}>
                  Soit <strong style={{ color: '#f0eeff' }}>{roi}% de retour</strong> sur
                  investissement
                </p>
              </div>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 20px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg,#6d56fa,#f059da)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(109,86,250,0.3)',
                }}
              >
                <FiTrendingUp size={14} />
                Arrêter de perdre de l'argent → Devis gratuit
                <FiArrowRight size={14} />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
