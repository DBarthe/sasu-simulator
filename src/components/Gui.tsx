import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Comlink from 'comlink'
import { SalairesDict, SimulationOutput, SimulationSettings } from "../models";
import styles from "../styles/MainGui.module.css";
import { WorkerApi } from "../worker";
import SettingsControls from "./SettingsControls";

interface MainGuiProps {
  salairesDict: SalairesDict
}

function ControlsGui({settings, setSettings}) {
  return (
    <div className={styles.controlsContainer}>
      <SettingsControls onChange={setSettings}/>
      {/* { settings && <SalaryControls settings={settings} />} */}
      <div className={styles.fineTuningContainer}></div>
    </div>
  );
}

export default function MainGui({salairesDict}: MainGuiProps) {

  const [settings, setSettings] = useState<SimulationSettings>(null);
  const [output, setOutput] = useState<SimulationOutput>(null);

  const workerApiRef = useRef<Comlink.Remote<WorkerApi>>()
  useEffect(() => {
    workerApiRef.current = Comlink.wrap<WorkerApi>(new Worker(new URL('../worker.ts', import.meta.url)))
  }, [])

  const run = useCallback(async () => {
    console.log("run simulation")
    const newOuput = await workerApiRef.current.run(settings, salairesDict);
    setOutput(output)
  }, [settings, salairesDict])


  useEffect(() => {
    if (settings === null) {
      setOutput(null)
      return ;
    }
    run()
  }, [settings])

  return (
    <div className={styles.guiContainer}>
      <ControlsGui settings={settings} setSettings={setSettings} />
      <div className={styles.viewContainer}></div>
      <div className={styles.detailsContainer}></div>
    </div>
  );
}
