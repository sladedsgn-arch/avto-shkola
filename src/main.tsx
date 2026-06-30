import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as BrowserRouter } from 'react-router-dom'
import './index.css'
import { AppRouter } from './app/Router'
import { initSeedData } from './db/storage'

function App() {
  useEffect(() => {
    initSeedData().catch(console.error)
  }, [])
  return (
    <div className="device-stage">
      <div className="device-frame">
        <div className="device-screen">
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
