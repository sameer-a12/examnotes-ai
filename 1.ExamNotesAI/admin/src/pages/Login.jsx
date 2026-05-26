import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAdminData } from '../redux/adminSlice'
import { serverUrl } from '../App'
import { auth, provider } from '../config/firebase'
import { signInWithPopup, getIdToken } from 'firebase/auth'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, provider)
      const idToken = await getIdToken(result.user)
      const res = await axios.post(
        serverUrl + '/api/admin/login',
        { idToken },
        { withCredentials: true }
      )
      if (res.data && res.data.role === 'admin') {
        dispatch(setAdminData(res.data))
        navigate('/', { replace: true })
      } else {
        setError('Access denied. Admins only.')
      }
    } catch (e) {
      if (e.response?.data?.message) {
        setError(e.response.data.message)
      } else if (e.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled')
      } else {
        setError('Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mb-5">
        <div className="rounded-2xl bg-[#2b2b2b] px-8 py-5 shadow-lg">
          <h1 className="text-xl font-bold text-white">ExamNotes AI</h1>
          <p className="text-sm text-gray-400 mt-0.5">Admin Control Panel</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
        <p className="text-gray-400 text-sm mb-7">Sign in to access the admin panel</p>

        {error && (
          <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-[#2b2b2b] text-white font-semibold
            text-sm hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {!loading && (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Login
 