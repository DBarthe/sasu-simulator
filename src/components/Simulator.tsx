import * as Comlink from 'comlink';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateCa, calculateFrais } from "../core";
import { ChiffreAffaires, ChiffreAffairesInput, Frais, FraisInput, Reserve, SimulationInput, SimulationOutput } from "../models";
import styles from '../styles/Simulator.module.css';
import { formatEuro } from "../utils";
import { WorkerApi } from "../worker";
import Loader from "./Loader";
import ResultsTable from "./ResultsTable";


function NumberInput(props: { label: string, value: number, setValue: (value: number) => void }) {
  return (
    <div>
      <label>{props.label}</label>
      <input size={10} value={props.value} onChange={({ target }) => props.setValue(Number(target.value))} />
    </div>
  )
}

function EuroOutput(props: { label: string, value: number }) {
  return (
    <div>
      <div>{props.label}</div>
      <div>{formatEuro(props.value)}/an</div>
    </div>
  )
}

export default function Simulator() {


  const [caInput, setCaInput] = useState<ChiffreAffairesInput>({
    tjm: 400,
    joursParMois: 18,
    autreMensuel: 0,
    autreAnnuel: 0
  })

  const ca = useMemo<ChiffreAffaires>(() => calculateCa(caInput), [caInput])

  const [fraisInput, setFraisInput] = useState<FraisInput>({
    annuel: 2000,
    mensuel: 500
  })

  const frais = useMemo<Frais>(() => calculateFrais(fraisInput), [fraisInput])


  const [reserve, setReserve] = useState<Reserve>({
    total: 1000
  })

  const [dividendesReserve, setDividendeReserve] = useState<number>(0);

  const [autresRevenusImposables, setAutresRevenuesImposables] = useState<number>(0)

  const simulationInput = useMemo<SimulationInput>(() => ({
    ca, frais, reserve, dividendesReserve, autresRevenusImposables
  }), [ca, frais, reserve, dividendesReserve, autresRevenusImposables])

  const [simulationOutput, setSimulationOutput] = useState<SimulationOutput>()

  const tableRef = useRef(null);

  const workerApiRef = useRef<Comlink.Remote<WorkerApi>>()
  useEffect(() => {
    workerApiRef.current = Comlink.wrap<WorkerApi>(new Worker(new URL('../worker.ts', import.meta.url)))
  }, [])

  const [loading, setLoading] = useState<boolean>(false)

  const runSimulation = useCallback(async () => {
    setSimulationOutput(null)
    setLoading(true)
    const output = await workerApiRef.current.run(simulationInput);
    setSimulationOutput(output)
    setLoading(false)
    tableRef?.current.scrollIntoView()
  }, [simulationInput, setSimulationOutput, tableRef])

  return <>


      <div>
        <h2>
          Produits
        </h2>
        <NumberInput label="JJM" value={caInput.tjm} setValue={value => setCaInput(state => ({ ...state, tjm: value }))} />


        <NumberInput label="Jours par mois" value={caInput.joursParMois} setValue={value => setCaInput(state => ({ ...state, joursParMois: value }))} />
        <NumberInput label="Autres revenus annuels" value={caInput.autreAnnuel} setValue={value => setCaInput(state => ({ ...state, autreAnnuel: value }))} />
        <NumberInput label="Autres revenus mensuels" value={caInput.autreMensuel} setValue={value => setCaInput(state => ({ ...state, autreMensuel: value }))} />
        <EuroOutput label="Total" value={ca.total} />
    </div>

    <div>
      <h2>Charges</h2>
      <NumberInput label="Frais annuels" value={fraisInput.annuel} setValue={value => setFraisInput(state => ({ ...state, annuel: value }))} />
      <NumberInput label="Frais mensuels" value={fraisInput.mensuel} setValue={value => setFraisInput(state => ({ ...state, mensuel: value }))} />
      <EuroOutput label="Total" value={frais.total} />
    </div>

    <div>
      <h2>Bilan</h2>
      <NumberInput label="Mise en réserve" value={reserve.total} setValue={value => setReserve(state => ({ ...state, total: value }))} />
      <NumberInput label="Dividendes à prélever sur la réserve" value={dividendesReserve} setValue={value => setDividendeReserve(value)} />

    </div>

    <div>
      <h2>Impôts</h2>
      <NumberInput label="Autres revenus imposables" value={autresRevenusImposables} setValue={value => setAutresRevenuesImposables(value)} />
    </div>
    { loading ? <Loader /> : <button  onClick={runSimulation}>Lancer la simulation</button>}


    <div className={styles.containerResults} ref={tableRef}>
      {simulationOutput && <ResultsTable output={simulationOutput} />}
    </div>
  </>
}
