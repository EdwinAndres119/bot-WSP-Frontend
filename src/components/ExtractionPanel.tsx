import { useState } from 'react'
import { ApiError, startExtraction, stopExtraction } from '../api/client'
import { useStatusPolling } from '../hooks/useStatusPolling'
import { ProgressBar } from './ProgressBar'
import { QrDisplay } from './QrDisplay'
import { StatusBanner } from './StatusBanner'

const MONTHS_OPTIONS = [
  { label: '1 mes', value: '1' },
  { label: '2 meses', value: '2' },
  { label: '3 meses', value: '3' },
  { label: '6 meses', value: '6' },
  { label: 'Sin límite', value: '' },
]

export function ExtractionPanel() {
  const status = useStatusPolling(true)
  const [lineLabel, setLineLabel] = useState('')
  const [monthsLimit, setMonthsLimit] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const state = status?.state ?? 'idle'
  const isRunning = state === 'starting' || state === 'qr' || state === 'extracting'

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lineLabel.trim()) {
      setFormError('El nombre/número de línea es requerido')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await startExtraction({
        lineLabel: lineLabel.trim(),
        monthsLimit: monthsLimit ? Number(monthsLimit) : null,
      })
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Error de red')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStop = async () => {
    try {
      await stopExtraction()
    } catch {
      // el próximo poll reflejará el estado real
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-6">
      <form
        onSubmit={handleStart}
        className="space-y-3 rounded-md border border-gray-200 bg-white p-6"
      >
        <div>
          <label htmlFor="lineLabel" className="mb-1 block text-sm font-medium text-gray-700">
            Línea (nombre o número)
          </label>
          <input
            id="lineLabel"
            type="text"
            value={lineLabel}
            onChange={(e) => setLineLabel(e.target.value)}
            disabled={isRunning}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="monthsLimit" className="mb-1 block text-sm font-medium text-gray-700">
            Meses a extraer
          </label>
          <select
            id="monthsLimit"
            value={monthsLimit}
            onChange={(e) => setMonthsLimit(e.target.value)}
            disabled={isRunning}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          >
            {MONTHS_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isRunning || isSubmitting}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Iniciar
          </button>
          {isRunning ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Detener
            </button>
          ) : null}
        </div>
      </form>

      {state === 'qr' ? <QrDisplay qrDataUrl={status?.qrDataUrl ?? null} /> : null}
      {state === 'extracting' && status ? <ProgressBar progress={status.progress} /> : null}
      {status ? <StatusBanner status={status} /> : null}
    </div>
  )
}
