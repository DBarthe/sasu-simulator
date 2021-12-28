import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Comlink from "comlink";
import {
  SalairesDict,
  SimulationOutput,
  SimulationOutputItem,
  SimulationSettings,
} from "../models";
import styles from "../styles/MainGui.module.css";
import { WorkerApi } from "../worker";
import DetailsTable from "./DetailsTable";
import { KpiView } from "./KpiView";
import { Controls } from "./Controls";
import VisualizationView from "./VisualizationView";

interface MainGuiProps {
  salairesDict: SalairesDict;
}

export default function MainGui({ salairesDict }: MainGuiProps) {
  const [settings, setSettings] = useState<SimulationSettings>(null);
  const [output, setOutput] = useState<SimulationOutput>(null);
  const [maxBrut, setMaxBrut] = useState<number>(null);
  const [currentBrut, setCurrentBrut] = useState<number>(0);
  const [displayMonthly, setDisplayMonthly] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<SimulationOutputItem>(null);

  const workerApiRef = useRef<Comlink.Remote<WorkerApi>>();
  useEffect(() => {
    workerApiRef.current = Comlink.wrap<WorkerApi>(
      new Worker(new URL("../worker.ts", import.meta.url))
    );
  }, []);

  const run = useCallback(async () => {
    console.log("run simulation");
    const newOuput = await workerApiRef.current.run(settings, salairesDict);
    setOutput(newOuput);
  }, [settings, salairesDict]);

  // trigger simulation when settings changed
  useEffect(() => {
    if (settings === null) {
      setOutput(null);
      return;
    }
    run();
  }, [settings]);

  // when simulation output has changed, update the maxBrut state value
  useEffect(() => {
    console.log("update max brut");
    if (output === null || output.items.length === 0) {
      setMaxBrut(null);
      return;
    }
    setMaxBrut(output.items[output.items.length - 1].salaire.brut);
  }, [output]);

  // when output or currentBrut changed, set the current item
  useEffect(() => {
    if (output && output.itemsByBrut[currentBrut]) {
      setCurrentItem(output.itemsByBrut[currentBrut]);
    } else {
      setCurrentItem(null);
    }
  }, [currentBrut, output]);

  return (
    <div className={styles.guiContainer}>
      <Controls
        maxBrut={maxBrut}
        setSettings={setSettings}
        currentBrut={currentBrut}
        setCurrentBrut={setCurrentBrut}
        displayMonthly={displayMonthly}
        setDisplayMonthly={setDisplayMonthly}
      />
      <div className={styles.viewContainer}>
        <div className={styles.kpiContainer}>
          {currentItem ? (
            <KpiView item={currentItem} displayMonthly={displayMonthly} />
          ) : (
            ""
          )}
        </div>
        <div className={styles.visualizationContainer}>
          {output ? <VisualizationView output={output} currentBrut={currentBrut}/> : ""}
        </div>
      </div>
      <div className={styles.detailsContainer}>
        {currentItem ? <DetailsTable item={currentItem} /> : ""}
      </div>
    </div>
  );
}
