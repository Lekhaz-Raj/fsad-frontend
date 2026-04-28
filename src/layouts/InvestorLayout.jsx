import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInvestments } from '../context/InvestmentContext'
import { CircleHelp, LayoutDashboard, TrendingUp, BarChart3, Calculator, Briefcase, User, LogOut, Menu, X, Search, Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/investor/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/investor/funds', label: 'Mutual Funds', icon: <TrendingUp className="w-5 h-5" /> },
  { to: '/investor/compare', label: 'Compare Funds', icon: <BarChart3 className="w-5 h-5" /> },
  { to: '/investor/investments', label: 'My Investments', icon: <Briefcase className="w-5 h-5" /> },
  { to: '/investor/calculator', label: 'Calculator', icon: <Calculator className="w-5 h-5" /> },
  { to: '/investor/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
]

const InvestorLayout = ({ children }) => {
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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white block">FundsPilot</span>
              <span className="text-xs text-slate-400">Investor</span>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {currentUser && (
          <div className="px-6 py-5 bg-slate-800/50 border-b border-slate-700/50">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Welcome back</div>
            <div className="font-semibold text-white text-sm truncate">{currentUser.fullName}</div>
            <div className="text-xs text-slate-400 truncate mt-1">{currentUser.email}</div>
          </div>
        )}

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
  key={item.to}
  to={item.to}
  className={({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`
  }
>
  <span className="flex-shrink-0 group-hover:text-blue-400">
    {item.icon}
  </span>

  <span className="font-medium text-sm">{item.label}</span>
</NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-300 hover:bg-red-900/30 hover:text-red-400 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200/80 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-20 px-6 max-w-full">
            <div className="flex-1 flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden lg:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2.5 flex-1 max-w-md border border-gray-200/50 hover:border-gray-300 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search funds, portfolios..."
                  className="bg-transparent text-sm placeholder-gray-400 outline-none flex-1 text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <motion.button
                className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role || 'Investor'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating help button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-xl text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50"
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        title="Help"
      >
        <CircleHelp className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

export default InvestorLayout