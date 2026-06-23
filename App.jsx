import CursorAndProgress from './components/CursorAndProgress'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import Services     from './components/Services'
import ROICalculator from './components/ROICalculator'
import About        from './components/About'
import Skills       from './components/Skills'
import Projects     from './components/Projects'
import Contact      from './components/Contact'
import Footer       from './components/Footer'
import Divider      from './components/Divider'

export default function App() {
  return (
    <div style={{ background: '#080810', color: '#f0eeff', minHeight: '100vh' }}>
      <div id="cursor" />
      <div id="cursor-trail" />
      <div id="scroll-progress" />
      <CursorAndProgress />
      <Navbar />
      <Hero />
      <Divider />
      <Services />
      <Divider />
      <ROICalculator />
      <Divider />
      <About />
      <Divider />
      <Skills />
      <Divider />
      <Projects />
      <Divider />
      <Contact />
      <Footer />
    </div>
  )
}
