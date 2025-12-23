# Sistema de Notificaciones

## 📱 Arquitectura de Notificaciones del Navegador

Este sistema implementa notificaciones push del navegador con recordatorios diarios programables para cada nota.

---

## 🏗️ Estructura

### Servicio de Notificaciones

**Ubicación:** `src/services/notifications.ts`

#### Características Principales

✅ **Verificación de Soporte**: Detecta si el navegador soporta notifications  
✅ **Gestión de Permisos**: Solicita y verifica permisos del usuario  
✅ **Programación Inteligente**: Calcula automáticamente la próxima ocurrencia  
✅ **Re-programación Automática**: Crea recordatorios diarios recurrentes  
✅ **Limpieza de Recursos**: Cancela timeouts al eliminar notas  
✅ **Manejo de Errores**: Try-catch en todas las operaciones críticas  

---

## ⏰ Flujo de Notificaciones

### 1. Creación de Nota con Notificación

```
Usuario escribe nota → Selecciona hora (9AM/10AM/11AM) → Click en "Agregar"
     ↓
Se solicita permiso de notificaciones (si es primera vez)
     ↓
Se crea la nota con el campo `notificationTime`
     ↓
Se programa la notificación mediante `setTimeout`
     ↓
Se guarda en localStorage
```

### 2. Programación de Notificación

```typescript
scheduleNoteNotification(note: Note)
     ↓
Calcula tiempo hasta próxima ocurrencia de la hora
     ↓
Si la hora ya pasó hoy → Programa para mañana
     ↓
Crea setTimeout con el cálculo
     ↓
Guarda timeoutId en Map para poder cancelarla después
     ↓
Al dispararse → Muestra notificación y re-programa para día siguiente
```

### 3. Visualización en la UI

Las notas con notificaciones muestran un **badge** con:
- 🔔 Icono de campana
- Hora formateada (ej: "9:00 AM")
- Tooltip al hacer hover
- Diseño consistente con el sistema de colores

---

## 🎯 Modelo de Datos

```typescript
interface Note {
  id: string;                    // ID único para identificar la nota
  content: string;               // Contenido de la nota
  createdAt: number;             // Timestamp de creación
  updatedAt: number;             // Timestamp de última actualización
  notificationTime?: string;     // Hora opcional en formato "HH:MM"
}
```

**Opciones de Hora Predeterminadas:**
- `09:00` → 9:00 AM
- `10:00` → 10:00 AM
- `11:00` → 11:00 AM
- `''` → Sin notificación

---

## 🔐 Gestión de Permisos

### Estados del Permiso

| Estado | Descripción | Acción |
|--------|-------------|---------|
| `default` | Usuario no ha decidido | Solicitar permiso al agregar nota |
| `granted` | Permiso concedido | Programar notificación normalmente |
| `denied` | Permiso denegado | Mostrar toast de advertencia |

### Flujo de Solicitud

```typescript
async ensureNotificationPermission() {
  if (permission === 'granted') return true;
  if (permission === 'default') {
    const newPermission = await requestPermission();
    return newPermission === 'granted';
  }
  return false; // denied
}
```

---

## 🎨 Diseño UI/UX

### Selector de Hora

**Ubicación:** Debajo del input de texto de la nota

**Características:**
- 🔔 Icono de campana para identificación visual
- Label "Recordatorio:" descriptivo
- Dropdown estilizado con las 4 opciones
- Accesible por teclado (tabindex, labels)
- Responsive: stack vertical en móvil

**Estilos:**
- Color primario (indigo) consistente con el sistema
- Borde redondeado de 8px
- Estados hover y focus claramente visibles
- Altura mínima de 44px (accesibilidad)

### Badge de Notificación

**Ubicación:** Dentro de cada tarjeta con notificación

**Características:**
- Gradiente sutil del color primario
- Icono de campana + hora formateada
- Tooltip informativo al hacer hover
- Animación scale al hover (1.05x)
- Font-size: 13px (legible pero discreto)

---

## 💾 Persistencia

Las notificaciones persisten porque:

1. **El campo `notificationTime` se guarda en localStorage** junto con la nota
2. **Al cargar la app**, el `useEffect` lee todas las notas
3. **Para cada nota con hora**, programa su notificación
4. **Los timeouts se mantienen** mientras la pestaña esté abierta

### Re-hidratación

```typescript
useEffect(() => {
  // Limpiar notificaciones anteriores
  cancelAllNotifications(scheduledNotifications.current);
  
  // Programar de nuevo desde localStorage
  notes.forEach(note => {
    if (note.notificationTime) {
      const timeoutId = scheduleNoteNotification(note);
      scheduledNotifications.current.set(note.id, timeoutId);
    }
  });
}, [notes]);
```

---

## 🔄 Ciclo de Vida de Notificaciones

### Al Agregar Nota
1. Verificar soporte del navegador
2. Solicitar permiso si es necesario
3. Crear nota con `notificationTime`
4. Programar notificación vía `setTimeout`
5. Guardar timeoutId en `Map`

### Al Eliminar Nota
1. Buscar timeoutId en `Map` por `note.id`
2. Cancelar timeout con `clearTimeout`
3. Eliminar entrada de `Map`
4. Nota se borra de localStorage

