import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'

export default function Visualizations({ data }: { data: any[] }) {
  const monthlyTrends = calculateMonthlyTrends(data)

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow mt-8"> {/* Increased padding */}
      <h2 className="text-xl font-bold mb-6 dark:text-white">Monthly Expense Trends</h2> {/* Added dark mode text color */}

      {/* Line Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyTrends}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280' }} // Gray text for X-axis
              tickLine={{ stroke: '#6b7280' }} // Gray lines for X-axis
            />
            <YAxis
              tick={{ fill: '#6b7280' }} // Gray text for Y-axis
              tickLine={{ stroke: '#6b7280' }} // Gray lines for Y-axis
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937', // Dark gray background for tooltip
                borderColor: '#374151', // Darker gray border for tooltip
                color: '#f3f4f6', // Light gray text for tooltip
              }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#3b82f6" // Blue line for expenses
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }} // Blue dots
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function calculateMonthlyTrends(data: any[]) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i).toLocaleString('default', { month: 'short' }),
    expenses: 0
  }))

  data.forEach(transaction => {
    const month = transaction.date.getMonth()
    months[month].expenses += transaction.charges
  })

  return months
}
