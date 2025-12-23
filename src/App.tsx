import { useState } from 'react'
import NoteCard from './NoteCard'

function App() {
  const [noteInput, setNoteInput] = useState('')
  const [notes, setNotes] = useState<string[]>([])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-light text-gray-800 mb-8 text-center">Notas</h1>
        
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu nota..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <button
              onClick={handleAddNote}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note, index) => (
            <NoteCard key={index} content={note} />
          ))}
        </div>

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No hay notas aún. ¡Agrega tu primera nota!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
