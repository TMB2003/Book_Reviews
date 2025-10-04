/* Minimal Label component */
import clsx from 'classnames';

export function Label({ className, children, ...props }) {
  return (
    <label className={clsx('ui-label', className)} {...props}>
      {children}
    </label>
  );
}

export default Label;
