/**
 * Stub FNO loads grid component.
 * Replace with your own implementation.
 */

import type { FnoCredentials } from './connectivity-test'

export default function LoadsGrid(_props: {
  credentials: FnoCredentials
  companies: string[]
  baseUrl: string
}) {
  return (
    <div className='w-full text-center'>
      <p className='text-muted-foreground text-sm'>Loads grid placeholder — build your data view here.</p>
    </div>
  )
}
