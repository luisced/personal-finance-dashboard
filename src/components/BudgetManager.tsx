import { useState, useEffect } from 'react'
import { PlusCircle, AlertTriangle, CheckCircle } from 'lucide-react'
import ExpenseAssigner from './ExpenseAssigner'

const BudgetManager = () => {
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('budget-income')
    return saved ? parseFloat(saved) : 0
  })
  const [categories, setCategories] = useState<Array<{ id: string, name: string, budget: number, spent: number }>>(() => {
    const saved = localStorage.getItem('budget-categories')
    return saved ? JSON.parse(saved) : []
  })
  const [transactions, setTransactions] = useState([])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('budget-income', income.toString())
  }, [income])

  useEffect(() => {
    localStorage.setItem('budget-categories', JSON.stringify(categories))
  }, [categories])

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const remainingIncome = income - totalAllocated
  const isOverBudget = remainingIncome < 0

  const addCategory = (name: string, budget: number) => {
    if (budget <= 0) return
    const newCategory = { id: Date.now().toString(), name, budget, spent: 0 }
    setCategories([...categories, newCategory])
  }

  const updateSpending = (index: number, amount: number) => {
    const newCategories = [...categories]
    newCategories[index].spent = Math.max(0, amount)
    setCategories(newCategories)
  }

  const handleExpenseAssignments = (assignments) => {
    const updatedCategories = categories.map(cat => {
      const categoryExpenses = assignments
        .filter(a => a.categoryId === cat.id)
        .reduce((sum, a) => sum + a.amount, 0)

      return {
        ...cat,
        spent: cat.spent + categoryExpenses
      }
    })

    setCategories(updatedCategories)
  }

  return (
    <div className="space-y-8">
      {/* Income Input */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Monthly Income</h2>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
            className="border rounded p-2 w-48 dark:bg-gray-700 dark:text-white"
            min="0"
            step="100"
          />
          <span className="text-gray-500 dark:text-gray-300">USD</span>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Budget Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Income"
            value={income}
            color="text-green-600 dark:text-green-400"
          />
          <SummaryCard
            title="Allocated Budget"
            value={totalAllocated}
            color={isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}
          />
          <SummaryCard
            title="Remaining Balance"
            value={remainingIncome}
            color={isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}
          />
        </div>
        {isOverBudget && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 rounded flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">Warning: Budget allocation exceeds income!</span>
          </div>
        )}
      </div>

      {/* Budget Categories */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Budget Categories</h2>
        <AddCategoryForm 
          onAdd={addCategory}
          remaining={remainingIncome}
        />
        
        <div className="mt-6 space-y-4">
          {categories.map((cat, index) => (
            <BudgetCategory
              key={cat.id}
              category={cat}
              onUpdate={(amount) => updateSpending(index, amount)}
            />
          ))}
        </div>
      </div>

      {/* Expense Assigner */}
      {transactions.length > 0 && (
        <ExpenseAssigner
          transactions={transactions}
          categories={categories}
          onAssign={handleExpenseAssignments}
        />
      )}
    </div>
  )
}

const SummaryCard = ({ title, value, color }: { title: string, value: number, color: string }) => {
  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
      <h3 className="text-gray-500 dark:text-gray-300">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>
        ${value.toLocaleString()}
      </p>
    </div>
  )
}

const AddCategoryForm = ({ onAdd, remaining }: { onAdd: (name: string, budget: number) => void, remaining: number }) => {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && budget > 0 && budget <= remaining) {
      onAdd(name, budget)
      setName('')
      setBudget(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="border rounded p-2 flex-1 dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(parseFloat(e.target.value))}
        placeholder="Budget amount"
        className="border rounded p-2 w-48 dark:bg-gray-700 dark:text-white"
        min="0"
        max={remaining}
        step="10"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        Add Category
      </button>
    </form>
  )
}

const BudgetCategory = ({ category, onUpdate }: { category: any, onUpdate: (amount: number) => void }) => {
  const remaining = category.budget - category.spent
  const isOver = remaining < 0
  const utilization = Math.min(100, (category.spent / category.budget) * 100)

  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium dark:text-white">{category.name}</h3>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 dark:text-gray-300">Budget: ${category.budget.toLocaleString()}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={category.spent}
              onChange={(e) => onUpdate(parseFloat(e.target.value))}
              className="border rounded p-1 w-24 dark:bg-gray-700 dark:text-white"
              min="0"
            />
            <span className="text-gray-500 dark:text-gray-300">spent</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className="h-full"
          style={{
            width: `${utilization}%`,
            backgroundColor: isOver ? '#dc2626' : '#2563eb'
          }}
        />
      </div>

      {/* Status */}
      <div className="mt-2 flex items-center gap-2">
        {isOver ? (
          <>
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">
              Over budget by ${Math.abs(remaining).toLocaleString()}
            </span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400">
              ${remaining.toLocaleString()} remaining
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default BudgetManager
