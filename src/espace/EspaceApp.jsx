import { useState } from 'react'
import './espace.css'
import { AuthProvider, useAuth } from './AuthContext'
import { authFlowType } from './supabase'
import Login from './Login'
import SetPassword from './SetPassword'
import ClientView from './ClientView'
import AdminView from './AdminView'
import ProjectDetail from './ProjectDetail'

function Shell() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [openId, setOpenId] = useState(null)
  // Après une invitation ou une réinitialisation, on force la définition du mot de passe
  const [needsPassword, setNeedsPassword] = useState(
    authFlowType === 'invite' || authFlowType === 'recovery'
  )

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

  return (
    <div className="esp">
      <header className="esp-top">
        <a href="/espace" className="esp-brand" onClick={() => setOpenId(null)}>
          Espace<span> · {isAdmin ? 'Admin' : 'Client'}</span>
        </a>
        <div className="esp-top-right">
          <span>{user.email}</span>
          <button className="esp-btn esp-btn-ghost esp-btn-sm" onClick={signOut}>
            Déconnexion
          </button>
        </div>
      </header>

      {openId ? (
        <ProjectDetail projetId={openId} onBack={() => setOpenId(null)} />
      ) : isAdmin ? (
        <AdminView onOpen={setOpenId} />
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
