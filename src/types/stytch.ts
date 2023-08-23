import { Session } from 'stytch';

export type StytchAuthMethods = 'otp_email' | 'otp_sms';

export type StytchCustomClaims = {
  db_user_id: string;
};

export interface StytchSessionWithCustomClaims extends Session {
  custom_claims: StytchCustomClaims;
}
