import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import { FiArrowDown, FiGithub, FiLinkedin, FiZap } from 'react-icons/fi'

// Chargé en différé : three.js (~600KB) sort du bundle principal
const HeroBackground3D = lazy(() => import('./HeroBackground3D'))

const PHRASES = [
  'Je construis votre présence en ligne.',
  'Développeur web indépendant.',
  'Un tarif adapté à vos besoins.',
  'Des sites web sur mesure.',
  'Livré en 72h à 14 jours.',
]

function Typewriter() {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const current = PHRASES[i]
    let t
    if (phase === 'typing') {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), 55)
      } else {
        t = setTimeout(() => setPhase('deleting'), 1900)
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), 28)
      } else {
        t = setTimeout(() => {
          setPhase('typing')
          setI((i + 1) % PHRASES.length)
        }, 60)
      }
    }
    return () => clearTimeout(t)
  }, [text, phase, i])

  return (
    <>
      <span className="text-window" aria-live="polite" aria-atomic="true">
        {text}
      </span>
      <span className="tw-caret" aria-hidden="true">
        |
      </span>
    </>
  )
}

export default function Hero() {
  const ref = useRef(null)
  // Mois courant, mis à jour automatiquement (ex. « juillet »)
  const moisCourant = new Date().toLocaleDateString('fr-FR', { month: 'long' })
  const { scrollY } = useScroll()
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  // Orbs parallax
  const y = useTransform(scrollY, [0, vh], ['0%', '20%'])
  // Éléments centraux : disparition complète en scrollant
  const scale = useTransform(scrollY, [0, vh * 0.7], [1, 0.68])
  const yContent = useTransform(scrollY, [0, vh * 0.7], ['0%', '-12%'])
  const opacity = useTransform(scrollY, [0, vh * 0.5], [1, 0])
  // Fond 3D s'efface encore plus vite
  const bgOpacity = useTransform(scrollY, [0, vh * 0.35], [1, 0])

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        /* Padding vertical symétrique : le bloc central est vraiment au centre de l'écran */
        padding: 'clamp(7rem,11vh,8.5rem) clamp(1.5rem,8vw,5rem)',
        overflow: 'hidden',
      }}
    >
      {/* Fond 3D interactif — s'estompe au scroll */}
      <motion.div style={{ opacity: bgOpacity, position: 'absolute', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <HeroBackground3D />
        </Suspense>
      </motion.div>

      {/* Orbs parallax */}
      <motion.div style={{ y, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '40%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      {/* Badge disponibilite */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(5rem,9vh,6.5rem)',
          left: 'clamp(1.25rem,4vw,3rem)',
          zIndex: 2,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.35)',
            padding: '5px 14px',
            letterSpacing: '0.04em',
            background: 'rgba(34,197,94,0.06)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          2 créneaux disponibles en {moisCourant} — Réservez maintenant
        </span>
      </div>

      {/* Bloc central — parallaxe 3D au scroll */}
      <motion.div
        style={{
          opacity,
          scale,
          y: yContent,
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transformOrigin: 'center 40%',
        }}
      >
        {/* Titre machine à écrire */}
        <motion.h1 className="hero-title">
          <Typewriter />
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 'clamp(0.95rem,1.6vw,1.3rem)',
            fontWeight: 300,
            maxWidth: 620,
            lineHeight: 1.8,
            marginBottom: '3rem',
          }}
        >
          <span className="hero-sub-line">
            Sites vitrines, Applications web, E-commerce — livrés en{' '}
            <span style={{ color: '#ffffff', fontWeight: 500 }}>72h à 14 jours</span>.
          </span>
          <span className="hero-sub-line">
            Double expertise{' '}
            <span style={{ color: '#ffffff', fontWeight: 500 }}>
              informatique &amp; terrain industriel
            </span>
            .
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#contact" className="btn-primary">
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FiZap size={15} /> Obtenir un devis gratuit
            </span>
          </a>
          <a href="#services" className="btn-ghost">
            Voir les démos en live →
          </a>
        </motion.div>
      </motion.div>

      {/* Socials — disparaissent aussi au scroll */}
      <motion.div
        style={{
          opacity,
          position: 'absolute',
          bottom: 'clamp(4.5rem,9vh,6rem)',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 10,
          zIndex: 1,
        }}
      >
        {[
          { icon: FiGithub, href: 'https://github.com/jeremie-henri', label: 'GitHub' },
          {
            icon: FiLinkedin,
            href: 'https://www.linkedin.com/in/jeremie-henri-09a02b419/',
            label: 'LinkedIn',
          },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex items-center justify-center w-10 h-10 rounded-[10px] text-[rgba(255,255,255,0.65)] no-underline transition-all duration-200 hover:text-[#ffffff] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <Icon size={17} />
          </a>
        ))}
        <a
          href="mailto:jeremiehenri99@gmail.com"
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            marginLeft: 4,
            textDecoration: 'none',
          }}
          className="hover:text-[#ffffff] transition-colors duration-200"
        >
          jeremiehenri99@gmail.com
        </a>
      </motion.div>

      {/* Scroll arrow — disparaît au scroll */}
      <motion.a
        href="#services"
        aria-label="Défiler vers les services"
        style={{
          opacity,
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.65)',
          textDecoration: 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
      >
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <FiArrowDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  )
}
