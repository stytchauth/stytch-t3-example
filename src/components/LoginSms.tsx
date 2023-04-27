import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type StythAuthMethods } from '~/types/stytch';
import { trpc } from '~/utils/trpc';
import { VALID_PHONE_NUMBER } from '~/utils/regex';
import { Button } from './Button';
import { PhoneInput } from './PhoneInput';
import { VerifyOtp } from './VerifyOtp';

const formSchema = z.object({
  phone: z.string().regex(VALID_PHONE_NUMBER, 'Invalid phone number').min(1, 'Phone number is required'),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function LoginSms(props: { onSwitchMethod: (method: StythAuthMethods) => void }) {
  const { data, mutateAsync } = trpc.auth.loginSms.useMutation();

  const {
    handleSubmit,
    getValues,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  if (data?.methodId) {
    return <VerifyOtp methodValue={getValues('phone')} methodId={data.methodId} />;
  }

  return (
    <form
      className='flex w-full flex-col gap-y-4 rounded-lg bg-white p-8 text-center shadow-sm'
      onSubmit={handleSubmit((values) =>
        mutateAsync({ phone: values.phone }).catch((err) => {
          setError('root', { message: err.message });
        }),
      )}
    >
      <h1 className='text-3xl font-semibold'>Stytch + tRPC Demo</h1>
      <p className='text-neutral-600'>Sign in to your account to continue.</p>
      <div>
        <PhoneInput control={control} />
        {errors.phone && <span className='mt-2 block text-left text-sm text-red-800'>{errors.phone?.message}</span>}
      </div>
      <Button isLoading={isSubmitting} type='submit'>
        Continue
      </Button>
      {!data?.methodId && (
        <button type='button' className='text-[#19303d] underline' onClick={() => props.onSwitchMethod('otp_email')}>
          Use email address
        </button>
      )}
      {errors && <span className='mt-2 block text-left text-sm text-red-800'>{errors.root?.message}</span>}
      <div className='text-neutral-4 text-xs text-neutral-600'>
        By continuing, you agree to the <span className='underline'>Terms of Service</span> and acknowledge our{' '}
        <span className='underline'>Privacy Policy</span>.
      </div>
    </form>
  );
}
