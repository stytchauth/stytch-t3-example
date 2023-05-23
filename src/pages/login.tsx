import { useState } from 'react';
import { LoginEmail, LoginSms } from '~/components';
import { StytchAuthMethods } from '~/types/stytch';

export default function LoginPage() {
  const [method, setMethod] = useState<StytchAuthMethods>('otp_email');

  return (
    <div className='container'>
      {method === 'otp_sms' && <LoginSms onSwitchMethod={setMethod} />}
      {method === 'otp_email' && <LoginEmail onSwitchMethod={setMethod} />}
    </div>
  );
}
