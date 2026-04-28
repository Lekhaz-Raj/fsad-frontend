import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInvestments } from '../context/InvestmentContext'
import { CircleHelp, LayoutDashboard, Users, FolderOpen, FileText, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/admin/users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
  { to: '/admin/funds', label: 'Fund Management', icon: <FolderOpen className="w-5 h-5" /> },
  { to: '/admin/content', label: 'Content Management', icon: <FileText className="w-5 h-5" /> },
  { to: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
]

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const { currentUser, logout } = useInvestments()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FundsPilot</span>
          </div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {currentUser && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">Logged in as</div>
            <div className="font-semibold text-gray-900 text-sm truncate">{currentUser.fullName}</div>
            <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <div className="w-6" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Floating help button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Help"
      >
        <CircleHelp className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

export default AdminLayout