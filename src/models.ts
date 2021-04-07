export interface ChiffreAffairesInput {
  tjm: number;
  joursParMois: number;
  autreMensuel: number;
  autreAnnuel: number;
}

export interface FraisInput {
  mensuel: number
  annuel: number
}

export interface SalaireInput {
  percent: number
}

export interface ChiffreAffaires {
  total: number
}

export interface Frais {
  total: number
}

export interface Salaire {
  superBrut: number
  brut: number
  net: number
  netFiscal: number
  cotisation: Cotisation
}

export interface Cotisation {
  total: number
  partSalariale: number
  partPatronale: number
}

export interface Reserve {
  total: number
}

export interface SimulationInput {
  ca: ChiffreAffaires
  frais: Frais
  reserve: Reserve
  dividendesReserve: number
  autresRevenusImposables: number
}

export interface Benefices {
  brut: number
  net: number
  is: number
  taux: number
}


export interface Dividendes {
  option: string
  brut: number
  depuisBenefice: number
  depuisReserve: number
  net: number
  imposable: number
  csgDeduite: number
  abattement: number
  prelevementsSociaux: number
  pfuImpotsRevenu: number
  optionDifference: number
}

export interface Impots {
  autreImposable: number
  avant: number
  imposable: number
  montant: number
  taux: number
  apres: number
}

export interface SimulationOutputItem {
  ca: ChiffreAffaires
  frais: Frais
  salaire: Salaire
  benefices: Benefices
  reserve: Reserve
  dividendes: Dividendes
  impots: Impots
  rendement: number
}

export interface SimulationOutput {
  items: SimulationOutputItem[]
}