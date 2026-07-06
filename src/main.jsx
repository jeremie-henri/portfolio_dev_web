import './styles/index.css'
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'

// Espace client/admin chargé en différé : n'alourdit pas le portfolio
const EspaceApp = lazy(() => import('./espace/EspaceApp.jsx'))

// Un lien d'authentification Supabase (invitation, reset) peut atterrir sur la
// racine avec le token dans le hash : on le renvoie vers /espace qui le consomme.
if (
  window.location.hash.includes('access_token') &&
  !window.location.pathname.startsWith('/espace')
) {
  window.location.replace('/espace' + window.location.search + window.location.hash)
}

// Forcer le scroll à 0 avant le rendu React pour que Framer Motion
// lise scrollY=0 dès l'initialisation, évitant le flash sombre au refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/espace/*"
          element={
            <Suspense
              fallback={
                <div
                  style={{
                    minHeight: '100vh',
                    background: '#000',
                    color: 'rgba(255,255,255,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Chargement de l&apos;espace…
                </div>
              }
            >
              <EspaceApp />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
