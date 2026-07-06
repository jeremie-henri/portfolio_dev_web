import { useEffect, useState } from 'react'
import './espace.css'
import { AuthProvider, useAuth } from './AuthContext'
import { authFlowType, supabase } from './supabase'
import Login from './Login'
import SetPassword from './SetPassword'
import Dashboard from './Dashboard'
import ClientView from './ClientView'
import AdminView from './AdminView'
import ProjectDetail from './ProjectDetail'
import Profil from './Profil'

// Au retour du paiement d'une facture, confirme le paiement côté serveur
async function confirmerPaiementFacture() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('facture') === 'paid') {
    const fid = params.get('fid')
    const sessionId = params.get('session_id')
    try {
      const { data } = await supabase.auth.getSession()
      await fetch('/api/espace-facture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session?.access_token}`,
        },
        body: JSON.stringify({ action: 'confirm', factureId: fid, sessionId }),
      })
    } catch {
      /* silencieux */
    }
    window.history.replaceState({}, '', '/espace')
    return true
  }
  if (params.get('facture') === 'cancelled') {
    window.history.replaceState({}, '', '/espace')
  }
  return false
}

function Shell() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [tab, setTab] = useState('accueil') // accueil | projets | profil
  const [openId, setOpenId] = useState(null)
  const [needsPassword, setNeedsPassword] = useState(
    authFlowType === 'invite' || authFlowType === 'recovery'
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    confirmerPaiementFacture().then((paid) => paid && setTab('accueil'))
  }, [])

  if (loading) {
    return (
      <div className="esp">
        <div className="esp-wrap">Chargement…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="esp">
        <Login />
      </div>
    )
  }

  if (needsPassword) {
    return (
      <div className="esp">
        <SetPassword email={user.email} onDone={() => setNeedsPassword(false)} />
      </div>
    )
  }

  const go = (t) => {
    setOpenId(null)
    setTab(t)
  }

  // Onglets côté client uniquement (l'admin garde sa vue projets globale)
  const clientTabs = [
    ['accueil', 'Accueil'],
    ['projets', 'Mes projets'],
    ['profil', 'Mon profil'],
  ]

  return (
    <div className="esp">
      <header className="esp-top">
        <a href="/espace" className="esp-brand" onClick={() => go('accueil')}>
          Espace<span> · {isAdmin ? 'Admin' : 'Client'}</span>
        </a>
        {!isAdmin && !openId && (
          <nav className="esp-tabs">
            {clientTabs.map(([k, label]) => (
              <button
                key={k}
                className={`esp-tab${tab === k ? ' active' : ''}`}
                onClick={() => go(k)}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
        <div className="esp-top-right">
          <span className="esp-email">{user.email}</span>
          <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={signOut}>
            Déconnexion
          </button>
        </div>
      </header>

      {openId ? (
        <ProjectDetail projetId={openId} onBack={() => setOpenId(null)} />
      ) : isAdmin ? (
        <AdminView onOpen={setOpenId} />
      ) : tab === 'accueil' ? (
        <Dashboard onOpen={setOpenId} />
      ) : tab === 'profil' ? (
        <Profil />
      ) : (
        <ClientView onOpen={setOpenId} />
      )}
    </div>
  )
}

export default function EspaceApp() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
