import { AccountDelete, AccountLogout } from '~/components';
import { trpc } from '~/utils/trpc';

export default function AccountPage() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <div className='mx-auto max-w-7xl'>
      {user && (
        <div className='flex flex-col gap-y-8'>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <div className='flex gap-x-2'>
            <AccountLogout />
            <AccountDelete />
          </div>
        </div>
      )}
    </div>
  );
}
