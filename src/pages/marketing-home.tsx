export default function MarketingHomePage() {
  const principles = [
    'Must follow the customer\u2019s Dream.',
    'Must constantly create a Vision of the vehicle that would have to be created to meet that Dream. This is the realm of the Thinker.',
    'Must follow our Purpose\u2014the reason we get up in the morning. This is the realm of the Storyteller.',
    'Must be tethered to reality by a Leader, who has a Mission. All these visions and run rates must be realized, or it is just some meme.',
    'Must be a job first. The job is the technician\u2019s output.',
    'Must be a practice next. A three legged stool. Must be the combination of lead generation, lead conversion to customer, and then client fulfillment.',
    'Must be a business next, which is a practice plus a management system.',
    'Must be an enterprise next, which is a business plus a leadership system.',
  ]

  return (
    <div className='py-16'>
      <section className='mx-auto max-w-6xl'>
        <h1 className='mb-10 text-4xl font-bold tracking-tight'>Principles</h1>
        <div className='flex flex-col items-start gap-12 lg:flex-row'>
          <ol className='list-none space-y-6 lg:flex-1'>
            {principles.map((text, i) => (
              <li key={i} className='flex gap-4'>
                <span className='text-muted-foreground mt-0.5 text-lg font-semibold'>
                  {i + 1}.
                </span>
                <p className='text-lg leading-relaxed'>{text}</p>
              </li>
            ))}
          </ol>
          <div className='flex shrink-0 justify-center lg:-mt-40 lg:w-[480px]'>
            <img
              src='https://rfacblob.blob.core.windows.net/publicmain/dreamOS/10prin.svg'
              alt='10 Principles diagram'
              className='w-full mix-blend-multiply dark:mix-blend-screen'
            />
          </div>
        </div>
      </section>
    </div>
  )
}
