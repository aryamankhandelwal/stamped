'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import DateInput from './DateInput'
import CountryCombobox from './CountryCombobox'
import PurposeCombobox from './PurposeCombobox'
import { createTrips } from '@/actions/trips'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatShort(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

type Draft = {
  country: string
  city: string
  entryRaw: string
  entryParsed: Date | null
  exitRaw: string
  exitParsed: Date | null
  purpose: string
  notes: string
}

function emptyDraft(): Draft {
  return { country: '', city: '', entryRaw: '', entryParsed: null, exitRaw: '', exitParsed: null, purpose: '', notes: '' }
}

export default function AddTripSession() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [form, setForm] = useState<Draft>(emptyDraft())
  const [formKey, setFormKey] = useState(0)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/.test(navigator.platform))
  }, [])

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function validate(d: Draft): string | null {
    if (!d.country.trim()) return 'Country is required.'
    if (!d.entryParsed) return 'Please enter a valid entry date.'
    if (!d.exitParsed) return 'Please enter a valid exit date.'
    if (d.entryParsed >= d.exitParsed) return 'Entry date must be before exit date.'
    if (!d.purpose.trim()) return 'Purpose is required.'
    return null
  }

  function isFormEmpty(d: Draft): boolean {
    return !d.country.trim() && !d.entryRaw.trim() && !d.exitRaw.trim() && !d.purpose.trim()
  }

  function handleAddAnother() {
    setFormError(null)
    const error = validate(form)
    if (error) { setFormError(error); return }
    setDrafts(prev => [...prev, form])
    setForm(emptyDraft())
    setFormKey(k => k + 1)
  }

  function handleEditDraft(index: number) {
    setFormError(null)
    if (!isFormEmpty(form)) {
      const error = validate(form)
      if (error) { setFormError(error); return }
      setDrafts(prev => {
        const copy = [...prev]
        copy[index] = form
        return copy
      })
      setForm(drafts[index])
      setFormKey(k => k + 1)
    } else {
      setDrafts(prev => prev.filter((_, i) => i !== index))
      setForm(drafts[index])
      setFormKey(k => k + 1)
    }
  }

  function handleRemoveDraft(index: number) {
    setDrafts(prev => prev.filter((_, i) => i !== index))
  }

  function handleDone() {
    setFormError(null)
    const finalDrafts = [...drafts]

    if (!isFormEmpty(form)) {
      const error = validate(form)
      if (error) { setFormError(error); return }
      finalDrafts.push(form)
    }

    if (finalDrafts.length === 0) {
      setFormError('Please fill in at least one trip.')
      return
    }

    startTransition(async () => {
      const result = await createTrips(
        finalDrafts.map(d => ({
          country: d.country.trim(),
          city: d.city.trim() || null,
          entry_date: toISODate(d.entryParsed!),
          exit_date: toISODate(d.exitParsed!),
          purpose: d.purpose.trim(),
          notes: d.notes.trim() || null,
        }))
      )
      if (result?.error) setFormError(result.error)
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (!mod || isPending) return
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleAddAnother()
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        handleDone()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMac, isPending, form, drafts])

  const doneTripCount = drafts.length + (isFormEmpty(form) ? 0 : 1)
  const modSymbol = isMac ? '⌘' : 'Ctrl+'
  const shiftSymbol = isMac ? '⇧' : 'Shift+'

  return (
    <div className="space-y-6">
      {/* Session cards */}
      {drafts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Added this session</p>
          {drafts.map((draft, i) => (
            <div
              key={i}
              onClick={() => handleEditDraft(i)}
              className="group flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-white transition-all"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {draft.country}{draft.city ? `, ${draft.city}` : ''}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {draft.entryParsed ? formatShort(draft.entryParsed) : '?'}
                  {' → '}
                  {draft.exitParsed ? formatShort(draft.exitParsed) : '?'}
                  {' · '}
                  {draft.purpose}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemoveDraft(i) }}
                className="ml-4 text-gray-300 hover:text-gray-600 text-lg leading-none flex-shrink-0 transition-colors"
                aria-label="Remove trip"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active form */}
      <div className="space-y-5">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-gray-400 font-normal">(required)</span>
          </label>
          <CountryCombobox key={formKey} value={form.country} onChange={(v) => setField('country', v)} autoFocus />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => setField('city', e.target.value)}
            placeholder="e.g. Paris"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
        </div>

        {/* Entry date */}
        <DateInput
          label="Entry date (required)"
          id="entry_date"
          value={form.entryRaw}
          onChange={(raw, parsed) => setForm(prev => ({ ...prev, entryRaw: raw, entryParsed: parsed }))}
          placeholder="e.g. 10 April 2022 or 10/4/22"
        />

        {/* Exit date */}
        <DateInput
          label="Exit date (required)"
          id="exit_date"
          value={form.exitRaw}
          onChange={(raw, parsed) => setForm(prev => ({ ...prev, exitRaw: raw, exitParsed: parsed }))}
          placeholder="e.g. 20 April 2022 or 20/4/22"
        />

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose <span className="text-gray-400 font-normal">(required)</span>
          </label>
          <PurposeCombobox value={form.purpose} onChange={(v) => setField('purpose', v)} />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={3}
            placeholder="Any additional notes…"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
          />
        </div>

        {formError && (
          <p className="text-sm text-red-600">{formError}</p>
        )}

        <div className="flex gap-3 pt-1 flex-wrap">
          <button
            type="button"
            onClick={handleAddAnother}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Add another
            <kbd className="text-xs text-gray-400 font-mono">{modSymbol}↵</kbd>
          </button>
          <button
            type="button"
            onClick={handleDone}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Saving…' : `Done${doneTripCount > 0 ? ` (${doneTripCount})` : ''}`}
            {!isPending && (
              <kbd className="text-xs text-gray-400 font-mono">{modSymbol}{shiftSymbol}↵</kbd>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
