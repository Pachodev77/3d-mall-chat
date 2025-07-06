# 🚀 Guía Completa: GitHub + Vercel

## 📋 Pasos para Desplegar tu Proyecto

### Paso 1: Preparar el Repositorio Local

```bash
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Initial commit: 3D Mall Chat application"

# 4. Verificar el estado
git status
```

### Paso 2: Crear Repositorio en GitHub

1. **Ve a [GitHub](https://github.com)**
2. **Haz clic en "New repository"**
3. **Configura el repositorio:**
   - **Repository name**: `3d-mall-chat`
   - **Description**: `3D Mall Chat - Real-time chat application with avatar customization`
   - **Visibility**: Public (recomendado)
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)

4. **Haz clic en "Create repository"**

### Paso 3: Conectar Repositorio Local con GitHub

```bash
# 1. Agregar el repositorio remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/3d-mall-chat.git

# 2. Cambiar a la rama main (si no estás en ella)
git branch -M main

# 3. Subir el código a GitHub
git push -u origin main
```

### Paso 4: Desplegar en Vercel

#### Opción A: Despliegue Automático (Recomendado)

1. **Ve a [Vercel](https://vercel.com)**
2. **Regístrate/Inicia sesión** con tu cuenta de GitHub
3. **Haz clic en "New Project"**
4. **Importa tu repositorio** `3d-mall-chat`
5. **Configura el proyecto:**
   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (dejar por defecto)
   - **Output Directory**: `./` (dejar por defecto)
   - **Install Command**: `npm install` (dejar por defecto)

6. **Haz clic en "Deploy"**

#### Opción B: Despliegue con CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Iniciar sesión en Vercel
vercel login

# 3. Desplegar
vercel

# 4. Seguir las instrucciones en pantalla
```

### Paso 5: Configurar Variables de Entorno (Opcional)

En Vercel Dashboard:
1. Ve a tu proyecto
2. **Settings** > **Environment Variables**
3. Agregar si es necesario:
   ```
   NODE_ENV=production
   PORT=3000
   ```

## ✅ Verificar el Despliegue

### 1. Verificar la URL
- Vercel te dará una URL como: `https://tu-proyecto.vercel.app`
- La aplicación debería cargar correctamente

### 2. Probar Funcionalidades
1. **Personalización de avatar**: Debería funcionar
2. **Chat**: Debería conectarse y enviar mensajes
3. **Mundo 3D**: Debería cargar correctamente

### 3. Verificar Logs
En Vercel Dashboard:
1. Ve a **Functions**
2. Revisa los logs de `chat-server.js`

## 🔧 Configuración Avanzada

### Dominio Personalizado
1. En Vercel Dashboard > **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### Configuración de WebSockets
Vercel soporta WebSockets nativamente, pero asegúrate de:
1. Usar `wss://` en producción (Vercel lo maneja automáticamente)
2. El servidor esté configurado correctamente

### Optimizaciones
```javascript
// En chat-server.js, agregar para producción
const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';
```

## 🆘 Solución de Problemas

### Error: "Build failed"
**Solución:**
- Verifica que `package.json` tenga las dependencias correctas
- Revisa los logs de build en Vercel

### Error: "WebSocket connection failed"
**Solución:**
- Verifica que el servidor esté ejecutándose
- Revisa que la URL del WebSocket sea correcta
- Asegúrate de que Vercel soporte WebSockets

### Error: "Assets not found"
**Solución:**
- Verifica que la carpeta `assets/` esté incluida en el repositorio
- Revisa las rutas en el código

### Error: "Function timeout"
**Solución:**
- Aumenta el timeout en `vercel.json`
- Optimiza el código del servidor

## 📊 Monitoreo

### Vercel Analytics
1. Ve a **Analytics** en Vercel Dashboard
2. Revisa métricas de rendimiento
3. Monitorea errores

### Logs en Tiempo Real
```bash
# Ver logs en tiempo real
vercel logs --follow
```

## 🔄 Actualizaciones

### Para futuras actualizaciones:
```bash
# 1. Hacer cambios en tu código
# 2. Commit y push a GitHub
git add .
git commit -m "Update: nueva funcionalidad"
git push

# 3. Vercel se actualiza automáticamente
```

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
- **URL de Vercel**: `https://tu-proyecto.vercel.app`
- **WebSocket**: `wss://tu-proyecto.vercel.app`

### Funcionalidades que funcionarán:
- ✅ Chat en tiempo real
- ✅ Personalización de avatares
- ✅ Mundo 3D
- ✅ Almacenamiento local
- ✅ Interfaz completa

## 📞 Soporte

### Vercel
- [Documentación](https://vercel.com/docs)
- [Soporte](https://vercel.com/support)

### GitHub
- [Documentación](https://docs.github.com)
- [Soporte](https://support.github.com)

### Tu Proyecto
- Revisa los logs en Vercel Dashboard
- Verifica la consola del navegador (F12)
- Revisa el estado del servidor 