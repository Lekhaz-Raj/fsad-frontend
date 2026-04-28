import { Routes, Route, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, Rocket, CircleHelp, ArrowRight, Users, BarChart3, TrendingUp, Shield, Menu, X } from 'lucide-react'
import { InvestmentProvider } from './context/InvestmentContext.jsx'
import './styles/investor.css'
import AdminLayout from "./layouts/AdminLayout"
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard       from './pages/investor/Dashboard.jsx'
import MutualFunds     from './pages/investor/MutualFunds.jsx'
import CompareFunds    from './pages/investor/CompareFunds.jsx'
import Calculator      from './pages/investor/Calculator.jsx'
import MyInvestments   from './pages/investor/MyInvestments.jsx'
import Profile         from './pages/investor/Profile.jsx'
import FundDetail      from './pages/investor/FundDetail.jsx'
import AdminDashboard     from './pages/admin/AdminDashboard.jsx'
import UserManagement     from './pages/admin/UserManagement.jsx'
import FundManagement     from './pages/admin/FundManagement.jsx'
import ContentManagement  from './pages/admin/ContentManagement.jsx'
import AdminReports       from './pages/admin/AdminReports.jsx'

// ── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
)

// ── Home Page ────────────────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* ── Navbar ── */}
      <motion.nav
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 font-poppins">FundsPilot</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"></div>

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-poppins leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Build Wealth with
              <span className="block text-blue-600">Smart Investing</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join FundsPilot, the leading platform for mutual fund investment. Compare funds, track performance,
              and make informed decisions with expert insights and personalized recommendations.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                onClick={() => navigate('/register')}
              >
                <Rocket className="w-5 h-5" />
                Get Started Free
              </button>
              <button
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Learn More
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Why Choose FundsPilot?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of mutual fund investing with our comprehensive platform
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Investor Dashboard"
              description="Track your portfolio, monitor performance, and manage your mutual fund investments easily."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Fund Comparison"
              description="Compare mutual funds based on returns, risk level, and long-term performance."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Investment Insights"
              description="Get smart insights and analytics to help you choose the best mutual funds."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure Platform"
              description="Your investment data is protected with modern security standards."
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2 font-poppins">10,000+</div>
              <div className="text-gray-600 font-medium">Active Investors</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2 font-poppins">$2.5B+</div>
              <div className="text-gray-600 font-medium">Assets Under Management</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2 font-poppins">500+</div>
              <div className="text-gray-600 font-medium">Mutual Funds Available</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2 font-poppins">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime Guarantee</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-poppins">
              Start Your Investment Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Secure your financial future with data-driven insights and expert guidance
            </p>
            <button
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              onClick={() => navigate('/register')}
            >
              <UserPlus className="w-5 h-5" />
              Create Free Account
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold font-poppins">FundsPilot</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering investors with smart mutual fund solutions. Make informed decisions with our comprehensive platform.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mutual Funds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio Tracker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investment Calculator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fund Comparison</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2026 FundsPilot. All rights reserved. | Empowering investors with smart mutual fund solutions</p>
          </div>
        </div>
      </footer>

      {/* ── Floating Help ── */}
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

// ── App Router ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <InvestmentProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/investor/dashboard"  element={<Dashboard />} />
        <Route path="/investor/funds"      element={<MutualFunds />} />
        <Route path="/investor/funds/:fundName" element={<FundDetail />} />
        <Route path="/investor/compare"    element={<CompareFunds />} />
        <Route path="/investor/calculator" element={<Calculator />} />
        <Route path="/investor/investments" element={<MyInvestments />} />
        <Route path="/investor/profile"    element={<Profile />} />
        {/* Admin */}
<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="funds" element={<FundManagement />} />
  <Route path="content" element={<ContentManagement />} />
  <Route path="reports" element={<AdminReports />} />
</Route>
      </Routes>
    </InvestmentProvider>
  )
}

export default App
