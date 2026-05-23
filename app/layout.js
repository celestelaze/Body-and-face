import './globals.css'
import { AppProvider } from '../lib/context'
import AuthModal     from '../components/AuthModal'
import CartDrawer    from '../components/CartDrawer'
import WishlistDrawer from '../components/WishlistDrawer'

export const metadata = {
  title: 'Body & Face — Luxe Beauty & Skincare',
  description: 'Votre destination premium pour la skincare, les soins du corps, les compléments alimentaires et la beauté.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppProvider>
          {children}
          <AuthModal />
          <CartDrawer />
          <WishlistDrawer />
        </AppProvider>
      </body>
    </html>
  )
}
