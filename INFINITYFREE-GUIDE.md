# 🚀 Guía de Despliegue en InfinityFree

## 📋 Requisitos Previos

1. **Cuenta en InfinityFree** (gratuita)
2. **Proyecto en Firebase** (para WebSocket)
3. **Archivos del proyecto**

## 🔧 Paso 1: Configurar Firebase

### 1.1 Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Realtime Database**
4. Configura las reglas de seguridad:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    },
    "messages": {
      ".read": true,
      ".write": true
    },
    "positions": {
      ".read": true,
      ".write": true
    }
  }
}
```

### 1.2 Obtener configuración
1. Ve a **Project Settings** > **General**
2. Desplázate hasta **Your apps**
3. Crea una nueva app web
4. Copia la configuración

## 🔧 Paso 2: Configurar Archivos

### 2.1 Actualizar firebase-config.js
Reemplaza la configuración en `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 2.2 Archivos a subir a InfinityFree
Sube estos archivos a tu hosting:

- ✅ `index-infinityfree.html` → `index.html`
- ✅ `firebase-config.js`
- ✅ `assets/` (carpeta con imágenes)
- ✅ `INFINITYFREE-GUIDE.md` (opcional)

## 🌐 Paso 3: Subir a InfinityFree

### 3.1 Acceder al panel de control
1. Inicia sesión en [InfinityFree](https://infinityfree.net/)
2. Ve a **Control Panel**
3. Selecciona tu dominio

### 3.2 Subir archivos
1. Ve a **File Manager**
2. Navega a la carpeta `htdocs` o `public_html`
3. Sube los archivos:
   - Arrastra `index-infinityfree.html` y renómbralo a `index.html`
   - Sube `firebase-config.js`
   - Sube la carpeta `assets/` completa

### 3.3 Estructura final
```
public_html/
├── index.html (renombrado desde index-infinityfree.html)
├── firebase-config.js
└── assets/
    └── images/
        ├── adbtc-logo.png
        ├── binance-logo.png
        └── ... (todas las imágenes)
```

## ✅ Paso 4: Verificar Funcionamiento

### 4.1 Probar la aplicación
1. Ve a tu dominio: `https://tu-dominio.infinityfreeapp.com`
2. Deberías ver la aplicación cargando
3. Prueba la personalización del avatar
4. Prueba el chat (necesitas otro usuario)

### 4.2 Verificar Firebase
1. Abre las **Developer Tools** (F12)
2. Ve a la pestaña **Console**
3. Deberías ver: "Conectado al chat como: [tu-nombre]"
4. Ve a Firebase Console > Realtime Database
5. Deberías ver datos en tiempo real

## 🔧 Paso 5: Configuración Avanzada

### 5.1 Dominio personalizado (opcional)
1. En InfinityFree, ve a **Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### 5.2 SSL/HTTPS
- InfinityFree proporciona SSL automático
- Tu sitio será accesible en `https://`

## 🆘 Solución de Problemas

### Problema: "Firebase no está definido"
**Solución:**
- Verifica que los scripts de Firebase estén cargando
- Revisa la consola del navegador para errores

### Problema: "No se puede conectar al chat"
**Solución:**
- Verifica la configuración de Firebase
- Asegúrate de que Realtime Database esté habilitado
- Revisa las reglas de seguridad

### Problema: "Las imágenes no cargan"
**Solución:**
- Verifica que la carpeta `assets/` esté subida correctamente
- Revisa las rutas en el código

### Problema: "Error 404"
**Solución:**
- Asegúrate de que `index-infinityfree.html` esté renombrado a `index.html`
- Verifica que esté en la carpeta raíz (`public_html`)

## 📊 Monitoreo

### Verificar usuarios activos
1. Ve a Firebase Console
2. Realtime Database
3. Nodo `users` - muestra usuarios conectados

### Verificar mensajes
1. Nodo `messages` - historial de chat
2. Se limpia automáticamente (últimos 100)

## 🔒 Seguridad

### Recomendaciones
1. **Limitar acceso** a Firebase Database
2. **Configurar reglas** más restrictivas en producción
3. **Monitorear uso** de Firebase (límites gratuitos)

### Reglas de seguridad avanzadas
```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": "auth != null || newData.child('timestamp').val() > (now - 30000)"
    },
    "messages": {
      ".read": true,
      ".write": "newData.child('timestamp').val() > (now - 60000)"
    }
  }
}
```

## 💰 Costos

### InfinityFree
- ✅ **Hosting**: Gratuito
- ✅ **Dominio**: Gratuito (subdominio)
- ✅ **SSL**: Gratuito

### Firebase
- ✅ **Realtime Database**: Gratuito hasta 1GB/mes
- ✅ **Hosting**: No necesario (usando InfinityFree)

## 📞 Soporte

### InfinityFree
- [Foro de soporte](https://forum.infinityfree.net/)
- [Documentación](https://infinityfree.net/support/)

### Firebase
- [Documentación](https://firebase.google.com/docs)
- [Soporte](https://firebase.google.com/support)

## 🎉 ¡Listo!

Tu aplicación 3D Mall Chat ahora está funcionando en InfinityFree con:
- ✅ Chat en tiempo real
- ✅ Personalización de avatares
- ✅ Mundo 3D básico
- ✅ Almacenamiento local
- ✅ Completamente gratuito

**URL de tu aplicación:** `https://tu-dominio.infinityfreeapp.com` 