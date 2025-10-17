import { createRoot } from 'react-dom/client'
import App from './App'
import './assets/css/App.css'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
