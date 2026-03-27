import ScrollToTopButton from '@/components/footer/scroll-to-top'
import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className='mt-auto flex w-full flex-col pt-4'>
      <ScrollToTopButton />
      <div className='text-muted-foreground grid grid-cols-1 gap-1 px-2 text-xs select-none md:grid-cols-3'>
        <p className='text-center hover:underline md:text-left'>
          © {new Date().getFullYear()}{' '}
          <a target='_blank' rel='noreferrer' href='https://aqueductsconsulting.com'>
          Aqueducts Consulting
          </a>
        </p>{' '}

        <p className='text-center md:text-right'>
          <Link
            resetScroll={true}
            to='/privacy-policy'
            className='hover:underline'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  )
}
