import Engine from "publicodes";
import rules from "modele-social";
import { configIS, configIR, configDividende, configSalaires } from "./config";
import { SimulationSettings, Salaire, Benefices, Dividendes, Impots, SimulationOutputItem, SimulationOutput, SalairesDict } from "./models";


function round2dec(num: number): number {
  return Math.round((num));
}


function evaluateEurPerMonth(engine: Engine, name: string): number {

  const node = engine.evaluate(name);
  const value = node.nodeValue as number;
  return node.unit.denominators[0] === "mois" ? value * 12 : value;
}

function calculateIS(brut: number): number {

  if (brut <= configIS.tranche1) {
    return brut * (1 - configIS.taux1)
  }
  else {
    return configIS.tranche1 * (1 - configIS.taux1) + (brut - configIS.tranche1) * (1 - configIS.taux2)
  }
}

function calculateInverseIS(net: number): number {


  if (net <= configIS.tranche1 * (1 - configIS.taux1)) {
    return net / (1 - configIS.taux1)
  }
  else {
    return configIS.tranche1 + (net - configIS.tranche1 * (1 - configIS.taux1)) / (1 - configIS.taux2)
  }
}



function calculateBenefices(settings: SimulationSettings, salaire: Salaire): Benefices {

  const brut = settings.ca.total - settings.frais.total - salaire.superBrut
  const net = round2dec(calculateIS(brut))
  const is = brut - net
  const taux = is / brut
  return {
    brut, net, is, taux
  }
}



function calculateImpots(settings: SimulationSettings, salaire: Salaire, dividendes: Dividendes): Impots {

  const avant = salaire.net + dividendes.net + settings.autresRevenusImposables
  const imposable = salaire.netFiscal + dividendes.imposable + settings.autresRevenusImposables

  const [tranche1, tranche2, tranche3, tranche4] = configIR.tranches
  const [taux1, taux2, taux3, taux4, taux5] = configIR.taux

  let montant = 0;
  if (imposable <= tranche1) {
    montant = imposable * taux1
  }
  else if (imposable <= tranche2) {
    montant = tranche1 * taux1 + (imposable - tranche1) * taux2
  }
  else if (imposable <= tranche3) {
    montant = tranche1 * taux1 + (tranche2 - tranche1) * taux2 + (imposable - tranche2) * taux3
  }
  else if (imposable <= tranche4) {
    montant = tranche1 * taux1 + (tranche2 - tranche1) * taux2 + (tranche3 - tranche2) * taux3 + (imposable - tranche3) * taux4
  }
  else {
    montant = tranche1 * taux1 + (tranche2 - tranche1) * taux2 + (tranche3 - tranche2) * taux3 + (tranche4 - tranche3) * taux4 + (imposable - tranche4) * taux5
  }

  montant = round2dec(montant)

  const taux = montant / imposable
  const apres = avant - montant

  return {
    autreImposable: settings.autresRevenusImposables,
    avant,
    imposable,
    montant,
    taux,
    apres
  }
}

function calculateDividendesBaremeProg(depuisBenefice: number, depuisReserve: number): Dividendes {

  const brut = depuisBenefice + depuisReserve
  const prelevementsSociaux = brut * configDividende.prelevementsSociaux
  const pfuImpotsRevenu = 0
  const abattement = brut * configDividende.abattement
  const csgDeduite = brut * configDividende.csgDeductible
  const imposable = brut - abattement - csgDeduite
  const net = brut - prelevementsSociaux

  return {
    option: "barème progressif",
    brut,
    imposable,
    csgDeduite,
    abattement,
    prelevementsSociaux,
    pfuImpotsRevenu,
    net,
    depuisBenefice,
    depuisReserve,
    optionDifference: 0
  }
}

