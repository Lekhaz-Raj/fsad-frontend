import { useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { Users, UserPlus, X, Ban, ShieldCheck, Eye, CircleX } from 'lucide-react'

const ROLES    = ['All Roles', 'Investor', 'Financial Advisor', 'Data Analyst', 'Admin']
const STATUSES = ['All Status', 'Active', 'Inactive']

const EMPTY_FORM = { name: '', email: '', role: 'Investor', joinDate: new Date().toISOString().slice(0, 10) }

// Load real registered users → convert to the table format
function loadUsers() {
  const raw = JSON.parse(localStorage.getItem('mfp_users') || '[]')
  return raw.map((u, i) => ({
    id: `USR${String(i + 1).padStart(3, '0')}`,
    name: u.fullName,
    email: u.email,
    role: u.role,
    joinDate: u.joinDate || new Date().toISOString().slice(0, 10),
    status: u.status || 'Active',
  }))
}

// Persist status / new users back
function saveUsers(tableUsers) {
  const raw = JSON.parse(localStorage.getItem('mfp_users') || '[]')
  const updated = tableUsers.map(u => {
    const existing = raw.find(r => r.email === u.email)
    return existing
      ? { ...existing, status: u.status, joinDate: u.joinDate }
      : { fullName: u.name, email: u.email, role: u.role, password: '', status: u.status, joinDate: u.joinDate }
  })
  localStorage.setItem('mfp_users', JSON.stringify(updated))
}

export default function UserManagement() {
  const [users, setUsers] = useState(loadUsers)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRole]     = useState('All Roles')
  const [statusFilter, setStatus] = useState('All Status')
  const [toast, setToast]         = useState('')
  const [showAdd, setShowAdd]     = useState(false)
  const [viewUser, setViewUser]   = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter   === 'All Roles'   || u.role   === roleFilter
    const matchStatus = statusFilter === 'All Status'  || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const toggleStatus = (id) => {
    const user = users.find(u => u.id === id)
    setUsers(prev => {
      const updated = prev.map(u =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
      saveUsers(updated)
      return updated
    })
    showToast(`✓ ${user.name} ${user.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const addUser = e => {
    e.preventDefault()
    if (!form.name || !form.email) { showToast('Name and email are required.'); return }
    const newId = `USR${String(users.length + 1).padStart(3, '0')}`
    setUsers(prev => {
      const updated = [...prev, { id: newId, name: form.name, email: form.email, role: form.role, joinDate: form.joinDate, status: 'Active' }]
      saveUsers(updated)
      return updated
    })
    setShowAdd(false); setForm(EMPTY_FORM)
    showToast('✓ User added successfully!')
  }

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h2 className="adm-page-title" style={{ margin: 0 }}><span className="ui-title-row"><Users className="ui-title-icon" />User Management</span></h2>
        <button className="adm-btn-primary" onClick={() => setShowAdd(true)}><span className="ui-btn-content"><UserPlus className="ui-btn-icon" />Add New User</span></button>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}

      {/* Add User Modal */}
      {showAdd && (
        <div className="adm-overlay" onClick={() => setShowAdd(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Add New User</h3>
              <button className="adm-modal-close" onClick={() => setShowAdd(false)}><X className="ui-btn-icon" /></button>
            </div>
            <form onSubmit={addUser}>
              {[['Name', 'name', 'text', 'Enter full name'], ['Email', 'email', 'email', 'email@example.com']].map(([lbl, key, type, ph]) => (
                <div className="adm-form-group" key={key}>
                  <label className="adm-label">{lbl}</label>
                  <input className="adm-input" type={type} placeholder={ph}
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div className="adm-form-group">
                <label className="adm-label">Role</label>
                <select className="adm-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {['Investor', 'Financial Advisor', 'Data Analyst', 'Admin'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-outline" onClick={() => setShowAdd(false)}><span className="ui-btn-content"><CircleX className="ui-btn-icon" />Cancel</span></button>
                <button type="submit" className="adm-btn-primary"><span className="ui-btn-content"><UserPlus className="ui-btn-icon" />Add User</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div className="adm-overlay" onClick={() => setViewUser(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">User Details</h3>
              <button className="adm-modal-close" onClick={() => setViewUser(null)}><X className="ui-btn-icon" /></button>
            </div>
            <div className="adm-detail-rows">
              {[['User ID', viewUser.id], ['Name', viewUser.name], ['Email', viewUser.email],
                ['Role', viewUser.role], ['Join Date', viewUser.joinDate], ['Status', viewUser.status]
              ].map(([k, v]) => (
                <div className="adm-detail-row" key={k}>
                  <span className="adm-detail-key">{k}</span>
                  <span className="adm-detail-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-outline" onClick={() => setViewUser(null)}><span className="ui-btn-content"><CircleX className="ui-btn-icon" />Close</span></button>
              <button className={viewUser.status === 'Active' ? 'adm-btn-danger' : 'adm-btn-primary'}
                onClick={() => { toggleStatus(viewUser.id); setViewUser(null) }}>
                <span className="ui-btn-content">{viewUser.status === 'Active' ? <Ban className="ui-btn-icon" /> : <ShieldCheck className="ui-btn-icon" />}{viewUser.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
              </button>
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
          <input className="adm-search-input" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-input" value={roleFilter} onChange={e => setRole(e.target.value)}>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="adm-input" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="adm-card">
        <h3 className="adm-card-title">Registered Users</h3>
        <table className="adm-table">
          <thead>
            <tr>
              <th>User ID</th><th>Name</th><th>Email</th>
              <th>Role</th><th>Join Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td className="adm-td-link">{u.id}</td>
                <td>{u.name}</td>
                <td className="adm-td-muted">{u.email}</td>
                <td>{u.role}</td>
                <td className="adm-td-muted">{u.joinDate}</td>
                <td>
                  <span className={`adm-status ${u.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className="adm-action-row">
                    <button className="adm-action-btn" onClick={() => setViewUser(u)}><span className="ui-btn-content"><Eye className="ui-btn-icon" />View Details</span></button>
                    <button
                      className={u.status === 'Active' ? 'adm-action-btn' : 'adm-action-btn adm-btn-activate'}
                      onClick={() => toggleStatus(u.id)}>
                      <span className="ui-btn-content">{u.status === 'Active' ? <Ban className="ui-btn-icon" /> : <ShieldCheck className="ui-btn-icon" />}{u.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: '1.5rem' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
