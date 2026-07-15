export type CompanionRelation = 'favorable' | 'avoid'

export interface CompanionPair {
  a: string
  b: string
  relation: CompanionRelation
  reason: string
}

/**
 * Hand-curated from common companion-planting knowledge — not derived from
 * the source CSV (no such data existed there). Covers well-established pairs
 * among the catalog's common vegetables/aromatics. Not exhaustive; extend as
 * needed. Same-family avoidance (crop rotation) is a separate fallback rule,
 * not listed here explicitly.
 */
export const COMPANION_PAIRS: CompanionPair[] = [
  { a: 'Tomate', b: 'Basilic', relation: 'favorable', reason: 'Le basilic éloignerait certains insectes et améliorerait la saveur des tomates.' },
  { a: 'Tomate', b: "Œillet d'Inde (Tagète)", relation: 'favorable', reason: 'Les tagètes repoussent les nématodes du sol.' },
  { a: 'Tomate', b: 'Persil', relation: 'favorable', reason: 'Association classique, favoriserait la croissance des deux.' },
  { a: 'Tomate', b: 'Capucine', relation: 'favorable', reason: 'La capucine sert de plante-piège contre les pucerons.' },
  { a: 'Tomate', b: 'Pomme de terre', relation: 'avoid', reason: 'Même famille (Solanacées), risque de mildiou partagé.' },
  { a: 'Tomate', b: 'Fenouil', relation: 'avoid', reason: 'Le fenouil inhibe la croissance de nombreuses plantes voisines.' },
  { a: 'Tomate', b: 'Maïs doux', relation: 'avoid', reason: 'Sensibilité croisée à certains vers/chenilles (noctuelles).' },

  { a: 'Carotte', b: 'Poireau', relation: 'favorable', reason: 'Répulsion croisée de la mouche de la carotte et de la teigne du poireau.' },
  { a: 'Carotte', b: 'Oignon', relation: 'favorable', reason: "L'oignon repousse la mouche de la carotte." },
  { a: 'Carotte', b: 'Fenouil', relation: 'avoid', reason: 'Le fenouil inhiberait la levée et la croissance des carottes.' },

  { a: 'Chou pommé', b: 'Aneth', relation: 'favorable', reason: "Attire des insectes auxiliaires, aide contre la piéride du chou." },
  { a: 'Chou pommé', b: 'Céleri branche', relation: 'favorable', reason: 'Le céleri éloignerait la piéride du chou.' },
  { a: 'Chou pommé', b: 'Sauge', relation: 'favorable', reason: 'La sauge repousserait la piéride du chou.' },
  { a: 'Chou pommé', b: 'Romarin', relation: 'favorable', reason: 'Le romarin repousserait la piéride du chou.' },
  { a: 'Chou pommé', b: 'Fraisier', relation: 'avoid', reason: 'Compétition et sensibilité croisée aux ravageurs.' },
  { a: 'Chou-fleur', b: 'Céleri branche', relation: 'favorable', reason: 'Le céleri éloignerait la piéride du chou.' },

  { a: 'Concombre', b: 'Aneth', relation: 'favorable', reason: "Attire des insectes auxiliaires utiles au concombre." },
  { a: 'Concombre', b: 'Haricot vert', relation: 'favorable', reason: 'Le haricot enrichit le sol en azote, profitable au concombre.' },
  { a: 'Concombre', b: 'Maïs doux', relation: 'favorable', reason: 'Le maïs sert de tuteur/ombrage léger pour le concombre.' },
  { a: 'Concombre', b: 'Pomme de terre', relation: 'avoid', reason: 'Compétition hydrique et sensibilité croisée au mildiou.' },

  { a: 'Courgette', b: 'Capucine', relation: 'favorable', reason: 'La capucine sert de plante-piège contre les pucerons.' },
  { a: 'Maïs doux', b: 'Haricot vert', relation: 'favorable', reason: "Trio des trois sœurs : le maïs sert de tuteur au haricot." },
  { a: 'Maïs doux', b: 'Potiron/Citrouille', relation: 'favorable', reason: 'Trio des trois sœurs : le feuillage du potiron couvre le sol.' },
  { a: 'Haricot vert', b: 'Potiron/Citrouille', relation: 'favorable', reason: 'Trio des trois sœurs, association traditionnelle.' },

  { a: 'Haricot vert', b: 'Oignon', relation: 'avoid', reason: "Les alliacées inhiberaient la fixation d'azote des légumineuses." },
  { a: 'Haricot vert', b: 'Ail', relation: 'avoid', reason: "Les alliacées inhiberaient la fixation d'azote des légumineuses." },
  { a: 'Haricot vert', b: 'Échalote', relation: 'avoid', reason: "Les alliacées inhiberaient la fixation d'azote des légumineuses." },
  { a: 'Haricot vert', b: 'Fenouil', relation: 'avoid', reason: 'Le fenouil inhiberait la croissance du haricot.' },

  { a: 'Radis', b: 'Laitue', relation: 'favorable', reason: 'Le radis pousse vite et ameublit le sol pour la laitue.' },
  { a: 'Radis', b: 'Concombre', relation: 'favorable', reason: 'Le radis éloignerait certains coléoptères du concombre.' },
  { a: 'Laitue', b: 'Fraisier', relation: 'favorable', reason: 'Occupation complémentaire du sol, peu de compétition.' },

  { a: 'Oignon', b: 'Betterave rouge', relation: 'favorable', reason: 'Peu de compétition, bonne occupation du sol.' },
  { a: 'Poireau', b: 'Céleri branche', relation: 'favorable', reason: 'Association traditionnelle du potager.' },

  { a: 'Rosier', b: 'Ail', relation: 'favorable', reason: "L'ail planté au pied du rosier éloignerait les pucerons." },
  { a: 'Rosier', b: 'Lavande', relation: 'favorable', reason: 'La lavande éloignerait pucerons et certains insectes.' },

  { a: 'Aubergine', b: 'Haricot vert', relation: 'favorable', reason: 'Le haricot enrichit le sol en azote, profitable aux aubergines.' },
  { a: 'Aubergine', b: 'Pomme de terre', relation: 'avoid', reason: 'Même famille (Solanacées), sensibilité au mildiou partagée.' },

  { a: 'Betterave rouge', b: 'Haricot vert', relation: 'avoid', reason: 'Compétition connue, croissance mutuellement freinée.' },
]
