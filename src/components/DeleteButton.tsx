'use client'

import { useTransition } from 'react'
import { deleteTrip } from '@/actions/trips'

type Props = {
  tripId: string
}

export default function DeleteButton({ tripId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Delete this trip? This cannot be undone.')) return
    startTransition(async () => {
      await deleteTrip(tripId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
