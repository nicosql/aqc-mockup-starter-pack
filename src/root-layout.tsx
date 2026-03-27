import { Outlet } from '@tanstack/react-router'
import NavThemeSwitch from './components/header/nav-theme-switch'
import { Toaster } from './components/ui/sonner'

export default function RootLayout() {
  return (
    <div className='mx-auto flex min-h-dvh max-w-[1600px] flex-col gap-4 px-4 py-2'>
      <header className='flex items-center justify-between py-2'>
        <img src='https://rfacblob.blob.core.windows.net/publicmain/fnLOAD/fnLOAD-logo-side.png' alt='fnLOAD' className='h-18' />
        <NavThemeSwitch />
      </header>
      <Outlet />
      <footer className='text-muted-foreground mt-auto py-4 text-center text-xs'>
        © {new Date().getFullYear()} Aqueducts Consulting
      </footer>
      <Toaster position='bottom-center' toastOptions={{ duration: 2500 }} />
    </div>
  )
}
