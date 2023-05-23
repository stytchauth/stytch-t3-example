import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '~/utils/trpc';
import { Button } from './Button';

const formSchema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits'),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function VerifyOtp(props: { methodId: string; methodValue: string }) {
  const { methodId, methodValue } = props;

  const router = useRouter();
  const utils = trpc.useContext();

  const { mutateAsync } = trpc.auth.authenticate.useMutation({
    onSuccess: () => {
      utils.user.current.invalidate();
      router.push('/profile');
    },
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful, isLoading },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      className='flex w-full flex-col gap-y-4 rounded-lg bg-white p-8 text-center shadow-sm border-[#adbcc5] border-[1px]'
      onSubmit={handleSubmit((values) =>
        mutateAsync({ code: values.code, methodId: methodId }).catch((err) => {
          setError('root', { message: err.message });
        }),
      )}
    >
      <h1 className='text-3xl font-semibold'>Enter your verification code</h1>
      <p className='text-neutral-600'>
        A 6-digit verification was sent to <strong className='font-semibold'>{methodValue}</strong>
      </p>
      <div>
        <input
          className='w-full border p-3'
          aria-label='6-Digit Code'
          type='text'
          inputMode='numeric'
          {...register('code')}
        />
        {errors && <span className='mt-2 block text-left text-sm text-red-800'>{errors.code?.message}</span>}
      </div>
      <Button isLoading={isSubmitting || isSubmitSuccessful} type='submit'>
        Continue
      </Button>
      {errors && <span className='mt-2 block text-left text-sm text-red-800'>{errors.root?.message}</span>}
    </form>
  );
}
