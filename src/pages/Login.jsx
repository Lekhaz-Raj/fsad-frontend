import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInvestments } from '../context/InvestmentContext'
import { Mail, Lock, UserCog, LogIn, ArrowLeft, CircleHelp, TrendingUp } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { setCurrentUser } = useInvestments()
  const [form, setForm] = useState({ email: '', password: '', passkey: '', role: 'Investor' })
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    // Look up registered user
    const users = JSON.parse(localStorage.getItem('mfp_users') || '[]')
    const user = users.find(u => u.email === form.email && u.password === form.password)

    if (!user) {
      setError('Invalid email or password. Please register first.')
      return
    }
    if (user.role !== form.role) {
      setError(`This account is registered as "${user.role}". Please select the correct role.`)
      return
    }
    if (form.role === 'Admin' && user.passkey !== form.passkey) {
      setError('Admin passkey is required and must match your registered passkey.')
      return
    }

    setCurrentUser(user)

    const routes = {
      Investor: '/investor/dashboard',
      'Financial Advisor': '/investor/dashboard',
      'Data Analyst': '/investor/dashboard',
      Admin: '/admin/dashboard',
    }
    navigate(routes[user.role] || '/investor/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center space-x-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-poppins">FundsPilot</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {['Investor', 'Financial Advisor', 'Data Analyst', 'Admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                    form.role === role
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {(role === 'Admin' || role === 'Financial Advisor' || role === 'Data Analyst') && <UserCog className="w-4 h-4" />}
                  <span className="font-medium">{role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {form.role === 'Admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Passkey</label>
              <div className="relative">
                <input
                  type="password"
                  name="passkey"
                  value={form.passkey}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter admin passkey"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </motion.button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center space-x-1 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </motion.div>

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