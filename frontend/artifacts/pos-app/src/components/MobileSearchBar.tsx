import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function MobileSearchBar({ onSearch, placeholder = 'Cari produk...' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = (q: string) => {
    setQuery(q)
    onSearch(q)
  }

  return (
    <div className="md:hidden">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Search size={20} />
        </button>
      ) : (
        <div className="fixed inset-0 z-50 flex flex-col gap-2 bg-white p-4 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => {
                setIsOpen(false)
                setQuery('')
                onSearch('')
              }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition dark:bg-slate-900 dark:text-slate-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
