// src/utils/api/email.ts
// Appels API email — backend Vercel Functions (clés jamais exposées côté client)

import type { ContactFormData, ApiResponse } from '../../types'

/**
 * Envoie le formulaire de contact via notre API Vercel
 * (jamais via EmailJS directement depuis le client — clé protégée côté serveur)
 */
export async function sendContactForm(data: ContactFormData): Promise<ApiResponse> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error ?? 'Erreur inconnue')
  }

  return json
}

/**
 * Valide les données du formulaire avant envoi
 */
export function validateContactForm(data: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.name.trim()) {
    errors.name = 'Le nom est requis'
  }

  if (!data.email.trim()) {
    errors.email = "L'email est requis"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email invalide'
  }

  if (!data.message.trim()) {
    errors.message = 'Le message est requis'
  } else if (data.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères'
  }

  return errors
}
