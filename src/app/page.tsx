import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import StatsRow from '@/components/StatsRow'
import TripViewToggle from '@/components/TripViewToggle'
import type { Trip } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: trips = [] } = await supabase
    .from('trips')
    .select('*')
    .order('entry_date', { ascending: false })

  const allTrips: Trip[] = trips ?? []

  const totalTrips = allTrips.length
  const countries = new Set(allTrips.map((t) => t.country)).size
  const nightsAbroad = allTrips.reduce((sum, t) => {
    const diff =
      (new Date(t.exit_date).getTime() - new Date(t.entry_date).getTime()) /
      86_400_000
    return sum + Math.round(diff)
  }, 0)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Your travels
          </h2>
          <Link
            href="/add"
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            + Add trip
          </Link>
        </div>

        <StatsRow
          totalTrips={totalTrips}
          countries={countries}
          nightsAbroad={nightsAbroad}
        />

        <TripViewToggle trips={allTrips} />
      </main>
    </div>
  )
}
