import { motion } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const TAGS = [
  { label: 'Développement web', accent: true },
  { label: 'Automatisation Python', accent: true },
  { label: 'IA & bots', accent: true },
  { label: 'Full remote', accent: false },
  { label: 'Freelance', accent: false },
  { label: 'Double expertise', accent: false },
]

const CARDS = [
  {
    icon: '🎓',
    title: 'Formation',
    desc: 'DUT Informatique + Licence Informatique — bases solides en algo, POO, réseaux et développement web.',
  },
  {
    icon: '🤖',
    title: 'Projets',
    desc: 'Passionné par la programmation et du hardware (notamment Arduino et Raspberry Pi), je conçois et réalise régulièrement des projets personnels en autodidacte.',
  },
  {
    icon: '🔧',
    title: 'Terrain',
    desc: 'Expérience en maintenance industrielle (CNRS, SAVN) — je comprend aussi bien le code que les machines.',
  },
]

export default function About() {
  return (
    <section
      id="about"
      style={{
        padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,6rem)',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: 0.12 }}
      >
        {/* Label + titre */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '0.75rem',
          }}
        >
          À propos
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
          Développeur indépendant,
          <br />
          profil rare.
        </motion.h2>
        <motion.p
          variants={itemVariants}
          style={{
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 520,
            fontWeight: 300,
            marginBottom: '1rem',
          }}
        >
          Une double casquette que très peu de freelances peuvent revendiquer.
        </motion.p>
        <motion.p
          variants={itemVariants}
          style={{
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 560,
            fontWeight: 300,
            marginBottom: '1rem',
            lineHeight: 1.7,
          }}
        >
          Du site vitrine au projet plus complexe, je vous propose une expertise et un développement
          web qui correspond à vos attentes et à vos besoins.
        </motion.p>

        {/* Grille : texte + avatar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          {/* Avatar */}
          <motion.div variants={itemVariants}>
            <div
              style={{
                width: '100%',
                maxWidth: 300,
                aspectRatio: '3/4',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.07)',
                position: 'relative',
                overflow: 'hidden',
                margin: '0 auto',
              }}
            >
              <img
                src="/photos/profile.jpg"
                alt="Portrait de Jérémie Henri, développeur web indépendant"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg,rgba(255,255,255,0.04),transparent 60%)',
                }}
              />
            </div>
          </motion.div>

          {/* Texte */}
          <motion.div variants={itemVariants}>
            <p
              style={{
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.8,
                marginBottom: '1.25rem',
                fontWeight: 300,
                fontSize: 15,
              }}
            >
              Je m'appelle Jérémie Henri, développeur web freelance. Titulaire d'un{' '}
              <strong style={{ color: '#f5f5f5' }}>DUT et d'une Licence en Informatique</strong>, je
              combine une solide base technique — PHP, React, SQL — avec une expérience concrète
              acquise sur le terrain en tant que technicien de maintenance. Aujourd'hui, je me
              consacre pleinement au développement web et j'accompagne mes clients dans la création
              de leur présence en ligne.{' '}
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 12,
          }}
        >
          {CARDS.map(c => (
            <motion.div
              key={c.title}
              variants={itemVariants}
              whileHover={{
                y: -4,
                borderColor: 'rgba(255,255,255,0.2)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
              }}
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: '1.25rem',
                transition: 'border-color 0.2s',
              }}
            >
              <span
                style={{ fontSize: '1.6rem', display: 'block', marginBottom: 10 }}
                aria-hidden="true"
              >
                {c.icon}
              </span>
              <strong style={{ color: '#f5f5f5', fontSize: 14, display: 'block', marginBottom: 6 }}>
                {c.title}
              </strong>
              <p
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
