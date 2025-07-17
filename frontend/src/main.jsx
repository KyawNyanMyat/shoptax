import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './context/socketContext.jsx'
import { AdminAuthContextProvider } from './context/adminAuthContext.jsx'
import { UserAuthContextProvider } from './context/userAuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthContextProvider>
        <UserAuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </UserAuthContextProvider>
      </AdminAuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
