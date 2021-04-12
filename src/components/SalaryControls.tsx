import { useEffect } from "react";
import { configSalaires } from "../config";
import { formatEuroNoUnit } from "../utils";
import styles from "../styles/SalaryControls.module.css";

interface SalaryControlsProps {
  max: number;
  current: number;
  setCurrent: (value: number) => any;
  displayMonthly: boolean;
}

export default function SalaryControls({
  max,
  current,
  setCurrent,
  displayMonthly,
}: SalaryControlsProps) {
  // when the max changed, ensure the current brut is below or equal
  useEffect(() => {
    if (current > max) {
      setCurrent(max);
    }
  }, [max]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Salaire brut</div>

      <input
        className={styles.input}
        type="range"
        min={0}
        max={max}
        value={current}
        step={configSalaires.brutInterval}
        onChange={(event) => setCurrent(+event.target.value)}
      />
      <div className={styles.amount}>
        {formatEuroNoUnit(displayMonthly ? current / 12 : current)}
      </div>
      <div className={styles.unit}>€/{displayMonthly ? "mois" : "an"}</div>
    </div>
  );
}
