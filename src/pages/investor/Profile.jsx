import { useState, useEffect } from 'react'
import InvestorLayout from '../../layouts/InvestorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { UserCircle2, User, Mail, Phone, BadgeCheck, MapPin, Save, ShieldCheck, SlidersHorizontal, MessageSquareMore, Send, RefreshCcw, Clock3 } from 'lucide-react'

const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function Profile() {
  const { currentUser, setCurrentUser } = useInvestments()
  const [form, setForm] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    pan: currentUser?.pan || '',
    address: currentUser?.address || '',
  })
  const [prefs, setPrefs] = useState({
    riskAppetite: currentUser?.preferences?.riskAppetite || 'Moderate',
    horizon: currentUser?.preferences?.horizon || 'Medium Term (3-5 years)',
    sipBudget: currentUser?.preferences?.sipBudget || '15000',
  })
  const [query, setQuery] = useState('')
  const [queryToast, setQueryToast] = useState('')
  const [myQueries, setMyQueries] = useState([])

  // Load this investor's queries from localStorage (filtered by email)
  const refreshMyQueries = () => {
    const all = JSON.parse(localStorage.getItem('mfp_queries') || '[]')
    setMyQueries(all.filter(q => q.email === currentUser?.email))
  }

  useEffect(() => { refreshMyQueries() }, [currentUser?.email])

  useEffect(() => {
    if (!currentUser) return
    setForm({
      fullName: currentUser.fullName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      pan: currentUser.pan || '',
      address: currentUser.address || '',
    })
    setPrefs({
      riskAppetite: currentUser.preferences?.riskAppetite || 'Moderate',
      horizon: currentUser.preferences?.horizon || 'Medium Term (3-5 years)',
      sipBudget: currentUser.preferences?.sipBudget || '15000',
    })
  }, [currentUser])

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handlePrefs = e => setPrefs({ ...prefs, [e.target.name]: e.target.value })

  const handleUpdateProfile = () => {
    if (currentUser) {
      const oldEmail = currentUser.email
      const newEmail = form.email
      const updated = {
        ...currentUser,
        fullName: form.fullName,
        email: newEmail,
        phone: form.phone,
        pan: form.pan,
        address: form.address,
        preferences: {
          riskAppetite: prefs.riskAppetite,
          horizon: prefs.horizon,
          sipBudget: prefs.sipBudget,
        },
      }

      if (oldEmail && newEmail && oldEmail !== newEmail) {
        const oldInvKey = `mfp_inv_${oldEmail}`
        const newInvKey = `mfp_inv_${newEmail}`
        const oldInv = localStorage.getItem(oldInvKey)
        if (oldInv && !localStorage.getItem(newInvKey)) {
          localStorage.setItem(newInvKey, oldInv)
          localStorage.removeItem(oldInvKey)
        }

        const allQueries = JSON.parse(localStorage.getItem('mfp_queries') || '[]')
        const migratedQueries = allQueries.map(q =>
          q.email === oldEmail ? { ...q, email: newEmail, name: form.fullName } : q
        )
        localStorage.setItem('mfp_queries', JSON.stringify(migratedQueries))
      }

      setCurrentUser(updated)
      const users = JSON.parse(localStorage.getItem('mfp_users') || '[]')
      const idx = users.findIndex(u => u.email === currentUser.email)
      if (idx >= 0) {
        users[idx] = {
          ...users[idx],
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          pan: form.pan,
          address: form.address,
          preferences: {
            riskAppetite: prefs.riskAppetite,
            horizon: prefs.horizon,
            sipBudget: prefs.sipBudget,
          },
        }
        localStorage.setItem('mfp_users', JSON.stringify(users))
      }
    }
    alert('Profile updated successfully!')
  }

  const submitQuery = () => {
    if (!query.trim()) return
    const existing = JSON.parse(localStorage.getItem('mfp_queries') || '[]')
    const newQuery = {
      id: Date.now(),
      name: currentUser?.fullName || 'Investor',
      email: currentUser?.email || '',
      query: query.trim(),
      time: 'Just now',
      status: 'Pending',
      response: '',
    }
    localStorage.setItem('mfp_queries', JSON.stringify([newQuery, ...existing]))
    setQuery('')
    setQueryToast('✓ Your query has been sent to the advisor!')
    setTimeout(() => setQueryToast(''), 3000)
    refreshMyQueries()
  }

  return (
    <InvestorLayout>
      <h2 className="inv-page-title"><span className="ui-title-row"><UserCircle2 className="ui-title-icon" />Profile</span></h2>

      {queryToast && (
        <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.7rem 1.2rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {queryToast}
        </div>
      )}

      <div className="profile-layout">
        {/* Left — Personal Info */}
        <div className="inv-card profile-left">
          <h3 className="inv-card-title" style={{ marginBottom: '1.2rem' }}><span className="ui-title-row"><User className="ui-title-icon" />Personal Information</span></h3>
          <div className="profile-grid">
            <div className="form-group-p">
              <label className="p-label"><span className="ui-meta-row"><User className="ui-meta-icon" />Full Name</span></label>
              <input className="p-input" name="fullName" value={form.fullName} onChange={handleForm} />
            </div>
            <div className="form-group-p">
              <label className="p-label"><span className="ui-meta-row"><Mail className="ui-meta-icon" />Email Address</span></label>
              <input className="p-input" name="email" value={form.email} onChange={handleForm} />
            </div>
            <div className="form-group-p">
              <label className="p-label"><span className="ui-meta-row"><Phone className="ui-meta-icon" />Phone Number</span></label>
              <input className="p-input" name="phone" value={form.phone} onChange={handleForm} />
            </div>
            <div className="form-group-p">
              <label className="p-label"><span className="ui-meta-row"><BadgeCheck className="ui-meta-icon" />PAN Number</span></label>
              <input className="p-input" name="pan" value={form.pan} onChange={handleForm} />
            </div>
          </div>
          <div className="form-group-p" style={{ marginTop: '0.8rem' }}>
            <label className="p-label"><span className="ui-meta-row"><MapPin className="ui-meta-icon" />Address</span></label>
            <textarea className="p-textarea" name="address" value={form.address} onChange={handleForm} rows={3} />
          </div>
          <button className="auth-btn" style={{ marginTop: '1.2rem', width: 'auto', padding: '0.55rem 1.5rem' }} onClick={handleUpdateProfile}><span className="ui-btn-content"><Save className="ui-btn-icon" />Update Profile</span></button>
        </div>

        {/* Right column */}
        <div className="profile-right-col">
          {/* Avatar Card */}
          <div className="inv-card profile-avatar-card">
            <div className="profile-avatar"><UserIcon /></div>
            <div className="profile-avatar-name">{form.fullName}</div>
            <div className="profile-avatar-role">{currentUser?.role || 'Investor'}</div>
          </div>

          {/* Account Status */}
          <div className="inv-card" style={{ marginTop: '1rem', padding: '1.2rem 1.4rem' }}>
            <h3 className="inv-card-title" style={{ marginBottom: '0.9rem' }}><span className="ui-title-row"><ShieldCheck className="ui-title-icon" />Account Status</span></h3>
            <div className="acct-row">
              <span className="acct-label">KYC Status</span>
              <span className="acct-verified">Verified</span>
            </div>
            <div className="acct-row">
              <span className="acct-label">Member Since</span>
              <span className="acct-info">Jan 2024</span>
            </div>
            <div className="acct-row">
              <span className="acct-label">Risk Profile</span>
              <span className="acct-info">Moderate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Preferences */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1.4rem' }}>
        <h3 className="inv-card-title" style={{ marginBottom: '1rem' }}><span className="ui-title-row"><SlidersHorizontal className="ui-title-icon" />Investment Preferences</span></h3>
        <div className="pref-grid">
          <div className="form-group-p">
            <label className="p-label">Risk Appetite</label>
            <select className="p-input" name="riskAppetite" value={prefs.riskAppetite} onChange={handlePrefs}>
              {['Conservative','Moderate','Aggressive'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group-p">
            <label className="p-label">Investment Horizon</label>
            <select className="p-input" name="horizon" value={prefs.horizon} onChange={handlePrefs}>
              {['Short Term (< 1 year)','Medium Term (3-5 years)','Long Term (5+ years)'].map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="form-group-p">
            <label className="p-label">Monthly SIP Budget</label>
            <input className="p-input" name="sipBudget" value={prefs.sipBudget} onChange={handlePrefs} />
          </div>
        </div>
      </div>

      {/* Ask Advisor */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1.4rem' }}>
        <h3 className="inv-card-title" style={{ marginBottom: '1rem' }}><span className="ui-title-row"><MessageSquareMore className="ui-title-icon" />Ask Financial Advisor</span></h3>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '0.8rem' }}>
          Have a question about your investments? Submit it below — our advisor will respond shortly.
        </p>
        <div className="form-group-p">
          <label className="p-label">Your Question</label>
          <textarea
            className="p-textarea"
            rows={3}
            placeholder="E.g., Which funds are best for long-term growth?"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button
          className="auth-btn"
          style={{ marginTop: '0.8rem', width: 'auto', padding: '0.55rem 1.5rem' }}
          onClick={submitQuery}
          disabled={!query.trim()}
        >
          <span className="ui-btn-content"><Send className="ui-btn-icon" />Submit Query</span>
        </button>
      </div>

      {/* My Queries & Advisor Responses */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="inv-card-title" style={{ margin: 0 }}>My Queries &amp; Advisor Responses</h3>
          <button
            onClick={refreshMyQueries}
            style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem', color: '#555' }}
          >
            <span className="ui-btn-content"><RefreshCcw className="ui-btn-icon" />Refresh</span>
          </button>
        </div>

        {myQueries.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
            You haven&apos;t submitted any queries yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myQueries.map(q => (
              <div key={q.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '1rem 1.2rem', background: '#fafafa' }}>
                {/* Question */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 600, color: '#222', fontSize: '0.92rem', margin: 0 }}>{q.query}</p>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.7rem', borderRadius: '20px', marginLeft: '1rem', whiteSpace: 'nowrap',
                    background: q.status === 'Responded' ? '#f0fdf4' : '#fef3c7',
                    color:      q.status === 'Responded' ? '#166534' : '#92400e',
                    border:     `1px solid ${q.status === 'Responded' ? '#bbf7d0' : '#fde68a'}`,
                  }}>
                    {q.status}
                  </span>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.78rem', margin: '0 0 0.6rem' }}>{q.time}</p>

                {/* Advisor Response */}
                {q.status === 'Responded' && q.response ? (
                  <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderLeft: '3px solid #7B1D1D', borderRadius: '6px', padding: '0.7rem 1rem', marginTop: '0.4rem' }}>
                    <p style={{ fontSize: '0.78rem', color: '#7B1D1D', fontWeight: 600, marginBottom: '0.3rem' }}>Advisor&apos;s Response</p>
                    <p style={{ fontSize: '0.88rem', color: '#333', margin: 0 }}>{q.response}</p>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: '#bbb', fontStyle: 'italic', margin: 0 }}>
                    <span className="ui-meta-row"><Clock3 className="ui-meta-icon" />Awaiting advisor response...</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </InvestorLayout>
  )
}
