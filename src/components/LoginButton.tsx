import { Button } from '~/components';
import { useRouter } from 'next/router';


export const config = {
  matcher: ['/profile', '/login'],
};

// This component is used to navigate from the Welcome page to the Login page.
export function LoginButton() {
  const router = useRouter();

  return (
    <Button type='submit' onClick={() => router.replace('/login')}>
      Log in
    </Button>
  );
};