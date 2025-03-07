import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F']

export default function ExpenseBreakdown({ data }: { data: any[] }) {
  const categoryData = calculateCategoryBreakdown(data)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="w-5 h-5" />
        <h2 className="text-xl font-bold">Expense Breakdown</h2>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ payload }) => (
                <div className="bg-white p-2 border rounded shadow">
                  <p className="font-medium">{payload[0]?.name}</p>
                  <p>Amount: ${payload[0]?.value.toLocaleString()}</p>
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function calculateCategoryBreakdown(data: any[]) {
  const categories = new Map<string, number>()

  data.forEach(transaction => {
    if (transaction.charges > 0) {
      const category = getCategoryFromDescription(transaction.description)
      categories.set(category, (categories.get(category) || 0) + transaction.charges)
    }
  })

  return Array.from(categories.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100
  }))
}

function getCategoryFromDescription(description: string) {
  if (description.includes('UBER')) return 'Transport'
  if (description.includes('PAYPAL')) return 'Online Services'
  if (description.includes('REST')) return 'Restaurants'
  if (description.includes('SPEI')) return 'Transfers'
  if (description.includes('CLIP')) return 'Retail'
  return 'Other'
}
