import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@asafarim/react-themes'
import '@asafarim/react-themes/styles.css'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultMode="light" persistMode={true}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
