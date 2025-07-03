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
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Manage Tasks', icon: ClipboardList, path: '/app/tasks' },
  { name: 'Kanban', icon: KanbanSquare, path: '/app/kanban' },
  { name: 'Create Task', icon: PlusSquare, path: '/app/create' },
  { name: 'Team', icon: Users, path: '/app/team' },
]

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } h-full bg-base-200 border-r border-base-300 transition-all duration-300 flex flex-col relative`}
    >
      {/* Toggle button (inside sidebar) */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-4 z-50 bg-base-100 border border-base-300 rounded-full p-1 shadow-lg"
      >
        {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-base-300 flex justify-center items-center">
        <h2 className={`text-xl font-bold transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          TeamTasks
        </h2>
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
        {isOpen && (
          <>
            <p className="font-semibold text-lg">{user?.name || 'User Name'}</p>
            <p className="text-sm opacity-70">{user?.email || 'user@email.com'}</p>
            <NavLink to="/app/profile" className="btn btn-link btn-sm">
              View Profile
            </NavLink>
          </>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-base-300'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {isOpen && <span>{name}</span>}
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
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
