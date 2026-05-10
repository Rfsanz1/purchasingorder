export const formatRupiah = (n: number | string): string => {
  const num = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(num)) return 'Rp 0'
  return 'Rp ' + num.toLocaleString('id-ID')
}

export const formatNumber = (n: number | string, decimals = 0): string => {
  const num = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(num)) return '0'
  return num.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export const formatDate = (d: string | Date): string => {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateTime = (d: string | Date): string => {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const parseRupiah = (s: string): number => {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0
}
