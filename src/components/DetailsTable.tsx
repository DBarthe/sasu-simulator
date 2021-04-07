import React from "react";
import { configIS, configDividende, configIR } from "../config";
import { SimulationOutputItem } from "../models";
import styles from '../styles/Simulator.module.css';
import { formatEuro, formatPercent } from "../utils";


export default function DetailsTable(props: { item: SimulationOutputItem; }) {
  const { item } = props;
  return (
    <>
      <table className={styles.innerTable}>
        <tbody>
          <tr>
            <td><b>Chiffre d'affaires</b></td>
            <td><b>{formatEuro(item.ca.total)}</b></td>
          </tr>
          <tr>
            <td>Frais professionnels</td>
            <td className={styles.right}>{formatEuro(-item.frais.total)}</td>
          </tr>
          <tr>
            <td rowSpan={6}>Salaires et traitements</td>
            <td className={styles.right} rowSpan={6}>{formatEuro(-item.salaire.superBrut)}</td>
            <td>Super brut</td>
            <td>{formatEuro(item.salaire.superBrut)}</td>
          </tr>
          <tr>
            <td>Brut</td>
            <td>{formatEuro(item.salaire.brut)}</td>
          </tr>
          <tr>
            <td>Net</td>
            <td>{formatEuro(item.salaire.net)}</td>
          </tr>
          <tr>
            <td>Net fiscal</td>
            <td>{formatEuro(item.salaire.netFiscal)}</td>
          </tr>
          <tr>
            <td>Cotisations patronales</td>
            <td>{formatEuro(item.salaire.cotisation.partPatronale)}</td>
          </tr>
          <tr>
            <td>Cotisations salariales</td>
            <td>{formatEuro(item.salaire.cotisation.partSalariale)}</td>
          </tr>
          <tr>
            <td><b>Bénéfice brut</b></td>
            <td><b>{formatEuro(item.benefices.brut)}</b></td>
          </tr>
          <tr>
            <td rowSpan={3}>Impôt sur les sociétés</td>
            <td rowSpan={3} className={styles.right}>{formatEuro(-item.benefices.is)}</td>
            <td>De 0 à {formatEuro(configIS.tranche1)}</td>
            <td>{formatPercent(configIS.taux1)}</td>
          </tr>
          <tr>
            <td>Après {formatEuro((configIS.tranche1))}</td>
            <td>{formatPercent(configIS.taux2)}</td>
          </tr>
          <tr>
            <td>Taux effectif</td>
            <td>{formatPercent(item.benefices.taux)}</td>
          </tr>
          <tr>
            <td><b>Bénéfice net</b></td>
            <td><b>{formatEuro(item.benefices.net)}</b></td>
          </tr>
          <tr>
            <td>Mise en réserve</td>
            <td className={styles.right}>{formatEuro(-item.reserve.total)}</td>
          </tr>
          <tr>
            <td>Distribution en dividendes</td>
            <td className={styles.right}>{formatEuro(-item.dividendes.depuisBenefice)}</td>
          </tr>
          <tr>
            <td><b>Balance</b></td>
            <td><b>{formatEuro(
              item.ca.total
              - item.frais.total
              - item.salaire.superBrut
              - item.benefices.is
              - item.reserve.total
              - item.dividendes.depuisBenefice)}</b></td>
          </tr>
          <tr>
            <td rowSpan={2}><b>Dividende brut</b></td>
            <td rowSpan={2}><b>{formatEuro(item.dividendes.brut)}</b></td>
            <td>Prélevé sur les bénéfices</td>
            <td>{formatEuro(item.dividendes.depuisBenefice)}</td>
          </tr>
          <tr>
            <td>Prélevé sur la réserve</td>
            <td>{formatEuro(item.dividendes.depuisReserve)}</td>
          </tr>
          {item.dividendes.pfuImpotsRevenu !== 0 && <>
            <tr>
              <td rowSpan={2}>Prélèvements forfaitaire {formatPercent(configDividende.pfu)}</td>
              <td rowSpan={2} className={styles.right}>{formatEuro(-(item.dividendes.prelevementsSociaux - item.dividendes.pfuImpotsRevenu))}</td>
              <td>Prélèvements sociaux {formatPercent(configDividende.prelevementsSociaux)}</td>
              <td>{formatEuro(item.dividendes.prelevementsSociaux)}</td>
            </tr>
            <tr>
              <td>Impôt sur le revenu {formatPercent(configDividende.pfuImpotsRevenu)}</td>
              <td>{formatEuro(item.dividendes.pfuImpotsRevenu)}</td>
            </tr>
          </>}
          {item.dividendes.pfuImpotsRevenu === 0 && <>
            <tr>
              <td>Prélèvements sociaux {formatPercent(configDividende.prelevementsSociaux)}</td>
              <td>{formatEuro(item.dividendes.prelevementsSociaux)}</td>
            </tr>
          </>}
          <tr>
            <td><b>Dividende net</b></td>
            <td><b>{formatEuro(item.dividendes.net)}</b></td>
          </tr>
          {item.dividendes.pfuImpotsRevenu !== 0 && <>
            <tr>
              <td>Dividende imposable</td>
              <td>{formatEuro(0)}</td>
            </tr>
          </>}
          {item.dividendes.pfuImpotsRevenu === 0 && <>
            <tr>
              <td rowSpan={3}>Dividende imposable</td>
              <td rowSpan={3}>{formatEuro(item.dividendes.imposable)}</td>
              <td>Dividende brut</td>
              <td>{formatEuro(item.dividendes.brut)}</td>
            </tr>
            <tr>
              <td>Abattement {formatPercent(configDividende.abattement)}</td>
              <td className={styles.right}>{formatEuro(-item.dividendes.abattement)}</td>
            </tr>
            <tr>
              <td>CSG déductible {formatPercent(configDividende.csgDeductible)}</td>
              <td className={styles.right}>{formatEuro(-item.dividendes.csgDeduite)}</td>
            </tr>
          </>}
          <tr>
            <td>Salaire net fiscal</td>
            <td>{formatEuro(item.salaire.netFiscal)}</td>
          </tr>
          <tr>
            <td>Autres revenus imposables</td>
            <td>{formatEuro(item.impots.autreImposable)}</td>
          </tr>
          <tr>
            <td><b>Total revenus imposables</b></td>
            <td><b>{formatEuro(item.impots.imposable)}</b></td>
          </tr>
          <tr>
            <td rowSpan={configIR.taux.length + 1}>Impôt sur le revenu</td>
            <td rowSpan={configIR.taux.length + 1} className={styles.right}>{formatEuro(-item.impots.montant)}</td>
            <td>De 0 à {formatEuro(configIR.tranches[0])}</td>
            <td>{formatPercent(configIR.taux[0])}</td>
          </tr>
          {Array.from({ length: configIR.taux.length - 2 }, (v, k) => <tr>
            <td>De {formatEuro(configIR.tranches[k] + 1)} à {formatEuro(configIR.tranches[k + 1])}</td>
            <td>{formatPercent(configIR.taux[k + 1])}</td>
          </tr>)}
          <tr>
            <td>Après {formatEuro(configIR.tranches[configIR.tranches.length - 1])}</td>
            <td>{formatPercent(configIR.taux[configIR.taux.length - 1])}</td>
          </tr>
          <tr>
            <td>Taux effectif</td>
            <td>{formatPercent(item.impots.taux)}</td>
          </tr>
          <tr>
            <td rowSpan={3}>Revenus avant impôts</td>
            <td rowSpan={3}>{formatEuro(item.impots.avant)}</td>
            <td>Salaire net</td>
            <td>{formatEuro(item.salaire.net)}</td>
          </tr>
          <tr>
            <td>Dividende net</td>
            <td>{formatEuro(item.dividendes.net)}</td>
          </tr>
          <tr>
            <td>Autres revenus imposables</td>
            <td>{formatEuro(item.impots.autreImposable)}</td>
          </tr>
          <tr>
            <td><b>Revenus après impôts</b></td>
            <td><b>{formatEuro(item.impots.apres)}</b></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
