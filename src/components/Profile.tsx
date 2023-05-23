import { AccountLogout } from '~/components';
import { trpc } from '~/utils/trpc';

export function Profile() {
  const { data: user } = trpc.user.current.useQuery();

  return (
    <div className='card'>
    <h1>Profile</h1>
      <h2>User object</h2>
      <pre className='code-block'>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <p>
        You are logged in, and a Session has been created. The backend Node SDK has stored the
        Session as a JWT in the browser cookies as{" "}
        <span className="code">session_jwt</span>.
      </p>
      <AccountLogout />
  </div>
  );
};