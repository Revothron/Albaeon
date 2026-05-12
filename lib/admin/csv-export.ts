import type { AnalyticsTableColumn, AnalyticsTableRow } from '@/components/admin/AdminAnalytics'

function sanitizeCSVCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportCSV(
  filename: string,
  columns: AnalyticsTableColumn[],
  rows: AnalyticsTableRow[]
) {
  const header = columns.map((c) => sanitizeCSVCell(c.label)).join(',')
  const body = rows
    .map((row) => columns.map((col) => sanitizeCSVCell(row.cells[col.key] ?? '')).join(','))
    .join('\n')

  const bom = '\uFEFF'
  const csv = bom + header + '\n' + body

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
