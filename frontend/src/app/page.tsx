'use client'
import { useState } from 'react'
export default function Home() {
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('Senior')
  const [company, setCompany] = useState('')
  const [comparisons, setComparisons] = useState<any[]>([])
  const compare = async () => {
    const res = await fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role, level, company }) })
    const data = await res.json()
    setComparisons(data.comparisons || [])
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Levels</h1>
        <p className="text-gray-400 mb-8">Compare tech salaries across companies</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. Software Engineer)"
            className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={level} onChange={e => setLevel(e.target.value)}
            className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Intern','Junior','Mid','Senior','Staff','Principal','Director'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company (e.g. Google)"
            className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={compare} disabled={!role}
          className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 mb-8">
          Compare Salaries
        </button>
        {comparisons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisons.map((c, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">{c.company[0]}</div>
                  <div><h3 className="font-bold">{c.company}</h3><p className="text-gray-400 text-sm">{c.role} - {c.level}</p></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-400">Base Salary</span><span className="font-bold">${c.base_salary.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Equity</span><span className="font-bold">{c.equity}</span></div>
                  <div className="h-px bg-white/20" />
                  <div className="flex justify-between"><span className="text-gray-400">Total Comp</span><span className="text-xl font-bold text-green-400">${c.total_comp.toLocaleString()}</span></div>
                </div>
                <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{width: `${(c.total_comp/300000)*100}%`}} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
