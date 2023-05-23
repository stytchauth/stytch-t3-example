import { useState } from 'react';
import { LoginEmail, LoginSms } from '~/components';
import { StycthAuthMethods } from '~/types/stytch';

export default function LoginPage() {
  const [method, setMethod] = useState<StycthAuthMethods>('otp_email');

  return (
    <div className='container'>
      {method === 'otp_sms' && <LoginSms onSwitchMethod={setMethod} />}
      {method === 'otp_email' && <LoginEmail onSwitchMethod={setMethod} />}
    </div>
  );
}
