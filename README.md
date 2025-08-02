# 3D Mall Chat - Aplicación de Chat en Tiempo Real

Una aplicación de chat 3D con un centro comercial virtual donde los usuarios pueden personalizar avatares y chatear en tiempo real.

## 🚀 Despliegue en Diferentes Hostings

### 1. **VPS/Dedicado (Recomendado)**

#### Opción A: Con PM2 (Automático)
```bash
# Clonar el proyecto
git clone <tu-repositorio>
cd proyecto

# Ejecutar script de despliegue
chmod +x deploy.sh
./deploy.sh
```

#### Opción B: Manual
```bash
# Instalar dependencias
npm install

# Instalar PM2
npm install -g pm2

# Iniciar servidor
pm2 start ecosystem.config.js --env production

# Configurar inicio automático
pm2 startup
pm2 save
```

### 2. **Hosting Compartido (Sin Node.js)**

Para hosting que no permite servidores Node.js:

#### Opción A: Netlify/Vercel + Servicio WebSocket Externo
1. **Subir archivos estáticos** a Netlify/Vercel
2. **Usar servicio de WebSocket** como:
   - Firebase Realtime Database
   - Pusher
   - Socket.io con servidor separado

#### Opción B: Heroku
```bash
# Crear app en Heroku
heroku create tu-app-name

# Configurar variables de entorno
heroku config:set NODE_ENV=production

# Desplegar
git push heroku main
```

### 3. **Docker (Para cualquier hosting)**

Crear `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

```bash
# Construir imagen
docker build -t 3d-mall-chat .

# Ejecutar contenedor
docker run -p 8000:8000 3d-mall-chat
```

## 📋 Comandos Útiles

### PM2 (Gestión del servidor)
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs chat-server

# Reiniciar
pm2 restart chat-server

# Detener
pm2 stop chat-server

# Eliminar
pm2 delete chat-server
```

### Monitoreo
```bash
# Dashboard de PM2
pm2 monit

# Ver uso de recursos
pm2 show chat-server
```

## 🔧 Configuración de Producción

### Variables de Entorno
```bash
NODE_ENV=production
PORT=8000
```

### Firewall
```bash
# Abrir puerto 8000
sudo ufw allow 8000
```

### Nginx (Proxy reverso)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoreo y Logs

### Logs del Sistema
```bash
# Ver logs en tiempo real
tail -f logs/chat-server.log

# Ver logs de PM2
pm2 logs chat-server --lines 100
```

### Monitoreo de Recursos
```bash
# Ver uso de CPU y memoria
pm2 monit

# Estadísticas detalladas
pm2 show chat-server
```

## 🔒 Seguridad

### Recomendaciones
1. **Usar HTTPS** en producción
2. **Configurar firewall** apropiadamente
3. **Limitar conexiones** por IP
4. **Validar datos** de entrada
5. **Usar variables de entorno** para configuraciones sensibles

### Ejemplo de configuración segura
```javascript
// En chat-server.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
}));
```

## 🆘 Solución de Problemas

### Servidor no inicia
```bash
# Verificar puerto
netstat -tulpn | grep :8000

# Verificar logs
pm2 logs chat-server

# Reiniciar PM2
pm2 restart chat-server
```

### Conexiones WebSocket fallan
- Verificar que el puerto 8000 esté abierto
- Verificar configuración de proxy/firewall
- Revisar logs del servidor

### Alto uso de memoria
```bash
# Ver uso de memoria
pm2 monit

# Reiniciar si es necesario
pm2 restart chat-server
```

## 📞 Soporte

Para problemas específicos:
1. Revisar logs: `pm2 logs chat-server`
2. Verificar estado: `pm2 status`
3. Reiniciar servicio: `pm2 restart chat-server` 