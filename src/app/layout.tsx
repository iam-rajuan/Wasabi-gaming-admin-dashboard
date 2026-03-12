import Providers from '@/components/providers/Providers'
import './globals.css'
import { Toaster } from 'sonner'
import TopLoader from 'nextjs-toploader'

export const metadata = {
  title: 'Aspiring Legal Network Dashboard',
  description: 'Aspiring Legal Network Dashboard',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F9FAFB]">
        <Toaster />
        <TopLoader
          color="#FFFF00"
          shadow="0 0 10px #147575, 0 0 5px #147575"
          showSpinner={false}
          height={4}
          easing="ease-in"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
