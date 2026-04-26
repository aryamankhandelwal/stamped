import Link from 'next/link'
import DeleteButton from './DeleteButton'
import type { Trip } from '@/lib/types'

type Props = {
  trip: Trip
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function TripCard({ trip }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg px-5 py-4 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-gray-900">{trip.country}</h2>
            {trip.city && (
              <span className="text-sm text-gray-500">{trip.city}</span>
            )}
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {trip.purpose}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(trip.entry_date)} – {formatDate(trip.exit_date)}
          </p>
          {trip.notes && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{trip.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href={`/edit/${trip.id}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Edit
          </Link>
          <DeleteButton tripId={trip.id} />
        </div>
      </div>
    </div>
  )
}
