import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { AppointmentsProvider } from '@/contexts/appointments-context'
import { DocumentsProvider } from '@/contexts/documents-context'
import { DoctorsProvider } from '@/contexts/doctors-context'
import { Toaster } from '@/components/ui/sonner'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Smart Salud',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'https://thumbs.dreamstime.com/b/la-se%C3%B1al-del-coraz%C3%B3n-m%C3%A9dico-y-el-hospital-relacionaron-sistema-plano-icono-dise%C3%B1o-130955539.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'https://thumbs.dreamstime.com/b/la-se%C3%B1al-del-coraz%C3%B3n-m%C3%A9dico-y-el-hospital-relacionaron-sistema-plano-icono-dise%C3%B1o-130955539.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'https://thumbs.dreamstime.com/b/la-se%C3%B1al-del-coraz%C3%B3n-m%C3%A9dico-y-el-hospital-relacionaron-sistema-plano-icono-dise%C3%B1o-130955539.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          <DoctorsProvider>
            <AppointmentsProvider>
              <DocumentsProvider>
                {children}
                <Toaster />
              </DocumentsProvider>
            </AppointmentsProvider>
          </DoctorsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
