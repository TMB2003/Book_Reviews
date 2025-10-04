/* Minimal Button component with blue theme */
import clsx from 'classnames';

export function Button({ className, children, variant = 'primary', ...props }) {
  const classes = clsx(
    'ui-btn',
    variant === 'primary' && 'ui-btn--primary',
    variant === 'ghost' && 'ui-btn--ghost',
    className,
  );
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
