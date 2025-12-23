/**
 * Hook para registrar el Service Worker y convertir la app en PWA
 * Soporta iOS Safari cuando la app está instalada
 */

import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    // Solo registrar en producción o si hay service worker disponible
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registrado exitosamente:', registration.scope);

            // Verificar actualizaciones cada hora
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);

            // Escuchar actualizaciones del SW
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nuevo contenido disponible
                    console.log('Nueva versión disponible. Actualiza la página.');
                    
                    // Opcional: Mostrar notificación al usuario
                    if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('Error al registrar Service Worker:', error);
          });
      });

      // Escuchar mensajes del service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Mensaje del Service Worker:', event.data);
      });
    }
  }, []);
}

/**
 * Verifica si la app está instalada como PWA
 */
export function isPWAInstalled(): boolean {
  // iOS
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  // Android y otros
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  return false;
}

/**
 * Muestra el prompt de instalación de PWA si está disponible
 */
export function useInstallPrompt() {
  useEffect(() => {
    // Almacenar el prompt de instalación para uso futuro
    let deferredPrompt: any = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que el navegador muestre su propio prompt
      e.preventDefault();
      deferredPrompt = e;
      
      console.log('PWA instalable detectada');
      
      // Aquí podrías guardar deferredPrompt y mostrar tu propio botón de instalación
      // Ejemplo: setShowInstallButton(true);
      
      // Para uso futuro: window.deferredPrompt = deferredPrompt;
      (window as any).deferredPrompt = deferredPrompt;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar cuando la app se instala
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada exitosamente');
      deferredPrompt = null;
      (window as any).deferredPrompt = null;
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
}

/**
 * Hook combinado para PWA completo
 */
export function usePWA() {
  useServiceWorker();
  useInstallPrompt();
  
  return {
    isInstalled: isPWAInstalled(),
    supportsServiceWorker: 'serviceWorker' in navigator,
  };
}
