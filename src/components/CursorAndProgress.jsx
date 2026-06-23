import { useEffect } from 'react'

export default function CursorAndProgress() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const trail  = document.getElementById('cursor-trail')
    const bar    = document.getElementById('scroll-progress')
    if (!cursor || !trail || !bar) return

    const onMove = e => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
      setTimeout(() => {
        trail.style.left = e.clientX + 'px'
        trail.style.top  = e.clientY + 'px'
      }, 80)
    }

    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      bar.style.transform = `scaleX(${pct})`
    }

    const addHover = () => { cursor.classList.add('hovered'); trail.classList.add('hovered') }
    const remHover = () => { cursor.classList.remove('hovered'); trail.classList.remove('hovered') }

    document.querySelectorAll('a,button,[role="button"]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', remHover)
    })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}
