'use client'

import ExcelJS from 'exceljs'
import type { Trip } from '@/lib/types'

type Props = {
  trips: Trip[]
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function ExportButton({ trips }: Props) {
  async function handleExport() {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Trips')

    // Column widths wide enough that no value wraps within its own line
    ws.columns = [
      { width: 24 }, // Country
      { width: 20 }, // City
      { width: 14 }, // Entry
      { width: 14 }, // Exit
      { width: 20 }, // Purpose
      { width: 36 }, // Notes
    ]

    // Header row
    ws.addRow(['Country', 'City', 'Entry', 'Exit', 'Purpose', 'Notes'])

    // Single data row — all values joined by newlines within each cell
    const dataRow = ws.addRow([
      trips.map((t) => t.country).join('\n'),
      trips.map((t) => t.city ?? '').join('\n'),
      trips.map((t) => formatDate(t.entry_date)).join('\n'),
      trips.map((t) => formatDate(t.exit_date)).join('\n'),
      trips.map((t) => t.purpose).join('\n'),
      trips.map((t) => t.notes ?? '').join('\n'),
    ])

    // Apply wrap text + top-align so newlines render as visible line breaks
    dataRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' }
    })

    // Row height: ~18pt per entry
    dataRow.height = trips.length * 18

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stamped-trips.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md transition-colors"
    >
      Export
    </button>
  )
}
