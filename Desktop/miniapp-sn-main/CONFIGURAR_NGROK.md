# 🔐 Configuración de ngrok - Paso a Paso

## 📝 Crear Cuenta Gratuita en ngrok

### Paso 1: Registrarse
1. Ve a **https://ngrok.com/signup**
2. Completa el formulario de registro
3. Verifica tu email

### Paso 2: Obtener Authtoken
1. Ve a **https://dashboard.ngrok.com/get-started/your-authtoken**
2. Copia tu authtoken (algo como: `2abc123def456ghi789jkl012mno345pqr678stu`)

### Paso 3: Configurar ngrok
```bash
# Reemplaza TU_TOKEN_AQUI con tu authtoken real
ngrok config add-authtoken TU_TOKEN_AQUI
```

### Paso 4: Probar
```bash
# Iniciar túnel
ngrok http 3000

# O usar nuestro script
./start-miniapp.sh
```

## 🆓 Límites de la Cuenta Gratuita

- **40 conexiones por minuto**
- **1 túnel simultáneo**
- **Sin límite de tiempo**
- **HTTPS incluido**

## 🔄 Alternativas si ngrok no funciona

### Opción 1: Cloudflare Tunnel (Gratuito)
```bash
# Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Usar
cloudflared tunnel --url http://localhost:3000
```

### Opción 2: localtunnel (Sin registro)
```bash
# Instalar
npm install -g localtunnel

# Usar
lt --port 3000
```

### Opción 3: serveo (Sin instalación)
```bash
# Usar directamente
ssh -R 80:localhost:3000 serveo.net
```

## 🚀 Comandos Rápidos

```bash
# Solo servidor local
npm run dev

# Con túnel ngrok (después de configurar authtoken)
ngrok http 3000

# Con túnel Cloudflare
cloudflared tunnel --url http://localhost:3000

# Con localtunnel
lt --port 3000
```
