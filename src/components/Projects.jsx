import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { PROJECTS } from '../data/projects'

const FILTERS = [
  'Tous',
  'IA & Automation',
  'Full-stack',
  'Application',
  'Jeu vidéo',
  'Challenge',
  'En cours',
]

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function Projects() {
  const [active, setActive] = useState('Tous')

  const filtered = active === 'Tous' ? PROJECTS : PROJECTS.filter(p => p.badge === active)

  return (
    <section
      id="projects"
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
        transition={{ staggerChildren: 0.1 }}
      >
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
          Projets
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
            color: '#e8e6f0',
          }}
        >
          Ce que je construis
        </motion.h2>
        <motion.p
          variants={itemVariants}
          style={{ color: '#7a7890', fontWeight: 300, marginBottom: '2rem', maxWidth: 480 }}
        >
          Projets personnels, universitaires et professionnels — tous disponibles sur GitHub.
        </motion.p>

        {/* Filtres */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2.5rem' }}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              style={{
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                background: active === f ? '#7c6af7' : 'transparent',
                borderColor: active === f ? '#7c6af7' : 'rgba(255,255,255,0.1)',
                color: active === f ? '#fff' : '#7a7890',
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grille projets */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 14,
          }}
        >
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                style={{
                  background: '#111118',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  cursor: 'default',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
                    position: 'relative',
                    background: p.gradient,
                  }}
                >
                  {p.emoji}
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(10,10,15,0.75)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${p.badgeColor}40`,
                      color: p.badgeColor,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 100,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '1.25rem' }}>
                  <h3
                    style={{
                      color: '#e8e6f0',
                      fontFamily: "'Inter',sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: '#7a7890',
                      fontSize: 13,
                      lineHeight: 1.6,
                      marginBottom: '1rem',
                    }}
                  >
                    {p.desc}
                  </p>

                  {/* Stack badges */}
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '1.25rem' }}
                  >
                    {p.stack.map(s => (
                      <span
                        key={s}
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#1a1a24',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: '#7a7890',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Liens */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        color: '#7a7890',
                        textDecoration: 'none',
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.08)',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#e8e6f0'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '#7a7890'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <FiGithub size={13} /> GitHub
                    </a>
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          color: '#7c6af7',
                          textDecoration: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: '1px solid rgba(124,106,247,0.3)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <FiExternalLink size={13} /> Démo live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  )
}
