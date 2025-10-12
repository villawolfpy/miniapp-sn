#!/bin/bash

# Script para iniciar la Mini App con túnel seguro
# Uso: ./start-miniapp.sh

echo "🚀 Iniciando Mini App SN Reader con túnel seguro..."
echo ""

# Verificar que ngrok esté disponible
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado. Instalando..."
    export PATH="$HOME/bin:$PATH"
fi

# Verificar que el servidor local esté corriendo
if ! curl -s http://localhost:3000 > /dev/null && ! curl -s http://localhost:3001 > /dev/null; then
    echo "📡 Iniciando servidor local en puerto 3000..."
    npm run dev &
    sleep 5
fi

# Determinar el puerto correcto
PORT=3000
if curl -s http://localhost:3001 > /dev/null; then
    PORT=3001
fi

echo "🌐 Servidor local corriendo en puerto $PORT"
echo ""

# Crear cuenta gratuita en ngrok si no existe
if [ ! -f ~/.ngrok2/ngrok.yml ]; then
    echo "📝 Necesitas crear una cuenta gratuita en ngrok:"
    echo "   1. Ve a https://ngrok.com/signup"
    echo "   2. Crea una cuenta gratuita"
    echo "   3. Copia tu authtoken desde https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "   4. Ejecuta: ngrok config add-authtoken TU_TOKEN_AQUI"
    echo ""
    echo "🔓 Mientras tanto, iniciando túnel temporal..."
    ngrok http $PORT --log=stdout
else
    echo "🔐 Iniciando túnel seguro con ngrok..."
    ngrok http $PORT --log=stdout
fi
