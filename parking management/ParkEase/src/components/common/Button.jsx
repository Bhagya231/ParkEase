import './Button.css';

function Button({children,type = 'button',variant = 'primary',size = 'medium',loading = false,disabled = false,
fullWidth = false,
  onClick,
  className = '',
}) {
  const buttonClasses = [
    'app-button',
    `app-button-${variant}`,
    `app-button-${size}`,
    fullWidth ? 'app-button-full-width' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="button-spinner" />}
      {loading ? 'Please wait...' : children}
    </button>
  );
}

export default Button;
