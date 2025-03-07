import { useState } from 'react'
import { Calendar, TrendingUp, Wallet, BarChart } from 'lucide-react'

export default function FinancialMetrics({ data }: { data: any[] }) {
  const [dateRange, setDateRange] = useState({
    start: new Date('2023-01-01'), // Default start date
    end: new Date() // Default end date (today)
  })

  // Filter data based on date range
  const filteredData = data.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end
  })

  // Calculate metrics
  const totalIncome = filteredData.reduce((sum, t) => sum + t.credits, 0)
  const totalExpenses = filteredData.reduce((sum, t) => sum + t.charges, 0)
  const netBalance = totalIncome - totalExpenses
  const avgDailySpending = totalExpenses / ((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow mb-8"> {/* Increased padding */}
      <h2 className="text-xl font-bold mb-6 dark:text-white">Financial Metrics</h2> {/* Added dark mode text color */}

      {/* Date Range Selector */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 dark:text-gray-200" />
          <span className="dark:text-gray-200">Date Range:</span>
        </div>
        <input
          type="date"
          value={dateRange.start.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
          className="border rounded p-1 dark:bg-gray-700 dark:text-gray-200"
        />
        <span className="dark:text-gray-200">to</span>
        <input
          type="date"
          value={dateRange.end.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
          className="border rounded p-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Increased gap between cards */}
        <MetricCard
          icon={<Wallet className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
          title="Net Balance"
          value={netBalance}
          period={`${dateRange.start.toISOString().split('T')[0]} to ${dateRange.end.toISOString().split('T')[0]}`}
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400" />}
          title="Total Income"
          value={totalIncome}
          period={`${dateRange.start.toISOString().split('T')[0]} to ${dateRange.end.toISOString().split('T')[0]}`}
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-red-500 dark:text-red-400" />}
          title="Total Expenses"
          value={totalExpenses}
          period={`${dateRange.start.toISOString().split('T')[0]} to ${dateRange.end.toISOString().split('T')[0]}`}
        />
        <MetricCard
          icon={<BarChart className="w-6 h-6 text-purple-500 dark:text-purple-400" />}
          title="Avg Daily Spending"
          value={avgDailySpending}
          period={`${dateRange.start.toISOString().split('T')[0]} to ${dateRange.end.toISOString().split('T')[0]}`}
        />
      </div>
    </div>
  )
}

function MetricCard({ icon, title, value, period }: { icon: any, title: string, value: number, period: string }) {
  return (
    <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700"> {/* Increased padding and added dark mode background */}
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium dark:text-gray-200">{title}</h3>
      </div>
      <p className="text-2xl font-bold dark:text-white">${value.toLocaleString()}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">{period}</p>
    </div>
  )
}
