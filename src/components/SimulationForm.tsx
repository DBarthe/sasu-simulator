import classNames from 'classnames'
import { Formik, FormikErrors } from 'formik'
import * as Yup from 'yup';
import React, { InputHTMLAttributes } from 'react'
import styles from '../styles/SimulationForm.module.css'
import Loader from './Loader'
import { TypeOf } from 'yup';
import { SimulationSettings, SimulationOutput } from '../models';

interface ValueInputProps {
  name: string
  title: string
  unit: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  invalid?: string
}


function ValueInput({ name, title, unit, inputProps, invalid }: ValueInputProps) {

  return (
    <>
      <label className={classNames(styles.label)}>
        <div className={classNames(styles.inputTitle, invalid ? styles.invalid : "")}>{title}</div>
        <div className={styles.inputWrapper}>
          <input className={classNames(styles.input, styles.number, invalid ? styles.invalid : "")} name={name} width={1} {...inputProps} />
          <div className={styles.inputUnit}>{unit}</div>
        </div>
      </label>
    </>
  )
}

interface ValueOutputProps {
  title: string
  value: string
  unit: string
}

function ValueOutput({ title, value, unit }: ValueOutputProps) {
  return (
    <div className={styles.valueDisplayWrapper}>
      <div className={styles.valueDisplayTitle}>{title}</div>
      <div className={styles.valueDisplay}><span className={styles.number}>{value}</span> {unit}</div>
    </div>
  )
}

const FormSchema = Yup.object().shape({
  tjm: Yup.number().min(0).required(),
  joursParMois: Yup.number().min(0).required(),
  autresRevenusAnnuels: Yup.number().min(0).required(),
  autresRevenusMensuels: Yup.number().min(0).required(),
  fraisAnnuels: Yup.number().min(0).required(),
  fraisMensuels: Yup.number().min(0).required(),
  miseEnReserve: Yup.number().min(0).required(),
  dividendesReserve: Yup.number().min(0).required(),
  autresRevenusImposables: Yup.number().min(0).required()
})


function computeCa(values: TypeOf<typeof FormSchema>): number {
  return values.tjm * values.joursParMois * 12 + values.autresRevenusAnnuels + values.autresRevenusMensuels * 12
}

function computeFrais(values: TypeOf<typeof FormSchema>): number {
  return values.fraisAnnuels + values.fraisMensuels * 12
}

function convertValuesToSimulationInput(values: TypeOf<typeof FormSchema>): SimulationSettings {
  return {
    ca: {
      total: computeCa(values)
    },
    frais: {
      total: computeFrais(values)
    },
    reserve: {
      total: values.miseEnReserve
    },
    dividendesReserve: values.dividendesReserve,
    autresRevenusImposables: values.autresRevenusImposables
  }
}

function preComputeAndFormatCa(values: TypeOf<typeof FormSchema>, errors: FormikErrors<TypeOf<typeof FormSchema>>): string {

  if (errors.tjm || errors.joursParMois || errors.autresRevenusAnnuels || errors.autresRevenusMensuels) {
    return ""
  }
  const amount = Number(values.tjm) * Number(values.joursParMois) * 12 + Number(values.autresRevenusAnnuels) + Number(values.autresRevenusMensuels * 12)
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code'
  }).replace(/[a-z]{3}/i, "").trim()
}

function preComputeAndFormatFrais(values: TypeOf<typeof FormSchema>, errors: FormikErrors<TypeOf<typeof FormSchema>>): string {

  if (errors.fraisAnnuels || errors.fraisMensuels) {
    return ""
  }
  const amount = Number(values.fraisAnnuels) + Number(values.fraisMensuels) * 12
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code'
  }).replace(/[a-z]{3}/i, "").trim()
}


interface SimulationFormProps {

  onSubmit: (SimulationInput) => Promise<any>
}


