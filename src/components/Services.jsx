import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiArrowRight, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } },
}

const SERVICES = [
  {
    id: 1, emoji: '🍽️',
    title: 'Site vitrine',
    subtitle: 'Restaurants · Artisans · TPE',
    price: 'À partir de 350 €',
    accentColor: '#ffffff',
    demo: '/demos/restaurant.html',
    demoLabel: 'Voir démo restaurant',
    preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70',
    desc: 'Un site professionnel, rapide et visible sur Google pour présenter votre activité et attirer de nouveaux clients.',
    features: ['Design sur mesure adapté à votre secteur','Optimisé mobile (60% du trafic)','Référencement SEO local inclus','Formulaire de contact / devis','Intégration Google Maps & horaires','Livraison en 5 à 7 jours'],
    cibles: ['Restaurants','Traiteurs','Artisans','Commerçants','Professions libérales'],
  },
  {
    id: 2, emoji: '📅',
    title: 'Application RDV',
    subtitle: 'Coiffeurs · Kinés · Coachs',
    price: 'À partir de 800 €',
    accentColor: '#ffffff',
    demo: '/demos/rdv.html',
    demoLabel: 'Voir démo salon',
    preview: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=70',
    badge: 'Populaire',
    desc: 'Vos clients réservent en ligne 24h/24. Fini les appels manqués et les agendas papier.',
    features: ['Calendrier interactif en temps réel','Confirmations email automatiques','Gestion des créneaux & congés','Interface admin simple','Rappels automatiques par email','Export planning PDF'],
    cibles: ['Coiffeurs','Kinésithérapeutes','Coachs','Médecins','Centres beauté'],
  },
  {
    id: 3, emoji: '🛒',
    title: 'Boutique e-commerce',
    subtitle: 'Vendre en ligne 24h/24',
    price: 'À partir de 600 €',
    accentColor: '#ffffff',
    demo: '/demos/ecommerce.html',
    demoLabel: 'Voir démo boutique',
    preview: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=70',
    desc: 'Une boutique complète pour vendre vos produits en ligne, sans commission sur vos ventes.',
    features: ['Catalogue produits avec filtres','Paiement sécurisé Stripe','Gestion des stocks intégrée','Confirmation de commande email','Interface admin ventes','Livraison en 10 à 14 jours'],
    cibles: ['Producteurs locaux','Créateurs','Artisans','Boutiques','Associations'],
  },
  {
    id: 4, emoji: '📊',
    title: 'Dashboard client',
    subtitle: 'Espace personnel & suivi',
    price: 'À partir de 1 200 €',
    accentColor: '#ffffff',
    demo: '/demos/dashboard.html',
    demoLabel: 'Voir démo dashboard',
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=70',
    badge: 'Sur mesure',
    desc: 'Un espace sécurisé où vos clients suivent commandes, factures et données en temps réel.',
    features: ['Authentification sécurisée JWT','Tableau de bord personnalisé','Historique commandes / missions','Gestion profil utilisateur','Interface admin séparée','Maintenance mensuelle dispo'],
    cibles: ['PME','Prestataires services','E-commerce B2B','Agences','Startups'],
  },
]

const PROCESS = [
  { num: '01', title: 'Échange gratuit',  desc: 'On discute de votre projet et budget. Sans engagement.' },
  { num: '02', title: 'Devis & maquette', desc: 'Devis détaillé et maquette visuelle sous 48h.' },
  { num: '03', title: 'Développement',    desc: 'Je code votre site en vous tenant informé à chaque étape.' },
  { num: '04', title: 'Livraison & suivi',desc: 'Mise en ligne, formation et support après livraison.' },
]

const N = SERVICES.length
const GAP = 16
// Triple copy : [copy0][copy1=home][copy2]
// Indices 0..N-1 = copy0, N..2N-1 = copy1, 2N..3N-1 = copy2
const TRIPLE = [...SERVICES, ...SERVICES, ...SERVICES]

