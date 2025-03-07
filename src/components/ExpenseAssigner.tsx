import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function ExpenseAssigner({ transactions, categories, onAssign }) {
  const [assignments, setAssignments] = useState([])

  // Initialize assignments when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      const initialAssignments = transactions.map(transaction => ({
        ...transaction,
        categoryId: null,
        categoryName: 'Uncategorized'
      }))
      setAssignments(initialAssignments)
    }
  }, [transactions])

  // Auto-assign expenses based on keywords
  const autoAssignExpenses = () => {
    const newAssignments = transactions.map(transaction => {
      const category = categories.find(cat =>
        transaction.description.toLowerCase().includes(cat.name.toLowerCase())
      ) || { name: 'Uncategorized', id: null }

      return {
        ...transaction,
        categoryId: category.id,
        categoryName: category.name
      }
    })

    setAssignments(newAssignments)
    onAssign(newAssignments)
  }

  // Manually assign a transaction to a category
  const handleManualAssign = (transactionId, categoryId) => {
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === transactionId
        ? { ...assignment, categoryId, categoryName: categories.find(c => c.id === categoryId).name }
        : assignment
    )
    setAssignments(updatedAssignments)
    onAssign(updatedAssignments)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Assign Expenses to Budget Categories</h2>
      
      {/* Auto-Assign Button */}
      <button
        onClick={autoAssignExpenses}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Auto-Assign Expenses
      </button>

      {/* List of Transactions */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              {/* Transaction Details */}
              <div>
                <p className="font-medium">{assignment.description}</p>
                <p className="text-gray-500">${assignment.amount.toLocaleString()}</p>
              </div>
              
              {/* Category Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Assigned to: {assignment.categoryName}
                </span>
                <select
                  value={assignment.categoryId || ''}
                  onChange={(e) => handleManualAssign(assignment.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignment Feedback */}
            {assignment.categoryId && (
              <div className="mt-2 flex items-center gap-2">
                {assignment.amount > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Assigned successfully</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Invalid amount</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
