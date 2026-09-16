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
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {failedChats.map((chat) => (
            <tr key={chat.chatId} className="border-t border-gray-100">
              <td className="px-3 py-2">{chat.chatName || '—'}</td>
              <td className="px-3 py-2 text-gray-500">{chat.chatId}</td>
              <td className="px-3 py-2 text-red-600">{chat.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollapsibleAlert>
  )
}
