/**
 * Tipos y modelos de datos de la aplicación
 * 
 * Este archivo centraliza todas las interfaces y tipos,
 * facilitando la escalabilidad y mantenimiento futuro.
 */

/**
 * Modelo de una nota individual
 * Para escalabilidad futura: fácil agregar propiedades como id, timestamp, categoría, etc.
 */
export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  notificationTime?: string; // Hora en formato "HH:MM" para notificación diaria (ej: "09:00")
}

/**
 * Horarios predeterminados para notificaciones
 */
export const NOTIFICATION_TIMES = [
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '', label: 'Sin notificación' },
] as const;

/**
 * Configuración de localStorage
 */
export const STORAGE_KEYS = {
  NOTES: 'notes-app-data',
  SETTINGS: 'notes-app-settings',
} as const;

/**
 * Configuración de la aplicación (para futuras expansiones)
 */
export interface AppSettings {
  theme?: 'light' | 'dark';
  sortBy?: 'date' | 'alphabetical';
}
