import { useState } from 'react'
import { ExtractionPanel } from './components/ExtractionPanel'
import { RunsTable } from './components/RunsTable'

type Tab = 'extraccion' | 'admin'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('extraccion')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('extraccion')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              activeTab === 'extraccion'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Extracción
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Admin
          </button>
        </div>
      </header>

      {activeTab === 'extraccion' ? <ExtractionPanel /> : <RunsTable />}
    </div>
  )
}

export default App
