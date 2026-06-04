import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../App'

function AdminNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState({})

  const fetchNotes = async () => {
    try {
      const res = await axios.get(serverUrl + '/api/admin/notes', { withCredentials: true })
      setNotes(res.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchNotes() }, [])

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note permanently?')) return
    try {
      setDeleting(p => ({ ...p, [noteId]: true }))
      await axios.delete(serverUrl + `/api/admin/notes/${noteId}`, { withCredentials: true })
      setNotes(prev => prev.filter(n => n._id !== noteId))
    } catch (e) { console.log(e) }
    finally { setDeleting(p => ({ ...p, [noteId]: false })) }
  }

  const filtered = notes.filter(n =>
    n.topic?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">All Notes</h2>
          <p className="text-sm text-gray-400 mt-0.5">{notes.length} notes generated</p>
        </div>
        <div className="bg-[#2b2b2b] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          {filtered.length} shown
        </div>
      </motion.div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by topic or user..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm mb-5 px-4 py-2.5 bg-white border border-gray-200
          rounded-xl text-sm outline-none focus:border-gray-400 transition shadow-sm"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading notes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm
          flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500 font-medium">No notes found</p>
          <p className="text-gray-300 text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note, i) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2b2b2b] flex items-center
                    justify-center text-white font-bold text-sm shrink-0">
                    {note.topic?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 leading-tight">
                      {note.topic || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(note.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(note._id)}
                  disabled={deleting[note._id]}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500
                    hover:bg-red-100 transition disabled:opacity-40 shrink-0 font-medium"
                >
                  {deleting[note._id] ? '...' : 'Delete'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {note.classLevel && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    Class {note.classLevel}
                  </span>
                )}
                {note.examType && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
                    {note.examType}
                  </span>
                )}
                {note.revisionMode && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-600">
                    ⚡ Revision
                  </span>
                )}
                {note.includeDiagram && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                    📊 Diagram
                  </span>
                )}
                {note.includeChart && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                    📈 Chart
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center
                  justify-center text-gray-600 text-xs font-bold shrink-0">
                  {note.user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">{note.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{note.user?.email || ''}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminNotes
