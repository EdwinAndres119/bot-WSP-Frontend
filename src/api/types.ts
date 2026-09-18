export type StatusState =
  | 'idle'
  | 'starting'
  | 'qr'
  | 'extracting'
  | 'completed'
  | 'error'

export interface FailedChat {
  chatId: string
  chatNumber: string | null
  isGroup: boolean
  chatName: string
  error: string
}

export interface EmptyChat {
  chatId: string
  chatNumber: string | null
  isGroup: boolean
  chatName: string
  reason: string
}

export interface Progress {
  chatsFound: number
  processed: number
  failed: number
  saved: number
  failedChats: FailedChat[]
  emptyChats: EmptyChat[]
}

export interface StatusResponse {
  state: StatusState
  lineLabel: string | null
  monthsLimit: number | null
  runId: number | null
  qrDataUrl: string | null
  progress: Progress
  errorMessage: string | null
}

export interface RunRecord {
  id: number
  line_label: string
  months_limit: number | null
  status: 'running' | 'completed' | 'error'
  chats_found: number
  chats_processed: number
  chats_failed: number
  messages_saved: number
  started_at: string
  finished_at: string | null
  error_message: string | null
  failed_chats: FailedChat[]
  empty_chats: EmptyChat[]
}

export interface StartPayload {
  lineLabel: string
  monthsLimit: number | null
}

export interface ApiErrorBody {
  error: string
}
