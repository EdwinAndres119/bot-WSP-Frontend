import { useEffect, useState } from 'react'
import { getStatus } from '../api/client'
import type { StatusResponse } from '../api/types'

const POLL_INTERVAL_MS = 1500

export function useStatusPolling(active: boolean) {
  const [status, setStatus] = useState<StatusResponse | null>(null)

  useEffect(() => {
    if (!active) return

    let cancelled = false

    const poll = async () => {
      try {
        const next = await getStatus()
        if (!cancelled) setStatus(next)
      } catch {
        // red inestable: se reintenta en el próximo ciclo
      }
    }

    poll()
    const intervalId = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [active])

  return status
}
