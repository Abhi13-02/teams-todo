import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ClipboardList,
  KanbanSquare,
  PlusSquare,
  Users,
  LogOut,
  UserCircle,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Manage Tasks', icon: ClipboardList, path: '/app/tasks' },
  { name: 'Kanban', icon: KanbanSquare, path: '/app/kanban' },
  { name: 'Create Task', icon: PlusSquare, path: '/app/create' },
  { name: 'Team', icon: Users, path: '/app/team' },
];

const Sidebar = ({ sidebarOpen, onClose, onLogout }) => {
  const { user } = useSelector(state => state.auth);

  return (
    <aside
      className={`fixed z-40 md:static w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">TeamTasks</h2>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
          <X />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center p-4">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-600 mb-2"
          />
        ) : (
          <UserCircle className="w-20 h-20 text-gray-500 mb-2" />
        )}

        <p className="font-semibold text-lg text-white">
          {user?.name || 'User Name'}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          {user?.email || 'user@email.com'}
        </p>
        <button className="text-sm text-blue-400 hover:underline mb-2">
          View Profile
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1 px-4">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition text-sm font-medium
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <Icon className="w-5 h-5 mr-2" />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center text-red-400 hover:text-red-500 text-sm"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
