import clsx from 'clsx';
import { forwardRef } from 'react';

type InputProps = React.ComponentPropsWithRef<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className, ...rest } = props;

  return <input className={clsx('w-full border p-3', className)} ref={ref} {...rest} />;
});
