import clsx from 'clsx';
import { forwardRef } from 'react';

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
  isLoading?: boolean;
};

function Spinner() {
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      <svg className='h-5 w-5 animate-spin' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          fill='currentColor'
        />
      </svg>
    </div>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const { children, className, disabled, isLoading, ...rest } = props;

  return (
    <button
      className={clsx(
        'relative inline-flex items-center justify-center gap-x-2 rounded bg-[#4a37be] p-3 font-semibold text-white w-full',
        className,
      )}
      disabled={isLoading || disabled}
      ref={ref}
      type='button'
      {...rest}
    >
      {isLoading && <Spinner />}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
});
