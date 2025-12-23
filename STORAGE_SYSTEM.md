# Sistema de Persistencia de Datos

## 📦 Arquitectura de LocalStorage

Este proyecto implementa un sistema robusto y escalable de persistencia de datos usando localStorage del navegador.

---

## 🏗️ Estructura

### Hook Personalizado: `useLocalStorage`

**Ubicación:** `src/hooks/useLocalStorage.ts`

#### Características Principales

✅ **Type-Safe**: Completamente tipado con TypeScript genéricos  
✅ **Manejo de Errores**: Try-catch en todas las operaciones críticas  
✅ **Lazy Initialization**: Mejor rendimiento al cargar datos solo cuando es necesario  
✅ **Sincronización Multi-Tab**: Detecta cambios en otras pestañas/ventanas  
✅ **SSR Compatible**: Verifica `typeof window` para entornos sin navegador  
✅ **API Familiar**: Mismo patrón que `useState` de React  

#### Uso Básico

```typescript
import { useLocalStorage } from './hooks/useLocalStorage';

function MyComponent() {
  const [data, setData] = useLocalStorage<string[]>('my-key', []);
  
  // Usar como useState normal
  setData([...data, 'nuevo item']);
}
```

---

## 🔑 Gestión de Claves

**Ubicación:** `src/types/index.ts`

Las claves de localStorage están centralizadas en constantes:

```typescript
export const STORAGE_KEYS = {
  NOTES: 'notes-app-data',
  SETTINGS: 'notes-app-settings',
} as const;
```

**Ventajas:**
- Evita typos y errores de escritura
- Autocompletado en el IDE
- Fácil refactoring (cambiar una vez, aplicar en todos lados)
- Type-safe con TypeScript

---

## 🛡️ Manejo de Errores

El sistema implementa múltiples capas de protección:

### 1. Lectura desde localStorage
```typescript
try {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : initialValue;
} catch (error) {
  console.warn(`Error al leer localStorage key "${key}":`, error);
  return initialValue; // Fallback al valor inicial
}
```

### 2. Escritura a localStorage
```typescript
try {
  window.localStorage.setItem(key, JSON.stringify(valueToStore));
} catch (error) {
  console.error(`Error al guardar en localStorage key "${key}":`, error);
  // La app continúa funcionando, solo sin persistencia
}
```

### 3. Casos de Error Manejados

| Error | Causa | Solución Implementada |
|-------|-------|----------------------|
| `QuotaExceededError` | localStorage lleno (5-10MB) | Log error, app continúa sin persistir |
| `SecurityError` | Navegador privado/bloqueado | Fallback a valor inicial |
| `SyntaxError` | JSON corrupto | Log warning, usar valor inicial |
| `undefined window` | Server-Side Rendering | Verificación previa con `typeof window` |

---

## 🔄 Sincronización Multi-Tab

El hook escucha el evento `storage` del navegador:

```typescript
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      setStoredValue(JSON.parse(e.newValue));
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [key]);
```

**Resultado:** Si abres la app en dos pestañas, los cambios en una se reflejan automáticamente en la otra.

---

## 📈 Escalabilidad Futura

### Migración a Modelo Estructurado

Actualmente almacenamos arrays de strings. Para escalar:

```typescript
// Estado actual
const [notes, setNotes] = useLocalStorage<string[]>('notes', []);

// Migración futura (ya preparada en types/index.ts)
interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  category?: string;
  tags?: string[];
}

const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
```

### Utilidades Adicionales Incluidas

```typescript
// Eliminar una clave específica
removeFromLocalStorage('notes-app-data');

// Limpiar múltiples claves (útil para "logout" o "reset")
clearAppStorage(['notes-app-data', 'notes-app-settings']);
```

---

## 🧪 Testing

Para probar el sistema de persistencia:

1. **Agregar notas** → Refrescar página → Notas persisten ✓
2. **Eliminar nota** → Refrescar página → Cambio persiste ✓
3. **Abrir en nueva pestaña** → Cambios se sincronizan ✓
4. **Modo incógnito** → App funciona sin crashes ✓

---

## ⚡ Rendimiento

### Optimizaciones Implementadas

1. **Lazy Initialization**: `useState(() => {...})` evita leer localStorage en cada render
2. **Memoización implícita**: Solo escribe cuando el valor realmente cambia
3. **Event listener único**: Un solo listener por hook, cleanup automático
4. **JSON parse/stringify**: Operaciones nativas del navegador (muy rápidas)

### Métricas Esperadas

- **Lectura inicial:** < 1ms (localStorage es síncrono y rápido)
- **Escritura:** < 1ms para arrays pequeños (< 100 items)
- **Overhead en render:** ~0ms (lazy initialization)

---

## 🔐 Seguridad y Privacidad

### ⚠️ Consideraciones Importantes

1. **No almacenar datos sensibles**: localStorage es visible en DevTools
2. **No almacenar tokens/passwords**: Usar httpOnly cookies para autenticación
3. **Sanitizar input del usuario**: Prevenir XSS (ya implementado en el input)
4. **Límite de tamaño**: ~5-10MB dependiendo del navegador

### ✅ Buenas Prácticas Implementadas

- ✅ Datos no sensibles (notas públicas del usuario)
- ✅ Validación de input (trim, longitud)
- ✅ Manejo graceful de cuota excedida
- ✅ No exponer API keys o secrets

---

## 📚 Referencias y Estándares

- [Web Storage API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Storage Event (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

## 🚀 Próximos Pasos (Roadmap)

- [ ] Implementar exportación/importación de notas (JSON/CSV)
- [ ] Agregar sincronización con backend (API REST)
- [ ] Implementar IndexedDB para grandes volúmenes (> 1000 notas)
- [ ] Agregar versionado de datos para migraciones
- [ ] Implementar compresión para optimizar espacio (LZ-string)

---

*Sistema diseñado para ser simple, robusto y fácilmente escalable.*
