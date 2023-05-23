import { trpc } from '~/utils/trpc';
import { LoginButton } from './LoginButton';
import Link from 'next/link';
import Image from 'next/image';

export function Welcome() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <div className='card'>
      <h1 className='text-3xl font-semibold text-[#19303d]'>Stytch + T3 example</h1>
      <p>
        This example app helps you understand how to use Stytch with the {' '} 
        <Link
          target='_blank'
          href='https://create.t3.gg/'
          style={{
            textDecoration: 'underline',
          }}
        >
          T3 stack
        </Link>
        . You can use One-Time Passcodes, sent via email or SMS, to log in to this app and see the profile page.
      </p>
      <LoginButton />
      <Image alt='Powered by Stytch' src='/powered-by-stytch.png' width={150} height={14} className='pt-5' />
  </div>
  );
};