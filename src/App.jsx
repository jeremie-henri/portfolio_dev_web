import ScrollProgress from './components/ScrollProgress'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import Services     from './components/Services'
import TrustBar     from './components/TrustBar'
import Testimonials from './components/Testimonials'
import About        from './components/About'
import Skills       from './components/Skills'
import Projects     from './components/Projects'
import Contact      from './components/sections/Contact'
import Footer       from './components/Footer'
import Divider      from './components/Divider'

export default function App() {
  return (
    <div style={{ background: 'transparent', color: '#f0eeff', minHeight: '100vh' }}>
      {/* Skip link accessibilité */}
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      {/* Fond aurore animé, fixe derrière toute la page */}
      <div className="bg-aurora-fixed" aria-hidden="true">
        <span /><span /><span />
      </div>

      <div id="scroll-progress" />
      <ScrollProgress />
      <Navbar />

      {/* Zone transparente : le fond animé transparaît */}
      <Hero />
      <main id="main-content">
      <div className="reveal-band" aria-hidden="true" />
      <Services />
      <TrustBar />
      <div className="reveal-band" aria-hidden="true" />

      {/* Feuille opaque : le reste du site couvre le fond animé */}
      <div className="solid-sheet">
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Contact />
      </div>
      </main>
      <Footer />
    </div>
  )
}
/*
      <Projects />
      <Divider />

      <Testimonials />
      <Divider />*/