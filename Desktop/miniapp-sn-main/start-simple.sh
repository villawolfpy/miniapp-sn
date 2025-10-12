#!/bin/bash

# Script simple para iniciar la Mini App
# Uso: ./start-simple.sh

echo "🚀 Iniciando Mini App SN Reader..."
echo ""

# Verificar que el servidor local esté corriendo
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "📡 Iniciando servidor local..."
    npm run dev &
    sleep 3
fi

echo "✅ Servidor local funcionando en:"
echo "   🌐 http://localhost:3000"
echo "   🌐 http://192.168.100.7:3000 (red local)"
echo ""

echo "📱 Para probar la Mini App:"
echo "   1. Comparte http://192.168.100.7:3000 en Farcaster"
echo "   2. O usa un túnel externo:"
echo ""

echo "🔗 Opciones de túnel:"
echo "   • ngrok: ngrok http 3000 (requiere cuenta)"
echo "   • localtunnel: lt --port 3000 (sin registro)"
echo "   • Cloudflare: cloudflared tunnel --url http://localhost:3000"
echo ""

echo "📋 Para configurar ngrok:"
echo "   1. Ve a https://ngrok.com/signup"
echo "   2. Copia tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken"
echo "   3. Ejecuta: ngrok config add-authtoken TU_TOKEN_AQUI"
echo ""

echo "🎯 La Mini App está lista para usar!"
