#!/bin/bash

# Script alternativo para iniciar la Mini App con túnel seguro
# Uso: ./start-miniapp-alt.sh

echo "🚀 Iniciando Mini App SN Reader con túnel alternativo..."
echo ""

# Verificar que el servidor local esté corriendo
if ! curl -s http://localhost:3000 > /dev/null && ! curl -s http://localhost:3001 > /dev/null && ! curl -s http://localhost:3002 > /dev/null; then
    echo "📡 Iniciando servidor local..."
    npm run dev &
    sleep 5
fi

# Determinar el puerto correcto
PORT=3000
if curl -s http://localhost:3001 > /dev/null; then
    PORT=3001
elif curl -s http://localhost:3002 > /dev/null; then
    PORT=3002
fi

echo "🌐 Servidor local corriendo en puerto $PORT"
echo ""

# Verificar si ngrok está configurado
if [ -f ~/.config/ngrok/ngrok.yml ] || ngrok config check > /dev/null 2>&1; then
    echo "🔐 Usando ngrok (configurado)..."
    ngrok http $PORT --log=stdout
else
    echo "🔓 Usando localtunnel (sin configuración requerida)..."
    echo "📝 URL del túnel aparecerá en unos segundos..."
    lt --port $PORT
fi
