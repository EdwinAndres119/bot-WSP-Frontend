# Frontend WSP

Panel web para controlar el bot de extracción de WhatsApp (BOT_WSP): inicio/detención de extracciones, escaneo de QR, progreso en vivo y tabla de admin con el historial de corridas. Sin login — la API del backend está abierta.

Proyecto independiente del backend — solo consume su API vía HTTP.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`, sin config aparte)
- Sin router: navegación por tabs en estado local
- Sin librería de estado: `fetch` + polling con hooks propios

## Requisitos

- Node.js 20+
- El backend (BOT_WSP) corriendo en paralelo con `npm run web` (por defecto en `http://localhost:3001`)

## Setup

```bash
npm install
cp .env.example .env   # ajustar VITE_API_URL si el backend corre en otra URL
npm run dev
```

La app queda disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3001` |

## Scripts

- `npm run dev` — servidor de desarrollo con hot-reload
- `npm run build` — type-check (`tsc -b`) + build de producción
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — lint con oxlint

## Flujo de uso

1. **Extracción**: se ingresa la línea (nombre/número) y el límite de meses (1/2/3/6/sin límite) y se inicia con `POST /api/start`. La pantalla hace polling a `GET /api/status` cada 1.5s y muestra el QR cuando `state === 'qr'`, el progreso (barra segmentada + detalle + chats fallidos/sin actividad colapsables) cuando `state === 'extracting'`, y el resultado final en `completed`/`error`. Hay botón para cortar con `POST /api/stop`.
2. **Admin**: tabla con el historial de corridas (`GET /api/runs`), con detalle expandible de chats fallidos y sin actividad por corrida, y un link de descarga de CSV (`GET /api/export?runId=N`) por fila.

## Estructura

```
src/
  api/          # cliente HTTP (fetch wrapper) y tipos de la API
  hooks/        # useStatusPolling (polling de estado)
  lib/          # cn() (utilidad shadcn)
  components/ui/ # primitivas shadcn (card.tsx, collapsible-alert.tsx)
  components/   # ExtractionPanel, QrDisplay, ProgressBar, FailedChatsList, EmptyChatsList, StatusBanner, RunsTable
  App.tsx       # layout con tabs Extracción / Admin
```
