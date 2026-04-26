'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import DateInput from './DateInput'
import CountryCombobox from './CountryCombobox'
import PurposeCombobox from './PurposeCombobox'
import { createTrip, updateTrip } from '@/actions/trips'
import type { Trip } from '@/lib/types'

type Props =
  | { mode: 'add' }
  | { mode: 'edit'; trip: Trip }

function pad(n: number) {
  return String(n).padStart(2, '0')
}

// Convert a local Date to a YYYY-MM-DD ISO string without UTC shifting
function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export default function TripForm(props: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/.test(navigator.platform))
  }, [])

  const existing = props.mode === 'edit' ? props.trip : null

  const [country, setCountry] = useState(existing?.country ?? '')
  const [city, setCity] = useState(existing?.city ?? '')
  const [purpose, setPurpose] = useState(existing?.purpose ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')

  // Entry date: raw text input + parsed Date
  const [entryRaw, setEntryRaw] = useState(() => {
    if (existing?.entry_date) {
      const [y, m, d] = existing.entry_date.split('-')
      return `${d}/${m}/${y}`
    }
    return ''
  })
  const [entryParsed, setEntryParsed] = useState<Date | null>(() => {
    if (existing?.entry_date) {
      const [y, m, d] = existing.entry_date.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    return null
  })

  // Exit date: raw text input + parsed Date
  const [exitRaw, setExitRaw] = useState(() => {
    if (existing?.exit_date) {
      const [y, m, d] = existing.exit_date.split('-')
      return `${d}/${m}/${y}`
    }
    return ''
  })
  const [exitParsed, setExitParsed] = useState<Date | null>(() => {
    if (existing?.exit_date) {
      const [y, m, d] = existing.exit_date.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    return null
  })

  function handleEntryChange(raw: string, parsed: Date | null) {
    setEntryRaw(raw)
    setEntryParsed(parsed)
  }

  function handleExitChange(raw: string, parsed: Date | null) {
    setExitRaw(raw)
    setExitParsed(parsed)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!entryParsed) {
      setFormError('Please enter a valid entry date.')
      return
    }
    if (!exitParsed) {
      setFormError('Please enter a valid exit date.')
      return
    }
    if (entryParsed >= exitParsed) {
      setFormError('Entry date must be before exit date.')
      return
    }
    if (!country.trim()) {
      setFormError('Country is required.')
      return
    }
    if (!purpose.trim()) {
      setFormError('Purpose is required.')
      return
    }

    const data = {
      country: country.trim(),
      city: city.trim() || null,
      entry_date: toISODate(entryParsed),
      exit_date: toISODate(exitParsed),
      purpose: purpose.trim(),
      notes: notes.trim() || null,
    }

    startTransition(async () => {
      if (props.mode === 'add') {
        const result = await createTrip(data)
        if (result?.error) {
          setFormError(result.error)
        }
      } else {
        const result = await updateTrip(props.trip.id, data)
        if (result?.error) {
          setFormError(result.error)
        }
      }
    })
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (mod && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMac, isPending, country, city, purpose, notes, entryParsed, exitParsed])

  const modSymbol = isMac ? '⌘' : 'Ctrl+'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-gray-400 font-normal">(required)</span>
        </label>
        <CountryCombobox value={country} onChange={setCountry} />
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Paris"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
      </div>

      {/* Entry date */}
      <DateInput
        label="Entry date (required)"
        id="entry_date"
        value={entryRaw}
        onChange={handleEntryChange}
        placeholder="e.g. 10 April 2022 or 10/4/22"
      />

      {/* Exit date */}
      <DateInput
        label="Exit date (required)"
        id="exit_date"
        value={exitRaw}
        onChange={handleExitChange}
        placeholder="e.g. 20 April 2022 or 20/4/22"
      />

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Purpose <span className="text-gray-400 font-normal">(required)</span>
        </label>
        <PurposeCombobox value={purpose} onChange={setPurpose} />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any additional notes…"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
        />
      </div>

      {formError && (
        <p className="text-sm text-red-600">{formError}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving…' : props.mode === 'add' ? 'Add trip' : 'Save changes'}
          {!isPending && <kbd className="text-xs text-gray-400 font-mono">{modSymbol}↵</kbd>}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
