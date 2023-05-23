import Link from 'next/link';
import Image from 'next/image';
import { trpc } from '~/utils/trpc';

export function SiteHeader() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <header>
      <Link className='header' href='/'>
        <Image alt='sdf' src='logo.svg' width={190} height={200} />
      </Link>
      <div className='link-container'>
        <Link
          className='header'
          target='_blank'
          href='https://github.com/stytchauth/stytch-nextjs-example'
        >
          <Image
            alt='GitHub'
            src='github.svg'
            width={20}
            height={20}
            style={{ marginRight: '4px' }}
          />
          View on GitHub
        </Link>
        {user ? <Link className='header' href='profile'>Profile</Link> : <Link className='header' href='/login'>Log in</Link>}
      </div>
    </header>
  );
}
