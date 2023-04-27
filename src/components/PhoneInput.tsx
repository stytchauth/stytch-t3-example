import React from 'react';
import { type Control } from 'react-hook-form';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import flags from 'react-phone-number-input/flags';
import clsx from 'clsx';
import { STYTCH_SUPPORTED_SMS_COUNTRIES } from '~/utils/stytch';
import { Input } from './Input';

import 'react-phone-number-input/style.css';

export function PhoneInput(props: { control: Control<{ phone: string }, any> }) {
  const { control } = props;

  return (
    <PhoneInputWithCountry
      style={{
        '--PhoneInputCountryFlag-borderWidth': '0',
        '--PhoneInputCountrySelectArrow-width': '.5em',
        '--PhoneInputCountryFlag-height': '.75em',
      }}
      className={clsx(
        'relative flex grow items-center',
        '[&_.PhoneInputCountrySelectArrow]:hidden',
        '[&_.PhoneInputCountry]:absolute [&_.PhoneInputCountry]:left-6 [&_.PhoneInputCountry]:self-center',
        '[&_input]:pl-14',
      )}
      control={control}
      countries={STYTCH_SUPPORTED_SMS_COUNTRIES}
      countryCallingCodeEditable={false}
      defaultCountry={STYTCH_SUPPORTED_SMS_COUNTRIES[0]}
      flags={flags}
      inputComponent={Input}
      international
      name='phone'
      rules={{ required: true }}
      withCountryCallingCode
    />
  );
}
