import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from './store/store'
import App from './App'
import './index.css'

const applyTheme = () => {
    const theme = store.getState().theme.theme
    document.documentElement.setAttribute('data-theme', theme)
}

applyTheme()
store.subscribe(applyTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
