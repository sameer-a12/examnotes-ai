import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminNotes from './pages/AdminNotes'
import Login from './pages/Login'

export const serverUrl = "https://examnotes-backend-vjow.onrender.com";

function App() {
  const { adminData } = useSelector((state) => state.admin)

  return (
    <Routes>
      <Route
        path="/login"
        element={adminData ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={adminData ? <AdminLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="notes" element={<AdminNotes />} />
      </Route>
    </Routes>
  )
}

export default App