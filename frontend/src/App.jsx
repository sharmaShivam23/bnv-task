import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import UserList from './pages/UserList/UserList'
import UserForm from './pages/UserForm/UserForm'
import UserView from './pages/UserView/UserView'
import Toast from './components/Toast/Toast'
import { ToastProvider } from './hooks/useToast.jsx'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import './App.css'
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="app-wrapper">
          <Navbar />
          <ThemeToggle />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<UserList />} />
              <Route path="/users/add" element={<UserForm />} />
              <Route path="/users/:id/edit" element={<UserForm />} />
              <Route path="/users/:id" element={<UserView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toast />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
