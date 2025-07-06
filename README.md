# 3D Mall Chat - Aplicación de Chat en Tiempo Real

Una aplicación de chat 3D con un centro comercial virtual donde los usuarios pueden personalizar avatares y chatear en tiempo real.

## 🚀 Despliegue Rápido en Vercel

### Opción 1: Despliegue Automático (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/3d-mall-chat)

1. Haz clic en el botón "Deploy with Vercel" arriba
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio
4. ¡Listo! Tu aplicación estará disponible en minutos

### Opción 2: Despliegue Manual

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/3d-mall-chat.git
cd 3d-mall-chat

# 2. Instalar dependencias
npm install

# 3. Desplegar en Vercel
npx vercel
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# O ejecutar directamente
node chat-server.js
```

La aplicación estará disponible en `http://localhost:8000`

## 📋 Características

- ✅ **Chat en tiempo real** con WebSockets
- ✅ **Personalización de avatares** (camisa, pantalones, zapatos)
- ✅ **Mundo 3D** con Three.js
- ✅ **Vista previa del avatar** en tiempo real
- ✅ **Almacenamiento local** de preferencias
- ✅ **Interfaz moderna** y responsive

## 🏗️ Estructura del Proyecto

```
project/
├── chat-server.js          # Servidor WebSocket
├── index.html              # Aplicación principal
├── package.json            # Dependencias
├── assets/                 # Imágenes y recursos
│   └── images/
├── components/             # Componentes React (si aplica)
└── README.md              # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **Backend**: Node.js + WebSocket
- **Frontend**: HTML5 + CSS3 + JavaScript
- **3D Graphics**: Three.js
- **Real-time**: WebSocket API
- **Hosting**: Vercel (recomendado)

## 🌐 Opciones de Despliegue

### Vercel (Recomendado)
- ✅ Soporte nativo para Node.js
- ✅ WebSockets funcionan perfectamente
- ✅ Despliegue automático desde GitHub
- ✅ SSL automático
- ✅ Dominio personalizado gratuito

### Otros Hostings
- **Railway**: Excelente para desarrollo
- **Render**: Buena opción gratuita
- **Heroku**: Confiable pero con costos
- **Netlify**: Solo para versión estática + Firebase

## 📱 Uso

1. **Personalizar Avatar**:
   - Haz clic en "👤 Personalizar"
   - Elige colores para camisa, pantalones y zapatos
   - Escribe tu nombre
   - Guarda la personalización

2. **Chat en Tiempo Real**:
   - Haz clic en "💬 Chat"
   - Escribe mensajes y presiona Enter
   - Ve mensajes de otros usuarios en tiempo real

3. **Navegación 3D**:
   - Usa WASD para moverte
   - Haz clic en las tiendas para visitarlas
   - Explora el centro comercial virtual

## 🔒 Seguridad

- Validación de entrada en cliente y servidor
- Sanitización de mensajes
- Límites de caracteres para nombres
- Timeouts para conexiones inactivas

## 🆘 Solución de Problemas

### Error: "Puerto 8000 en uso"
```bash
# Cambiar puerto en chat-server.js
const PORT = process.env.PORT || 8000;
```

### Error: "WebSocket no conecta"
- Verifica que el servidor esté ejecutándose
- Revisa la consola del navegador (F12)
- Asegúrate de que no haya firewall bloqueando

### Error: "Three.js no carga"
- Verifica la conexión a internet
- Revisa que el CDN de Three.js esté disponible

## 📊 Monitoreo

### Logs del Servidor
```bash
# Ver logs en tiempo real
npm run logs

# O directamente
node chat-server.js
```

### Métricas
- Usuarios conectados
- Mensajes por minuto
- Uso de memoria y CPU

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/3d-mall-chat/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/3d-mall-chat/discussions)
- **Email**: tu-email@example.com

## 🎉 Agradecimientos

- Three.js por la librería 3D
- Vercel por el hosting gratuito
- La comunidad de desarrolladores

---

**¡Disfruta chateando en el centro comercial virtual! 🛍️💬** 