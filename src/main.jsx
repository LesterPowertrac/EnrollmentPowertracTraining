// Disable console logs in production
if (import.meta.env.MODE === "production") {
  console.log = () => {};
  console.debug = () => {};
  console.error = () => {};
}else{
  console.log("Development mode is active!");
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './Router/router.jsx'
import { AuthProvider } from './Utils/AuthContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
)
