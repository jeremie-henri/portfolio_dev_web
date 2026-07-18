// src/components/sections/Contact.tsx
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { sendContactForm } from '../../utils/api/email'
import type { ContactFormData } from '../../types'

// ─── Schéma Zod ───────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

// ─── Données statiques ────────────────────────────────────────────
const INFOS = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'jeremiehenri99@gmail.com',
    href: 'mailto:jeremiehenri99@gmail.com',
  },
  { icon: FiMapPin, label: 'Localisation', value: 'St Mandrier — 100% Remote', href: null },
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'github.com/jeremie-henri',
    href: 'https://github.com/jeremie-henri',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/jeremiehenri',
    href: 'https://www.linkedin.com/in/jeremie-henri-09a02b419/',
  },
] as const

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

const INPUT_BASE = `
  w-full px-4 py-3 rounded-xl text-sm outline-none
  bg-white/[0.04] border border-white/[0.08] text-[#f0eeff]
  font-[inherit] transition-all duration-200
  placeholder:text-[#6e6b8a]
  focus:border-[rgba(109,86,250,0.5)] focus:shadow-[0_0_0_3px_rgba(109,86,250,0.1)]
  focus-visible:ring-2 focus-visible:ring-[#6d56fa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080810]
`

// â”€â”€â”€ Composant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Contact() {
  const reduceMotion = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('idle')
    setErrorMsg('')
    try {
      await sendContactForm(data)
      setStatus('success')
      reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi")
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,5rem)',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: reduceMotion ? 0 : 0.1 }}
      >
        {/* Header */}
        <motion.p
          variants={item}
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#7c6af7',
            marginBottom: '0.75rem',
          }}
        >
          Contact
        </motion.p>
        <motion.h2
          id="contact-heading"
          variants={item}
          style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: '#f0eeff',
          }}
        >
          Parlons de votre{' '}
          <span
            style={{
              fontFamily: "'Inter',serif",
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#ffffff',
            }}
          >
            projet
          </span>
        </motion.h2>
        <motion.p
          variants={item}
          style={{ color: '#6e6b8a', fontWeight: 300, marginBottom: '3rem', maxWidth: 480 }}
        >
          Devis gratuit sous 24h. Aucun engagement.
        </motion.p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Formulaire */}
          <motion.form
            variants={item}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            aria-label="Formulaire de contact"
          >
            {/* Feedback succès */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  background: 'rgba(5,232,200,0.08)',
                  border: '1px solid rgba(5,232,200,0.2)',
                  borderRadius: 10,
                  color: '#05e8c8',
                  fontSize: 13,
                }}
              >
                <FiCheckCircle size={16} aria-hidden="true" />
                Message envoyé ! Je reviens vers vous sous 24h.
              </motion.div>
            )}

            {/* Feedback erreur */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                aria-live="assertive"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 10,
                  color: '#ef4444',
                  fontSize: 13,
                }}
              >
                <FiAlertCircle
                  size={16}
                  style={{ flexShrink: 0, marginTop: 1 }}
                  aria-hidden="true"
                />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Champ Nom */}
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Votre nom
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Votre nom *"
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={INPUT_BASE}
                {...register('name')}
              />
              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="contact-email" className="sr-only">
                Votre email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Votre email *"
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={INPUT_BASE}
                {...register('email')}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Champ Sujet */}
            <div>
              <label htmlFor="contact-subject" className="sr-only">
                Sujet
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Sujet (ex : Site vitrine restaurant)"
                className={INPUT_BASE}
                {...register('subject')}
              />
            </div>

            {/* Champ Message */}
            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="Décrivez votre projet... *"
                rows={5}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                style={{ resize: 'vertical', minHeight: 120 }}
                className={INPUT_BASE}
                {...register('message')}
              />
              {errors.message && (
                <p
                  id="message-error"
                  role="alert"
                  style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Bouton envoi */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              aria-label="Envoyer le message"
              aria-busy={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 24px',
                borderRadius: 0,
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: isSubmitting ? '#888' : '#080808',
                fontFamily: 'inherit',
                background: isSubmitting ? 'rgba(200,200,200,0.15)' : '#ffffff',
                boxShadow: 'none',
                transition: 'all 0.2s',
                width: 'fit-content',
              }}
            >
              <FiSend size={14} aria-hidden="true" />
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </motion.button>
          </motion.form>

          {/* Informations de contact */}
          <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INFOS.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(109,86,250,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color="#ffffff" aria-hidden="true" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#6e6b8a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ fontSize: 13, color: '#f0eeff', textDecoration: 'none' }}
                      className="hover:text-[#a592ff] focus-visible:ring-2 focus-visible:ring-[#6d56fa]"
                    >
                      {value}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: '#f0eeff' }}>{value}</span>
                  )}
                </div>
              </div>
            ))}

            <div
              style={{
                padding: '1rem 1.25rem',
                background: 'rgba(109,86,250,0.06)',
                border: '1px solid rgba(109,86,250,0.18)',
                borderRadius: 14,
                marginTop: 4,
              }}
            >
              <p style={{ fontSize: 13, color: '#ffffff', fontWeight: 600, marginBottom: 4 }}>
                ⚡ Réponse garantie sous 24h
              </p>
              <p style={{ fontSize: 12, color: '#6e6b8a', lineHeight: 1.6 }}>
                Sites vitrines · Apps web · E-commerce · Dashboards
                <br />
                Devis gratuit et sans engagement.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
