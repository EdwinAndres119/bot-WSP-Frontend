import { TriangleAlert } from 'lucide-react'
import type { EmptyChat } from '../api/types'
import { CollapsibleAlert } from './ui/collapsible-alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface EmptyChatsListProps {
  emptyChats: EmptyChat[]
  className?: string
  alwaysOpen?: boolean
}

export function EmptyChatsList({ emptyChats, className, alwaysOpen }: EmptyChatsListProps) {
  if (emptyChats.length === 0) return null

  return (
    <CollapsibleAlert
      theme="amber"
      className={className}
      alwaysOpen={alwaysOpen}
      label={`${emptyChats.length} chat${emptyChats.length === 1 ? '' : 's'} sin actividad — sin mensajes para guardar`}
    >
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="h-auto px-3 py-2">Chat</TableHead>
            <TableHead className="h-auto px-3 py-2">Número</TableHead>
            <TableHead className="h-auto px-3 py-2">Motivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emptyChats.map((chat) => (
            <TableRow key={chat.chatId}>
              <TableCell className="px-3 py-2">{chat.chatName || '—'}</TableCell>
              {/* chatNumber es null para grupos (no tienen un numero "dueño") o
                  cuando WhatsApp no dejo resolver el @lid - en esos casos se
                  muestra el id interno como ultimo recurso, para no dejar la
                  celda vacia. */}
              <TableCell className="text-muted-foreground px-3 py-2">
                {chat.chatNumber || chat.chatId}
              </TableCell>
              <TableCell className="max-w-sm px-3 py-2 text-amber-700">
                <span className="flex items-start gap-1.5" title={chat.reason}>
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{chat.reason}</span>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CollapsibleAlert>
  )
}
