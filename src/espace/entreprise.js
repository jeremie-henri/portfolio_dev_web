// Informations légales de l'entreprise — utilisées sur les devis et factures.
// ⚠️ Complète ADRESSE avec ta rue + code postal (mention obligatoire sur les factures).
export const ENTREPRISE = {
  nom: 'Jérémie Henri',
  formeJuridique: 'Entrepreneur individuel (EI)',
  activite: 'Développeur web indépendant',
  adresse: '8 avenue Marc Baron, 83430 Saint-Mandrier-sur-Mer',
  ville: 'Saint-Mandrier-sur-Mer',
  siren: '107 342 875',
  email: 'jeremiehenri99@gmail.com',
  site: 'jeremiehenri.fr',
  // Régime micro-entreprise : franchise en base de TVA
  mentionTva: 'TVA non applicable, art. 293 B du CGI',
  // Mentions obligatoires B2B (pénalités de retard)
  mentionPaiement:
    'Paiement à réception. Tout retard de paiement entraîne une pénalité égale à 3 fois le taux ' +
    "d'intérêt légal ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €.",
}
