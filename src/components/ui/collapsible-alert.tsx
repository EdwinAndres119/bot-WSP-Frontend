import type { ReactNode } from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const THEME_CLASSES = {
  red: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
} as const

interface CollapsibleAlertProps {
  label: string
  theme: keyof typeof THEME_CLASSES
  children: ReactNode
  className?: string
  /** Cuando true, omite el botón de colapsar y muestra el contenido directo (para usar dentro de un contenedor que ya maneja su propio expand/collapse). */
  alwaysOpen?: boolean
}

export function CollapsibleAlert({
  label,
  theme,
  children,
  className,
  alwaysOpen = false,
}: CollapsibleAlertProps) {
  const [isOpen, setIsOpen] = useState(false)
  const showContent = alwaysOpen || isOpen

  return (
    <div className={className}>
      {alwaysOpen ? null : (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className={cn(
            'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-medium',
            THEME_CLASSES[theme],
          )}
        >
          <span>{label}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {showContent ? (
        <div className={cn('overflow-x-auto rounded-md border border-gray-200', !alwaysOpen && 'mt-2')}>
          {children}
        </div>
      ) : null}
    </div>
  )
}
