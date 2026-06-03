import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../App'
 
function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [creditInputs, setCreditInputs] = useState({})
  const [actionLoading, setActionLoading] = useState({})
 
  const fetchUsers = async () => {
    try {
      const res = await axios.get(serverUrl + '/api/admin/users', { withCredentials: true })
      setUsers(res.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }
 
  useEffect(() => { fetchUsers() }, [])
 
  const handleCredits = async (userId, type) => {
    const amount = Number(creditInputs[userId])
    if (!amount || amount <= 0) return alert('Enter a valid amount')
    try {
      setActionLoading(p => ({ ...p, [userId]: true }))
      await axios.post(serverUrl + '/api/admin/users/credits', { userId, amount, type }, { withCredentials: true })
      await fetchUsers()
      setCreditInputs(p => ({ ...p, [userId]: '' }))
    } catch (e) { console.log(e) }
    finally { setActionLoading(p => ({ ...p, [userId]: false })) }
  }
 
  const handleBan = async (userId, isBanned) => {
    try {
      setActionLoading(p => ({ ...p, [userId + 'ban']: true }))
      await axios.post(serverUrl + '/api/admin/users/ban', { userId, isBanned: !isBanned }, { withCredentials: true })
      await fetchUsers()
    } catch (e) { console.log(e) }
    finally { setActionLoading(p => ({ ...p, [userId + 'ban']: false })) }
  }
 
  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )
 
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-extrabold mb-6 text-gray-800">
        Manage Users
      </motion.h2>
 
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm mb-5 px-4 py-2.5 bg-white border border-gray-200
          rounded-xl text-sm outline-none focus:border-gray-400 transition shadow-sm"
      />
 
      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Manage Credits</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2b2b2b] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                      {u.credits} credits
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${u.role === 'admin' ? 'bg-[#2b2b2b] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                      {u.isBanned && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-500 font-medium">Banned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Amt"
                        value={creditInputs[u._id] || ''}
                        onChange={e => setCreditInputs(p => ({ ...p, [u._id]: e.target.value }))}
                        className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-gray-400"
                      />
                      <button onClick={() => handleCredits(u._id, 'add')} disabled={actionLoading[u._id]}
                        className="px-3 py-1.5 bg-[#2b2b2b] text-white text-xs rounded-lg hover:bg-black transition disabled:opacity-40 font-medium">
                        + Add
                      </button>
                      <button onClick={() => handleCredits(u._id, 'remove')} disabled={actionLoading[u._id]}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition disabled:opacity-40">
                        − Remove
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleBan(u._id, u.isBanned)} disabled={actionLoading[u._id + 'ban']}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-40
                        ${u.isBanned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
                      {actionLoading[u._id + 'ban'] ? '...' : u.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-400 text-sm text-center py-10">No users found.</p>}
        </div>
      )}
    </div>
  )
}
 
export default AdminUsers