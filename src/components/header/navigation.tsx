import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMe } from '@/hooks/use-me'
import { Link } from '@tanstack/react-router'
import NavThemeSwitch from './nav-theme-switch'

export default function Navigation() {
  const { data: me } = useMe()
  const user = me?.authenticated ? me.user : undefined
  const profile = me?.authenticated ? me.profile : undefined

  return (
    <nav className='flex items-center justify-between'>
      <Link to='/' className='focus:outline-hidden'>
        <img
          src='https://rfacblob.blob.core.windows.net/publicmain/dreamOS/dreamos-logo-legs.svg'
          alt='DreamOS'
          className='h-10 w-auto'
        />
      </Link>
      <div className='flex items-center gap-x-3'>
        <NavThemeSwitch />
        <Link
          aria-label='user account or log in'
          to={user ? '/app/settings' : '/auth/login'}
          className='focus:outline-hidden'>
          <Avatar className='flex size-10 items-center justify-center'>
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt='user avatar' />
            ) : (
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() ?? '?'}
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
      </div>
    </nav>
  )
}
