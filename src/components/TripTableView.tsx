import Link from 'next/link'
import DeleteButton from './DeleteButton'
import type { Trip } from '@/lib/types'

type Props = {
  trips: Trip[]
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function TripTableView({ trips }: Props) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-base">No trips yet.</p>
        <p className="text-sm mt-1">Add your first trip to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Country</th>
            <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">City</th>
            <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Entry</th>
            <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Exit</th>
            <th className="text-left py-2 pr-4 font-medium text-gray-500 whitespace-nowrap">Purpose</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{trip.country}</td>
              <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{trip.city ?? '—'}</td>
              <td className="py-3 pr-4 text-gray-600 whitespace-nowrap tabular-nums">{formatDate(trip.entry_date)}</td>
              <td className="py-3 pr-4 text-gray-600 whitespace-nowrap tabular-nums">{formatDate(trip.exit_date)}</td>
              <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{trip.purpose}</td>
              <td className="py-3 whitespace-nowrap">
                <div className="flex items-center gap-3 justify-end">
                  <Link
                    href={`/edit/${trip.id}`}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteButton tripId={trip.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
