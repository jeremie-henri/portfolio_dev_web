import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiCheck,
  FiArrowRight,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const SERVICES = [
  {
    id: 1,
    emoji: '🍽️',
    title: 'Site vitrine',
    subtitle: 'Restaurants · Artisans · TPE',
    price: 'À partir de 350 €',
    accentColor: '#ffffff',
    demo: '/demos/restaurant.html',
    demoLabel: 'Voir démo restaurant',
    preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70',
    desc: 'Un site professionnel, rapide et visible sur Google pour présenter votre activité et attirer de nouveaux clients.',
    features: [
      'Design sur mesure adapté à votre secteur',
      'Optimisé mobile (60% du trafic)',
      'Référencement SEO local inclus',
      'Galerie photos & menu en ligne',
      'Avis clients mis en avant',
      'Formulaire de contact / devis',
      'Statistiques de visite sans cookies (100% RGPD)',
      'Livraison en 5 à 7 jours',
    ],
    cibles: ['Restaurants', 'Traiteurs', 'Artisans', 'Commerçants', 'Professions libérales'],
  },
  {
    id: 2,
    emoji: '📅',
    title: 'Application RDV',
    subtitle: 'Coiffeurs · Kinés · Coachs',
    price: 'À partir de 800 €',
    accentColor: '#ffffff',
    demo: '/demos/rdv.html',
    demoLabel: 'Voir démo salon',
    preview: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=70',
    badge: 'Populaire',
    desc: 'Vos clients réservent en ligne 24h/24. Fini les appels manqués et les agendas papier.',
    features: [
      'Calendrier interactif en temps réel',
      'Paiement d’acompte en ligne (anti no-show)',
      'Confirmations & rappels email automatiques',
      'Galerie avant / après de vos réalisations',
      'Panel admin de gestion (agenda, clients)',
      'Statistiques de fréquentation sans cookies',
      'Export planning PDF',
    ],
    cibles: ['Coiffeurs', 'Kinésithérapeutes', 'Coachs', 'Médecins', 'Centres beauté'],
  },
  {
    id: 3,
    emoji: '🛒',
    title: 'Boutique e-commerce',
    subtitle: 'Vendre en ligne 24h/24',
    price: 'À partir de 600 €',
    accentColor: '#ffffff',
    demo: '/demos/ecommerce.html',
    demoLabel: 'Voir démo boutique',
    preview: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=70',
    desc: 'Une boutique complète pour vendre vos produits en ligne, sans commission sur vos ventes.',
    features: [
      'Catalogue produits avec filtres & recherche',
      'Paiement sécurisé Stripe (CB, Apple/Google Pay)',
      'Liste de souhaits & codes promo',
      'Gestion des stocks & réductions',
      'Avis clients sur les produits',
      'Panel admin complet (ventes, stats)',
      'Livraison en 10 à 14 jours',
    ],
    cibles: ['Producteurs locaux', 'Créateurs', 'Artisans', 'Boutiques', 'Associations'],
  },
  {
    id: 4,
    emoji: '📊',
    title: 'Dashboard client',
    subtitle: 'Espace personnel & suivi',
    price: 'À partir de 1 200 €',
    accentColor: '#ffffff',
    demo: '/demos/dashboard.html',
    demoLabel: 'Voir démo dashboard',
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=70',
    badge: 'Sur mesure',
    desc: 'Un espace sécurisé où vos clients suivent l’avancement de leur projet, signent leurs devis et règlent leurs factures en ligne.',
    features: [
      'Authentification sécurisée + mot de passe oublié',
      'Suivi de projet avec avancement en temps réel',
      'Signature électronique des devis (au doigt)',
      'Paiement des factures en ligne (Stripe)',
      'Messagerie & livrables téléchargeables',
      'Espace admin pour gérer tous vos clients',
      'Données isolées par client (100% RGPD)',
    ],
    cibles: ['PME', 'Prestataires services', 'E-commerce B2B', 'Agences', 'Startups'],
  },
]

const PROCESS = [
  {
    num: '01',
    title: 'Échange gratuit',
    desc: 'On discute de votre projet et budget. Sans engagement.',
  },
  { num: '02', title: 'Devis & maquette', desc: 'Devis détaillé et maquette visuelle sous 48h.' },
  {
    num: '03',
    title: 'Développement',
    desc: 'Je code votre site en vous tenant informé à chaque étape.',
  },
  {
    num: '04',
    title: 'Livraison & suivi',
    desc: 'Mise en ligne, formation et support après livraison.',
  },
]

