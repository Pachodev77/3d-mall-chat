#!/bin/bash

# Script de despliegue para el servidor de chat 3D
echo "🚀 Iniciando despliegue del servidor de chat 3D..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Instalar PM2 globalmente si no está instalado
if ! command -v pm2 &> /dev/null; then
    echo "🔧 Instalando PM2..."
    npm install -g pm2
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar el servidor con PM2
echo "🔄 Iniciando servidor con PM2..."
pm2 start ecosystem.config.js --env production

# Configurar PM2 para iniciar automáticamente al reiniciar el sistema
echo "⚙️ Configurando inicio automático..."
pm2 startup
pm2 save

echo "✅ Servidor desplegado exitosamente!"
echo "📊 Para ver logs: pm2 logs chat-server"
echo "🛑 Para detener: pm2 stop chat-server"
echo "🔄 Para reiniciar: pm2 restart chat-server"
echo "🌐 Servidor disponible en: http://localhost:8000" 