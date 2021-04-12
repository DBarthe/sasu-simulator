import React from "react";
import styles from "../styles/Controls.module.css";
import SettingsControls from "./SettingsControls";
import SalaryControls from "./SalaryControls";
import Switch, { SwitchPosition } from "./Switch";

export function Controls({
  setSettings,
  currentBrut,
  setCurrentBrut,
  maxBrut,
  displayMonthly,
  setDisplayMonthly,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.settings}>
        <SettingsControls
          onChange={setSettings}
          displayMonthly={displayMonthly}
          setDisplayMonthly={setDisplayMonthly}
        />
      </div>

      <div className={styles.salary}>
        {maxBrut && (
          <SalaryControls
            max={maxBrut}
            current={currentBrut}
            setCurrent={setCurrentBrut}
            displayMonthly={displayMonthly}
          />
        )}
      </div>
    </div>
  );
}
