import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { clearAdminData } from '../redux/adminSlice'
import { serverUrl } from '../App'

function AdminNavbar({ onMenuClick }) {
  const { adminData } = useSelector((state) => state.admin)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(serverUrl + '/api/admin/logout', {}, { withCredentials: true })
    } catch (e) { console.log(e) }
    dispatch(clearAdminData())
    navigate('/login')
  }

  return (
    <header className="h-16 bg-[#2b2b2b] flex items-center justify-between px-6 sticky top-0 z-20 rounded-b-2xl mx-3 mt-3 shadow-lg">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-white font-bold text-lg tracking-wide">
          ExamNotes <span className="text-gray-400 font-normal">AI</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm hidden sm:block">{adminData?.name}</span>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold text-sm">
          {adminData?.name?.charAt(0).toUpperCase()}
        </div>
        <button onClick={handleLogout}
          className="text-xs px-4 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition">
          Logout
        </button>
      </div>
    </header>
  )
}

export default AdminNavbar