import { createContext, useContext, useState, useEffect } from 'react'

const InvestmentContext = createContext(null)

// ── Per-user investment storage key ──────────────────────
const invKey = (email) => `mfp_inv_${email}`
const educationalContentKey = 'mfp_educational_content'

const SEED_EDUCATIONAL_CONTENT = [
  {
    id: 1,
    title: 'Understanding SIP Investments',
    category: 'Investment Basics',
    content: 'A Systematic Investment Plan helps investors build long-term wealth through disciplined, periodic investing. It also reduces timing risk by averaging purchase costs over market cycles.',
    keyTakeaways: 'Start early, stay consistent, and increase SIP amounts as income grows.',
    date: '2025-02-15',
    views: 342,
    status: 'Published',
  },
  {
    id: 2,
    title: 'Risk Management in Mutual Funds',
    category: 'Risk Awareness',
    content: 'Risk can be managed by diversifying across categories, reviewing portfolio allocation periodically, and matching funds to investment horizon and risk tolerance.',
    keyTakeaways: 'Diversification and periodic rebalancing can reduce concentration risk.',
    date: '2025-02-10',
    views: 289,
    status: 'Published',
  },
  {
    id: 3,
    title: 'Tax-Saving Investment Options',
    category: 'Tax Planning',
    content: 'Equity Linked Savings Schemes (ELSS) provide tax deductions under Section 80C with a 3-year lock-in and potential for long-term growth.',
    keyTakeaways: 'Use ELSS for tax efficiency, but align with your overall asset allocation.',
    date: '2025-02-05',
    views: 428,
    status: 'Published',
  },
  {
    id: 4,
    title: 'Building a Retirement Portfolio',
    category: 'Financial Planning',
    content: 'A retirement-focused portfolio should balance growth and stability by combining equity, debt, and periodic review based on years left to retirement.',
    keyTakeaways: 'Shift gradually toward lower-risk assets as retirement approaches.',
    date: '2025-01-28',
    views: 512,
    status: 'Published',
  },
]

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem('mfp_current_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function loadInvestments(user) {
  if (!user?.email) return []
  try {
    const raw = localStorage.getItem(invKey(user.email))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveInvestments(user, data) {
  if (!user?.email) return
  localStorage.setItem(invKey(user.email), JSON.stringify(data))
}

function loadEducationalContent() {
  try {
    const raw = localStorage.getItem(educationalContentKey)
    return raw ? JSON.parse(raw) : SEED_EDUCATIONAL_CONTENT
  } catch { return SEED_EDUCATIONAL_CONTENT }
}

function saveEducationalContent(data) {
  localStorage.setItem(educationalContentKey, JSON.stringify(data))
}

export function InvestmentProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(loadCurrentUser)
  const [investments, setInvestments] = useState(() => loadInvestments(loadCurrentUser()))
  const [educationalContent, setEducationalContent] = useState(loadEducationalContent)

  // When investments change, persist under the current user's key
  useEffect(() => {
    saveInvestments(currentUser, investments)
  }, [investments, currentUser])

  useEffect(() => {
    saveEducationalContent(educationalContent)
  }, [educationalContent])

  const setCurrentUser = (user) => {
    setCurrentUserState(user)
    if (user) {
      localStorage.setItem('mfp_current_user', JSON.stringify(user))
      // Load this user's own investments (empty for new users)
      setInvestments(loadInvestments(user))
    } else {
      localStorage.removeItem('mfp_current_user')
      setInvestments([])
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const invest = (fund, amountRaw) => {
    const amount = Number(amountRaw)
    if (!amount || amount <= 0) return

    const navVal = parseFloat(String(fund.nav).replace('₹', ''))
    const newUnits = parseFloat((amount / navVal).toFixed(2))

    setInvestments(prev => {
      const idx = prev.findIndex(p => p.name === fund.name)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = {
          ...updated[idx],
          invested: updated[idx].invested + amount,
          units: parseFloat((updated[idx].units + newUnits).toFixed(2)),
        }
        return updated
      }
      return [...prev, {
        name: fund.name,
        category: fund.category,
        risk: fund.risk,
        nav: navVal,
        invested: amount,
        units: newUnits,
      }]
    })
  }

  const upsertEducationalArticle = (articleData, editId = null) => {
    const payload = {
      title: articleData.title,
      category: articleData.category,
      content: articleData.content,
      keyTakeaways: articleData.keyTakeaways,
    }

    setEducationalContent(prev => {
      if (editId) {
        return prev.map(article => (
          article.id === editId
            ? { ...article, ...payload, status: articleData.status }
            : article
        ))
      }

      const article = {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        views: 0,
        ...payload,
        status: articleData.status,
      }
      return [article, ...prev]
    })
  }

  return (
    <InvestmentContext.Provider value={{
      investments,
      invest,
      currentUser,
      setCurrentUser,
      logout,
      educationalContent,
      upsertEducationalArticle,
    }}>
      {children}
    </InvestmentContext.Provider>
  )
}

export const useInvestments = () => useContext(InvestmentContext)
