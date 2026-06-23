// src/types/index.ts
// Types partagés dans tout le projet

// ─── Projets ──────────────────────────────────────────────────
export interface Project {
  id: number
  emoji: string
  title: string
  desc: string
  stack: string[]
  github: string
  demo: string | null
  gradient: string
  badge: string
  badgeColor: string
}

// ─── Services ─────────────────────────────────────────────────
export interface Service {
  id: number
  emoji: string
  title: string
  subtitle: string
  price: string
  accentColor: string
  demo: string
  demoLabel: string
  preview: string
  gradient: string
  badge?: string
  desc: string
  features: string[]
  cibles: string[]
}

// ─── Formulaire de contact ────────────────────────────────────
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

// ─── Navigation ───────────────────────────────────────────────
export interface NavLink {
  label: string
  href: string
}

// ─── Témoignages ──────────────────────────────────────────────
export interface Testimonial {
  name: string
  role: string
  stars: number
  text: string
  avatar: string
  color: string
}

// ─── Statistiques ─────────────────────────────────────────────
export interface Stat {
  num: string
  label: string
  color: string
}

// ─── Compétences ──────────────────────────────────────────────
export interface Skill {
  icon: string
  name: string
  level: number
  cat: string
}

// ─── Réponse API ──────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  error?: string
  data?: T
}
