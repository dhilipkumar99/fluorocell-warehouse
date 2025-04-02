import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'md',
  border = false,
  ...props
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
    xl: 'p-6 sm:p-8',
  };
  
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-md',
    xl: 'shadow-lg',
  };
  
  const roundedStyles = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };
  
  return (
    <div
      className={`
        bg-white
        ${paddingStyles[padding] || paddingStyles.md}
        ${shadowStyles[shadow] || shadowStyles.md}
        ${roundedStyles[rounded] || roundedStyles.md}
        ${border ? 'border border-gray-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header component
Card.Header = function CardHeader({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`pb-4 mb-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title component
Card.Title = function CardTitle({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) {
  return (
    <Component
      className={`text-lg font-medium leading-6 text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Description component
Card.Description = function CardDescription({
  children,
  className = '',
  ...props
}) {
  return (
    <p
      className={`mt-1 text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

// Card Footer component
Card.Footer = function CardFooter({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`pt-4 mt-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};