import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const LINKS = [
  { icon: FiGithub,   href: 'https://github.com/jeremie-henri',                      label: 'GitHub'   },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/jeremie-henri-09a02b419/',  label: 'LinkedIn' },
  { icon: FiMail,     href: 'mailto:jeremiehenri99@gmail.com',                       label: 'Email'    },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '2rem clamp(1.5rem,8vw,6rem)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: '1rem',
      position: 'relative', zIndex: 2,
    }}>
      <a href="#hero" aria-label="Retour en haut de page - Jeremie Henri" style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem',
        textDecoration: 'none',
        color: '#ffffff',
      }}>JH.</a>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} Jérémie Henri · Développeur web indépendant
        <span style={{ display: 'block', marginTop: 4 }}>
          <a href="/mentions-legales.html" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>Mentions légales</a>
          {' · '}
          <a href="/politique-confidentialite.html" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>Confidentialité</a>
        </span>
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        {LINKS.map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-[#aaaaaa] no-underline transition-all duration-200 hover:text-[#ffffff] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Icon size={15} />
          </a>
        ))}
      </div>
    </footer>
  )
}
