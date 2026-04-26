'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { TripInsert, TripUpdate } from '@/lib/types'

export async function createTrip(data: TripInsert): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('trips').insert({
    ...data,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect('/')
}

export async function createTrips(data: TripInsert[]): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('trips').insert(
    data.map(d => ({ ...d, user_id: user.id }))
  )

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect('/')
}

export async function updateTrip(
  id: string,
  data: TripUpdate
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('trips')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)  // extra ownership check beyond RLS

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect('/')
}

export async function deleteTrip(id: string): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
}
