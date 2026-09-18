import type { EmptyChat } from '../api/types'
import { CollapsibleAlert } from './ui/collapsible-alert'

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
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-3 py-2">Chat</th>
            <th className="px-3 py-2">Número</th>
            <th className="px-3 py-2">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {emptyChats.map((chat) => (
            <tr key={chat.chatId} className="border-t border-gray-100">
              <td className="px-3 py-2">{chat.chatName || '—'}</td>
              {/* chatNumber es null para grupos (no tienen un numero "dueño") o
                  cuando WhatsApp no dejo resolver el @lid - en esos casos se
                  muestra el id interno como ultimo recurso, para no dejar la
                  celda vacia. */}
              <td className="px-3 py-2 text-gray-500">{chat.chatNumber || chat.chatId}</td>
              <td className="px-3 py-2 text-amber-700">{chat.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollapsibleAlert>
  )
}
