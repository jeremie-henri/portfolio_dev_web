import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FiArrowDown, FiGithub, FiLinkedin, FiZap } from 'react-icons/fi'

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
        setPhase('typing')
        setI((i + 1) % PHRASES.length)
      }
    }
    return () => clearTimeout(t)
  }, [text, phase, i])

  return (
    <>
      <span className="text-window" aria-live="polite" aria-atomic="true">{text}</span>
      <span className="tw-caret" aria-hidden="true">|</span>
    </>
  )
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      textAlign: 'center',
      padding: 'clamp(6rem,10vw,8rem) clamp(1.5rem,8vw,5rem) 4rem',
      overflow: 'hidden',
    }}>

      {/* Orbs parallax */}
      <motion.div style={{ y, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '40%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </motion.div>

      {/* Badge disponibilité — tout en haut à gauche */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
        style={{ position: 'absolute', top: 'clamp(5rem,9vh,6.5rem)', left: 'clamp(1.25rem,4vw,3rem)', zIndex: 2, textAlign: 'left' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:12, color:'#22c55e', border:'1px solid rgba(34,197,94,0.35)', padding:'5px 14px', letterSpacing:'0.04em', background:'rgba(34,197,94,0.06)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e', display:'inline-block', flexShrink:0 }} />
          2 créneaux disponibles en juin — Réservez maintenant
        </span>
      </motion.div>

      {/* Bloc central */}
      <motion.div style={{ opacity, position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        variants={container} initial="hidden" animate="visible">

        {/* Titre machine à écrire */}
        <motion.h1 variants={item} style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800, lineHeight: 1.08,
          fontSize: 'clamp(1.8rem,6vw,5.2rem)', letterSpacing: '-0.03em',
          marginBottom: '2rem', paddingBottom: '0.12em',
          whiteSpace: 'nowrap',
          width: '100vw', maxWidth: '100vw', marginLeft: 'calc(50% - 50vw)',
          display: 'flex', alignItems: 'baseline', justifyContent: 'center',
          minHeight: '1.3em', padding: '0 1rem',
        }}>
          <Typewriter />
        </motion.h1>

        {/* Sous-titre */}
        <motion.p variants={item} style={{
          color: '#888888', fontSize: 'clamp(1.05rem,1.6vw,1.3rem)',
          fontWeight: 300, maxWidth: 620, lineHeight: 1.8, marginBottom: '3rem',
        }}>
          Sites vitrines, Applications web, E-commerce — livrés en{' '}
          <span style={{ color: '#ffffff', fontWeight: 500 }}>72h à 14 jours</span>.
          Double expertise{' '}
          <span style={{ color: '#ffffff', fontWeight: 500 }}>informatique &amp; terrain industriel</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#contact" className="btn-primary">
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiZap size={15} /> Obtenir un devis gratuit
            </span>
          </a>
          <a href="#services" className="btn-ghost">
            Voir les démos en live →
          </a>
        </motion.div>
      </motion.div>

      {/* Socials — en bas, centrés */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}
        style={{ position: 'absolute', bottom: 'clamp(4.5rem,9vh,6rem)', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10, zIndex: 1 }}>
        {[
          { icon: FiGithub,   href: 'https://github.com/jeremie-henri',     label: 'GitHub' },
          { icon: FiLinkedin, href: 'https://linkedin.com/in/jeremiehenri', label: 'LinkedIn' },
        ].map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="flex items-center justify-center w-10 h-10 rounded-[10px] text-[#888888] no-underline transition-all duration-200 hover:text-[#ffffff] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          ><Icon size={17} /></a>
        ))}
        <a href="mailto:jeremiehenri99@gmail.com" style={{ fontSize: 13, color: '#888888', marginLeft: 4, textDecoration: 'none' }} className="hover:text-[#ffffff] transition-colors duration-200">jeremiehenri99@gmail.com</a>
      </motion.div>

      {/* Scroll arrow */}
      <motion.a href="#services" aria-label="Défiler vers les services" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}
        style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: '#888888', textDecoration: 'none' }}
        onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.5'}
      >
        <motion.div animate={{ y: [0,7,0] }} transition={{ duration: 2, repeat: Infinity }}>
          <FiArrowDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  )
}
