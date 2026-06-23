import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

const ITEMS = [
  { label: 'Validation W3C', detail: 'HTML & CSS conformes aux standards' },
  { label: 'Accessibilité WAI/WCAG', detail: 'Niveau AA — utilisable par tous' },
  { label: 'Référencement SEO', detail: 'Balises, structure et performance optimisées' },
  { label: 'Responsive garanti', detail: 'Mobile, tablette & desktop' },
  { label: 'HTTPS & sécurité', detail: 'Certificat SSL + headers sécurisés' },
]

export default function TrustBar() {
  return (
    <section aria-label="Inclus dans chaque projet" style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,8vw,6rem)' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(165,146,255,0.7)', marginBottom: '1.5rem', textAlign: 'center' }}
        >
          Inclus dans chaque projet
        </motion.p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {ITEMS.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(20,20,34,0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(165,146,255,0.15)',
                borderRadius: 12,
                padding: '0.75rem 1.25rem',
              }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(109,86,250,0.2)', border: '1px solid rgba(109,86,250,0.4)',
              }}>
                <FiCheck size={12} color="#a592ff" />
              </span>
              <span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e8e6f0', display: 'block', lineHeight: 1.3 }}>{item.label}</span>
                <span style={{ fontSize: 11, color: '#7a7890', lineHeight: 1.4 }}>{item.detail}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
