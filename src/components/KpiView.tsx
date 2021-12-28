import React from "react";
import { SimulationOutputItem } from "../models";
import styles from "../styles/KpiView.module.css";
import { formatEuroNoUnit, formatPercentNoUnit, unitShorthand } from "../utils";

interface KpiViewProps {
  item: SimulationOutputItem;
  displayMonthly: boolean;
}

export function KpiCard({ title, value, unit }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiCardTitle}>{title}</div>
      <div className={styles.kpiCardValue}>{value}</div>
      <div className={styles.kpiCardUnit}>{unit}</div>
    </div>
  );
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function KpiCardOptionDividendes({
  item,
  displayMonthly,
}: {
  item: SimulationOutputItem;
  displayMonthly: boolean;
}) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiCardTitle}>
        Option
      </div>
      <div className={styles.kpiCardTitle}>
        {capitalize(item.dividendes.option)}
      </div>
      <div>
        +{formatEuroNoUnit(item.dividendes.optionDifference, displayMonthly)}{unitShorthand(displayMonthly)}
      </div>
    </div>
  );
}
export function KpiView({ item, displayMonthly }: KpiViewProps) {
  return (
    <div className={styles.container}>
      <KpiCard
        title={"Salaire net"}
        value={formatEuroNoUnit(item.salaire.net, displayMonthly)}
        unit={unitShorthand(displayMonthly)}
      />
      <KpiCard
        title={"Dividende net"}
        value={formatEuroNoUnit(item.dividendes.net, displayMonthly)}
        unit={unitShorthand(displayMonthly)}
      />
      <KpiCard
        title={"Après impôts"}
        value={formatEuroNoUnit(item.impots.apres, displayMonthly)}
        unit={unitShorthand(displayMonthly)}
      />
      <KpiCard
        title={"Rendement"}
        value={formatPercentNoUnit(item.rendement)}
        unit={"%"}
      />
      <KpiCardOptionDividendes item={item} displayMonthly={displayMonthly} />
    </div>
  );
}
