'use client'

import * as chrono from 'chrono-node'

type Props = {
  label: string
  id: string
  value: string
  onChange: (raw: string, parsed: Date | null) => void
  placeholder?: string
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatLocal(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export default function DateInput({ label, id, value, onChange, placeholder }: Props) {
  const parsed = value.trim()
    ? chrono.parseDate(value, new Date(), { forwardDate: false })
    : null

  const showError = value.trim().length > 0 && parsed === null

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const result = raw.trim()
      ? chrono.parseDate(raw, new Date(), { forwardDate: false })
      : null
    onChange(raw, result)
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder ?? 'e.g. 10 April 2022 or 10/4/22'}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
      />
      <div className="mt-1 h-4">
        {parsed && (
          <p className="text-xs text-gray-500">Parsed: {formatLocal(parsed)}</p>
        )}
        {showError && (
          <p className="text-xs text-red-500">Could not parse date</p>
        )}
      </div>
    </div>
  )
}
