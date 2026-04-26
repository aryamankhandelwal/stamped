'use client'

import { useState } from 'react'
import TripList from './TripList'
import TripTableView from './TripTableView'
import ExportButton from './ExportButton'
import type { Trip } from '@/lib/types'

type Props = {
  trips: Trip[]
}

function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="2" width="14" height="4" rx="1" fill="currentColor" />
      <rect x="1" y="9" width="14" height="4" rx="1" fill="currentColor" />
    </svg>
  )
}

function TableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="2" width="14" height="1.5" rx="0.5" fill="currentColor" />
      <rect x="1" y="6" width="14" height="1" rx="0.5" fill="currentColor" />
      <rect x="1" y="9" width="14" height="1" rx="0.5" fill="currentColor" />
      <rect x="1" y="12" width="14" height="1" rx="0.5" fill="currentColor" />
      <rect x="5" y="2" width="1" height="11" rx="0.5" fill="currentColor" />
      <rect x="10" y="2" width="1" height="11" rx="0.5" fill="currentColor" />
    </svg>
  )
}

export default function TripViewToggle({ trips }: Props) {
  const [view, setView] = useState<'card' | 'table'>('card')

  return (
    <div>
      <div className="flex justify-end items-center gap-2 mb-3">
        <ExportButton trips={trips} />
        <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
          <button
            onClick={() => setView('card')}
            className={`px-2.5 py-1.5 transition-colors ${
              view === 'card' ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 hover:text-gray-700'
            }`}
            aria-label="Card view"
          >
            <CardIcon />
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-2.5 py-1.5 border-l border-gray-200 transition-colors ${
              view === 'table' ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 hover:text-gray-700'
            }`}
            aria-label="Table view"
          >
            <TableIcon />
          </button>
        </div>
      </div>

      {view === 'card' ? <TripList trips={trips} /> : <TripTableView trips={trips} />}
    </div>
  )
}
