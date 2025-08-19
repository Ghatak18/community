import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOm from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Routess from './Routess.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routess/>
    </BrowserRouter>
  </StrictMode>,
)
