import Head from 'next/head';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import SimulationForm from '../components/SimulationForm';
import * as Comlink from 'comlink'
import { WorkerApi } from '../worker';
import { SimulationOutput } from '../models';
import ResultsTable from '../components/ResultsTable';
import styles from '../styles/Index.module.css'


export default function Home() {


  const [output, setOutput] = useState<SimulationOutput>(null)
  const tableRef = useRef(null);
  const formRef  = useRef(null);

  const workerApiRef = useRef<Comlink.Remote<WorkerApi>>()
  useEffect(() => {
    workerApiRef.current = Comlink.wrap<WorkerApi>(new Worker(new URL('../worker.ts', import.meta.url)))
  }, [])


  const run = useCallback(async (input) => {
    setOutput(null)
    const newOutput = await workerApiRef.current.run(input);
    setOutput(newOutput)
    tableRef?.current.scrollIntoView()
  }, [setOutput, tableRef])

  const scrollDown = useCallback(() => {
    formRef?.current.scrollIntoView(formRef)
  }, [formRef])

  return (
    <>
      <Head>
        <title>Simulateur de SASU</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.fixedBackgroudImage}></div>
      <div className={styles.fixedBackgroudGradient}></div>


      <Header onClickScrollDown={scrollDown}/>
      <div ref={formRef} className={styles.formContainer}>
        <SimulationForm onSubmit={run} />
      </div>
      <div ref={tableRef}>
        {output && <ResultsTable output={output} />}
      </div>

    </>
  )
}