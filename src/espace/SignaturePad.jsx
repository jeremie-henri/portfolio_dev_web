import { useEffect, useRef, useState } from 'react'

// Modale de signature : le client trace au doigt/à la souris + tape son nom.
export default function SignaturePad({ doc, onCancel, onConfirm }) {
  const canvasRef = useRef(null)
  const [nom, setNom] = useState('')
  const [vide, setVide] = useState(true)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#111'
  }, [])

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    return { x: p.clientX - rect.left, y: p.clientY - rect.top }
  }
  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const move = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setVide(false)
  }
  const end = () => {
    drawing.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setVide(true)
  }

  const confirm = () => {
    if (!nom.trim() || vide) return
    // Fond blanc + tracé sur une copie, pour un PNG lisible
    const src = canvasRef.current
    const out = document.createElement('canvas')
    out.width = src.width
    out.height = src.height
    const c = out.getContext('2d')
    c.fillStyle = '#fff'
    c.fillRect(0, 0, out.width, out.height)
    c.drawImage(src, 0, 0)
    onConfirm(nom.trim(), out.toDataURL('image/png'))
  }

  return (
    <div className="esp-modal-overlay" onClick={onCancel}>
      <div className="esp-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>Signer le devis</h3>
        <p className="esp-sub" style={{ margin: '0 0 1.25rem' }}>
          {doc.numero} — {doc.libelle}
        </p>

        <div className="esp-field">
          <label className="esp-label">Votre nom complet</label>
          <input
            className="esp-input"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Marie Dupont"
          />
        </div>

        <label className="esp-label">Votre signature (tracez ci-dessous)</label>
        <canvas
          ref={canvasRef}
          className="esp-sign-canvas"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
        <div className="esp-row" style={{ justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <button className="esp-link-btn" style={{ marginTop: 0 }} onClick={clear}>
            Effacer
          </button>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Bon pour accord — valeur d’engagement
          </span>
        </div>

        <div className="esp-row" style={{ gap: 8, marginTop: '1.5rem' }}>
          <button className="esp-btn esp-btn-ghost" onClick={onCancel} style={{ flex: 1 }}>
            Annuler
          </button>
          <button
            className="esp-btn esp-btn-accent"
            onClick={confirm}
            disabled={!nom.trim() || vide}
            style={{ flex: 2 }}
          >
            Valider ma signature
          </button>
        </div>
      </div>
    </div>
  )
}
