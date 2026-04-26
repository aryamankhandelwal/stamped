import AddTripSession from '@/components/AddTripSession'

export default function AddTripPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold text-gray-900 mb-8">Add trip</h1>
        <AddTripSession />
      </div>
    </div>
  )
}
