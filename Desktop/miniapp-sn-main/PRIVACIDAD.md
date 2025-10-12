# 🔒 Guía Completa para Ocultar tu IP - Mini App SN Reader

## 🚀 Opciones Recomendadas (Orden de Preferencia)

### 1. **ngrok (Recomendado para Desarrollo)**
```bash
# Ya instalado en tu sistema
./start-miniapp.sh
```

**Ventajas:**
- ✅ Gratuito con límites generosos
- ✅ Fácil de usar
- ✅ HTTPS automático
- ✅ No requiere configuración compleja

**Configuración:**
1. Ve a https://ngrok.com/signup
2. Crea cuenta gratuita
3. Copia tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken
4. Ejecuta: `ngrok config add-authtoken TU_TOKEN_AQUI`

### 2. **Cloudflare Tunnel (Más Seguro)**
```bash
# Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Crear túnel
cloudflared tunnel --url http://localhost:3000
```

**Ventajas:**
- ✅ Completamente gratuito
- ✅ IP de Cloudflare (muy segura)
- ✅ Sin límites de tiempo
- ✅ Cifrado end-to-end

### 3. **VPN con IP Dedicada (Máxima Privacidad)**

#### **Private Internet Access (PIA)**
- **Costo:** $5/mes
- **IP Dedicada:** Sí
- **Ubicaciones:** US, Canadá, Australia, UK, Alemania
- **Registro:** https://www.privateinternetaccess.com/es/vpn-features/dedicated-ip-vpn

#### **NordVPN**
- **Costo:** $3.99/mes
- **Servidores especializados:** Sí
- **Registro:** https://nordvpn.com/

#### **ProtonVPN**
- **Costo:** Gratuito (limitado) / $4/mes
- **Enfoque:** Privacidad máxima
- **Registro:** https://protonvpn.com/

### 4. **VPS Anónimo (Máximo Control)**

#### **AbeloHost**
- **Costo:** Desde $5/mes
- **Pagos:** Criptomonedas aceptadas
- **Registro:** https://abelohost.com/

#### **1984 Hosting**
- **Costo:** Desde $3/mes
- **Enfoque:** Privacidad y anonimato
- **Registro:** https://1984.hosting/

#### **Njalla**
- **Costo:** Desde $15/mes
- **Registro:** Completamente anónimo
- **Registro:** https://njal.la/

## 🛠️ Configuración Paso a Paso

### Opción 1: ngrok (Más Fácil)
```bash
# 1. Crear cuenta en ngrok.com
# 2. Obtener authtoken
# 3. Configurar:
ngrok config add-authtoken TU_TOKEN_AQUI

# 4. Iniciar Mini App:
./start-miniapp.sh
```

### Opción 2: Cloudflare Tunnel (Más Seguro)
```bash
# 1. Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# 2. Iniciar túnel
cloudflared tunnel --url http://localhost:3000
```

### Opción 3: VPN + Servidor Local
```bash
# 1. Instalar VPN (ejemplo con OpenVPN)
sudo apt install openvpn

# 2. Configurar VPN con IP dedicada
# 3. Iniciar servidor local:
npm run dev

# 4. Acceder desde la IP de la VPN
```

## 🔐 Niveles de Privacidad

### **Nivel 1: Básico (ngrok gratuito)**
- IP oculta: ✅
- Cifrado: ✅
- Límites: 40 conexiones/minuto
- Costo: Gratuito

### **Nivel 2: Intermedio (Cloudflare Tunnel)**
- IP oculta: ✅
- Cifrado: ✅
- Límites: Ninguno
- Costo: Gratuito

### **Nivel 3: Avanzado (VPN + IP Dedicada)**
- IP oculta: ✅
- Cifrado: ✅
- IP dedicada: ✅
- Costo: $3-5/mes

### **Nivel 4: Máximo (VPS Anónimo)**
- IP oculta: ✅
- Cifrado: ✅
- Control total: ✅
- Anonimato completo: ✅
- Costo: $3-15/mes

## 🚀 Comandos Rápidos

```bash
# Iniciar Mini App con túnel
./start-miniapp.sh

# Solo servidor local
npm run dev

# Solo túnel ngrok
ngrok http 3000

# Solo túnel Cloudflare
cloudflared tunnel --url http://localhost:3000
```

## 📱 Probar la Mini App

1. **Inicia el túnel** con cualquiera de las opciones
2. **Copia la URL** que te proporcione (ej: https://abc123.ngrok.io)
3. **Comparte en Farcaster** para probar como Mini App
4. **Accede directamente** para probar el fallback

## ⚠️ Consideraciones de Seguridad

- **Nunca compartas** tu IP real en repositorios públicos
- **Usa HTTPS** siempre que sea posible
- **Configura firewall** para limitar acceso
- **Monitorea logs** de acceso
- **Actualiza regularmente** las herramientas de túnel

## 🆘 Solución de Problemas

### Error: "ngrok not found"
```bash
export PATH="$HOME/bin:$PATH"
```

### Error: "Port already in use"
```bash
# Cambiar puerto
npm run dev -- -p 3001
ngrok http 3001
```

### Error: "Authentication failed"
```bash
ngrok config add-authtoken TU_TOKEN_CORRECTO
```
