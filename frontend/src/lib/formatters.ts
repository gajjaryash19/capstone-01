export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | number | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val)
}

export function formatPercent(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`
}
