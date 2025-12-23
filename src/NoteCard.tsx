import styles from './NoteCard.module.css'
import { Note } from './types'
import { formatNotificationTime } from './services/notifications'

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.content}>{note.content}</p>
      
      {/* Mostrar indicador de notificación si está configurada */}
      {note.notificationTime && (
        <div className={styles.notificationBadge} title={`Recordatorio diario a las ${formatNotificationTime(note.notificationTime)}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span>{formatNotificationTime(note.notificationTime)}</span>
        </div>
      )}
      
      <button
        onClick={onDelete}
        className={styles.deleteButton}
        aria-label="Eliminar nota"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