export default function SimulationForm({ onSubmit }: SimulationFormProps) {

  return <>

    <Formik
      initialValues={FormSchema.cast({
        tjm: 400,
        joursParMois: 18,
        autresRevenusAnnuels: 0,
        autresRevenusMensuels: 0,
        fraisAnnuels: 2000,
        fraisMensuels: 500,
        miseEnReserve: 1000,
        dividendesReserve: 0,
        autresRevenusImposables: 0

      })}
      validationSchema={FormSchema}
      onSubmit={async (values, { setSubmitting }) => {
        values = FormSchema.cast(values);
        console.log(values)
        const inputData = convertValuesToSimulationInput(values)
        await onSubmit(inputData)
        setSubmitting(false)
      }}
    >

      {({ values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting, }) => (

        <form className={styles.container} onSubmit={handleSubmit}>

          <div className={classNames(styles.header)} style={{ gridArea: "header" }} >
            <h2>Paramétrage</h2>
          </div>

          <div className={classNames(styles.item, styles.pHeader)} style={{ gridArea: "p-header" }}>
            <h2>Produits</h2>
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.p1)} style={{ gridArea: "p-1" }}>
            <ValueInput name="tjm" title="Taux journalier" unit="€/jour" invalid={errors.tjm}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.tjm, }} />
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.p2)} style={{ gridArea: "p-2" }}>
            <ValueInput name="joursParMois" title="Nombre de jours" unit="jours/mois" invalid={errors.joursParMois}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.joursParMois }} />
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.p3)} style={{ gridArea: "p-3" }}>
            <ValueInput name="autresRevenusAnnuels" title="Autres produits annuels" unit="€/an" invalid={errors.autresRevenusAnnuels}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.autresRevenusAnnuels }} />
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.p4)} style={{ gridArea: "p-4" }}>
            <ValueInput name="autresRevenusMensuels" title="Autres produits mensuels" unit="€/mois" invalid={errors.autresRevenusMensuels}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.autresRevenusMensuels }} />
          </div>
          <div className={classNames(styles.item, styles.pTotal)} style={{ gridArea: "p-total" }}>
            <ValueOutput title="Total" value={preComputeAndFormatCa(values, errors)} unit="€/an" />
          </div>


          <div className={classNames(styles.item, styles.cHeader)} style={{ gridArea: "c-header" }}>
            <h2>Charges</h2>
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.c1)} style={{ gridArea: "c-1" }}>
            <ValueInput name="fraisAnnuels" title="Frais annuels" unit="€/an" invalid={errors.fraisAnnuels}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.fraisAnnuels }} />
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.c2)} style={{ gridArea: "c-2" }}>
            <ValueInput name="fraisMensuels" title="Frais mensuels" unit="€/mois" invalid={errors.fraisMensuels}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.fraisMensuels }} />
          </div>
          <div className={classNames(styles.item, styles.cTotal)} style={{ gridArea: "c-total" }}>
            <ValueOutput title="Total" value={preComputeAndFormatFrais(values, errors)} unit="€/an" />
          </div>

          <div className={classNames(styles.item, styles.bHeader)} style={{ gridArea: "b-header" }}>
            <h2>Bilan</h2>
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.b1)} style={{ gridArea: "b-1" }}>

            <ValueInput name="miseEnReserve" title="Montant à mettre en réserve" unit="€" invalid={errors.miseEnReserve}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.miseEnReserve }} />
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.b2)} style={{ gridArea: "b-2" }}>
            <ValueInput name="dividendesReserve" title="Dividende pris sur la réserve" unit="€" invalid={errors.dividendesReserve}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.dividendesReserve }} />
          </div>

          <div className={classNames(styles.item, styles.iHeader)} style={{ gridArea: "i-header" }}>
            <h2>Impôts</h2>
          </div>
          <div className={classNames(styles.item, styles.itemInput, styles.i1)} style={{ gridArea: "i-1" }}>
            <ValueInput name="autresRevenusImposables" title="Autres revenus imposables" unit="€/an" invalid={errors.autresRevenusImposables}
              inputProps={{ onChange: handleChange, onBlur: handleBlur, value: values.autresRevenusImposables }} />
          </div>

          <div className={classNames(styles.item, styles.itemButton)} style={{ gridArea: "button" }}>
            {isSubmitting ? <Loader></Loader> : <button className={styles.button} type="submit">Lancer la simulation</button>}
          </div>

        </form>
      )}
    </Formik>
  </>
}