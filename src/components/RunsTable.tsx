import { Fragment, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'
import { ApiError, getEmptyExportUrl, getExportUrl, getRuns } from '../api/client'
import type { RunRecord } from '../api/types'
import { EmptyChatsList } from './EmptyChatsList'
import { FailedChatsList } from './FailedChatsList'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

type Panel = 'failed' | 'empty'
type Expanded = { runId: number; panel: Panel } | null

const COLUMN_COUNT = 12

const STATUS_VARIANT: Record<RunRecord['status'], 'default' | 'secondary' | 'destructive'> = {
  completed: 'default',
  running: 'secondary',
  error: 'destructive',
}

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
    <div className="mx-auto max-w-[110rem] space-y-3 p-6">
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

      <div className="bg-background overflow-hidden rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Línea</TableHead>
              <TableHead>Meses</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Encontrados</TableHead>
              <TableHead>Procesados</TableHead>
              <TableHead>Fallidos</TableHead>
              <TableHead>Sin actividad</TableHead>
              <TableHead>Guardados</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Error</TableHead>
              <TableHead>CSV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="text-muted-foreground text-center">
                  Cargando…
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && runs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} className="text-muted-foreground text-center">
                  Sin corridas registradas todavía.
                </TableCell>
              </TableRow>
            ) : null}
            {runs.map((run) => {
              const failedChats = run.failed_chats ?? []
              const emptyChats = run.empty_chats ?? []
              const isFailedExpanded = expanded?.runId === run.id && expanded.panel === 'failed'
              const isEmptyExpanded = expanded?.runId === run.id && expanded.panel === 'empty'

              return (
                <Fragment key={run.id}>
                  <TableRow>
                    <TableCell>{run.line_label}</TableCell>
                    <TableCell>{run.months_limit ?? 'Sin límite'}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[run.status]}>{run.status}</Badge>
                    </TableCell>
                    <TableCell>{run.chats_found}</TableCell>
                    <TableCell>{run.chats_processed}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{run.messages_saved}</TableCell>
                    <TableCell>{formatDate(run.started_at)}</TableCell>
                    <TableCell>{formatDate(run.finished_at)}</TableCell>
                    <TableCell className="text-red-600">{run.error_message ?? '—'}</TableCell>
                    <TableCell>
                      <a
                        href={getExportUrl(run.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Download size={14} />
                        Descargar
                      </a>
                    </TableCell>
                  </TableRow>
                  {isFailedExpanded ? (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={COLUMN_COUNT}>
                        <FailedChatsList failedChats={failedChats} alwaysOpen />
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {isEmptyExpanded ? (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={COLUMN_COUNT}>
                        <EmptyChatsList emptyChats={emptyChats} alwaysOpen />
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