### Al Recargar Página
1. Cargar notas desde localStorage
2. Para cada nota con hora, calcular tiempo restante
3. Programar de nuevo cada notificación
4. Actualizar `Map` con nuevos timeoutIds

### Al Cerrar Pestaña
1. `useEffect` cleanup se ejecuta
2. Todos los timeouts se cancelan
3. Al reabrir, se vuelve a programar todo

---

## ⚡ Optimizaciones

### 1. Map para Timeouts
```typescript
const scheduledNotifications = useRef<Map<string, number>>(new Map())
```
- **O(1) para búsqueda** por noteId
- Fácil cancelar notificación específica
- No causa re-renders (useRef)

### 2. Lazy Permission Request
Solo se solicita permiso cuando el usuario realmente quiere usar notificaciones (no al cargar la app)

### 3. Cálculo Eficiente de Tiempo
```typescript
const now = new Date();
const scheduledTime = new Date();
scheduledTime.setHours(hours, minutes, 0, 0);

if (scheduledTime <= now) {
  scheduledTime.setDate(scheduledTime.getDate() + 1);
}
```

### 4. Auto-cleanup
- Notificación se auto-cierra después de 5 segundos
- Timeouts se cancelan en cleanup de useEffect
- Map se limpia al eliminar notas

---

## 🛡️ Manejo de Casos Edge

### Navegador sin Soporte
```typescript
if (!('Notification' in window)) {
  // Ocultar selector de hora
  // Mostrar mensaje informativo
  return;
}
```

### Permiso Denegado
```typescript
if (permission === 'denied') {
  // Mostrar toast de advertencia
  // Permitir crear nota sin notificación
  // Guardar preferencia del usuario
}
```

### Hora ya Pasada
```typescript
if (scheduledTime <= now) {
  // Programar para el día siguiente automáticamente
  scheduledTime.setDate(scheduledTime.getDate() + 1);
}
```

### Múltiples Pestañas
```typescript
window.addEventListener('storage', (e) => {
  // Sincronizar cambios entre pestañas
  // Re-programar notificaciones si es necesario
});
```

---

## 📊 Formato de Notificación

### Estructura
```typescript
new Notification('Recordatorio de Nota', {
  body: note.content,           // Contenido de la nota
  icon: '/vite.svg',           // Icono de la app
  badge: '/vite.svg',          // Badge en Android
  tag: note.id,                // Para actualizar en lugar de duplicar
  requireInteraction: false,   // Auto-cierra después de 5s
  silent: false,               // Con sonido
});
```

### Comportamiento
- **Título:** "Recordatorio de Nota"
- **Cuerpo:** Texto completo de la nota
- **Duración:** 5 segundos, luego se cierra
- **Click:** (futuro) Abre la app y resalta la nota

---

## 🚀 Mejoras Futuras

### Corto Plazo
- [ ] Editar hora de notificación de notas existentes
- [ ] Snooze notification (posponer 5/10/15 minutos)
- [ ] Múltiples horarios por nota

### Mediano Plazo
- [ ] Service Worker para notificaciones en background
- [ ] Notificaciones push desde servidor
- [ ] Categorías de notas con colores diferentes
- [ ] Repetición personalizada (diaria, semanal, mensual)

### Largo Plazo
- [ ] Integración con calendario del sistema
- [ ] Notificaciones inteligentes (ML para mejores horarios)
- [ ] Sincronización cross-device
- [ ] Widget de escritorio/móvil

---

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 22+ (Desktop & Android)
- ✅ Firefox 22+
- ✅ Edge 14+
- ✅ Safari 16+ (macOS 13+ / iOS 16.4+)
- ❌ Internet Explorer (no soportado)

### Limitaciones por Plataforma

| Plataforma | Soporte | Limitaciones |
|------------|---------|--------------|
| Windows | ✅ Completo | Requiere Chrome/Edge |
| macOS | ✅ Completo | Requiere permiso sistema |
| Linux | ✅ Completo | Depende de DE |
| Android | ✅ Completo | Respeta DND |
| iOS | ⚠️ Parcial | Solo con app instalada (PWA) |

---

## 🧪 Testing Manual

### Checklist de Pruebas

1. **Crear nota con notificación**
   - [ ] Seleccionar hora
   - [ ] Agregar nota
   - [ ] Verificar badge aparece
   - [ ] Verificar permiso solicitado

2. **Notificación se dispara**
   - [ ] Cambiar hora del sistema
   - [ ] Verificar notificación aparece
   - [ ] Verificar sonido/vibración

3. **Persistencia**
   - [ ] Crear nota con notificación
   - [ ] Recargar página
   - [ ] Verificar badge persiste
   - [ ] Verificar notificación sigue programada

4. **Eliminar nota**
   - [ ] Eliminar nota con notificación
   - [ ] Verificar notificación cancelada
   - [ ] Verificar no aparece después

5. **Múltiples pestañas**
   - [ ] Abrir dos pestañas
   - [ ] Crear nota en una
   - [ ] Verificar aparece en otra

---

## 📚 Referencias

- [Notifications API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Using the Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)
- [Notification Permission](https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)

---

*Sistema diseñado para ser simple, no intrusivo y respetuoso con el usuario.*
