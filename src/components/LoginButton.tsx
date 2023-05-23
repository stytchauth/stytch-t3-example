import { Button } from '~/components';
import { useRouter } from 'next/router';


export const config = {
  matcher: ['/profile', '/login'],
};

export function LoginButton() {
  const router = useRouter();

  return (
    <Button type='submit' onClick={() => router.replace('/login')}>
      Log in
    </Button>
  );
};