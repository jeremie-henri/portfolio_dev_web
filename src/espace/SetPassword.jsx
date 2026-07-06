import { useState } from 'react'
import { supabase } from './supabase'

export default function SetPassword({ email, onDone }) {
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (pwd.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.')
      return
    }
    if (pwd !== pwd2) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password: pwd })
    setBusy(false)
    if (error) setError('Erreur : ' + error.message)
    else onDone()
  }

  return (
    <div className="esp-login">
      <form className="esp-login-box" onSubmit={submit}>
        <h1>Bienvenue !</h1>
        <p className="esp-sub">
          Définissez votre mot de passe pour accéder à votre espace{email ? ` (${email})` : ''}.
        </p>

        {error && <div className="esp-error">{error}</div>}

        <div className="esp-field">
          <label className="esp-label" htmlFor="sp1">
            Nouveau mot de passe
          </label>
          <input
            id="sp1"
            className="esp-input"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="8 caractères minimum"
            required
          />
        </div>
        <div className="esp-field">
          <label className="esp-label" htmlFor="sp2">
            Confirmer le mot de passe
          </label>
          <input
            id="sp2"
            className="esp-input"
            type="password"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="esp-btn esp-btn-accent" type="submit" disabled={busy}>
          {busy ? 'Enregistrement…' : 'Valider et accéder à mon espace'}
        </button>
      </form>
    </div>
  )
}
