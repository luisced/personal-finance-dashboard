import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { PlusCircle, AlertCircle, TrendingUp, Wallet, Clock } from 'lucide-react'

export default function InvestmentDashboard() {
  const [investments, setInvestments] = useState([])
  const [watchlist, setWatchlist] = useState([])

  // Add a new investment
  const addInvestment = (investment) => {
    setInvestments([...investments, { ...investment, date: new Date().toISOString().split('T')[0] }])
  }

  // Add to watchlist
  const addToWatchlist = (item) => {
    setWatchlist([...watchlist, item])
  }

  // Calculate portfolio metrics
  const totalCapital = investments.reduce((sum, inv) => sum + inv.capital, 0)
  const totalYield = investments.reduce((sum, inv) => sum + inv.rendimiento, 0)
  const averageRisk = investments.length > 0 ? investments.reduce((sum, inv) => sum + inv.riesgo, 0) / investments.length : 0

  // Diversification analysis
  const diversification = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.capital
    return acc
  }, {})

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Investment Tracking Dashboard</h1>

      {/* Add Investment Form */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Register Investment</h2>
        <AddInvestmentForm onAdd={addInvestment} />
      </div>

      {/* Portfolio Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<Wallet className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
            title="Total Capital"
            value={totalCapital}
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400" />}
            title="Total Yield"
            value={totalYield}
          />
          <MetricCard
            icon={<AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />}
            title="Average Risk"
            value={averageRisk.toFixed(2)}
          />
        </div>
      </div>

      {/* Diversification Analysis */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Diversification</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={Object.entries(diversification).map(([type, capital]) => ({ type, capital }))}
                dataKey="capital"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {Object.entries(diversification).map(([type], index) => (
                  <Cell key={type} fill={['#3b82f6', '#10b981', '#ef4444', '#f59e0b'][index % 4]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  color: '#f3f4f6',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Visualization */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Performance</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={investments}>
              <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  color: '#f3f4f6',
                }}
              />
              <Line
                type="monotone"
                dataKey="rendimiento"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Watchlist */}
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">Watchlist</h2>
        <Watchlist watchlist={watchlist} onAdd={addInvestment} onAddToWatchlist={addToWatchlist} />
      </div>
    </div>
  )
}

function AddInvestmentForm({ onAdd }) {
  const [investment, setInvestment] = useState({
    type: '',
    capital: 0,
    rendimiento: 0,
    riesgo: 0,
    plazo: 0,
    liquidez: '',
    inflacion: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(investment)
    setInvestment({
      type: '',
      capital: 0,
      rendimiento: 0,
      riesgo: 0,
      plazo: 0,
      liquidez: '',
      inflacion: 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={investment.type}
        onChange={(e) => setInvestment({ ...investment, type: e.target.value })}
        placeholder="Tipo de inversión (e.g., CETES, SOFIPO)"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        value={investment.capital}
        onChange={(e) => setInvestment({ ...investment, capital: parseFloat(e.target.value) })}
        placeholder="Capital"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        value={investment.rendimiento}
        onChange={(e) => setInvestment({ ...investment, rendimiento: parseFloat(e.target.value) })}
        placeholder="Rendimiento (%)"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        value={investment.riesgo}
        onChange={(e) => setInvestment({ ...investment, riesgo: parseFloat(e.target.value) })}
        placeholder="Riesgo (1-10)"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        value={investment.plazo}
        onChange={(e) => setInvestment({ ...investment, plazo: parseFloat(e.target.value) })}
        placeholder="Plazo (días)"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="text"
        value={investment.liquidez}
        onChange={(e) => setInvestment({ ...investment, liquidez: e.target.value })}
        placeholder="Liquidez (e.g., alta, media, baja)"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        value={investment.inflacion}
        onChange={(e) => setInvestment({ ...investment, inflacion: parseFloat(e.target.value) })}
        placeholder="Inflación actual (%)"
        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <PlusCircle className="w-5 h-5 inline-block mr-2" />
        Add Investment
      </button>
    </form>
  )
}

function MetricCard({ icon, title, value }) {
  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-medium dark:text-gray-200">{title}</h3>
      </div>
      <p className="text-2xl font-bold dark:text-white">${value.toLocaleString()}</p>
    </div>
  )
}

function Watchlist({ watchlist, onAdd, onAddToWatchlist }) {
  const [newItem, setNewItem] = useState('')

  const handleAddToWatchlist = (e) => {
    e.preventDefault()
    if (newItem) {
      onAddToWatchlist({ name: newItem })
      setNewItem('')
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddToWatchlist} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add to watchlist"
          className="border rounded p-2 flex-1 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 inline-block mr-2" />
          Add
        </button>
      </form>
      <div className="space-y-2">
        {watchlist.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 border rounded">
            <p className="dark:text-white">{item.name}</p>
            <button
              onClick={() => onAdd({ type: item.name, capital: 0, rendimiento: 0, riesgo: 0, plazo: 0, liquidez: '', inflacion: 0 })}
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Add to Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
