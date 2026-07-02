import { Analytics } from '@vercel/analytics/react'
import ScrollProgress from './components/ScrollProgress'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import Services     from './components/Services'
import TrustBar     from './components/TrustBar'
import About        from './components/About'
import Skills       from './components/Skills'
import Contact      from './components/sections/Contact'
import Footer       from './components/Footer'
import Divider      from './components/Divider'

export default function App() {
  return (
    <div style={{ background: 'transparent', color: '#111111', minHeight: '100vh' }}>
      {/* Skip link accessibilité */}
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      {/* Fond aurore animé, fixe derrière toute la page */}
      <div className="bg-aurora-fixed" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div id="scroll-progress" />
      <ScrollProgress />
      <Navbar />

      {/* Hero épinglé en fond */}
      <div className="hero-sticky-wrap">
        <Hero />
      </div>

      {/* Feuille de contenu qui glisse par-dessus le hero */}
      <main id="main-content" className="overlap-sheet-main solid-sheet">
        <Services />
        <TrustBar />
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}