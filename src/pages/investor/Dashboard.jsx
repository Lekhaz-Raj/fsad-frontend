import { useState } from 'react'
import InvestorLayout from '../../layouts/InvestorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { motion } from 'framer-motion'
import {
  TrendingUp, Briefcase, Target, Award, AlertCircle,
  BookOpenText, ArrowUpRight, ArrowDownRight, Download, Filter, Search
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const generatePerformanceData = (months) => {
  const data = []
  let value = 100
  for (let i = 0; i < months; i++) {
    value = value * (0.95 + Math.random() * 0.1)
    const date = new Date()
    date.setMonth(date.getMonth() - (months - i))
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short' }),
      value: Math.round(value * 100) / 100,
    })
  }
  return data
}

const PIE_COLORS = ['#7B1D1D', '#C9A84C', '#333333', '#e06b6b', '#6b8ce0', '#6be0b5']

const CAT_BUCKET = {
  'Large Cap': 'Equity',
  'Mid Cap': 'Equity',
  'Small Cap': 'Equity',
  'ELSS': 'Equity',
  'Balanced': 'Balanced',
  'Debt': 'Debt',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const StatCard = ({ icon: Icon, label, value, sub, gradient }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
    whileHover={{ scale: 1.02, translateY: -4 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white/30 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      {sub.includes('+') && <ArrowUpRight className="w-5 h-5 text-green-300" />}
      {sub.includes('-') && <ArrowDownRight className="w-5 h-5 text-red-300" />}
    </div>
    <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
    <h3 className="text-3xl font-bold mb-2">{value}</h3>
    <p className="text-white/70 text-sm">{sub}</p>
  </motion.div>
)

const HoldingsTable = ({ portfolio, sortBy, setSortBy, searchTerm, setSearchTerm }) => {
  const sorted = [...portfolio].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'value') return b.currentVal - a.currentVal
    if (sortBy === 'returns') return (b.currentVal - b.invested) - (a.currentVal - a.invested)
    return 0
  })

  const filtered = sorted.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Your Holdings</span>
          </h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200/50">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => setSortBy(sortBy === 'name' ? '' : 'name')}
                  className="font-semibold text-gray-700 text-sm hover:text-gray-900 flex items-center space-x-1"
                >
                  <span>Fund Name</span>
                  {sortBy === 'name' && <TrendingUp className="w-4 h-4" />}
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <button
                  onClick={() => setSortBy(sortBy === 'value' ? '' : 'value')}
                  className="font-semibold text-gray-700 text-sm hover:text-gray-900 flex items-center justify-end space-x-1 ml-auto"
                >
                  <span>Current Value</span>
                  {sortBy === 'value' && <TrendingUp className="w-4 h-4" />}
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <button
                  onClick={() => setSortBy(sortBy === 'returns' ? '' : 'returns')}
                  className="font-semibold text-gray-700 text-sm hover:text-gray-900 flex items-center justify-end space-x-1 ml-auto"
                >
                  <span>Returns</span>
                  {sortBy === 'returns' && <TrendingUp className="w-4 h-4" />}
                </button>
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700 text-sm">Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((holding, i) => {
              const gain = holding.currentVal - holding.invested
              const gainPct = holding.invested > 0 ? ((gain / holding.invested) * 100).toFixed(1) : 0
              const isGain = gain >= 0
              const riskClass = holding.risk === 'High' ? 'bg-red-100/80 text-red-700' : 
                               holding.risk === 'Medium' ? 'bg-yellow-100/80 text-yellow-700' : 
                               'bg-green-100/80 text-green-700'
              const gainClass = isGain ? 'bg-green-100/80 text-green-700' : 'bg-red-100/80 text-red-700'

              return (
                <motion.tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{holding.name}</p>
                      <p className="text-xs text-gray-500">{holding.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-gray-900">₹{holding.currentVal.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">{holding.units} units</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold text-sm ${gainClass}`}>
                      {isGain ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{Math.abs(gainPct)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">₹{gain.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${riskClass}`}>
                      {holding.risk}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No funds matching your search</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { currentUser, investments, educationalContent } = useInvestments()
  const [timeRange, setTimeRange] = useState('1Y')
  const [sortBy, setSortBy] = useState('value')
  const [searchTerm, setSearchTerm] = useState('')

  const portfolio = investments.map(p => ({
    ...p,
    currentVal: parseFloat((p.nav * 1.125 * p.units).toFixed(0)),
  }))

  const totalInvested = portfolio.reduce((s, p) => s + p.invested, 0)
  const totalCurrent = portfolio.reduce((s, p) => s + p.currentVal, 0)
  const totalReturns = totalCurrent - totalInvested
  const returnPct = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0.0'

  const bucketMap = {}
  portfolio.forEach(p => {
    const bucket = CAT_BUCKET[p.category] || p.category
    bucketMap[bucket] = (bucketMap[bucket] || 0) + p.currentVal
  })
  const pieData = Object.entries(bucketMap).map(([name, value]) => ({ name, value }))

  const highCount = investments.filter(p => p.risk === 'High').length
  const lowCount = investments.filter(p => p.risk === 'Low').length
  const totalFunds = investments.length
  const riskScore = totalFunds === 0 ? 0 : Math.round(((highCount * 3 + (totalFunds - highCount - lowCount) * 2 + lowCount) / (totalFunds * 3)) * 100)
  const riskLabel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : totalFunds === 0 ? 'N/A' : 'Low'
  const divScore = Math.min(100, Math.round((totalFunds / 8) * 100))

  const timeRangeMap = { '1M': 30, '6M': 180, '1Y': 365, '5Y': 1825 }
  const daysCount = timeRangeMap[timeRange]
  const performanceData = generatePerformanceData(Math.floor(daysCount / 30))

  const hasInvestments = investments.length > 0
  const publishedContent = educationalContent
    .filter(article => article.status === 'Published')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  return (
    <InvestorLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600">Here's your portfolio performance at a glance</p>
          </div>
          <button className="hidden lg:flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20">
            <ArrowUpRight className="w-4 h-4" />
            <span>New Investment</span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Briefcase}
            label="Portfolio Value"
            value={hasInvestments ? `₹${totalCurrent.toLocaleString('en-IN')}` : '₹0'}
            sub={hasInvestments ? `+${returnPct}% overall` : 'No investments yet'}
            gradient="from-blue-600 to-blue-700"
          />
          <StatCard
            icon={Target}
            label="Total Invested"
            value={hasInvestments ? `₹${totalInvested.toLocaleString('en-IN')}` : '₹0'}
            sub={hasInvestments ? `Across ${totalFunds} fund${totalFunds !== 1 ? 's' : ''}` : 'Start investing'}
            gradient="from-purple-600 to-purple-700"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Returns"
            value={hasInvestments ? `₹${totalReturns.toLocaleString('en-IN')}` : '₹0'}
            sub={hasInvestments ? `+${returnPct}%` : '—'}
            gradient="from-green-600 to-green-700"
          />
          <StatCard
            icon={Award}
            label="Active Holdings"
            value={String(totalFunds)}
            sub={hasInvestments ? 'Funds in portfolio' : 'Add your first fund'}
            gradient="from-amber-600 to-amber-700"
          />
        </motion.div>

        {!hasInvestments ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100/50"
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No investments yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your portfolio by exploring our curated selection of mutual funds
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20">
              Explore Funds
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100/50">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Portfolio Performance</span>
                  </h2>
                  <p className="text-sm text-gray-600">Last 5 years growth trajectory</p>
                </div>
                <div className="flex items-center space-x-2">
                  {['1M', '6M', '1Y', '5Y'].map(range => (
                    <motion.button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        timeRange === range
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range}
                    </motion.button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => `₹${value.toFixed(2)}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HoldingsTable
                  portfolio={portfolio}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100/50 h-fit"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <span>Asset Allocation</span>
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <span className="text-gray-700 font-medium">{d.name}</span>
                      </div>
                      <span className="text-gray-900 font-semibold">₹{d.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border border-red-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-700" />
                  </div>
                  <h3 className="font-bold text-gray-900">Risk Level</h3>
                </div>
                <p className="text-3xl font-bold text-red-700 mb-2">{riskLabel}</p>
                <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: `${riskScore}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-2">{riskScore}% risk score</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-gray-900">Diversification</h3>
                </div>
                <p className="text-3xl font-bold text-blue-700 mb-2">{Math.round(divScore)}%</p>
                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${divScore}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-2">Portfolio diversity</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="font-bold text-gray-900">Performance</h3>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-2">+{returnPct}%</p>
                <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: `${Math.min(100, parseFloat(returnPct))}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-2">Overall returns</p>
              </div>
            </motion.div>

            {publishedContent.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100/50">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <BookOpenText className="w-5 h-5 text-blue-600" />
                  <span>Learning Hub</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {publishedContent.map((article) => (
                    <motion.div
                      key={article.id}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      whileHover={{ translateY: -4 }}
                    >
                      <div className="mb-3">
                        <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                          {article.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.content}</p>
                      <p className="text-xs text-gray-500 font-medium">{article.date}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </InvestorLayout>
  )
}
