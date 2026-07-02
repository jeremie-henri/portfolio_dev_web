import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const REVIEWS = [
  {
    name: 'Marie Charpentier',
    role: 'Restauratrice · Lyon',
    stars: 5,
    text: 'Jérémie a livré notre site en 5 jours. Résultat bluffant, on a eu nos 10 premières réservations en ligne la semaine suivante.',
    avatar: '👩‍🍳',
    color: '#fbbf24',
  },
  {
    name: 'Thomas Girard',
    role: 'Artisan plombier · Marseille',
    stars: 5,
    text: 'Je ne comprenais rien au web. Il a tout géré, expliqué simplement. Mon site est top et je reçois des devis chaque semaine.',
    avatar: '🔧',
    color: '#05e8c8',
  },
  {
    name: 'Sophie Mallet',
    role: 'Coiffeuse · Bordeaux',
    stars: 5,
    text: "L'appli de RDV a changé ma vie. Plus d'appels le soir, les clients réservent eux-mêmes. Je recommande à 100%.",
    avatar: '✂️',
    color: '#a592ff',
  },
  {
    name: 'Karim Benali',
    role: 'E-commerce · Nantes',
    stars: 5,
    text: 'Ma boutique en ligne tourne parfaitement. Les paiements Stripe sont fluides, le panel admin est super simple à utiliser.',
    avatar: '🛒',
    color: '#f059da',
  },
  {
    name: 'Claire Fontaine',
    role: 'Coach bien-être · Paris',
    stars: 5,
    text: "Très réactif, livraison dans les délais, code propre. J'ai demandé des modifications, tout a été fait en quelques heures.",
    avatar: '🧘',
    color: '#10b981',
  },
  {
    name: 'Nicolas Aubert',
    role: 'TPE bâtiment · Toulouse',
    stars: 5,
    text: "Le site a l'air fait par une grande agence mais pour le prix d'une agence locale. Excellent rapport qualité/prix.",
    avatar: '🏗️',
    color: '#f97316',
  },
]

function ReviewCard({ r }) {
  return (
    <div
      style={{
        background: '#12121f',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '1.25rem',
        minWidth: 300,
        maxWidth: 320,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {[...Array(r.stars)].map((_, i) => (
          <span key={i} style={{ color: '#fbbf24', fontSize: 13 }}>
            ★
          </span>
        ))}
      </div>
      <p
        style={{
          fontSize: 13,
          color: '#c0bdd8',
          lineHeight: 1.65,
          marginBottom: '1rem',
          fontStyle: 'italic',
        }}
      >
        "{r.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: r.color + '22',
            border: `1px solid ${r.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          {r.avatar}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f0eeff' }}>{r.name}</p>
          <p style={{ fontSize: 11, color: '#6e6b8a' }}>{r.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const track1 = useRef(null)
  const track2 = useRef(null)

  useEffect(() => {
    let p1 = 0,
      p2 = 0
    const speed = 0.4
    let raf
    const animate = () => {
      p1 -= speed
      p2 += speed
      const w1 = track1.current?.scrollWidth / 2 || 0
      const w2 = track2.current?.scrollWidth / 2 || 0
      if (Math.abs(p1) >= w1) p1 = 0
      if (p2 >= w2) p2 = 0
      if (track1.current) track1.current.style.transform = `translateX(${p1}px)`
      if (track2.current) track2.current.style.transform = `translateX(${p2}px)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  const half = Math.ceil(REVIEWS.length / 2)
  const row1 = REVIEWS.slice(0, half)
  const row2 = REVIEWS.slice(half)

  return (
    <section style={{ padding: 'clamp(4rem,8vw,6rem) 0', overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 clamp(1.5rem,8vw,5rem)' }}
      >
        <p className="section-eyebrow">Témoignages</p>
        <h2
          style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#f0eeff',
            lineHeight: 1.1,
          }}
        >
          Ils m'ont fait confiance,{' '}
          <span
            style={{
              fontFamily: "'Inter',serif",
              fontStyle: 'italic',
              fontWeight: 300,
              background: 'linear-gradient(135deg,#6d56fa,#f059da)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            voici leur verdict
          </span>
        </h2>
      </motion.div>

      {/* Fade edges */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: 'linear-gradient(to right, #080810, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: 'linear-gradient(to left, #080810, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <div style={{ overflow: 'hidden', marginBottom: 12 }}>
          <div
            ref={track1}
            style={{ display: 'flex', gap: 12, width: 'max-content', willChange: 'transform' }}
          >
            {[...row1, ...row1].map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            ref={track2}
            style={{ display: 'flex', gap: 12, width: 'max-content', willChange: 'transform' }}
          >
            {[...row2, ...row2].map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
