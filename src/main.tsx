import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ConfessionProvider } from './lib/context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfessionProvider>
      <App />
    </ConfessionProvider>
  </StrictMode>,
)
