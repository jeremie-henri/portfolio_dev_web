import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } },
}

const INPUT = {
  width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#f0eeff', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}

const INFOS = [
  { icon: FiMail,     label: 'Email',        value: 'jeremiehenri99@gmail.com',     href: 'mailto:jeremiehenri99@gmail.com' },
  { icon: FiMapPin,   label: 'Localisation', value: 'St Mandrier — 100% Remote',    href: null },
  { icon: FiGithub,   label: 'GitHub',       value: 'github.com/jeremiehenri',      href: 'https://github.com/jeremiehenri' },
  { icon: FiLinkedin, label: 'LinkedIn',     value: 'linkedin.com/in/jeremiehenri', href: 'https://linkedin.com/in/jeremiehenri' },
]

export default function Contact() {
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errMsg, setErrMsg] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    setErrMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')

      setStatus('success')
      setForm({ name:'', email:'', subject:'', message:'' })

    } catch (err) {
      setStatus('error')
      setErrMsg(err.message)
    }
  }

  return (
    <section id="contact" style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,5rem)', maxWidth: 1100, margin: '0 auto' }}>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.1 }}>

        <motion.p variants={item} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6d56fa', marginBottom: '0.75rem' }}>
          Contact
        </motion.p>
        <motion.h2 variants={item} style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem', color: '#f0eeff' }}>
          Parlons de votre{' '}
          <span style={{ fontFamily:"'Fraunces',serif", fontStyle:'italic', fontWeight:300, background:'linear-gradient(135deg,#6d56fa,#f059da)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            projet
          </span>
        </motion.h2>
        <motion.p variants={item} style={{ color: '#6e6b8a', fontWeight: 300, marginBottom: '3rem', maxWidth: 480 }}>
          Devis gratuit sous 24h. Aucun engagement.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Formulaire */}
          <motion.form variants={item} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'name',    type: 'text',  placeholder: 'Votre nom', required: true },
              { name: 'email',   type: 'email', placeholder: 'Votre email', required: true },
              { name: 'subject', type: 'text',  placeholder: 'Sujet (ex : Site vitrine restaurant)', required: false },
            ].map(f => (
              <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                value={form[f.name]} onChange={handleChange} style={INPUT}
                onFocus={e => { e.target.style.borderColor='rgba(109,86,250,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(109,86,250,0.1)' }}
                onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none' }}
              />
            ))}
            <textarea name="message" placeholder="Décrivez votre projet..." required rows={5}
              value={form.message} onChange={handleChange}
              style={{ ...INPUT, resize: 'vertical', minHeight: 120 }}
              onFocus={e => { e.target.style.borderColor='rgba(109,86,250,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(109,86,250,0.1)' }}
              onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none' }}
            />

            <motion.button type="submit" disabled={status === 'sending'}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 24px', borderRadius: 12, border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'none',
                fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'inherit',
                background: status === 'sending' ? 'rgba(109,86,250,0.4)' : 'linear-gradient(135deg,#6d56fa,#f059da)',
                boxShadow: status === 'sending' ? 'none' : '0 0 24px rgba(109,86,250,0.35)',
                transition: 'all 0.2s', width: 'fit-content',
              }}
            >
              <FiSend size={14} />
              {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
            </motion.button>

            {/* Feedback */}
            {status === 'success' && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', background:'rgba(5,232,200,0.08)', border:'1px solid rgba(5,232,200,0.2)', borderRadius:10, color:'#05e8c8', fontSize:13 }}
              >
                <FiCheckCircle size={16} />
                Message envoyé ! Vous allez recevoir une confirmation par email. Je reviens vers vous sous 24h.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'12px 16px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:'#ef4444', fontSize:13 }}
              >
                <FiAlertCircle size={16} style={{ flexShrink:0, marginTop:1 }} />
                <span>{errMsg || 'Erreur d\'envoi. Contactez-moi directement par email.'}</span>
              </motion.div>
            )}
          </motion.form>

          {/* Infos */}
          <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INFOS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:14, padding:'1rem 1.25rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'rgba(109,86,250,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color="#a592ff" />
                </div>
                <div>
                  <p style={{ fontSize:11, color:'#6e6b8a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>{label}</p>
                  {href
                    ? <a href={href} style={{ fontSize:13, color:'#f0eeff', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#a592ff'} onMouseLeave={e=>e.currentTarget.style.color='#f0eeff'}>{value}</a>
                    : <span style={{ fontSize:13, color:'#f0eeff' }}>{value}</span>
                  }
                </div>
              </div>
            ))}

            <div style={{ padding:'1rem 1.25rem', background:'rgba(109,86,250,0.06)', border:'1px solid rgba(109,86,250,0.18)', borderRadius:14, marginTop:4 }}>
              <p style={{ fontSize:13, color:'#a592ff', fontWeight:600, marginBottom:4 }}>⚡ Réponse garantie sous 24h</p>
              <p style={{ fontSize:12, color:'#6e6b8a', lineHeight:1.6 }}>Sites vitrines · Apps web · Bots Python · Dashboards<br/>Devis gratuit et sans engagement.</p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}
