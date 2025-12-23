/**
 * Servicio de Notificaciones del Navegador
 * 
 * Maneja la API de Notifications con buenas prácticas:
 * - Verificación de soporte del navegador
 * - Manejo de permisos
 * - Programación de notificaciones
 * - Limpieza automática de recursos
 */

import type { Note } from '../types';

/**
 * Verifica si el navegador soporta la API de Notifications
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Obtiene el estado actual del permiso de notificaciones
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Solicita permiso al usuario para mostrar notificaciones
 * @returns Promise con el resultado del permiso
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Las notificaciones no están soportadas en este navegador');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error al solicitar permiso de notificaciones:', error);
    return 'denied';
  }
}

/**
 * Muestra una notificación inmediata
 * @param title - Título de la notificación
 * @param options - Opciones de la notificación
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if (getNotificationPermission() !== 'granted') {
    console.warn('Permiso de notificaciones no concedido');
    return;
  }

  try {
    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options,
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => notification.close(), 5000);
  } catch (error) {
    console.error('Error al mostrar notificación:', error);
  }
}

/**
 * Programa una notificación para una nota específica
 * Calcula el tiempo hasta la próxima ocurrencia de la hora especificada
 */
export function scheduleNoteNotification(note: Note): number | null {
  if (!note.notificationTime || getNotificationPermission() !== 'granted') {
    return null;
  }

  try {
    const [hours, minutes] = note.notificationTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Si la hora ya pasó hoy, programar para mañana
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Programar la notificación
    const timeoutId = window.setTimeout(() => {
      showNotification('Recordatorio de Nota', {
        body: note.content,
        tag: note.id,
        requireInteraction: false,
        silent: false,
      });

      // Reprogramar para el día siguiente
      scheduleNoteNotification(note);
    }, timeUntilNotification);

    return timeoutId;
  } catch (error) {
    console.error('Error al programar notificación:', error);
    return null;
  }
}

/**
 * Cancela una notificación programada
 * @param timeoutId - ID del timeout a cancelar
 */
export function cancelScheduledNotification(timeoutId: number): void {
  window.clearTimeout(timeoutId);
}

/**
 * Cancela todas las notificaciones programadas
 * @param timeoutIds - Array de IDs de timeouts
 */
export function cancelAllNotifications(timeoutIds: number[]): void {
  timeoutIds.forEach(id => cancelScheduledNotification(id));
}

/**
 * Verifica y solicita permisos si es necesario
 * Retorna true si los permisos están concedidos o fueron concedidos
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  const currentPermission = getNotificationPermission();
  
  if (currentPermission === 'granted') {
    return true;
  }
  
  if (currentPermission === 'default') {
    const newPermission = await requestNotificationPermission();
    return newPermission === 'granted';
  }
  
  return false;
}

/**
 * Formatea la hora para mostrar en la UI
 * @param time - Hora en formato "HH:MM"
 * @returns Hora formateada (ej: "9:00 AM")
 */
export function formatNotificationTime(time: string): string {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
