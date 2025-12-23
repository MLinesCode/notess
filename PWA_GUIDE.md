# PWA - Progressive Web App

## 📱 Configuración PWA para iOS y Android

La aplicación está completamente configurada como PWA (Progressive Web App) para soportar notificaciones en iOS Safari cuando está instalada.

---

## 🍎 iOS Safari - Limitaciones y Solución

### ⚠️ Problema
**iOS Safari NO soporta notificaciones web estándar** en el navegador. Las notificaciones solo funcionan cuando:
- La app está **instalada como PWA** en la pantalla de inicio
- iOS 16.4 o superior

### ✅ Solución: Instalar como PWA

#### En iOS Safari:
1. Abre la app en Safari
2. Toca el botón de **Compartir** (icono de compartir)
3. Desplázate y toca **"Agregar a pantalla de inicio"**
4. Confirma el nombre y toca **"Agregar"**
5. Abre la app desde la pantalla de inicio
6. Ahora sí se solicitarán permisos de notificación ✅

#### En iOS Brave:
Brave en iOS usa el mismo motor que Safari, por lo que tiene las mismas limitaciones. Sigue los pasos anteriores.

---

## 🤖 Android - Soporte Completo

Android soporta notificaciones web tanto en navegador como en PWA instalada.

### Chrome/Brave Android:
1. Abre la app
2. Verás un banner "Instalar aplicación" o el menú de opciones
3. Toca "Instalar" o "Agregar a pantalla de inicio"
4. Las notificaciones funcionan inmediatamente ✅

### Navegador sin instalar:
Las notificaciones funcionan directamente sin necesidad de instalar la PWA.

---

## 💻 Desktop - Soporte Completo

En computadoras (Windows, Mac, Linux), las notificaciones funcionan:
- ✅ En navegador sin instalar
- ✅ Como PWA instalada

---

## 🔧 Archivos PWA Implementados

### 1. manifest.json
Configuración de la PWA con:
- Nombre y descripción
- Iconos (192x192 y 512x512)
- Tema y colores
- Modo de pantalla (standalone)
- Shortcuts rápidos

### 2. Service Worker (sw.js)
- Cache de recursos para funcionar offline
- Estrategia Network First
- Soporte para notificaciones push
- Gestión de actualizaciones

### 3. usePWA Hook
- Registro automático del service worker
- Detección de instalación
- Prompt de instalación personalizable

### 4. Meta Tags iOS
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Notas" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

---

## 🎯 Cómo Verificar PWA

### Lighthouse (Chrome DevTools)
1. Abre DevTools (F12)
2. Ve a pestaña "Lighthouse"
3. Marca "Progressive Web App"
4. Click en "Analyze page load"

**Criterios PWA:**
- ✅ Manifest válido
- ✅ Service Worker registrado
- ✅ Funciona offline
- ✅ HTTPS habilitado (en producción)
- ✅ Iconos correctos
- ✅ Viewport configurado

---

## 📦 Generar Iconos

Necesitas crear iconos en /public/:

### Iconos Requeridos:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `icon-192.png` (para Apple touch icon)

