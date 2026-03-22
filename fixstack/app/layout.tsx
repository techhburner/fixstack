import "./globals.css"
import Navbar from "./components/navbar"
import AuthGuard from "./components/AuthGuard"

import AuthSync from "./components/AuthSync"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <AuthGuard>
          <Navbar />
          {children}
        </AuthGuard>

      </body>
    </html>
  )
}