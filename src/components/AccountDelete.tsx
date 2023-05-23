import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import { Button } from './Button';

export function AccountDelete() {
  const router = useRouter();
  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.user.delete.useMutation({
    onSuccess: () => {
      utils.user.current.invalidate();
      router.replace('/');
    },
  });

  return (
    <Button type='button' isLoading={isLoading} className='bg-[#AD2E30]' onClick={() => mutate()}>
      Delete Account
    </Button>
  );
}
