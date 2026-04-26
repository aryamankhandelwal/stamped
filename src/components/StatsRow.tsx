type Props = {
  totalTrips: number
  countries: number
  nightsAbroad: number
}

export default function StatsRow({ totalTrips, countries, nightsAbroad }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-50 rounded-lg px-4 py-4 text-center">
        <p className="text-2xl font-semibold text-gray-900">{totalTrips}</p>
        <p className="text-xs text-gray-500 mt-1">Trips</p>
      </div>
      <div className="bg-gray-50 rounded-lg px-4 py-4 text-center">
        <p className="text-2xl font-semibold text-gray-900">{countries}</p>
        <p className="text-xs text-gray-500 mt-1">Countries</p>
      </div>
      <div className="bg-gray-50 rounded-lg px-4 py-4 text-center">
        <p className="text-2xl font-semibold text-gray-900">{nightsAbroad}</p>
        <p className="text-xs text-gray-500 mt-1">Nights abroad</p>
      </div>
    </div>
  )
}
