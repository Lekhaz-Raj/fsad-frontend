import { NavLink, useNavigate, Outlet } from "react-router-dom"
import { motion } from "framer-motion"
import { useInvestments } from "../context/InvestmentContext"
import {
  CircleHelp,
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: "/admin/users", label: "User Management", icon: <Users className="w-5 h-5" /> },
  { to: "/admin/funds", label: "Fund Management", icon: <FolderOpen className="w-5 h-5" /> },
  { to: "/admin/content", label: "Content Management", icon: <FileText className="w-5 h-5" /> },
  { to: "/admin/reports", label: "Reports", icon: <BarChart3 className="w-5 h-5" /> }
]

const AdminLayout = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useInvestments()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            FP
          </div>
          <span className="font-bold text-lg">FundsPilot</span>
        </div>

        {/* User info */}
        {currentUser && (
          <div className="px-6 py-4 border-b">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="font-semibold text-sm">{currentUser.fullName}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        {/* Page content */}
        <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
  <div className="max-w-7xl mx-auto">
    <Outlet />
  </div>
</main>

      </div>

      {/* Floating help button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
      >
        <CircleHelp className="w-6 h-6" />
      </motion.button>

    </div>
  )
}

export default AdminLayout