# CLAUDE.md

Contexto para trabajar en este repo con Claude Code.

## Qué es esto

Frontend independiente (Vite + React + TypeScript + Tailwind v4) para un panel que controla un bot de extracción de WhatsApp. El backend vive en otro proyecto (`BOT_WSP`, carpeta hermana) y expone su API en `http://localhost:3001` (variable `VITE_API_URL`); se levanta aparte con `npm run web` desde ese repo. Este proyecto nunca implementa lógica de negocio del bot — solo consume la API.

## Decisiones de arquitectura (no las reabras sin pedirlo el usuario)

- **Sin auth**: por pedido explícito ("instrucción de los jefes"), la app no tiene login de ningún tipo — ni clave única ni cuentas por correo/contraseña (se probaron y se sacaron ambas). Entra directo a la pantalla de Extracción. No reintroducir un gate de auth sin que el usuario lo pida de nuevo.
- **Sin router**: la navegación entre "Extracción" y "Admin" es un tab en estado local de `App.tsx`, no `react-router`. No hace falta SSR/routing para este panel.
- **Sin librería de estado**: todo el estado remoto se maneja con hooks propios (`useStatusPolling`) sobre `fetch`, sin SWR/React Query.
- **Polling, no websockets**: `GET /api/status` se consulta cada 1.5s mientras la tab de Extracción está montada (`src/hooks/useStatusPolling.ts`). El backend no expone push/streaming.
- **Convención shadcn para UI**: `src/components/ui/` tiene las primitivas (`card.tsx`, `collapsible-alert.tsx`), `src/lib/utils.ts` tiene `cn()`, `components.json` declara los alias. Seguir ese patrón si se agregan más primitivas.
- **`FailedChatsList` y `EmptyChatsList` nunca se mezclan**: son conceptos distintos ("falló por error real" vs. "se revisó bien pero no tenía nada que guardar") y el equipo de negocio los revisa por separado — no fusionar en una sola lista/tabla aunque parezca "ahorrar espacio". Ambos son wrappers finos sobre `ui/collapsible-alert.tsx` (tema `red` vs `amber`) para no duplicar el shell colapsable, pero siguen siendo dos componentes/secciones separadas en la UI.

## Contrato de la API (backend BOT_WSP)

Todos los endpoints están abiertos, sin autenticación — no mandar header `Authorization`.

- `POST /api/start` — `{ lineLabel, monthsLimit }` (monthsLimit `null` = sin límite) → `{ ok: true }` o 409 si ya hay una corrida en curso
- `GET /api/status` — pensado para poll cada 1-2s; `state` es `idle | starting | qr | extracting | completed | error`; trae `qrDataUrl` (data URL de imagen) solo en `state === 'qr'`, y `progress` (`chatsFound/processed/failed/saved/failedChats/emptyChats`) durante `extracting` — `failedChats` es `{chatId, chatNumber, isGroup, chatName, error}[]` (error técnico real), `emptyChats` es `{chatId, chatNumber, isGroup, chatName, reason}[]` (se revisó bien, no había mensajes; `reason` es uno de tres textos fijos del backend). `chatNumber` (agregado 2026-09-17 en el backend) es el número real resuelto desde el `@lid` interno de WhatsApp — viene `null` para grupos (no tienen un número "dueño") o cuando WhatsApp no dejó resolverlo; en la UI hay que mostrar `chatNumber ?? chatId` (o `||`), nunca asumir que `chatNumber` siempre viene con dato.
- `POST /api/stop` — corta la extracción/sesión en curso
- `GET /api/runs` — historial de corridas para el panel de admin, más reciente primero; cada fila trae `failed_chats`/`empty_chats` (mismo shape que arriba, snake_case acá)
- `GET /api/export?runId=N` — CSV descargable de los mensajes de esa corrida; se usa como `<a href>` directo (`getExportUrl(runId)` en `src/api/client.ts`), no como fetch
- `GET /api/export/empty?runId=N` (backend agregado 2026-09-17) — CSV descargable de los chats vacíos de esa corrida (`chatNumber`, `chatName`, `isGroup`, `reason`). `runId` es obligatorio acá. Mismo patrón de uso que `/api/export`: `<a href>` directo, no fetch. **Pendiente de conectar en este frontend** — hoy solo existe el botón de descarga para `/api/export`; si el negocio lo pide, agregar un segundo link/botón junto a él (ver `RunsTable.tsx`, que ya tiene `getExportUrl(runId)` como referencia de patrón).

Los tipos exactos de estas respuestas están en [src/api/types.ts](src/api/types.ts); no los infieras de memoria, léelos ahí si necesitás el shape completo.

## Nota importante

`progress.failedChats`/`emptyChats` y `run.failed_chats`/`empty_chats` son campos relativamente nuevos en la API — si el backend corre una versión vieja o no aplicó la migración correspondiente, pueden llegar `undefined` en vez de un array (se vio pasar en vivo más de una vez durante el desarrollo). Por eso `ProgressBar.tsx` y `RunsTable.tsx` los tratan con fallback a `[]` en vez de asumir que siempre vienen. No sacar esos fallbacks salvo que se confirme que el backend en uso SIEMPRE los manda.

## Estructura

```
src/
  api/client.ts        # fetch wrapper: base URL, parseo de errores (sin auth)
  api/types.ts          # tipos de las respuestas de la API
  hooks/useStatusPolling.ts
  lib/utils.ts            # cn() (clsx + tailwind-merge), convención shadcn
  components/ui/          # primitivas shadcn: card.tsx, collapsible-alert.tsx (shell colapsable rojo/ámbar)
  components/              # ExtractionPanel, QrDisplay, ProgressBar (dashboard de progreso), FailedChatsList, EmptyChatsList (colapsables, nunca mezclados), StatusBanner, RunsTable
  App.tsx                   # tabs Extracción/Admin, sin gate
```

## Skills opcionales (no están en el repo)

`.agents/` y `.claude/` están en `.gitignore` — son herramientas locales de agentes, no parte del proyecto, así que un clone fresco NO las va a tener. Si hacen falta en otra máquina, reinstalar con `npx skills add <repo> --skill <nombre>`:

- `vercel-react-best-practices` (`github.com/vercel-labs/agent-skills`) — reglas de performance de React/Next.js (re-renders, waterfalls, bundle). Ya aplicadas en el código existente: ternarios en vez de `&&` para render condicional, `setState` funcional, dependencias primitivas en efectos, cleanup correcto del polling — no hace falta reinstalar la skill para que el código funcione, es solo para seguir el mismo criterio si se agrega código nuevo.
- `typescript-expert` (`github.com/sickn33/agentic-awesome-skills`) — patrones de tipado avanzado, migraciones, tooling TS.
- `frontend-design` (`github.com/anthropics/skills`) — guía de dirección visual/tipografía para que el UI no se vea "default".
