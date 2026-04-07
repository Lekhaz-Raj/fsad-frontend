import { useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { BadgeIndianRupee, PlusCircle, X, CircleX, Save, Edit3, RefreshCcw } from 'lucide-react'

const SEED_FUNDS = [
  { id: 'MF001', name: 'Alpha Growth Equity Fund',   category: 'Large Cap', risk: 'Medium', nav: 45.32,  aum: '₹5,240 Cr', expenseRatio: '1.20%', minInvest: '₹500'  },
  { id: 'MF002', name: 'Strategic Balanced Fund',    category: 'Balanced',  risk: 'Medium', nav: 38.76,  aum: '₹3,890 Cr', expenseRatio: '1.10%', minInvest: '₹500'  },
  { id: 'MF003', name: 'Mid Cap Opportunities Fund', category: 'Mid Cap',   risk: 'High',   nav: 62.15,  aum: '₹2,150 Cr', expenseRatio: '1.45%', minInvest: '₹1000' },
  { id: 'MF004', name: 'Conservative Debt Fund',     category: 'Debt',      risk: 'Low',    nav: 28.94,  aum: '₹4,560 Cr', expenseRatio: '0.85%', minInvest: '₹500'  },
  { id: 'MF005', name: 'Small Cap Growth Fund',      category: 'Small Cap', risk: 'High',   nav: 54.28,  aum: '₹1,680 Cr', expenseRatio: '1.60%', minInvest: '₹1000' },
  { id: 'MF006', name: 'Tax Saver Equity Fund',      category: 'ELSS',      risk: 'Medium', nav: 41.56,  aum: '₹6,200 Cr', expenseRatio: '1.25%', minInvest: '₹500'  },
  { id: 'MF007', name: 'Corporate Bond Fund',        category: 'Debt',      risk: 'Low',    nav: 32.18,  aum: '₹3,420 Cr', expenseRatio: '0.75%', minInvest: '₹500'  },
  { id: 'MF008', name: 'Dividend Yield Fund',        category: 'Large Cap', risk: 'Medium', nav: 49.82,  aum: '₹4,780 Cr', expenseRatio: '1.15%', minInvest: '₹500'  },
]

const CATEGORIES = ['All Categories', 'Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'Balanced', 'ELSS']
const RISK_LEVELS = ['All Risk Levels', 'Low', 'Medium', 'High']
const RISK_CLASS  = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' }

const EMPTY_FUND = { name: '', category: 'Large Cap', risk: 'Medium', nav: '', aum: '', expenseRatio: '', minInvest: '₹500' }

export default function FundManagement() {
  const [funds, setFunds]     = useState(SEED_FUNDS)
  const [search, setSearch]   = useState('')
  const [catFilter, setCat]   = useState('All Categories')
  const [riskFilter, setRisk] = useState('All Risk Levels')
  const [toast, setToast]     = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editFund, setEditFund] = useState(null)
  const [navModal, setNavModal] = useState(null)   // { fund, newNav }
  const [form, setForm]       = useState(EMPTY_FUND)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = funds.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchCat  = catFilter   === 'All Categories' || f.category === catFilter
    const matchRisk = riskFilter  === 'All Risk Levels' || f.risk    === riskFilter
    return matchSearch && matchCat && matchRisk
  })

  const saveFund = e => {
    e.preventDefault()
    if (!form.name || !form.nav) { showToast('Fund name and NAV are required.'); return }
    if (editFund) {
      setFunds(prev => prev.map(f => f.id === editFund.id ? { ...f, ...form, nav: parseFloat(form.nav) } : f))
      showToast('✓ Fund updated!')
    } else {
      const newId = `MF${String(funds.length + 1).padStart(3, '0')}`
      setFunds(prev => [...prev, { id: newId, ...form, nav: parseFloat(form.nav) }])
      showToast('✓ Fund added!')
    }
    setShowAdd(false); setEditFund(null); setForm(EMPTY_FUND)
  }

  const openEdit = f => {
    setEditFund(f)
    setForm({ name: f.name, category: f.category, risk: f.risk, nav: String(f.nav), aum: f.aum, expenseRatio: f.expenseRatio, minInvest: f.minInvest })
    setShowAdd(true)
  }

  const applyNav = () => {
    const val = parseFloat(navModal.newNav)
    if (isNaN(val) || val <= 0) { showToast('Enter a valid NAV value.'); return }
    setFunds(prev => prev.map(f => f.id === navModal.fund.id ? { ...f, nav: val } : f))
    setNavModal(null)
    showToast(`✓ NAV updated to ₹${val.toFixed(2)}`)
  }

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h2 className="adm-page-title" style={{ margin: 0 }}><span className="ui-title-row"><BadgeIndianRupee className="ui-title-icon" />Fund Management</span></h2>
        <button className="adm-btn-primary" onClick={() => { setEditFund(null); setForm(EMPTY_FUND); setShowAdd(true) }}><span className="ui-btn-content"><PlusCircle className="ui-btn-icon" />Add New Fund</span></button>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="adm-overlay" onClick={() => { setShowAdd(false); setEditFund(null) }}>
          <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{editFund ? 'Edit Fund' : 'Add New Fund'}</h3>
              <button className="adm-modal-close" onClick={() => { setShowAdd(false); setEditFund(null) }}><X className="ui-btn-icon" /></button>
            </div>
            <form onSubmit={saveFund}>
              <div className="adm-form-group">
                <label className="adm-label">Fund Name</label>
                <input className="adm-input" placeholder="Enter fund name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="adm-grid-2">
                <div className="adm-form-group">
                  <label className="adm-label">Category</label>
                  <select className="adm-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'Balanced', 'ELSS'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Risk Level</label>
                  <select className="adm-input" value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })}>
                    {['Low', 'Medium', 'High'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Current NAV (₹)</label>
                  <input className="adm-input" type="number" step="0.01" placeholder="0.00" value={form.nav}
                    onChange={e => setForm({ ...form, nav: e.target.value })} />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">AUM</label>
                  <input className="adm-input" placeholder="₹0,000 Cr" value={form.aum}
                    onChange={e => setForm({ ...form, aum: e.target.value })} />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Expense Ratio</label>
                  <input className="adm-input" placeholder="1.00%" value={form.expenseRatio}
                    onChange={e => setForm({ ...form, expenseRatio: e.target.value })} />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Min Investment</label>
                  <input className="adm-input" placeholder="₹500" value={form.minInvest}
                    onChange={e => setForm({ ...form, minInvest: e.target.value })} />
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-outline" onClick={() => { setShowAdd(false); setEditFund(null) }}><span className="ui-btn-content"><CircleX className="ui-btn-icon" />Cancel</span></button>
                <button type="submit" className="adm-btn-primary"><span className="ui-btn-content"><Save className="ui-btn-icon" />{editFund ? 'Save Changes' : 'Add Fund'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update NAV Modal */}
      {navModal && (
        <div className="adm-overlay" onClick={() => setNavModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Update NAV</h3>
              <button className="adm-modal-close" onClick={() => setNavModal(null)}><X className="ui-btn-icon" /></button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '1rem' }}>
              <strong>{navModal.fund.name}</strong> — Current NAV: <strong>₹{navModal.fund.nav.toFixed(2)}</strong>
            </p>
            <div className="adm-form-group">
              <label className="adm-label">New NAV (₹)</label>
              <input className="adm-input" type="number" step="0.01" placeholder="Enter new NAV"
                value={navModal.newNav}
                onChange={e => setNavModal({ ...navModal, newNav: e.target.value })}
                autoFocus />
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-outline" onClick={() => setNavModal(null)}><span className="ui-btn-content"><CircleX className="ui-btn-icon" />Cancel</span></button>
              <button className="adm-btn-primary" onClick={applyNav}><span className="ui-btn-content"><RefreshCcw className="ui-btn-icon" />Update NAV</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="adm-filter-bar">
        <div className="adm-search-wrap">
          <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="adm-search-input" placeholder="Search funds..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-input" value={catFilter} onChange={e => setCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="adm-input" value={riskFilter} onChange={e => setRisk(e.target.value)}>
          {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="adm-card">
        <h3 className="adm-card-title">Mutual Funds Database</h3>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Fund ID</th><th>Fund Name</th><th>Category</th>
              <th>Risk Level</th><th>Current NAV</th><th>AUM</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id}>
                <td className="adm-td-link">{f.id}</td>
                <td className="adm-td-name">{f.name}</td>
                <td>{f.category}</td>
                <td><span className={`adm-risk-chip ${RISK_CLASS[f.risk]}`}>{f.risk}</span></td>
                <td>₹{f.nav.toFixed(2)}</td>
                <td>{f.aum}</td>
                <td>
                  <div className="adm-action-row">
                    <button className="adm-action-btn" onClick={() => openEdit(f)}><span className="ui-btn-content"><Edit3 className="ui-btn-icon" />Edit</span></button>
                    <button className="adm-action-btn adm-btn-nav" onClick={() => setNavModal({ fund: f, newNav: '' })}><span className="ui-btn-content"><RefreshCcw className="ui-btn-icon" />Update NAV</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
