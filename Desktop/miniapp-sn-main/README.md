# SN Reader — Farcaster Mini App

Una Mini App de Farcaster para leer posts de Stacker News directamente desde tu cliente de Farcaster.

## 🚀 Demo en Vivo

**URL de la Mini App:** https://pink-books-grow.loca.lt

## ✨ Características

- 📱 **Navegación por territorios**: Bitcoin, Tech, Nostr, Meta, Recientes
- 🔗 **Compartir posts**: Directamente en Farcaster
- 🌐 **Abrir enlaces**: En navegador externo
- 🎨 **UI profesional**: Optimizada para móvil (424×695)
- ⚡ **API Edge**: Optimizada con caché
- 🛡️ **Manejo de errores**: Estados robustos y reintentos

## 🛠️ Tecnologías

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Edge Runtime** para API routes
- **Farcaster Mini Apps SDK**

## 📱 Cómo Usar

1. **Comparte el enlace** https://pink-books-grow.loca.lt en Farcaster
2. **Haz clic en "Abrir Mini App"** en la tarjeta que aparece
3. **Navega por territorios** usando el selector
4. **Comparte posts** o **abre enlaces** según necesites

## 🔧 Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build
```

## 📊 API

### GET `/api/rss?territory=bitcoin`

Obtiene posts de Stacker News por territorio.

**Parámetros:**
- `territory`: `recent` | `bitcoin` | `tech` | `nostr` | `meta`

**Respuesta:**
```json
{
  "items": [
    {
      "id": "string",
      "title": "string", 
      "url": "string",
      "points": "number",
      "by": "string",
      "timeAgo": "string"
    }
  ]
}
```

## 🎯 Territorios Disponibles

- **recent**: Posts recientes
- **bitcoin**: Temas de Bitcoin
- **tech**: Tecnología
- **nostr**: Protocolo Nostr
- **meta**: Meta (Stacker News)

## 📄 Licencia

MIT
