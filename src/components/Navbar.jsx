import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiZap } from 'react-icons/fi'

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'À propos', href: '#about' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '0.75rem clamp(1.5rem,5vw,3rem)' : '1.25rem clamp(1.5rem,5vw,3rem)',
        background: scrolled ? 'rgba(0,0,0,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        opacity: scrolled ? 1 : 1,
        transition:
          'padding 0.5s ease, background 0.6s ease, backdrop-filter 0.6s ease, border-color 0.6s ease',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        aria-label="Accueil — Jérémie Henri"
        style={{
          gridColumn: '1',
          justifySelf: 'start',
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: '1.25rem',
          textDecoration: 'none',
          letterSpacing: '-0.03em',
          color: '#ffffff',
        }}
      >
        JH<span style={{ color: '#888888' }}>.</span>
      </a>

      {/* Desktop nav */}
      <nav
        aria-label="Navigation principale"
        style={{
          gridColumn: '2',
          justifySelf: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        className="hide-mobile"
      >
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <a
        href="#contact"
        className="hide-mobile"
        style={{
          gridColumn: '3',
          justifySelf: 'end',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          whiteSpace: 'nowrap',
          padding: '9px 22px',
          borderRadius: 0,
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          background: '#ffffff',
          color: '#080808',
          textDecoration: 'none',
          boxShadow: 'none',
          transition: 'box-shadow 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#e0e0e0'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#ffffff'
          e.currentTarget.style.transform = 'none'
        }}
      >
        <FiZap size={13} /> Devis gratuit
      </a>

      {/* Burger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="show-mobile"
        style={{
          gridColumn: '3',
          justifySelf: 'end',
          background: 'none',
          border: 'none',
          color: '#f0eeff',
          cursor: 'pointer',
          display: 'none',
        }}
      >
        {open ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(8,8,16,0.97)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '1.5rem clamp(1.5rem,5vw,3rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: '#f0eeff',
                  textDecoration: 'none',
                  fontSize: 16,
                  fontWeight: 500,
                  padding: '0.5rem 0',
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              style={{
                marginTop: '0.5rem',
                padding: '12px',
                borderRadius: 0,
                background: '#ffffff',
                color: '#080808',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Devis gratuit
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:768px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}`}</style>
    </header>
  )
}
