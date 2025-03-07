import { ArrowUp, ArrowDown, Clock, TrendingUp, Wallet } from 'lucide-react'

export default function InformationCard({ data, categories }) {
  // Calculate current account balance
  const currentBalance = data.reduce((sum, t) => sum + t.credits - t.charges, 0)

  // Get last 5 transactions
  const recentTransactions = data
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Calculate week-over-week spending trend
  const currentWeekSpending = data
    .filter(t => new Date(t.date) >= new Date(new Date().setDate(new Date().getDate() - 7)))
    .reduce((sum, t) => sum + t.charges, 0)
  const previousWeekSpending = data
    .filter(t => new Date(t.date) >= new Date(new Date().setDate(new Date().getDate() - 14)) && new Date(t.date) < new Date(new Date().setDate(new Date().getDate() - 7)))
    .reduce((sum, t) => sum + t.charges, 0)
  const spendingTrend = ((currentWeekSpending - previousWeekSpending) / previousWeekSpending) * 100

  // Calculate budget utilization percentage
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const budgetUtilization = (totalSpent / totalBudget) * 100

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow mt-8">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Financial Overview</h2>

      {/* Current Account Balance */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <h3 className="font-medium dark:text-gray-200">Current Account Balance</h3>
        </div>
        <p className="text-2xl font-bold dark:text-white">${currentBalance.toLocaleString()}</p>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
          <h3 className="font-medium dark:text-gray-200">Recent Transactions</h3>
        </div>
        <div className="space-y-2">
          {recentTransactions.map((t, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300">{t.description}</p>
              <p className={`font-medium ${t.charges > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${(t.credits - t.charges).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Trends */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          <h3 className="font-medium dark:text-gray-200">Spending Trends</h3>
        </div>
        <div className="flex items-center gap-2">
          {spendingTrend >= 0 ? (
            <ArrowUp className="w-5 h-5 text-red-500" />
          ) : (
            <ArrowDown className="w-5 h-5 text-green-500" />
          )}
          <p className="text-gray-700 dark:text-gray-300">
            {Math.abs(spendingTrend).toFixed(1)}% {spendingTrend >= 0 ? 'increase' : 'decrease'} from last week
          </p>
        </div>
      </div>

      {/* Budget Utilization */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          <h3 className="font-medium dark:text-gray-200">Budget Utilization</h3>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${budgetUtilization}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
          {budgetUtilization.toFixed(1)}% of budget used
        </p>
      </div>
    </div>
  )
}
