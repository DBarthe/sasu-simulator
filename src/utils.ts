export function formatEuro(amount) {
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: (amount < 1 ? 2 : 0)
  })
}

export function formatPercent(taux) {
  return taux.toLocaleString('fr-FR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 })
}