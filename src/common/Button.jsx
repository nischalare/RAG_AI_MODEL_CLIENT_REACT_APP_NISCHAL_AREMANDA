import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | secondary | danger | ghost
  size = "md", // sm | md | lg
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = "",
}) => {

  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full",
    loading && "btn-loading",
    icon && !children && "btn-icon-only",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={classes}
      aria-busy={loading}
    >
      {loading ? (
        <span className="spinner"></span>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
