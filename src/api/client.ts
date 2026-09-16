import type { ApiErrorBody, RunRecord, StartPayload, StatusResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(response.status, body?.error ?? 'Error de red')
  }

  return response.json() as Promise<T>
}

export function startExtraction(payload: StartPayload): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>('/api/start', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getStatus(): Promise<StatusResponse> {
  return apiFetch<StatusResponse>('/api/status')
}

export function stopExtraction(): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>('/api/stop', { method: 'POST' })
}

export function getRuns(): Promise<RunRecord[]> {
  return apiFetch<RunRecord[]>('/api/runs')
}

export function getExportUrl(runId: number): string {
  return `${API_URL}/api/export?runId=${runId}`
}
