import styles from "./button.module.css";
const Button = ({
  variant = "primary",
  size = "md",
  loading,
  children,
  IconComponent,
  iconPosition = "left",
  type = "button",
  style,
  onClick,
  iconProps,
  className,
  fullWidth,
  fullRadius,
  shadow,
  disabled,
}) => {
  const baseClass = styles.custom_button;
  const variantClass = styles[variant];
  const sizeClass = styles[size];
  const fullWidthClass = fullWidth ? styles.fullWidth : "";
  const fullRadiusClass = fullRadius ? styles.fullRadius : "";
  const shadowClass = shadow !== "none" ? styles[shadow] : "";
  const loadingClass = loading ? styles.loading : "";
  const disabledClass = disabled ? styles.disabled : "";

  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    fullRadiusClass,
    shadowClass,
    loadingClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderIcon = () => {
    if (!IconComponent) return null;

    const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

    return (
      <IconComponent size={iconSize} {...iconProps} className={styles.icon} />
    );
  };

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      type={type}
      style={style}
      onClick={handleClick}
    >
      {loading && <div className={styles.spinner} />}
      {!loading && IconComponent && iconPosition === "left" && renderIcon()}
      <span className={styles.content}>{children}</span>
      {!loading && IconComponent && iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default Button;
