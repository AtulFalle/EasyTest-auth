import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Test Recording Demo</h1>
        
        <div className="space-y-4">
          <div>
            <input 
              id="input-field"
              type="text" 
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Type something..."
            />
          </div>
          
          <button
            id="some-button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setCount(count + 1)}
          >
            Clicked {count} times
          </button>
        </div>
      </div>
    </div>
  )
}

export default App