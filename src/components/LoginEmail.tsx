import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type StythAuthMethods } from '~/types/stytch';
import { trpc } from '~/utils/trpc';
import { VerifyOtp } from './VerifyOtp';
import { Button } from './Button';
import { Input } from './Input';

const formSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email address is required'),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function LoginEmail(props: { onSwitchMethod: (method: StythAuthMethods) => void }) {
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
      className='flex w-full flex-col gap-y-4 rounded-lg bg-white p-8 text-center shadow-sm'
      onSubmit={handleSubmit((values) =>
        mutateAsync({ email: values.email }).catch((err) => {
          setError('root', { message: err.message });
        }),
      )}
    >
      <h1 className='text-3xl font-semibold'>Stytch + tRPC Demo</h1>
      <p className='text-neutral-600'>Sign in to your account to continue.</p>
      <div>
        <Input
          aria-label='Email'
          placeholder='you@email.com'
          type='email'
          autoCapitalize='off'
          autoCorrect='off'
          spellCheck='false'
          inputMode='email'
          {...register('email')}
        />
        {errors.email && <span className='mt-2 block text-left text-sm text-red-800'>{errors.email?.message}</span>}
      </div>
      <Button isLoading={isSubmitting} type='submit'>
        Continue
      </Button>
      {!data?.methodId && (
        <button type='button' className='text-[#19303d] underline' onClick={() => props.onSwitchMethod('otp_sms')}>
          Use phone number
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
