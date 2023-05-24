import { Country } from 'react-phone-number-input';

/**
 * These are the countries that Stytch supports at the time of writing
 * https://stytch.com/docs/passcodes#unsupported-countries.
 *
 * This list is used to populate the country dropdown on the phone number input
 * in the login form. Simply remove any countries that you don't want to support. You may
 * want to limit support due to cost, fraud, or because you do not do business in that country.
 **/

export const STYTCH_SUPPORTED_SMS_COUNTRIES: Country[] = [
  'US', // will be selected by default on phone number input
  'CA',
  // 'AU',
  // 'BR',
  // 'DE',
  // 'ES',
  // 'FR',
  // 'GB',
  // 'MX',
];