export default function Services() {
  // On démarre au milieu (copy1, carte 0 → index N)
  const [idx, setIdx] = useState(N)
  const [instant, setInstant] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [cardWidth, setCardWidth] = useState(320)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)
  const jumpTimer = useRef(null)

  const updateCardWidth = useCallback(() => {
    if (!containerRef.current) return
    const w = containerRef.current.offsetWidth
    setContainerWidth(w)
    setCardWidth(Math.min(Math.round(w * 0.78), 400))
  }, [])

  useEffect(() => {
    updateCardWidth()
    window.addEventListener('resize', updateCardWidth)
    return () => window.removeEventListener('resize', updateCardWidth)
  }, [updateCardWidth])

  useEffect(() => () => clearTimeout(jumpTimer.current), [])

  const navigate = (dir) => {
    const next = idx + dir
    setInstant(false)
    setIdx(next)
    setShowDetail(false)

    // Silent jump : si on sort de copy1, on revient sur l'équivalent dans copy1 sans animation
    jumpTimer.current = setTimeout(() => {
      let target = null
      if (next < N)       target = next + N      // on était dans copy0, on saute à copy1
      if (next >= N * 2)  target = next - N      // on était dans copy2, on saute à copy1
      if (target !== null) {
        setInstant(true)
        setIdx(target)
        setTimeout(() => setInstant(false), 50)
      }
    }, 380)
  }

  const centerOffset = (containerWidth - cardWidth) / 2
  const xPos = centerOffset - idx * (cardWidth + GAP)

  const activeCard = TRIPLE[idx]

  // ─── Swipe tactile ────────────────────────────────────────────
  const touchStart = useRef(null)
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    // Swipe horizontal > 40px et plus horizontal que vertical
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      navigate(dx < 0 ? 1 : -1)
    }
  }

  return (
    <section id="services" style={{ padding: 'clamp(4rem,8vw,6rem) 0', maxWidth: 1400, margin: '0 auto' }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.1 }}>

        {/* Header */}
        <div style={{ padding: '0 clamp(1.5rem,4vw,3rem)', marginBottom: '2.5rem' }}>
          <motion.p variants={itemVariants} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.75rem' }}>Services</motion.p>
          <motion.h2 variants={itemVariants} style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem', color: '#f5f5f5' }}>
            Ce que je réalise<br />pour vous
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300, maxWidth: 500 }}>
            Naviguez avec les flèches — cliquez sur la carte active pour voir les détails.
          </motion.p>
        </div>

        {/* Carrousel */}
        <motion.div variants={itemVariants}>
          <div ref={containerRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ overflow: 'hidden', position: 'relative', touchAction: 'pan-y' }}>
            <motion.div
              animate={{ x: xPos }}
              transition={instant ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
              style={{ display: 'flex', gap: GAP, userSelect: 'none' }}
            >
              {TRIPLE.map((card, i) => {
                const isActive = i === idx
                return (
                  <motion.div
                    key={i}
                    className="glass"
                    animate={{ opacity: isActive ? 1 : 0.38, scale: isActive ? 1 : 0.94 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => isActive ? setShowDetail(v => !v) : navigate(i - idx)}
                    style={{
                      flex: `0 0 ${cardWidth}px`,
                      background: '#111111',
                      border: `1px solid ${isActive ? card.accentColor + '55' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 16, overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'border-color 0.25s',
                    }}
                  >
                    {/* Image */}
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={card.preview} alt={card.title}
                        draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,10,15,0.7) 0%,transparent 50%)', pointerEvents: 'none' }} />
                      <span style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '1.5rem' }}>{card.emoji}</span>
                      {isActive && (
                        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#ccc', pointerEvents: 'none' }}>
                          {showDetail ? 'Réduire ↑' : 'Détails ↓'}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f5f5f5', marginBottom: 3 }}>{card.title}</h3>
                      <p style={{ fontSize: 12, color: card.accentColor, fontWeight: 500, marginBottom: '0.6rem' }}>{card.subtitle}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '1rem' }}>{card.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: card.accentColor, fontFamily: "'Syne',sans-serif" }}>{card.price}</span>
                        <a
                          href={card.demo} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: card.accentColor, textDecoration: 'none', background: card.accentColor + '15', border: `1px solid ${card.accentColor}35`, padding: '6px 12px', borderRadius: 7 }}
                        >
                          <FiExternalLink size={12} /> Démo
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Panneau détail */}
          <AnimatePresence>
            {showDetail && (
              <motion.div
                key={activeCard.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                style={{ overflow: 'hidden', padding: '0 clamp(1.5rem,4vw,3rem)' }}
              >
                <div className="glass" style={{ background: '#111111', border: `1px solid ${activeCard.accentColor}35`, borderRadius: 14, padding: '1.5rem', marginTop: 12 }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 600 }}>Inclus :</p>
                  <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '6px 16px', marginBottom: '1.25rem' }}>
                    {activeCard.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#7c6af7', lineHeight: 1.4 }}>
                        <FiCheck size={13} style={{ color: activeCard.accentColor, flexShrink: 0, marginTop: 2 }} />{f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
                    {activeCard.cibles.map(c => (
                      <span key={c} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: activeCard.accentColor + '15', border: `1px solid ${activeCard.accentColor}30`, color: activeCard.accentColor }}>{c}</span>
                    ))}
                  </div>
                  <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 0, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#0d0d0d', background: '#ffffff' }}>
                    Demander un devis <FiArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flèches uniquement */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24, padding: '0 clamp(1.5rem,4vw,3rem)' }}>
            <button
              type="button"
              aria-label="Carte précédente"
              onClick={() => navigate(-1)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7c6af7', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#f5f5f5' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#7c6af7' }}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Carte suivante"
              onClick={() => navigate(1)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7c6af7', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#f5f5f5' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#7c6af7' }}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Process */}
        <motion.div variants={itemVariants} style={{ marginTop: '5rem', padding: '0 clamp(1.5rem,4vw,3rem)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.75rem' }}>Comment ça marche</p>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', fontWeight: 700, color: '#f5f5f5', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
            De l'idée à la mise en ligne
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.num}
                className="glass"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', position: 'relative', overflow: 'hidden', cursor: 'default' }}
              >
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '3rem', fontWeight: 800, color: 'rgba(255,255,255,0.05)', position: 'absolute', top: -4, right: 12, lineHeight: 1 }}>{p.num}</span>
                <span style={{ display: 'inline-block', fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: '#7c6af7', background: 'rgba(255,255,255,0.06)', padding: '2px 10px', borderRadius: 100, marginBottom: 10 }}>{p.num}</span>
                <h4 style={{ color: '#f5f5f5', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{p.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
