interface QrDisplayProps {
  qrDataUrl: string | null
}

export function QrDisplay({ qrDataUrl }: QrDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-700">
        Escaneá el código con WhatsApp
      </p>
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="QR de WhatsApp" className="h-56 w-56" />
      ) : (
        <div className="flex h-56 w-56 items-center justify-center text-sm text-gray-400">
          Generando QR…
        </div>
      )}
    </div>
  )
}
