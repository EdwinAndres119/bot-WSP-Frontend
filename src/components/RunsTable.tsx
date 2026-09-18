import { Fragment, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'
import { ApiError, getEmptyExportUrl, getExportUrl, getRuns } from '../api/client'
import type { RunRecord } from '../api/types'
import { EmptyChatsList } from './EmptyChatsList'
import { FailedChatsList } from './FailedChatsList'

type Panel = 'failed' | 'empty'
type Expanded = { runId: number; panel: Panel } | null

const COLUMN_COUNT = 12

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

export function RunsTable() {
  const [runs, setRuns] = useState<RunRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<Expanded>(null)

  const fetchRuns = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getRuns()
      setRuns(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error de red')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRuns()
  }, [])

  const togglePanel = (runId: number, panel: Panel) => {
    setExpanded((current) =>
      current?.runId === runId && current.panel === panel ? null : { runId, panel },
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-3 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Corridas</h2>
        <button
          type="button"
          onClick={fetchRuns}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Refrescar
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2">Línea</th>
              <th className="px-3 py-2">Meses</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Encontrados</th>
              <th className="px-3 py-2">Procesados</th>
              <th className="px-3 py-2">Fallidos</th>
              <th className="px-3 py-2">Sin actividad</th>
              <th className="px-3 py-2">Guardados</th>
              <th className="px-3 py-2">Inicio</th>
              <th className="px-3 py-2">Fin</th>
              <th className="px-3 py-2">Error</th>
              <th className="px-3 py-2">CSV</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-3 py-6 text-center text-gray-400">
                  Cargando…
                </td>
              </tr>
            ) : null}
            {!isLoading && runs.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-3 py-6 text-center text-gray-400">
                  Sin corridas registradas todavía.
                </td>
              </tr>
            ) : null}
            {runs.map((run) => {
              const failedChats = run.failed_chats ?? []
              const emptyChats = run.empty_chats ?? []
              const isFailedExpanded = expanded?.runId === run.id && expanded.panel === 'failed'
              const isEmptyExpanded = expanded?.runId === run.id && expanded.panel === 'empty'

              return (
                <Fragment key={run.id}>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2">{run.line_label}</td>
                    <td className="px-3 py-2">{run.months_limit ?? 'Sin límite'}</td>
                    <td className="px-3 py-2">{run.status}</td>
                    <td className="px-3 py-2">{run.chats_found}</td>
                    <td className="px-3 py-2">{run.chats_processed}</td>
                    <td className="px-3 py-2">
                      {failedChats.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => togglePanel(run.id, 'failed')}
                          className="inline-flex items-center gap-1 text-red-600 hover:underline"
                        >
                          {run.chats_failed}
                          {isFailedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      ) : (
                        run.chats_failed
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {emptyChats.length > 0 ? (
                        <span className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePanel(run.id, 'empty')}
                            className="inline-flex items-center gap-1 text-amber-700 hover:underline"
                          >
                            {emptyChats.length}
                            {isEmptyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          <a
                            href={getEmptyExportUrl(run.id)}
                            title="Descargar chats sin actividad (CSV)"
                            className="inline-flex items-center text-amber-700 hover:text-amber-900"
                          >
                            <Download size={14} />
                          </a>
                        </span>
                      ) : (
                        emptyChats.length
                      )}
                    </td>
                    <td className="px-3 py-2">{run.messages_saved}</td>
                    <td className="px-3 py-2">{formatDate(run.started_at)}</td>
                    <td className="px-3 py-2">{formatDate(run.finished_at)}</td>
                    <td className="px-3 py-2 text-red-600">{run.error_message ?? '—'}</td>
                    <td className="px-3 py-2">
                      <a
                        href={getExportUrl(run.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Download size={14} />
                        Descargar
                      </a>
                    </td>
                  </tr>
                  {isFailedExpanded ? (
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td colSpan={COLUMN_COUNT} className="px-3 py-3">
                        <FailedChatsList failedChats={failedChats} alwaysOpen />
                      </td>
                    </tr>
                  ) : null}
                  {isEmptyExpanded ? (
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td colSpan={COLUMN_COUNT} className="px-3 py-3">
                        <EmptyChatsList emptyChats={emptyChats} alwaysOpen />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
