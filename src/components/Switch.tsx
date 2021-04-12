import classNames from "classnames";
import { useCallback } from "react";
import styles from "../styles/Switch.module.css";

export enum SwitchPosition {
  L = 0,
  R = 1,
}

interface SwitchProps {
  position: SwitchPosition;
  setPosition: (position: SwitchPosition) => any;
  labels: [string, string];
}

export default function Switch({ labels, position, setPosition }: SwitchProps) {
  const handleChange = useCallback((event) => {}, []);

  return (
    <div className={styles.container}>
      <span
        className={
          position === SwitchPosition.L
            ? styles.labelSelected
            : styles.labelUnselected
        }
      >
        {labels[0]}
      </span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={position === SwitchPosition.L}
          onChange={(event) =>
            setPosition(
              event.target.checked ? SwitchPosition.L : SwitchPosition.R
            )
          }
        />
        <span className={classNames(styles.slider, styles.round)} />
      </label>
      <span
        className={
          position === SwitchPosition.R
            ? styles.labelSelected
            : styles.labelUnselected
        }
      >
        {labels[1]}
      </span>
    </div>
  );
}
