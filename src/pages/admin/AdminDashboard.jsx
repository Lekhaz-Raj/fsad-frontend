import { ShieldCheck, Users, BarChart3, TrendingUp } from "lucide-react"

const TYPE_COLOR = {
  user: { bg: "#fef2f2", color: "#c0392b", border: "#fcc" },
  fund: { bg: "#fdf8e1", color: "#b45309", border: "#f0d070" },
  content: { bg: "#f5f5f5", color: "#555", border: "#ddd" },
  report: { bg: "#f5f5f5", color: "#555", border: "#ddd" }
}

export default function AdminDashboard() {

  const users = JSON.parse(localStorage.getItem("mfp_users") || "[]")

  const investors = users.filter(u => u.role === "Investor")
  const advisors = users.filter(u => u.role === "Financial Advisor")

  const activity = users.map(u => ({
    time: "Recently",
    user: u.fullName,
    action: `Registered as ${u.role}`,
    type: "user"
  })).reverse()

  return (
    <div className="w-full max-w-7xl mx-auto">

      {/* Page Title */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6" />
        Admin Dashboard
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Mutual Funds</p>
          <p className="text-2xl font-bold">8</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Active Investors</p>
          <p className="text-2xl font-bold">{investors.length}</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Advisors Registered</p>
          <p className="text-2xl font-bold">{advisors.length}</p>
        </div>

      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

        <h3 className="text-lg font-semibold mb-4">Recent Activity Log</h3>

        {activity.length === 0 ? (
          <p style={{ color: "#888", padding: "1.5rem", textAlign: "center" }}>
            No registered users yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr className="border-b hover:bg-gray-50">
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {activity.map((a, i) => {
                const c = TYPE_COLOR[a.type]

                return (
                  <tr key={i}>

                    <td>{a.time}</td>
                    <td>{a.user}</td>
                    <td>{a.action}</td>

                    <td>
                      <span
                        className="adm-type-chip"
                        style={{
                          background: c.bg,
                          color: c.color,
                          border: `1px solid ${c.border}`
                        }}
                      >
                        {a.type}
                      </span>
                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>
        )}

      </div>

    </div>
  )
}