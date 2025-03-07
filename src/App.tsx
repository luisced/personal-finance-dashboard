import { useState } from 'react'
import FileUpload from './components/FileUpload'
import FinancialMetrics from './components/FinancialMetrics'
import Visualizations from './components/Visualizations'
import BudgetManager from './components/BudgetManager'
import InformationCard from './components/InformationCard' // Add this import
import { Home, PieChart, Wallet, Menu } from 'lucide-react'
import DarkModeToggle from './components/DarkModeToggle'

export default function App() { // Ensure this is the default export
  const [data, setData] = useState<any[]>([])
  const [categories, setCategories] = useState([]) // Add categories state
  const [activeTab, setActiveTab] = useState('analysis')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold dark:text-white">Financial Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-4">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'analysis' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Financial Analysis
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'budget'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  Budget Management
                </button>
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'analysis' ? (
          <>
            <FileUpload onUpload={setData} />
            {data.length > 0 && (
              <>
                <FinancialMetrics data={data} />
                <Visualizations data={data} />
                <InformationCard data={data} categories={categories} /> {/* Add this line */}
              </>
            )}
          </>
        ) : (
          <BudgetManager />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'analysis' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'budget' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-sm">Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('visualizations')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'visualizations' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-sm">Charts</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'menu' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm">Menu</span>
          </button>
        </div>
      </div>
    </div>
  )
}
