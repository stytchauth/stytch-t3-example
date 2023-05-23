import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type StytchAuthMethods } from '~/types/stytch';
import { trpc } from '~/utils/trpc';
import { VerifyOtp } from './VerifyOtp';
import { Button } from './Button';
import { Input } from './Input';

const formSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email address is required'),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function LoginEmail(props: { onSwitchMethod: (method: StytchAuthMethods) => void }) {
  const { data, mutateAsync } = trpc.auth.loginEmail.useMutation();

  const {
    handleSubmit,
    register,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  if (data?.methodId) {
    return <VerifyOtp methodValue={getValues('email')} methodId={data.methodId} />;
  }

  return (
    <form
      className='flex w-full flex-col gap-y-4 rounded bg-white p-8 text-center shadow-sm border-[#adbcc5] border-[1px]'
      onSubmit={handleSubmit((values) =>
        mutateAsync({ email: values.email }).catch((err) => {
          setError('root', { message: err.message });
        }),
      )}
    >
      <h1 className='text-3xl font-semibold text-[#19303d]'>Stytch + T3 example</h1>
      <div>
        <Input
          aria-label='Email'
          placeholder='example@email.com'
          type='email'
          autoCapitalize='off'
          autoCorrect='off'
          spellCheck='false'
          inputMode='email'
          className='rounded'
          {...register('email')}
        />
        {errors.email && <span className='mt-2 block text-left text-sm text-red-800'>{errors.email?.message}</span>}
      </div>
      <Button isLoading={isSubmitting} type='submit'>
        Continue
      </Button>

      {/* For mobile users, SMS OTP is often preferrable to email OTP. Allowing users to switch between the two is a great way to improve the user experience. */}
      {!data?.methodId && (
        <button type='button' className='text-[#19303d] underline' onClick={() => props.onSwitchMethod('otp_sms')}>
          Or use phone number
        </button>
      )}
      {errors && <span className='mt-2 block text-left text-sm text-red-800'>{errors.root?.message}</span>}
      
      {/* The ToS and privacy policy links here are not implemented, but serve as a demonstration of how you can easily customize the UI and include anything that you need in your authentication flow with Stytch. */}
      <div className='text-neutral-4 text-xs text-neutral-600'>
        By continuing, you agree to the <span className='underline'>Terms of Service</span> and acknowledge our{' '}
        <span className='underline'>Privacy Policy</span>.
      </div>
    </form>
  );
}
