import { useState, useEffect, useRef } from 'react'
import NoteCard from './NoteCard'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePWA } from './hooks/usePWA'
import type { Note } from './types'
import { NOTIFICATION_TIMES, STORAGE_KEYS } from './types'
import { 
  ensureNotificationPermission, 
  scheduleNoteNotification,
  cancelAllNotifications,
  isNotificationSupported
} from './services/notifications'
import styles from './App.module.css'

function App() {
  // Registrar Service Worker para PWA (iOS Safari requiere instalación)
  usePWA()
  
  const [noteInput, setNoteInput] = useState('')
  const [selectedTime, setSelectedTime] = useState('09:00') // Hora por defecto: 9AM
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Ref para almacenar los IDs de notificaciones programadas
  const scheduledNotifications = useRef<Map<string, number>>(new Map())

  // Programar notificaciones cuando se cargan o actualizan las notas
  useEffect(() => {
    // Cancelar todas las notificaciones anteriores
    cancelAllNotifications(Array.from(scheduledNotifications.current.values()))
    scheduledNotifications.current.clear()

    // Programar notificaciones para cada nota que tenga hora configurada
    notes.forEach(note => {
      if (note.notificationTime) {
        const timeoutId = scheduleNoteNotification(note)
        if (timeoutId) {
          scheduledNotifications.current.set(note.id, timeoutId)
        }
      }
    })

    // Cleanup al desmontar
    return () => {
      cancelAllNotifications(Array.from(scheduledNotifications.current.values()))
    }
  }, [notes])

  const handleAddNote = async () => {
    if (!noteInput.trim()) return

    // Solicitar permiso de notificaciones si hay hora seleccionada
    if (selectedTime && isNotificationSupported()) {
      const hasPermission = await ensureNotificationPermission()
      if (!hasPermission && selectedTime) {
        setToastMessage('No se pudo activar las notificaciones. Verifica los permisos del navegador.')
        setShowToast(true)
      }
    }

    // Crear nueva nota
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: noteInput.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      notificationTime: selectedTime || undefined,
    }

    setNotes([...notes, newNote])
    setNoteInput('')
    setToastMessage('Nota creada correctamente')
    setShowToast(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddNote()
    }
  }

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId)
    setShowConfirmModal(true)
  }

  const handleConfirmDelete = () => {
    if (noteToDelete !== null) {
      setNotes(notes.filter(note => note.id !== noteToDelete))
      setShowConfirmModal(false)
      setNoteToDelete(null)
      setToastMessage('Nota eliminada correctamente')
      setShowToast(true)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmModal(false)
    setNoteToDelete(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <h1 className={styles.title}>Notas</h1>
        
        {/* Input Section */}
        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu nota..."
              className={styles.input}
              aria-label="Contenido de la nota"
            />
            <div className={styles.inputContainer}>
              <div className={styles.selectWrapper}>
                <label htmlFor="notification-time" className={styles.selectLabel}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.selectIcon}>
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Recordatorio:
                </label>
                <select
                  id="notification-time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={styles.select}
                  aria-label="Hora de notificación"
                >
                  {NOTIFICATION_TIMES.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddNote}
                className={styles.button}
                aria-label="Agregar nota"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className={styles.notesGrid}>
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onDelete={() => handleDeleteClick(note.id)} 
            />
          ))}
        </div>

        {/* Empty State */}
        {notes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No hay notas aún. ¡Agrega tu primera nota!</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          message="¿Estás seguro de que deseas eliminar esta nota?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

export default App
