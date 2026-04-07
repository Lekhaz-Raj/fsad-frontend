import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import { LogIn, UserPlus, Rocket, CircleHelp, ArrowRight } from 'lucide-react'
import { InvestmentProvider } from './context/InvestmentContext.jsx'
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

// ── SVG Icons ──────────────────────────────────────────────────────────────
const TrendingUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const BarChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)

const TrendingUpIconLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// ── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{description}</p>
  </div>
)

// ── Home Page ────────────────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="app">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-icon"><TrendingUpIcon /></span>
          <span className="logo-text">FundsPilot</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-outline" onClick={() => navigate('/login')}><span className="ui-btn-content"><LogIn className="ui-btn-icon" />Login</span></button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}><span className="ui-btn-content"><UserPlus className="ui-btn-icon" />Register</span></button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Build Wealth with Smart Mutual Fund Investing
            Manage, Compare and Track Your Investments
          </h1>
          <p className="hero-subtitle">
            Join FundsPilot, the leading platform for mutual fund investment. Compare funds, track performance,<br />
            and make informed decisions with expert insights and personalized recommendations.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}><span className="ui-btn-content"><Rocket className="ui-btn-icon" />Get Started</span></button>
            <button className="btn btn-outline btn-lg"><span className="ui-btn-content"><ArrowRight className="ui-btn-icon" />Learn More</span></button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="features-grid">
          <FeatureCard
  icon={<UsersIcon />}
  title="Investor Dashboard"
  description="Track your portfolio, monitor performance, and manage your mutual fund investments easily."
/>

<FeatureCard
  icon={<BarChartIcon />}
  title="Fund Comparison"
  description="Compare mutual funds based on returns, risk level, and long-term performance."
/>

<FeatureCard
  icon={<TrendingUpIconLg />}
  title="Investment Insights"
  description="Get smart insights and analytics to help you choose the best mutual funds."
/>

<FeatureCard
  icon={<ShieldIcon />}
  title="Secure Platform"
  description="Your investment data is protected with modern security standards."
/>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Active Investors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$2.5B+</div>
            <div className="stat-label">Assets Under Management</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Mutual Funds Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime Guarantee</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <h2 className="cta-title">Start Your Investment Journey Today</h2>
        <p className="cta-subtitle">Secure your financial future with data-driven insights and expert guidance</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}><span className="ui-btn-content"><UserPlus className="ui-btn-icon" />Create Free Account</span></button>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>© 2026 FundsPilot. All rights reserved.</p>
        <p className="footer-sub">Empowering investors with smart mutual fund solutions</p>
      </footer>

      {/* ── Floating Help ── */}
      <button className="help-btn" title="Help"><CircleHelp className="ui-btn-icon" /></button>

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
        <Route path="/investor/portfolio"  element={<MyInvestments />} />
        <Route path="/investor/profile"    element={<Profile />} />
        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users"     element={<UserManagement />} />
        <Route path="/admin/funds"     element={<FundManagement />} />
        <Route path="/admin/content"   element={<ContentManagement />} />
        <Route path="/admin/reports"   element={<AdminReports />} />
      </Routes>
    </InvestmentProvider>
  )
}

export default App
