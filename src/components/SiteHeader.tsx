import Link from 'next/link';
import { trpc } from '~/utils/trpc';

export function SiteHeader() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <header className='relative bg-[#c7f1ff] p-4'>
      <div className='container mx-auto flex max-w-7xl justify-between'>
        <Link href='/' className='font-bold'>
          Stytch + tRPC Demo
        </Link>
        {user ? <Link href='dashboard'>Dashboard</Link> : <Link href='/signin'>Sign in</Link>}
      </div>
    </header>
  );
}
