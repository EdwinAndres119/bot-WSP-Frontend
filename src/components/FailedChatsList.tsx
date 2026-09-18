import type { FailedChat } from '../api/types'
import { CollapsibleAlert } from './ui/collapsible-alert'

interface FailedChatsListProps {
  failedChats: FailedChat[]
  className?: string
  alwaysOpen?: boolean
}

export function FailedChatsList({ failedChats, className, alwaysOpen }: FailedChatsListProps) {
  if (failedChats.length === 0) return null

  return (
    <CollapsibleAlert
      theme="red"
      className={className}
      alwaysOpen={alwaysOpen}
      label={`${failedChats.length} chat${failedChats.length === 1 ? '' : 's'} fallido${
        failedChats.length === 1 ? '' : 's'
      } — revisar manualmente`}
    >
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-3 py-2">Chat</th>
            <th className="px-3 py-2">Número</th>
            <th className="px-3 py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {failedChats.map((chat) => (
            <tr key={chat.chatId} className="border-t border-gray-100">
              <td className="px-3 py-2">{chat.chatName || '—'}</td>
              {/* chatNumber es null para grupos (no tienen un numero "dueño") o
                  cuando WhatsApp no dejo resolver el @lid - en esos casos se
                  muestra el id interno como ultimo recurso, para no dejar la
                  celda vacia. */}
              <td className="px-3 py-2 text-gray-500">{chat.chatNumber || chat.chatId}</td>
              <td className="px-3 py-2 text-red-600">{chat.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollapsibleAlert>
  )
}
