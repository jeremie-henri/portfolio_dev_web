import { useState } from 'react'
import { useAuth } from './AuthContext'
import { isConfigured } from './supabase'

export default function Login() {
  const { signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  if (!isConfigured) {
    return (
      <div className="esp-login">
        <div className="esp-login-box">
          <h1>Espace client</h1>
          <p className="esp-sub">Configuration requise</p>
          <div className="esp-notice">
            L&apos;espace n&apos;est pas encore relié à sa base de données. Ajoute les variables{' '}
            <strong>VITE_SUPABASE_URL</strong> et <strong>VITE_SUPABASE_ANON_KEY</strong> dans Vercel,
            puis redéploie.
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    setInfo('')
    const { error } = await signIn(email.trim(), password)
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setStatus('idle')
    }
    // succès → AuthContext bascule automatiquement vers le dashboard
  }

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Saisis ton email puis reclique sur « Mot de passe oublié ».')
      return
    }
    setError('')
    const { error } = await resetPassword(email.trim())
    if (error) setError("Impossible d'envoyer l'email de réinitialisation.")
    else setInfo('Email de réinitialisation envoyé ! Vérifie ta boîte de réception.')
  }

  return (
    <div className="esp-login">
      <form className="esp-login-box" onSubmit={handleSubmit}>
        <h1>Espace client</h1>
        <p className="esp-sub">Suivez l&apos;avancement de votre projet en temps réel.</p>

        {error && <div className="esp-error">{error}</div>}
        {info && <div className="esp-ok">{info}</div>}

        <div className="esp-field">
          <label className="esp-label" htmlFor="esp-email">
            Email
          </label>
          <input
            id="esp-email"
            className="esp-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@email.com"
            required
          />
        </div>
        <div className="esp-field">
          <label className="esp-label" htmlFor="esp-pass">
            Mot de passe
          </label>
          <input
            id="esp-pass"
            className="esp-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="esp-btn esp-btn-accent" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Connexion…' : 'Se connecter'}
        </button>

        <button type="button" className="esp-link-btn" onClick={handleReset}>
          Mot de passe oublié ?
        </button>
        <div style={{ marginTop: '1.5rem', fontSize: 12 }}>
          <a href="/">← Retour au site</a>
        </div>
      </form>
    </div>
  )
}
