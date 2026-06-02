import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../App'
 
function StatCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="bg-[#2b2b2b] rounded-2xl p-6 text-white shadow-md"
    >
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-4xl font-extrabold">{value ?? '—'}</p>
    </motion.div>
  )
}
 
function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    axios.get(serverUrl + '/api/admin/stats', { withCredentials: true })
      .then(r => setStats(r.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [])
 
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-extrabold mb-6 text-gray-800">
        Dashboard Overview
      </motion.h2>
 
      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users"   value={stats?.totalUsers}  delay={0} />
            <StatCard label="Total Notes"   value={stats?.totalNotes}  delay={0.05} />
            <StatCard label="Notes Today"   value={stats?.notesToday}  delay={0.1} />
            <StatCard label="Revenue"       value={`₹${stats?.totalRevenue || 0}`} delay={0.15} />
          </div>
 
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Users</h3>
              <span className="text-xs text-gray-400">Last 5 joined</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Credits</th>
                    <th className="px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.recentUsers?.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#2b2b2b] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                          {u.credits}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${u.role === 'admin' ? 'bg-[#2b2b2b] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
 
export default AdminDashboard