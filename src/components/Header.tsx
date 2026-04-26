import { signOut } from '@/actions/auth'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'var(--font-lora)' }}>Stamped</span>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
