import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Inbox, MessageSquare, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Progress } from '../api/types'
import { EmptyChatsList } from './EmptyChatsList'
import { FailedChatsList } from './FailedChatsList'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ProgressBarProps {
  progress: Progress
}

interface Segment {
  name: string
  size: number
  color: string
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const { chatsFound, processed, failed, saved, failedChats = [], emptyChats = [] } = progress
  const total = chatsFound
  const successCount = Math.max(processed - failed, 0)
  const pendingCount = Math.max(total - processed, 0)

  const segments: Segment[] = [
    { name: 'Procesados', size: successCount, color: 'bg-emerald-500' },
    { name: 'Fallidos', size: failed, color: 'bg-red-500' },
    { name: 'Pendientes', size: pendingCount, color: 'bg-muted' },
  ]

  const detailRows = [
    { icon: Search, label: 'Chats encontrados', value: chatsFound },
    { icon: CheckCircle2, label: 'Chats procesados', value: processed },
    { icon: AlertTriangle, label: 'Chats fallidos', value: failed, alert: failed > 0 },
    { icon: Inbox, label: 'Chats sin actividad', value: emptyChats.length },
    { icon: MessageSquare, label: 'Mensajes guardados', value: saved },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progreso de extracción</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <div
            className="relative flex h-3 w-full overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={processed}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Progreso de chats procesados"
          >
            {segments.map((segment, index) => {
              const percentage = total > 0 ? (segment.size / total) * 100 : 0
              return (
                <motion.div
                  key={segment.name}
                  className={cn(
                    'h-full',
                    segment.color,
                    index < segments.length - 1 && 'border-r-2 border-card',
                  )}
                  initial={{ width: '0%' }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                  style={{ flexShrink: 0 }}
                />
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {segments.map((segment) => (
                <div key={segment.name} className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', segment.color)} />
                  <span>{segment.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-0">
              {processed} de {total} chats procesados
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-card-foreground">Detalle</h3>
          <div className="mt-2 overflow-hidden rounded-lg border">
            {detailRows.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  'flex items-center justify-between p-4',
                  index < detailRows.length - 1 && 'border-b',
                )}
              >
                <div className="flex items-center gap-3">
                  <row.icon
                    className={cn('h-4 w-4', row.alert ? 'text-red-600' : 'text-muted-foreground')}
                  />
                  <span className="font-medium">{row.label}</span>
                </div>
                <span className={cn('text-sm', row.alert ? 'font-semibold text-red-600' : 'text-muted-foreground')}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <FailedChatsList failedChats={failedChats} />
        <EmptyChatsList emptyChats={emptyChats} />
      </CardContent>
    </Card>
  )
}
