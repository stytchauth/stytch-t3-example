import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import { Button } from './Button';

export function AccountLogout() {
  const router = useRouter();
  const utils = trpc.useContext();

  const { mutate } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.user.current.invalidate();
      router.replace('/login');
    },
  });

  return (
    <Button type='button' onClick={() => mutate()}>
      Logout
    </Button>
  );
}
