import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 140
const DEPTH = 300

export default function HeroBackground3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ─── Scène ───────────────────────────────────────────────────
    const W = el.clientWidth
    const H = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 1)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000)
    camera.position.z = 400

    // ─── Particules ───────────────────────────────────────────────
    const positions = []
    const velocities = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * W * 1.2,
        (Math.random() - 0.5) * H * 1.2,
        (Math.random() - 0.5) * DEPTH,
      )
      velocities.push(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.1,
      )
    }

    const geo = new THREE.BufferGeometry()
    const posArr = new Float32Array(positions)
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.5,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // ─── Lignes ───────────────────────────────────────────────────
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    })
    const lineGeo = new THREE.BufferGeometry()
    const maxLines = PARTICLE_COUNT * PARTICLE_COUNT
    const linePos = new Float32Array(maxLines * 6)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineSegments)

    // ─── Souris ───────────────────────────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 80
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * -40
    }
    const onTouch = (e) => {
      if (!e.touches[0]) return
      mouse.tx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 80
      mouse.ty = (e.touches[0].clientY / window.innerHeight - 0.5) * -40
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })

    // ─── Resize ───────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ─── Animation ────────────────────────────────────────────────
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Smooth mouse follow
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      scene.rotation.y = mouse.x * 0.008
      scene.rotation.x = mouse.y * 0.008

      // Déplace les particules
      const pos = geo.attributes.position.array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        pos[i3]     += velocities[i3]
        pos[i3 + 1] += velocities[i3 + 1]
        pos[i3 + 2] += velocities[i3 + 2]
        // Rebond sur les bords
        if (Math.abs(pos[i3])     > W * 0.7)  velocities[i3]     *= -1
        if (Math.abs(pos[i3 + 1]) > H * 0.7)  velocities[i3 + 1] *= -1
        if (Math.abs(pos[i3 + 2]) > DEPTH / 2) velocities[i3 + 2] *= -1
      }
      geo.attributes.position.needsUpdate = true

      // Connexions entre particules proches
      let lIdx = 0
      for (let a = 0; a < PARTICLE_COUNT; a++) {
        for (let b = a + 1; b < PARTICLE_COUNT; b++) {
          const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2]
          const bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2]
          const dist = Math.sqrt((ax-bx)**2 + (ay-by)**2 + (az-bz)**2)
          if (dist < CONNECTION_DISTANCE) {
            linePos[lIdx++] = ax; linePos[lIdx++] = ay; linePos[lIdx++] = az
            linePos[lIdx++] = bx; linePos[lIdx++] = by; linePos[lIdx++] = bz
          }
        }
      }
      // Vider le reste
      for (let k = lIdx; k < linePos.length; k++) linePos[k] = 0
      lineGeo.attributes.position.needsUpdate = true
      lineGeo.setDrawRange(0, lIdx / 3)
      lineMat.opacity = 0.12

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 0,
        width: '100%', height: '100%', pointerEvents: 'none',
      }}
    />
  )
}
