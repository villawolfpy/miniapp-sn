# Miniapp SN — Frames para Stacker News

Mini-aplicación basada en Next.js que expone un Frame v2 para Farcaster. El frame consume los feeds RSS de los territorios de [Stacker News](https://stacker.news) y permite navegar entre los posts recientes, abrirlos en el sitio y cambiar de territorio sin salir de Warpcaster u otro cliente compatible.

## Características

- Next.js (app router) escrito en TypeScript.
- Rutas serverless para `/frames/sn` (feed) y `/frames/sn/select` (selector de territorios).
- Imagen dinámica generada con `@vercel/og`/`ImageResponse`.
- Caché en memoria de 5 minutos para el RSS de cada territorio.
- Controles de navegación: anterior, siguiente, abrir post y cambiar territorio.
- Selector rápido de territorios predefinidos con opción para introducir uno personalizado.

## Requisitos previos

- Node.js 18 o superior (recomendado 20+).
- npm 9+.

## Instalación

```bash
npm install
```

> Si se actualizan variables como el territorio por defecto, recuerda reiniciar el servidor de desarrollo.

## Scripts disponibles

- `npm run dev`: inicia el entorno de desarrollo en `http://localhost:3000`.
- `npm run build`: genera el build de producción.
- `npm run start`: ejecuta el build de producción.

## Configuración

Variables de entorno opcionales:

- `DEFAULT_TERRITORY` — territorio inicial (por defecto `~bitcoin`).
- `CACHE_TTL_SECONDS` — duración de la caché RSS en segundos (por defecto `300`).
- `ALLOWED_TERRITORIES` — lista separada por comas para el selector rápido (por defecto `~bitcoin,~nostr,~design,~jobs`).

## Endpoints clave

| Ruta | Descripción |
|------|-------------|
| `/frames/sn` | Frame principal. Lee el estado `{ territory, index }`, consume el RSS y responde con la imagen + botones. |
| `/frames/sn/image` | Renderiza la imagen del frame (feed o estados vacíos). |
| `/frames/sn/select` | Pantalla de selección de territorio dentro del frame. |

La landing principal (`/`) describe cómo probar el frame y muestra el endpoint.

## Flujo del Frame

1. Warpcaster realiza `POST` a `/frames/sn` enviando `state` (territorio e índice) y la `buttonIndex` pulsada.
2. La ruta descarga el RSS del territorio (con caché 5 minutos) y determina el post actual.
3. Devuelve un objeto Frame v2 con imagen cuadrada, botones de navegación y enlace al post original.
4. El botón “Cambiar territorio” envía al frame `/frames/sn/select`, donde se puede elegir uno de los territorios predefinidos o introducir otro.
5. Al confirmar, se regresa al feed con el nuevo territorio y el índice reiniciado a `0`.

## Pruebas locales

1. Ejecuta `npm run dev`.
2. Desde otra terminal puedes usar [frames.js playground](https://warpcast.com/~/developers/frames) o herramientas similares para enviar requests manuales a `http://localhost:3000/frames/sn`.
3. Comprueba que:
   - Se muestra el post más reciente del territorio por defecto.
   - Los botones “Anterior” y “Siguiente” recorren los posts del feed.
   - “Abrir post” apunta a la URL real del ítem.
   - “Cambiar territorio” abre el selector y al elegir uno nuevo vuelve al feed.

> Los feeds de Stacker News pueden tardar unos segundos en responder. Existe un timeout de 5s para evitar bloquear la ruta.

## Despliegue en Vercel

1. Crea un nuevo proyecto en Vercel y selecciona este repositorio.
2. Configura (opcionalmente) las variables de entorno mencionadas.
3. Despliega. El runtime de las rutas `/frames/sn` y `/frames/sn/select` está fijado a `edge`, por lo que se ejecutan en la red perimetral de Vercel.
4. Tras el primer despliegue, usa la URL pública de Vercel como base para el frame (`https://tu-proyecto.vercel.app/frames/sn`).

## Uso en Warpcaster

1. Publica un cast con la URL del frame (`https://tu-proyecto.vercel.app/frames/sn`).
2. Al abrirlo:
   - Verás el post más reciente del territorio configurado.
   - Podrás navegar con los botones y abrir el enlace en Stacker News.
   - El botón de cambio te permitirá seleccionar otro territorio sin salir del frame.

¡Listo! Tienes un Frame v2 funcional para explorar Stacker News desde Farcaster.
