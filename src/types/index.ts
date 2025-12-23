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
}

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
