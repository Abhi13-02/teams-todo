import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  LayoutDashboard,
  ClipboardList,
  KanbanSquare,
  PlusSquare,
  Users,
  LogOut,
  UserCircle,
  X
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Manage Tasks', icon: ClipboardList, path: '/app/tasks' },
  { name: 'Kanban', icon: KanbanSquare, path: '/app/kanban' },
  { name: 'Create Task', icon: PlusSquare, path: '/app/create' },
  { name: 'Team', icon: Users, path: '/app/team' },
]

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full bg-base-200 border-r border-base-300 z-40
        transition-transform duration-300 ease-in-out
        w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}
    >
      {/* Close button only for mobile */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-base-300 flex justify-center items-center">
        <h2 className="text-xl font-bold">TeamTasks</h2>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center p-4 space-y-2">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border border-gray-400"
          />
        ) : (
          <UserCircle className="w-16 h-16 text-gray-500" />
        )}
        <p className="font-semibold text-lg">{user?.name}</p>
        <p className="text-sm opacity-70">{user?.email}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-base-300'
              }`
            }
            onClick={onClose} // auto-close on nav click (for mobile)
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-base-300">
        <button
          onClick={onLogout}
          className="flex items-center text-error gap-3 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