### Herramientas para Generar:
1. [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. [Favicon Generator](https://realfavicongenerator.net/)
3. [Icon Kitchen](https://icon.kitchen/)

### Usando tu logo:
1. Sube tu logo/icono (SVG o PNG de alta resolución)
2. Genera todos los tamaños
3. Descarga y coloca en /public/

---

## 🚀 Despliegue PWA

### Requisitos para Producción:
1. **HTTPS obligatorio** (Let's Encrypt gratuito)
2. Service Worker servido con MIME type correcto
3. Manifest accesible desde raíz
4. Iconos en resoluciones correctas

### Vercel:
```json
// vercel.json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    }
  ]
}
```

### Nginx (Dockploy):
Ya configurado en nginx.conf ✅

---

## 📊 Detección de PWA en la App

```typescript
import { usePWA } from './hooks/usePWA'

function MyComponent() {
  const { isInstalled, supportsServiceWorker } = usePWA()
  
  if (isInstalled) {
    // Usuario tiene la PWA instalada
    // Las notificaciones funcionarán en iOS
  }
}
```

---

## 🔔 Notificaciones en iOS PWA

### Antes de iOS 16.4:
❌ No hay soporte para notificaciones

### iOS 16.4+ (PWA instalada):
✅ Soporte completo de notificaciones
✅ Aparecen en el Centro de Notificaciones
✅ Soportan sonido y vibración
✅ Se integran con Foco/No Molestar

### Limitaciones iOS:
- Solo funciona con PWA instalada
- No funciona en navegador Safari normal
- Requiere interacción del usuario para solicitar permiso
- No soporta notificaciones silenciosas

---

## 🧪 Testing de Notificaciones iOS

### Checklist:
1. [ ] iOS 16.4 o superior
2. [ ] App instalada en pantalla de inicio (desde Safari)
3. [ ] Abrir app desde icono de pantalla de inicio
4. [ ] Crear nota con hora de notificación
5. [ ] Aceptar permiso de notificaciones cuando se solicite
6. [ ] Verificar en Ajustes > Notificaciones > Notas App

### Debug:
```javascript
// En Safari iOS Web Inspector (conectado a Mac):
console.log('PWA instalada:', window.navigator.standalone)
console.log('Service Worker:', 'serviceWorker' in navigator)
console.log('Notificaciones:', 'Notification' in window)
```

---

## 🎨 Personalización PWA

### Cambiar Colores:
```json
// manifest.json
{
  "theme_color": "#6366F1",      // Color de barra en Android
  "background_color": "#FAFAFA"  // Splash screen
}
```

### Cambiar Nombre:
```json
{
  "name": "Mi App de Notas",
  "short_name": "Notas"
}
```

### Agregar Shortcuts:
```json
{
  "shortcuts": [
    {
      "name": "Nueva Nota Rápida",
      "url": "/?quick=true",
      "icons": [...]
    }
  ]
}
```

---

## 📈 Beneficios PWA

### Para Usuarios:
- ✅ Instalar sin App Store
- ✅ Ocupa menos espacio (~5MB vs ~50MB)
- ✅ Actualizaciones automáticas
- ✅ Funciona offline
- ✅ Notificaciones nativas
- ✅ Icono en pantalla de inicio

### Para Desarrolladores:
- ✅ Un solo código para iOS/Android/Web
- ✅ Sin comisiones de App Store
- ✅ Deploy instantáneo
- ✅ Fácil actualización
- ✅ Menor mantenimiento

---

## 🐛 Troubleshooting

### "No se solicita permiso de notificaciones en iOS"
**Causa:** App no está instalada como PWA  
**Solución:** Instalar desde Safari usando "Agregar a pantalla de inicio"

### "Service Worker no se registra"
**Causa:** No hay HTTPS o SW bloqueado  
**Solución:** Usar HTTPS en producción, verificar DevTools

### "Iconos no aparecen"
**Causa:** Rutas incorrectas o tamaños mal  
**Solución:** Verificar que /public/icon-*.png existan y sean del tamaño correcto

### "Manifest no se detecta"
**Causa:** MIME type incorrecto o ruta mal  
**Solución:** Servir manifest.json como application/json

---

## 📚 Referencias

- [iOS 16.4 Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [PWA on iOS](https://developer.apple.com/videos/play/wwdc2021/10059/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://web.dev/add-manifest/)
- [iOS PWA Compatibility](https://caniuse.com/web-app-manifest)

---

## ✅ Checklist de Implementación

- [x] manifest.json creado
- [x] Service Worker implementado
- [x] Meta tags iOS agregados
- [x] Hook usePWA implementado
- [x] Iconos placeholder (pendiente generar definitivos)
- [x] HTTPS en producción
- [x] Cache strategy configurada
- [ ] Generar iconos personalizados
- [ ] Screenshots para app stores
- [ ] Testear en iOS 16.4+

---

*Ahora la app funciona como PWA nativa en iOS y Android* 📱
