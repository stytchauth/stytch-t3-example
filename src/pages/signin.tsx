import { useState } from 'react';
import { LoginEmail, LoginSms } from '~/components';
import { StythAuthMethods } from '~/types/stytch';

export default function SignInPage() {
  const [method, setMethod] = useState<StythAuthMethods>('otp_email');

  return (
    <div className='container'>
      {method === 'otp_sms' && <LoginSms onSwitchMethod={setMethod} />}
      {method === 'otp_email' && <LoginEmail onSwitchMethod={setMethod} />}
    </div>
  );
}
