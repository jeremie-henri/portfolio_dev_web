import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiCheckCircle } from 'react-icons/fi'
import emailjs from 'emailjs-com'

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } },
}

const INPUT_STYLE = {
  width: '100%', padding: '12px 16px', borderRadius: 8, fontSize: 14,
  background: '#111118', border: '1px solid rgba(255,255,255,0.08)',
  color: '#e8e6f0', fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
}

const INFOS = [
  { icon: FiMail,    label: 'Email',        value: 'jeremiehenri99@gmail.com',     href: 'mailto:jeremiehenri99@gmail.com' },
  { icon: FiMapPin,  label: 'Localisation', value: 'St Mandrier — 100% Remote',    href: null },
  { icon: FiGithub,  label: 'GitHub',       value: 'github.com/jeremie-henri',     href: 'https://github.com/jeremie-henri' },
  { icon: FiLinkedin,label: 'LinkedIn',     value: 'linkedin.com/in/jeremie-henri', href: 'https://www.linkedin.com/in/jeremie-henri-09a02b419/' },
]

export default function Contact() {
  const formRef = useRef()
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,6rem)', maxWidth: 1100, margin: '0 auto' }}>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.1 }}>

        <motion.p variants={itemVariants} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c6af7', marginBottom: '0.75rem' }}>
          Contact
        </motion.p>
        <motion.h2 variants={itemVariants} style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem', color: '#e8e6f0' }}>
          Travaillons ensemble
        </motion.h2>
        <motion.p variants={itemVariants} style={{ color: '#7a7890', fontWeight: 300, marginBottom: '3rem', maxWidth: 480 }}>
          Un projet en tête ? Décris-le moi, je réponds sous 24h.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Formulaire */}
          <motion.form ref={formRef} variants={itemVariants} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="Votre nom" required
              style={INPUT_STYLE}
              onFocus={e => e.target.style.borderColor='rgba(124,106,247,0.5)'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
            />
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="Votre email" required
              style={INPUT_STYLE}
              onFocus={e => e.target.style.borderColor='rgba(124,106,247,0.5)'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
            />
            <input
              name="subject" value={form.subject} onChange={handleChange}
              placeholder="Sujet (ex : Site vitrine restaurant)"
              style={INPUT_STYLE}
              onFocus={e => e.target.style.borderColor='rgba(124,106,247,0.5)'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
            />
            <textarea
              name="message" value={form.message} onChange={handleChange}
              placeholder="Demandez votre devis gratuit." required rows={5}
              style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 120 }}
              onFocus={e => e.target.style.borderColor='rgba(124,106,247,0.5)'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
            />

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 24px', borderRadius: 8, border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 500, color: '#fff', fontFamily: 'inherit',
                background: status === 'sending' ? '#3a3560' : '#7c6af7',
                boxShadow: '0 0 20px rgba(124,106,247,0.3)',
                transition: 'background 0.2s', width: 'fit-content',
              }}
            >
              <FiSend size={14} />
              {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
            </motion.button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5eead4', fontSize: 13, marginTop: 4 }}
              >
                <FiCheckCircle size={16} /> Message envoyé ! Je vous réponds sous 24h.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ color: '#f87171', fontSize: 13, marginTop: 4 }}
              >
                Erreur d&apos;envoi. Contactez-moi directement par email.
              </motion.div>
            )}
          </motion.form>

          {/* Infos contact */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INFOS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '1rem 1.25rem', background: '#111118',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(124,106,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#7c6af7" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#7a7890', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</p>
                  {href
                    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{ fontSize: 13, color: '#e8e6f0', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color='#7c6af7'} onMouseLeave={e => e.currentTarget.style.color='#e8e6f0'}>{value}</a>
                    : <span style={{ fontSize: 13, color: '#e8e6f0' }}>{value}</span>
                  }
                </div>
              </div>
            ))}

            <div style={{ padding: '1rem 1.25rem', background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: 12, marginTop: 4 }}>
              <p style={{ fontSize: 13, color: '#7c6af7', fontWeight: 500, marginBottom: 4 }}>⚡ Réponse garantie sous 24h</p>
              <p style={{ fontSize: 12, color: '#7a7890', lineHeight: 1.6 }}>Sites vitrines · Apps web · Bots Python · Dashboards · Devis gratuit et sans engagement.</p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}
