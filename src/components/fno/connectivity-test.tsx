/**
 * Stub FNO connectivity test component.
 * Replace with your own implementation.
 */

export interface FnoCredentials {
  base_url: string
  client_id: string
  client_secret: string
  tenant_id: string
}

export default function ConnectivityTest({
  onConnected
}: {
  onConnected: (creds: FnoCredentials, companies?: string[]) => void
}) {
  return (
    <div className='w-full space-y-4 text-center'>
      <p className='text-muted-foreground text-sm'>
        Connectivity test placeholder — click below to simulate a connection.
      </p>
      <button
        className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm'
        onClick={() =>
          onConnected(
            { base_url: 'https://mock.example.com', client_id: '', client_secret: '', tenant_id: '' },
            ['Company A', 'Company B']
          )
        }>
        Simulate Connection
      </button>
    </div>
  )
}
