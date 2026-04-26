import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TripForm from '@/components/TripForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditTripPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!trip) notFound()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold text-gray-900 mb-8">Edit trip</h1>
        <TripForm mode="edit" trip={trip} />
      </div>
    </div>
  )
}
