import type { StatusResponse } from '../api/types'

interface StatusBannerProps {
  status: StatusResponse
}

export function StatusBanner({ status }: StatusBannerProps) {
  if (status.state === 'completed') {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Extracción completada. {status.progress.saved} mensajes guardados.
      </div>
    )
  }

  if (status.state === 'error') {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Error: {status.errorMessage ?? 'Ocurrió un error desconocido'}
      </div>
    )
  }

  return null
}
