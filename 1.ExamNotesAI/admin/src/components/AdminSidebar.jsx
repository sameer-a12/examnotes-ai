import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
 
const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/notes', label: 'Notes' },
]
 
function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full py-6 px-3">
      <p className="text-xs text-gray-500 uppercase tracking-widest px-3 mb-3">Menu</p>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-sm font-medium transition
              ${isActive ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
          >{label}</NavLink>
        ))}
      </nav>
    </div>
  )
}
 
function AdminSidebar({ open, onClose }) {
  return (
    <>
      <aside className="hidden md:flex w-52 shrink-0 bg-[#2b2b2b] rounded-2xl m-3 mt-4">
        <div className="w-full"><SidebarContent /></div>
      </aside>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-20 left-3 bottom-3 w-52 z-20 bg-[#2b2b2b] rounded-2xl md:hidden">
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
 
export default AdminSidebar