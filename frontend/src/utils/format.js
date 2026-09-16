export const formatDate = (val, options = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  val ? new Date(val).toLocaleDateString('en-IN', options) : '-'

export const formatPhone = (val) => val || '-'

export const formatCurrency = (val, currency = 'INR', locale = 'en-IN') =>
  val == null || Number.isNaN(Number(val)) ? '-' : new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(val))

export const formatNumber = (val) =>
  val == null || Number.isNaN(Number(val)) ? '-' : new Intl.NumberFormat('en-IN').format(Number(val))

export const formatPercent = (val) =>
  val == null || Number.isNaN(Number(val)) ? '-' : `${Number(val).toFixed(1)}%`

export const formatDateTime = (val) =>
  val ? new Date(val).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'