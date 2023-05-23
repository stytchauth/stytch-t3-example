import { Profile } from '~/components';
import { trpc } from '~/utils/trpc';

export default function AccountPage() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <div className='mx-auto max-w-7xl'>
      {user && (
        <Profile />
      )}
    </div>
  );
}
