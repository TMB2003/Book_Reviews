/* Minimal Input component */
import clsx from 'classnames';

export function Input({ className, ...props }) {
  return <input className={clsx('ui-input', className)} {...props} />;
}

export default Input;
