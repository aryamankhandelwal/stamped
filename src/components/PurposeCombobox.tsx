'use client'

import { useEffect, useRef, useState } from 'react'
import { Command } from 'cmdk'
import { PURPOSE_OPTIONS } from '@/lib/constants'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function PurposeCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value changes (e.g. form reset / pre-populate)
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function handleInputChange(v: string) {
    setInputValue(v)
    onChange(v)  // free-text: form value = whatever is typed
    setOpen(true)
  }

  function handleSelect(selected: string) {
    setInputValue(selected)
    onChange(selected)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <Command shouldFilter={true} loop>
        <Command.Input
          value={inputValue}
          onValueChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={(e) => { if (!containerRef.current?.contains(e.relatedTarget as Node)) setOpen(false) }}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
          placeholder="Select or type a purpose…"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
        {open && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
            <Command.List>
              <Command.Empty className="px-3 py-2 text-sm text-gray-500">
                Press enter to use &ldquo;{inputValue}&rdquo;
              </Command.Empty>
              {PURPOSE_OPTIONS.map((option) => (
                <Command.Item
                  key={option}
                  value={option}
                  onSelect={handleSelect}
                  className="px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                >
                  {option}
                </Command.Item>
              ))}
            </Command.List>
          </div>
        )}
      </Command>
    </div>
  )
}
