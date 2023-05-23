import { trpc } from '~/utils/trpc';
import { LoginButton } from './LoginButton';

export function Welcome() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <div className='card'>
    <h1>Stytch T3 example app</h1>
      <p>
        This example app helps you understand how to use Stytch with the T3 stack. You can use One-Time Passcodes, sent via email or SMS, to log in to this app and see the profile page.
      </p>
      <LoginButton />
  </div>
  );
};