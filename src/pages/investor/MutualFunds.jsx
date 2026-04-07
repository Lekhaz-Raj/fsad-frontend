import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InvestorLayout from '../../layouts/InvestorLayout'
import { getSchemeNAV } from '../../services/mutualfundService'
import { BadgeIndianRupee, Search, Eye } from 'lucide-react'

const TrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)

export const FUNDS = [
  { name: 'Alpha Growth Equity Fund',     schemeCode: 119551, aum: '₹5,240 Cr', category: 'Large Cap', risk: 'Medium', nav: '₹45.32', ret1: 12.5, ret3: 15.2, ret5: 17.8, expenseRatio: '1.20%', minInvestment: '₹500' },
  { name: 'Strategic Balanced Fund',      schemeCode: 113177, aum: '₹3,890 Cr', category: 'Balanced',  risk: 'Medium', nav: '₹38.76', ret1: 10.8, ret3: 12.4, ret5: 14.1, expenseRatio: '1.10%', minInvestment: '₹500' },
  { name: 'Mid Cap Opportunities Fund',   schemeCode: 120503, aum: '₹2,150 Cr', category: 'Mid Cap',   risk: 'High',   nav: '₹62.15', ret1: 18.3, ret3: 22.6, ret5: 25.4, expenseRatio: '1.45%', minInvestment: '₹1000' },
  { name: 'Conservative Debt Fund',       schemeCode: 119775, aum: '₹4,560 Cr', category: 'Debt',      risk: 'Low',    nav: '₹28.94', ret1: 6.2,  ret3: 6.8,  ret5: 7.2,  expenseRatio: '0.85%', minInvestment: '₹500' },
  { name: 'Small Cap Growth Fund',        schemeCode: 120828, aum: '₹1,680 Cr', category: 'Small Cap', risk: 'High',   nav: '₹54.28', ret1: 22.4, ret3: 28.5, ret5: 31.2, expenseRatio: '1.60%', minInvestment: '₹1000' },
  { name: 'Tax Saver Equity Fund',        schemeCode: 120586, aum: '₹6,200 Cr', category: 'ELSS',      risk: 'Medium', nav: '₹41.56', ret1: 13.7, ret3: 16.8, ret5: 19.3, expenseRatio: '1.25%', minInvestment: '₹500' },
  { name: 'Corporate Bond Fund',          schemeCode: 101206, aum: '₹3,420 Cr', category: 'Debt',      risk: 'Low',    nav: '₹32.18', ret1: 7.1,  ret3: 7.6,  ret5: 8.0,  expenseRatio: '0.75%', minInvestment: '₹500' },
  { name: 'Dividend Yield Fund',          schemeCode: 118825, aum: '₹4,780 Cr', category: 'Large Cap', risk: 'Medium', nav: '₹49.82', ret1: 11.5, ret3: 13.9, ret5: 15.5, expenseRatio: '1.15%', minInvestment: '₹500' },
]

const riskClass = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' }

export default function MutualFunds() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All Categories')
  const [risk, setRisk]         = useState('All Risk Levels')
  const [liveNavs, setLiveNavs] = useState({})   // schemeCode -> '₹xx.xx'
  const [navLoading, setNavLoading] = useState(true)

  // Batch-fetch live NAV for all funds on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled(
          FUNDS.map(f => getSchemeNAV(f.schemeCode))
        )
        const navMap = {}
        results.forEach((res, i) => {
          if (res.status === 'fulfilled' && res.value?.data?.[0]?.nav) {
            navMap[FUNDS[i].schemeCode] = `₹${parseFloat(res.value.data[0].nav).toFixed(2)}`
          }
        })
        setLiveNavs(navMap)
      } catch (e) {
        console.error('NAV fetch error', e)
      } finally {
        setNavLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filtered = FUNDS.filter(f => {
    const matchSearch   = f.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All Categories' || f.category === category
    const matchRisk     = risk === 'All Risk Levels'    || f.risk === risk
    return matchSearch && matchCategory && matchRisk
  })

  return (
    <InvestorLayout>
      <h2 className="inv-page-title"><span className="ui-title-row"><BadgeIndianRupee className="ui-title-icon" />Mutual Funds</span></h2>

      {/* Filters */}
      <div className="inv-card" style={{ padding: '1rem 1.2rem' }}>
        <div className="funds-filters">
          <div className="funds-search-wrap">
            <span className="funds-search-icon"><Search className="ui-btn-icon" /></span>
            <input className="funds-search" placeholder="Search funds..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="inv-select" value={category} onChange={e => setCategory(e.target.value)}>
            {['All Categories','Large Cap','Mid Cap','Small Cap','Balanced','Debt','ELSS'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="inv-select" value={risk} onChange={e => setRisk(e.target.value)}>
            {['All Risk Levels','Low','Medium','High'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="inv-card" style={{ padding: 0, overflow: 'hidden', marginTop: '1.2rem' }}>
        <table className="funds-table">
          <thead>
            <tr>
              <th>Fund Name</th><th>Category</th><th>Risk Level</th>
              <th>NAV</th><th>1Y Return</th><th>3Y Return</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.name}>
                <td>
                  <div className="fund-name-main">{f.name}</div>
                  <div className="fund-name-aum">AUM: {f.aum}</div>
                </td>
                <td>{f.category}</td>
                <td><span className={`risk-badge ${riskClass[f.risk]}`}>{f.risk}</span></td>
                <td>
                  {navLoading
                    ? <span className="nav-loading">…</span>
                    : <span title="Live from mfapi.in">
                        {liveNavs[f.schemeCode] || f.nav}
                        {liveNavs[f.schemeCode] && <span className="live-dot" title="Live">●</span>}
                      </span>
                  }
                </td>
                <td className="ret-cell"><TrendUp /> {f.ret1}%</td>
                <td className="ret-cell"><TrendUp /> {f.ret3}%</td>
                <td><button className="view-btn" onClick={() => navigate(`/investor/funds/${encodeURIComponent(f.name)}`)}><span className="ui-btn-content"><Eye className="ui-btn-icon" />View Details</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InvestorLayout>
  )
}
