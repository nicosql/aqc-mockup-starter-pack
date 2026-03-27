import NavThemeSwitch from '@/components/header/nav-theme-switch'
import { Toaster } from '@/components/ui/sonner'
import { Link, Outlet } from '@tanstack/react-router'

export default function PublicLayout() {
  return (
    <div className='mx-auto flex min-h-dvh max-w-[1600px] flex-col gap-4 px-4 py-2'>
      <header className='flex items-center justify-between py-2'>
        <Link to='/' className='flex items-center gap-2'>
          <img
            src='https://rfacblob.blob.core.windows.net/publicmain/aqc-starter-pack/2026-03-27_10-56-28.jpg'
            alt='DreamOS'
            className='h-32 w-auto'
          />
        </Link>
        <nav className='flex items-center gap-4'>
          <NavThemeSwitch />
        </nav>
      </header>

      <div className='flex-1'>
        <Outlet />
      </div>

      <footer className='text-muted-foreground mt-auto py-4 text-center text-xs'>
        &copy; {new Date().getFullYear()} AQC Starter Pack
      </footer>

      <Toaster position='bottom-center' toastOptions={{ duration: 2500 }} />
    </div>
  )
}
