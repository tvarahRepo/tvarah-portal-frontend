import { LanguageProvider } from '../LanguageContext'
import './globals.css'

export const metadata = {
  title: 'Tvarah Portal',
  description: 'Tvarah Talent Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
