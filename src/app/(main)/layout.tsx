import Navbar from '../../components/Navbar'
import AuthGuard from '../../components/AuthGuard'
import { CurrentUserProvider } from '../../context/CurrentUserContext'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CurrentUserProvider>
        <div className="app-shell">
          <Navbar />
          <main className="page-content">
            {children}
          </main>
        </div>
      </CurrentUserProvider>
    </AuthGuard>
  )
}
