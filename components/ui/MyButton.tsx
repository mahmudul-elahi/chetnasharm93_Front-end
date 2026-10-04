"use client";
import React, { useState } from "react";
import { SpinnerCustom } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-r from-primary to-secondary text-white hover:bg-primary/90",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
  outline: "text-primary hover:bg-primary/10 ring-2 ring-primary ring-inset",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost:
    " text-gray-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-full",
  md: "px-6 py-2.5 text-base rounded-full",
  lg: "px-8 py-3 text-lg rounded-full",
};

const MyButton = ({
  children,
  className,
  isLoading,
  disabled,
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...props
}: MyButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        relative overflow-hidden font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 cursor-pointer
        ${className || ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? <SpinnerCustom /> : children}
      </span>

      {/* Hover effect for primary and danger variants */}
      {(variant === "primary" || variant === "danger") && (
        <div
          className={`absolute inset-0 bg-white/10 transition-transform duration-300 ${
            isHovered ? "scale-x-100" : "scale-x-0"
          } origin-left`}
        />
      )}

      {/* Hover effect for outline variant */}
      {variant === "outline" && (
        <div
          className={`absolute inset-0 bg-primary/10 transition-transform duration-300 ${
            isHovered ? "scale-x-100" : "scale-x-0"
          } origin-left`}
        />
      )}

      {/* Hover effect for ghost variant */}
      {variant === "ghost" && (
        <div
          className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-transform duration-300 ${
            isHovered ? "scale-x-100" : "scale-x-0"
          } origin-left`}
        />
      )}
    </button>
  );
};

export default MyButton;