const PACKS = [
  {
    nom: 'Essentiel',
    ideal: 'Artisans, TPE, indépendants',
    prix: '350 €',
    prixNote: 'à partir de',
    desc: 'Un site vitrine élégant pour exister sur le web et être trouvé sur Google.',
    inclus: [
      'Jusqu’à 5 pages sur mesure',
      'Design responsive (mobile inclus)',
      'Référencement SEO local',
      'Formulaire de contact',
      'Statistiques RGPD sans cookies',
      'Livraison en 5 à 7 jours',
    ],
    cta: 'Idéal pour se lancer',
  },
  {
    nom: 'Business',
    ideal: 'Commerces, salons, e-commerce',
    prix: '800 €',
    prixNote: 'à partir de',
    desc: 'Un outil qui travaille pour vous : réservation en ligne ou boutique, paiements sécurisés.',
    inclus: [
      'Tout le pack Essentiel',
      'Réservation en ligne OU boutique',
      'Paiement sécurisé Stripe',
      'Panel admin de gestion',
      'Emails automatiques (confirmations)',
      'Formation à la prise en main',
    ],
    populaire: true,
    cta: 'Le plus demandé',
  },
  {
    nom: 'Sur-mesure',
    ideal: 'PME, agences, projets ambitieux',
    prix: 'Sur devis',
    prixNote: 'à partir de 1 200 €',
    desc: 'Une application complète pensée pour votre métier : espace client, suivi, automatisations.',
    inclus: [
      'Tout le pack Business',
      'Espace client sécurisé',
      'Signature électronique des devis',
      'Suivi de projet en temps réel',
      'Fonctionnalités sur mesure',
      'Maintenance & support prioritaire',
    ],
    cta: 'Parlons de votre projet',
  },
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

  const navigate = dir => {
    const next = idx + dir
    setInstant(false)
    setIdx(next)
    setShowDetail(false)

    // Silent jump : si on sort de copy1, on revient sur l'équivalent dans copy1 sans animation
    jumpTimer.current = setTimeout(() => {
      let target = null
      if (next < N) target = next + N // on était dans copy0, on saute à copy1
      if (next >= N * 2) target = next - N // on était dans copy2, on saute à copy1
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
  const onTouchStart = e => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = e => {
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
    <section
      id="services"
      style={{ padding: 'clamp(4rem,8vw,6rem) 0', maxWidth: 1400, margin: '0 auto' }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: 0.1 }}
      >
        {/* Header */}
        <div style={{ padding: '0 clamp(1.5rem,4vw,3rem)', marginBottom: '2.5rem' }}>
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7c6af7',
              marginBottom: '0.75rem',
            }}
          >
            Services
          </motion.p>
          <motion.h2
            variants={itemVariants}
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '1rem',
              color: '#f5f5f5',
            }}
          >
            Ce que je réalise
            <br />
            pour vous
          </motion.h2>
          <motion.p
            variants={itemVariants}
            style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300, maxWidth: 500 }}
          >
            Naviguez avec les flèches — cliquez sur la carte active pour voir les détails.
          </motion.p>
        </div>

        {/* Carrousel */}
        <motion.div variants={itemVariants}>
          <div
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ overflow: 'hidden', position: 'relative', touchAction: 'pan-y' }}
          >
            <motion.div
              animate={{ x: xPos }}
              transition={
                instant ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }
              }
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
                    onClick={() => (isActive ? setShowDetail(v => !v) : navigate(i - idx))}
                    style={{
                      flex: `0 0 ${cardWidth}px`,
                      background: '#111111',
                      border: `1px solid ${isActive ? card.accentColor + '55' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 16,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'border-color 0.25s',
                    }}
                  >
                    {/* Image */}
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={card.preview}
                        alt={card.title}
                        draggable={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to top,rgba(10,10,15,0.7) 0%,transparent 50%)',
                          pointerEvents: 'none',
                        }}
                      />
                      <span
                        style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '1.5rem' }}
                      >
                        {card.emoji}
                      </span>
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            background: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(6px)',
                            borderRadius: 6,
                            padding: '4px 10px',
                            fontSize: 11,
                            color: '#ccc',
                            pointerEvents: 'none',
                          }}
                        >
                          {showDetail ? 'Réduire ↑' : 'Détails ↓'}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3
                        style={{
                          fontFamily: "'Inter',sans-serif",
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: '#f5f5f5',
                          marginBottom: 3,
                        }}
                      >
                        {card.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: card.accentColor,
                          fontWeight: 500,
                          marginBottom: '0.6rem',
                        }}
                      >
                        {card.subtitle}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: 'rgba(255,255,255,0.65)',
                          lineHeight: 1.6,
                          marginBottom: '1rem',
                        }}
                      >
                        {card.desc}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: card.accentColor,
                            fontFamily: "'Inter',sans-serif",
                          }}
                        >
                          {card.price}
                        </span>
                        <a
                          href={card.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 12,
                            fontWeight: 600,
                            color: card.accentColor,
                            textDecoration: 'none',
                            background: card.accentColor + '15',
                            border: `1px solid ${card.accentColor}35`,
                            padding: '6px 12px',
                            borderRadius: 7,
                          }}
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
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden', padding: '0 clamp(1.5rem,4vw,3rem)' }}
              >
                <div
                  className="glass"
                  style={{
                    background: '#111111',
                    border: `1px solid ${activeCard.accentColor}35`,
                    borderRadius: 14,
                    padding: '1.5rem',
                    marginTop: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.65)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Inclus :
                  </p>
                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                      gap: '6px 16px',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {activeCard.features.map(f => (
                      <li
                        key={f}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          fontSize: 13,
                          color: '#7c6af7',
                          lineHeight: 1.4,
                        }}
                      >
                        <FiCheck
                          size={13}
                          style={{ color: activeCard.accentColor, flexShrink: 0, marginTop: 2 }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}
                  >
                    {activeCard.cibles.map(c => (
                      <span
                        key={c}
                        style={{
                          fontSize: 11,
                          padding: '3px 10px',
                          borderRadius: 4,
                          background: activeCard.accentColor + '15',
                          border: `1px solid ${activeCard.accentColor}30`,
                          color: activeCard.accentColor,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 20px',
                      borderRadius: 0,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0d0d0d',
                      background: '#ffffff',
                    }}
                  >
                    Demander un devis <FiArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flèches uniquement */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginTop: 24,
              padding: '0 clamp(1.5rem,4vw,3rem)',
            }}
          >
            <button
              type="button"
              aria-label="Carte précédente"
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#7c6af7',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#f5f5f5'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = '#7c6af7'
              }}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Carte suivante"
              onClick={() => navigate(1)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#7c6af7',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#f5f5f5'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = '#7c6af7'
              }}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          variants={itemVariants}
          style={{ marginTop: '5rem', padding: '0 clamp(1.5rem,4vw,3rem)' }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7c6af7',
              marginBottom: '0.75rem',
            }}
          >
            Comment ça marche
          </p>
          <h3
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 'clamp(1.4rem,2.5vw,1.8rem)',
              fontWeight: 700,
              color: '#f5f5f5',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
            }}
          >
            De l'idée à la mise en ligne
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
              gap: 12,
            }}
          >
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.num}
                className="glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -6,
                  borderColor: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                }}
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.05)',
                    position: 'absolute',
                    top: -4,
                    right: 12,
                    lineHeight: 1,
                  }}
                >
                  {p.num}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#7c6af7',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 10px',
                    borderRadius: 100,
                    marginBottom: 10,
                  }}
                >
                  {p.num}
                </span>
                <h4 style={{ color: '#f5f5f5', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  {p.title}
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 12,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Packs / offres */}
        <motion.div
          variants={itemVariants}
          style={{ marginTop: '5rem', padding: '0 clamp(1.5rem,4vw,3rem)' }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7c6af7',
              marginBottom: '0.75rem',
            }}
          >
            Mes offres
          </p>
          <h3
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 'clamp(1.4rem,2.5vw,1.8rem)',
              fontWeight: 700,
              color: '#f5f5f5',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            Trois formules, un prix clair
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14,
              marginBottom: '2rem',
              maxWidth: 560,
            }}
          >
            Chaque projet reste unique : ces packs donnent un point de départ, le devis final s’adapte
            à vos besoins. Acompte de 30 % à la commande, TVA non applicable (art. 293 B du CGI).
            <br />
            Pas encore de logo ni de charte graphique ? La création de votre identité visuelle est
            proposée en option, facturée à part sur devis.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 16,
              alignItems: 'stretch',
            }}
          >
            {PACKS.map((pack, i) => (
              <motion.div
                key={pack.nom}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: pack.populaire ? 'rgba(124,106,247,0.08)' : '#111111',
                  border: pack.populaire
                    ? '1px solid rgba(124,106,247,0.5)'
                    : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  position: 'relative',
                }}
              >
                {pack.populaire && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -11,
                      left: '1.5rem',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#fff',
                      background: '#7c6af7',
                      padding: '3px 12px',
                      borderRadius: 100,
                      letterSpacing: '0.03em',
                    }}
                  >
                    Le plus demandé
                  </span>
                )}
                <h4
                  style={{
                    color: '#f5f5f5',
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {pack.nom}
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    marginBottom: 14,
                  }}
                >
                  {pack.ideal}
                </p>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{pack.prix}</span>
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      marginLeft: 6,
                    }}
                  >
                    {pack.prixNote}
                  </span>
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 13,
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {pack.desc}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                  {pack.inclus.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 13,
                        marginBottom: 8,
                      }}
                    >
                      <FiCheck
                        style={{ color: '#7c6af7', flexShrink: 0, marginTop: 3 }}
                        size={14}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 18,
                    padding: '11px 16px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: pack.populaire ? '#7c6af7' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: pack.populaire ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {pack.cta}
                  <FiArrowRight size={15} />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
