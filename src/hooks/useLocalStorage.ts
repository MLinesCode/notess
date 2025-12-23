import { useState, useEffect } from 'react';

/**
 * Hook personalizado para sincronizar estado con localStorage
 * 
 * @template T - Tipo del valor a almacenar
 * @param {string} key - Clave única en localStorage
 * @param {T} initialValue - Valor inicial si no existe en localStorage
 * @returns {[T, (value: T | ((val: T) => T)) => void]} - Tupla con el valor y la función setter
 * 
 * Características:
 * - Manejo robusto de errores (JSON parse/stringify)
 * - Sincronización automática con localStorage
 * - Type-safe con TypeScript
 * - Compatible con Server-Side Rendering (SSR)
 * - Lazy initialization para mejor rendimiento
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado que almacena el valor
  // Usamos una función para lazy initialization y evitar lecturas innecesarias en cada render
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Verificar si estamos en el navegador (no en SSR)
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Intentar obtener el valor de localStorage
      const item = window.localStorage.getItem(key);
      
      // Si existe, parsearlo; si no, retornar el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error en el parse o lectura, mostrar warning y retornar inicial
      console.warn(`Error al leer localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor en estado y localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función (como setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage si estamos en el navegador
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Si hay error al guardar, mostrar error pero no bloquear la app
      console.error(`Error al guardar en localStorage key "${key}":`, error);
    }
  };

  // Sincronizar con cambios en otras pestañas/ventanas
  useEffect(() => {
    // Solo ejecutar en el navegador
    if (typeof window === 'undefined') {
      return;
    }

    // Listener para el evento storage (cambios desde otras pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error al sincronizar storage para key "${key}":`, error);
        }
      }
    };

    // Agregar listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup: remover listener al desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Utilidad para limpiar una key específica del localStorage
 * @param {string} key - Clave a eliminar
 */
export function removeFromLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error al eliminar localStorage key "${key}":`, error);
  }
}

/**
 * Utilidad para limpiar todo el localStorage de la app
 * @param {string[]} keys - Array de claves a eliminar
 */
export function clearAppStorage(keys: string[]): void {
  keys.forEach(key => removeFromLocalStorage(key));
}
