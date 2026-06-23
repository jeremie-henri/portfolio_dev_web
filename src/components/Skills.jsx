import { motion } from 'framer-motion'

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } },
}

const SKILLS = [
  { icon: '⚛️',  name: 'React',     level: 80, cat: 'Frontend' },
  { icon: '🐘',  name: 'PHP',       level: 75, cat: 'Backend'  },
  { icon: '🐍',  name: 'Python',    level: 85, cat: 'Backend'  },
  { icon: '🗄️',  name: 'SQL',       level: 80, cat: 'Data'     },
  { icon: '🟩',  name: 'Node.js',   level: 60, cat: 'Backend'  },
  { icon: '💨',  name: 'Tailwind',  level: 75, cat: 'Frontend' },
  { icon: '☕',  name: 'Java',      level: 65, cat: 'Backend'  },
  { icon: '🔷',  name: 'TypeScript',level: 55, cat: 'Frontend' },
  { icon: '🔧',  name: 'Git',       level: 80, cat: 'Outils'   },
  { icon: '🤖',  name: 'C++',  level: 70, cat: 'IA'       },
  { icon: '📊',  name: 'Pandas',    level: 70, cat: 'Data'     },
  { icon: '🌐',  name: 'HTML/CSS',  level: 90, cat: 'Frontend' },
]

const TOOLS = [
  { icon: '🐙', name: 'GitHub'   },
  { icon: '📦', name: 'Vite'     },
  { icon: '🚀', name: 'Vercel'   },
  { icon: '🐋', name: 'Docker'   },
  { icon: '📬', name: 'Postman'  },
  { icon: '🗒️', name: 'VS Code'  },
]

export default function Skills() {
  return (
    <section id="skills" style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,6rem)', maxWidth: 1100, margin: '0 auto' }}>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.1 }}>

        <motion.p variants={itemVariants} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.75rem' }}>
          Compétences
        </motion.p>
        <motion.h2 variants={itemVariants} style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem', color: '#e8e6f0' }}>
          Ma stack technique
        </motion.h2>
        <motion.p variants={itemVariants} style={{ color: '#7a7890', fontWeight: 300, marginBottom: '3rem', maxWidth: 480 }}>
          Des technologies choisies pour leur efficacité et leur demande sur le marché freelance.
        </motion.p>

        {/* Grille compétences avec barres */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 10, marginBottom: '2.5rem' }}>
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ borderColor: 'rgba(124,106,247,0.35)', y: -2 }}
              style={{
                background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '1rem 1.1rem',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8e6f0' }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#7a7890', background: '#1a1a24', padding: '2px 7px', borderRadius: 4 }}>{s.cat}</span>
                  <span style={{ fontSize: 12, color: '#7c6af7', fontWeight: 600 }}>{s.level}%</span>
                </div>
              </div>
              {/* Barre animée */}
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.05 + 0.2, ease: [0.22,1,0.36,1] }}
                  style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg, #7c6af7, #5eead4)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Outils */}
        <motion.div variants={itemVariants}>
          <p style={{ fontSize: 12, color: '#7a7890', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 500 }}>Outils du quotidien</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TOOLS.map(t => (
              <motion.span
                key={t.name}
                whileHover={{ y: -2, borderColor: 'rgba(124,106,247,0.4)' }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8, padding: '6px 14px', fontSize: 13, color: '#7a7890',
                  cursor: 'default', transition: 'all 0.2s',
                }}
              >
                <span>{t.icon}</span> {t.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
