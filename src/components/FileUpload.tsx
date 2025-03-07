import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function FileUpload({ onUpload }: { onUpload: (data: any) => void }) {
  const [error, setError] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const rows = text.split('\n')
        const headers = rows[0].split(',').map(h => h.trim())
        
        // Validate headers
        if (!validateHeaders(headers)) {
          setError('Invalid CSV format: Missing required columns')
          return
        }

        const data = rows.slice(1).map(row => {
          const values = parseCSVRow(row)
          return {
            date: parseDate(values[0]),
            description: values[1],
            charges: parseCurrency(values[2]),
            credits: parseCurrency(values[3]),
            rfc: values[4],
            reference: values[5]
          }
        }).filter(Boolean)
        
        onUpload(data)
        setError('')
      } catch (err) {
        console.error(err)
        setError('Error processing file. Please check the format.')
      }
    }
    reader.readAsText(file, 'ISO-8859-1')
  }

  const validateHeaders = (headers: string[]) => {
    const required = ['OPERACION', 'LIQUIDACION', 'CARGOS', 'ABONOS', 'RFC', 'REFERENCIA']
    return required.every(h => headers.includes(h))
  }

  const parseCSVRow = (row: string) => {
    const result = []
    let inQuotes = false
    let current = ''
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const parseDate = (dateStr: string) => {
    const months = {
      ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
      JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
    }
    
    const [day, month] = dateStr.split('/')
    const monthNum = months[month.toUpperCase()]
    return new Date(2023, monthNum, parseInt(day))
  }

  const parseCurrency = (value: string) => {
    if (!value) return 0
    const cleaned = value.replace(/[^0-9.-]/g, '')
    return parseFloat(cleaned.replace(',', '.'))
  }

  return (
    <div className="p-4 border-2 border-dashed rounded-lg">
      <label className="flex flex-col items-center cursor-pointer">
        <Upload className="w-8 h-8 mb-2" />
        <span>Upload CSV</span>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFile} 
          className="hidden" 
        />
      </label>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
