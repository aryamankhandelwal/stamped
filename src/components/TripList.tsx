import TripCard from './TripCard'
import type { Trip } from '@/lib/types'

type Props = {
  trips: Trip[]
}

export default function TripList({ trips }: Props) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-base">No trips yet.</p>
        <p className="text-sm mt-1">Add your first trip to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}
