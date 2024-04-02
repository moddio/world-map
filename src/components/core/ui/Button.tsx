import clsx from 'clsx';
import If from './If';
import LoadingSpinner from './Spinner';
import { Link } from 'react-router-dom';

function getColorClasses(color) {
  const colors = {
    primary:
      'text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:border-primary-500 focus:ring-primary-500',
    secondary:
      'text-white bg-secondary-600 hover:bg-secondary-700 focus:ring-1 focus:border-secondary-500 focus:ring-secondary-500',
    success:
      'text-white bg-green-600 hover:bg-green-700 focus:ring-1 focus:border-green-500 focus:ring-green-500',
    warning:
      'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-1 focus:border-yellow-500 focus:ring-yellow-500',
    danger:
      'text-white bg-red-600 hover:bg-red-700 focus:ring-1 focus:border-red-500 focus:ring-red-500',
    alternate:
      'text-white bg-[#37393E] hover:bg-gray-700 focus:ring-1 focus:border-primary-500 focus:ring-primary-500',
  };

  return colors[color];
}

function getSizeClasses(size) {
  const sizes = {
    xs: 'py-2 px-3 text-xs',
    sm: 'py-2 px-3 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'py-3 px-5 text-base',
    xl: 'py-3.5 px-6 text-base',
  };

  return `${sizes[size]} w-full`;
}

function getVariantClasses(variant, color = 'primary') {
  const variants = {
    base: {
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
      alternate: '',
    },
    light: {
      primary:
        'text-primary-800 bg-primary-50 hover:text-primary-900 hover:bg-primary-600',
      secondary:
        'text-secondary-800 bg-secondary-50 hover:text-secondary-900 hover:bg-secondary-600',
      success:
        'text-green-800 bg-green-50 hover:text-green-900 hover:bg-green-600',
      warning:
        'text-yellow-800 bg-yellow-50 hover:text-yellow-900 hover:bg-yellow-600',
      danger: 'text-red-800 bg-red-50 hover:text-red-900 hover:bg-red-600',
      alternate:
        'text-gray-800 bg-gray-50 hover:text-gray-900 hover:bg-gray-600',
    },
    transparent: {
      primary: 'bg-transparent border-gray-700 hover:bg-primary-600',
    },
  };

  return variants[variant][color];
}

export default function Button({
  color = 'primary',
  size = 'md',
  variant = 'base',
  href,
  block,
  loading,
  disabled,
  className,
  children,
  as = 'button',
  innerClassName = '',
  target = '',
  rel = '',
  ...props
}) {
  const isDisabled = loading || disabled;

  const classNames = clsx(
    'inline-flex items-center justify-center border !border-transparent rounded-md font-medium focus:outline-none',
    getColorClasses(color),
    getVariantClasses(variant, color),
    block && 'w-full',
    isDisabled && 'opacity-70 pointer-events-none cursor-not-allowed',
    className
  );

  const As = as;

  return (
    //@ts-ignore
    <As {...props} disabled={isDisabled} className={classNames}>
      <InnerButtonContainerElement
        href={href}
        rel={rel}
        target={target}
        className={clsx(getSizeClasses(size), innerClassName)}
      >
        <span className="flex !hover:white !hover:no-underline  w-full only: flex-1 items-center justify-center">
        {/*@ts-ignore*/}
          <If condition={loading}>
            <LoadingSpinner />
          </If>

          {children}
        </span>
      </InnerButtonContainerElement>
    </As>
  );
}

function InnerButtonContainerElement({
  href,
  target = '',
  rel = '',
  className,
  children,
}) {
  if (href) {
    return (
      <Link
        //@ts-ignore
        href={href}
        target={target}
        rel={rel}
        style={{
          textDecoration: 'none',
          color: 'white',
        }}
        className={`${className} flex w-full !hover:white !hover:no-underline  items-center`}
      >
        {children}
      </Link>
    );
  }

  return (
    <span className={`${className} flex w-full items-center`}>{children}</span>
  );
}
