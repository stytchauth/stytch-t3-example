import { type Session } from 'stytch/types/lib/b2c/shared_b2c';

export type StycthAuthMethods = 'otp_email' | 'otp_sms';

export type StytchCustomClaims = {
  db_user_id: string;
};

export interface StytchSessionWithCustomClaims extends Session {
  custom_claims: StytchCustomClaims;
}
