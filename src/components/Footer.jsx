import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'

const LINKS = [
  { icon: FiGithub,   href: 'https://github.com/jeremie-henri',       label: 'GitHub'   },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/jeremiehenri',   label: 'LinkedIn' },
  { icon: FiMail,     href: 'mailto:jeremiehenri99@gmail.com',        label: 'Email'    },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '2rem clamp(1.5rem,8vw,6rem)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: '1rem',
    }}>
      <a href="#hero" aria-label="Retour en haut de page — Jérémie Henri" style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem',
        textDecoration: 'none',
        color: '#ffffff',
      }}>JH.</a>

      <p style={{ fontSize: 12, color: '#6e6b8a', margin: 0, textAlign: 'center' }}>
        © {new Date().getFullYear()} Jérémie Henri · Développeur web indépendant
      </p>


      <div style={{ display: 'flex', gap: 10 }}>
        {LINKS.map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-[#666666] no-underline transition-all duration-200 hover:text-[#e8e6f0] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#6d56fa]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Icon size={15} />
          </a>
        ))}
      </div>
    </footer>
  )
}
