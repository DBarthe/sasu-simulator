import classNames from "classnames";
import React, { InputHTMLAttributes, useState, useCallback, useEffect } from "react";
import * as Yup from "yup";
import { TypeOf } from "yup";
import { SimulationSettings } from "../models";
import styles from "../styles/SettingsControls.module.css";
import Switch, { SwitchPosition } from "./Switch";

const schema = Yup.object().shape({
  tjm: Yup.number().min(0).required(),
  joursParMois: Yup.number().min(0).required(),
  autresRevenusAnnuels: Yup.number().min(0).required(),
  autresRevenusMensuels: Yup.number().min(0).required(),
  fraisAnnuels: Yup.number().min(0).required(),
  fraisMensuels: Yup.number().min(0).required(),
  miseEnReserve: Yup.number().min(0).required(),
  dividendesReserve: Yup.number().min(0).required(),
  autresRevenusImposables: Yup.number().min(0).required(),
});

interface ValueInputProps {
  name: string;
  title: string;
  unit: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  invalid?: boolean;
}

function ValueInput({
  name,
  title,
  unit,
  inputProps,
  invalid,
}: ValueInputProps) {
  return (
    <>
      <label className={styles.label}>
        <div
          className={classNames(
            styles.inputTitle,
            invalid ? styles.invalid : ""
          )}
        >
          {title}
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            className={classNames(
              styles.input,
              styles.number,
              invalid ? styles.invalid : ""
            )}
            name={name}
            width={1}
            {...inputProps}
          />
          <div className={styles.inputUnit}>{unit}</div>
        </div>
      </label>
    </>
  );
}

function computeCa(values: TypeOf<typeof schema>): number {
  return (
    values.tjm * values.joursParMois * 12 +
    values.autresRevenusAnnuels +
    values.autresRevenusMensuels * 12
  );
}

function computeFrais(values: TypeOf<typeof schema>): number {
  return values.fraisAnnuels + values.fraisMensuels * 12;
}

function convertValuesToSettings(
  values: TypeOf<typeof schema>
): SimulationSettings {
  return {
    ca: {
      total: computeCa(values),
    },
    frais: {
      total: computeFrais(values),
    },
    reserve: {
      total: values.miseEnReserve,
    },
    dividendesReserve: values.dividendesReserve,
    autresRevenusImposables: values.autresRevenusImposables,
  };
}

interface SettingsControlsProps {
  onChange: (input: SimulationSettings | null) => any;
  displayMonthly: boolean;
  setDisplayMonthly: (value: boolean) => any
}

export default function SettingsControls({ onChange, displayMonthly, setDisplayMonthly }: SettingsControlsProps) {
  const [values, setValues] = useState({
    tjm: 400,
    joursParMois: 18,
    autresRevenusAnnuels: 0,
    autresRevenusMensuels: 0,
    fraisAnnuels: 2000,
    fraisMensuels: 500,
    miseEnReserve: 1000,
    dividendesReserve: 0,
    autresRevenusImposables: 0,
  });

  const [errors, setErrors] = useState<{ [field: string]: boolean }>({});

  const handleValidate = useCallback(() => {
    try {
      schema.validateSync(values, { abortEarly: false });
      setErrors({});
      onChange(convertValuesToSettings(schema.cast(values)));
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        const newErrors = {};
        for (const innerError of exception.inner) {
          if (innerError.path) {
            newErrors[innerError.path] = true;
          }
        }
        setErrors(newErrors);
      } else {
        throw exception;
      }
    }
  }, [values, onChange]);

  const handleChange = useCallback((event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  }, []);

  useEffect(() => {}, [values]);

  useEffect(handleValidate, [values]);

  const inputShorthand = (name, title, unit) => (
    <ValueInput
      name={name}
      title={title}
      unit={unit}
      invalid={errors[name]}
      inputProps={{
        onChange: handleChange,
        value: values[name],
      }}
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        {inputShorthand("tjm", "Taux journalier", "€/jour")}
        {inputShorthand("joursParMois", "Nombre de jours", "jour/mois")}
      </div>

      <div className={styles.group}>
        {inputShorthand("autresRevenusAnnuels", "Autres gains annuels", "€/an")}
        {inputShorthand(
          "autresRevenusMensuels",
          "Autres gains mensuels",
          "€/mois"
        )}
      </div>

      <div className={styles.group}>
        {inputShorthand("fraisAnnuels", "Frais annuels", "€/an")}
        {inputShorthand("fraisMensuels", "Frais mensuels", "€/mois")}
      </div>

      <div className={styles.group}>
        {inputShorthand("miseEnReserve", "Mise en réserve", "€")}
        {inputShorthand(
          "dividendesReserve",
          "Dividende pris sur la réserve",
          "€"
        )}
      </div>

      <div className={styles.group}>
        {inputShorthand(
          "autresRevenusImposables",
          "Autres revenus imposables",
          "€/an"
        )}
        <Switch
          position={displayMonthly ? SwitchPosition.L : SwitchPosition.R}
          setPosition={(position) => {
            setDisplayMonthly(position === SwitchPosition.L);
          }}
          labels={["Mensuel", "Annuel"]}
        />
      </div>
    </div>
  );
}
