export function formatEuro(amount) {
  return amount.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: amount < 1 ? 2 : 0,
  });
}

export function formatPercent(taux) {
  return taux.toLocaleString("fr-FR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatEuroNoUnit(
  amount: number,
  displayMonthly: boolean = false
): string {
  amount = displayMonthly ? amount / 12 : amount;
  return amount
    .toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
      currencyDisplay: "code",
      minimumFractionDigits: 0,
      maximumFractionDigits: amount < 1 ? 2 : 0,
    })
    .replace(/[a-z]{3}/i, "")
    .trim();
}

export function formatPercentNoUnit(taux) {
  return taux
    .toLocaleString("fr-FR", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    .replace(/%$/i, "")
    .trim();
}

export function unitShorthand(displayMonthly: boolean): string {
  return displayMonthly ? "€/mois" : "€/an";
}