function calculateDividendesFlatTaxe(depuisBenefice: number, depuisReserve: number): Dividendes {

  const brut = depuisBenefice + depuisReserve
  const prelevementsSociaux = brut * configDividende.prelevementsSociaux
  const pfuImpotsRevenu = brut * configDividende.pfuImpotsRevenu
  const imposable = 0
  const abattement = 0
  const csgDeduite = 0
  const net = brut - prelevementsSociaux - pfuImpotsRevenu

  return {
    option: "flat taxe 30%",
    brut,
    imposable,
    csgDeduite,
    abattement,
    prelevementsSociaux,
    pfuImpotsRevenu,
    net,
    depuisBenefice,
    depuisReserve,
    optionDifference: 0
  }
}

function runSimulationItem(settings: SimulationSettings, salaire : Salaire): SimulationOutputItem {

  const benefices = calculateBenefices(settings, salaire)

  const reserve = {
    total: Math.min(settings.reserve.total, benefices.brut)
  }

  const dividendesDepuisBenefice = benefices.net - reserve.total
  const dividendesOptFlatTaxe = calculateDividendesFlatTaxe(dividendesDepuisBenefice, settings.dividendesReserve)
  const dividendesOptProg = calculateDividendesBaremeProg(dividendesDepuisBenefice, settings.dividendesReserve)

  const impotsOptFlatTaxe = calculateImpots(settings, salaire, dividendesOptFlatTaxe)
  const impotsOptProg = calculateImpots(settings, salaire, dividendesOptProg)

  let dividendes, impots;
  if (impotsOptProg.apres > impotsOptFlatTaxe.apres) {
    dividendes = dividendesOptProg
    impots = impotsOptProg
  }
  else {
    dividendes = dividendesOptFlatTaxe
    impots = impotsOptFlatTaxe
  }
  dividendes.optionDifference = Math.abs(impotsOptProg.apres - impotsOptFlatTaxe.apres)

  return {
    ca: settings.ca,
    frais: settings.frais,
    salaire,
    benefices,
    reserve,
    dividendes,
    impots,
    rendement: impots.apres / settings.ca.total
  }
}

export function runSimulation(settings: SimulationSettings, salairesDict: SalairesDict): SimulationOutput {

  const minimumBeneficeBrut = Math.ceil(calculateInverseIS(settings.reserve.total))
  const superBrutMax = settings.ca.total - settings.frais.total - minimumBeneficeBrut

  const items = [];  
  let brut = 0;
  let salaire = salairesDict[brut]
  while (salaire && salaire.superBrut <= superBrutMax) {
    items.push(runSimulationItem(settings, salaire))
    brut += configSalaires.brutInterval;
    salaire = salairesDict[brut]
  }

  return {
    items
  }
}


function calculateSalaire(brut: number, engine: Engine) : Salaire {
  if (brut === 0) {
    return {
      superBrut: 0,
      brut: 0,
      net: 0,
      cotisation: {
        total: 0,
        partPatronale: 0,
        partSalariale: 0
      },
      netFiscal: 0
    };
  }

    engine
      .setSituation({
        "contrat salarié . rémunération . brut": `${brut} €/an`,
        "dirigeant": "'assimilé salarié'",
        "contrat salarié . activité partielle": "non"
      })

    return {
      superBrut: round2dec(evaluateEurPerMonth(engine, "contrat salarié . rémunération . total")),
      brut: brut,
      net: round2dec(evaluateEurPerMonth(engine, "contrat salarié . rémunération . net")),
      cotisation: {
        total: round2dec(evaluateEurPerMonth(engine, "contrat salarié . cotisations")),
        partPatronale: round2dec(evaluateEurPerMonth(engine, "contrat salarié . cotisations . patronales")),
        partSalariale: round2dec(evaluateEurPerMonth(engine, "contrat salarié . cotisations . salariales"))
      },
      netFiscal: round2dec(evaluateEurPerMonth(engine, "contrat salarié . rémunération . net imposable"))
    };
}

export function calculateAllSalaires() : SalairesDict {

  const engine = new Engine(rules);

  const dict : SalairesDict = {};


  for (let brut = 0; brut <= configSalaires.brutMax; brut += configSalaires.brutInterval) {
    dict[brut] = calculateSalaire(brut, engine)   
  }

  return dict;
}