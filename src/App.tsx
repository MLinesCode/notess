import { useState } from 'react'
import NoteCard from './NoteCard'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import styles from './App.module.css'

function App() {
  const [noteInput, setNoteInput] = useState('')
  const [notes, setNotes] = useState<string[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes([...notes, noteInput])
      setNoteInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddNote()
    }
  }

  const handleDeleteClick = (index: number) => {
    setNoteToDelete(index)
    setShowConfirmModal(true)
  }

  const handleConfirmDelete = () => {
    if (noteToDelete !== null) {
      setNotes(notes.filter((_, index) => index !== noteToDelete))
      setShowConfirmModal(false)
      setNoteToDelete(null)
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
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu nota..."
              className={styles.input}
            />
            <button
              onClick={handleAddNote}
              className={styles.button}
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className={styles.notesGrid}>
          {notes.map((note, index) => (
            <NoteCard key={index} content={note} onDelete={() => handleDeleteClick(index)} />
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
          message="Nota eliminada correctamente"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

export default App
