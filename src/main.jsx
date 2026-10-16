import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './lib/i18n.jsx'

// Tema: kayıtlı tercih yoksa varsayılan olarak açık temayı kullan
const saved = localStorage.getItem('infosession:theme')
const dark = saved === 'dark' // Sadece daha önce koyu tema seçildiyse koyu olsun
document.documentElement.classList.toggle('dark', dark)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
