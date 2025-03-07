import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, TrendingUp } from 'lucide-react'

export default function CashFlowAnalysis({ data }: { data: any[] }) {
  const [dateRange, setDateRange] = useState({
    start: new Date(2023, 0, 1),
    end: new Date(2023, 11, 31)
  })

  const filteredData = data.filter(t => 
    t.date >= dateRange.start && t.date <= dateRange.end
  )

  const cashFlowData = calculateDailyCashFlow(filteredData)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-xl font-bold">Cash Flow Analysis</h2>
        </div>
        <DateRangePicker range={dateRange} onChange={setDateRange} />
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData}>
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              content={({ payload }) => (
                <div className="bg-white p-2 border rounded shadow">
                  <p className="font-medium">
                    {new Date(payload[0]?.payload.date).toLocaleDateString()}
                  </p>
                  <p>Balance: ${payload[0]?.payload.balance.toLocaleString()}</p>
                  <p>Income: ${payload[0]?.payload.income.toLocaleString()}</p>
                  <p>Expenses: ${payload[0]?.payload.expenses.toLocaleString()}</p>
                </div>
              )}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DateRangePicker({ range, onChange }: { range: any, onChange: any }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={range.start.toISOString().split('T')[0]}
        onChange={(e) => onChange({ ...range, start: new Date(e.target.value) })}
        className="border rounded p-1"
      />
      <span>to</span>
      <input
        type="date"
        value={range.end.toISOString().split('T')[0]}
        onChange={(e) => onChange({ ...range, end: new Date(e.target.value) })}
        className="border rounded p-1"
      />
    </div>
  )
}

function calculateDailyCashFlow(data: any[]) {
  const days = new Map<string, { income: number, expenses: number }>()

  data.forEach(transaction => {
    const date = transaction.date.toISOString().split('T')[0]
    if (!days.has(date)) {
      days.set(date, { income: 0, expenses: 0 })
    }

    const day = days.get(date)
    if (transaction.credits > 0) {
      day!.income += transaction.credits
    }
    if (transaction.charges > 0) {
      day!.expenses += transaction.charges
    }
  })

  let balance = 0
  return Array.from(days.entries()).map(([date, values]) => {
    balance += values.income - values.expenses
    return {
      date,
      balance: Math.round(balance * 100) / 100,
      ...values
    }
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
