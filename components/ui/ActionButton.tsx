"use client";

import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";

export type ActionButtonVariant =
  | "edit"
  | "delete"
  | "view"
  | "primary"
  | "success"
  | "warning";

interface ActionButtonProps {
  variant?: ActionButtonVariant;
  icon?: LucideIcon;
  onClick?: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  showText?: boolean;
}

const variantStyles: Record<
  ActionButtonVariant,
  {
    gradient: string;
    hoverGradient: string;
    textColor: string;
    border: string;
    hoverBorder: string;
    shadowColor: string;
  }
> = {
  edit: {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    hoverGradient: "from-primary to-primary-dark",
    textColor: "text-primary",
    border: "border-primary/20",
    hoverBorder: "hover:border-primary",
    shadowColor: "hover:shadow-primary/25",
  },
  delete: {
    gradient:
      "from-red-50 via-red-100/50 to-transparent dark:from-red-950/30 dark:via-red-900/20 dark:to-transparent",
    hoverGradient: "from-red-500 via-red-600 to-red-700",
    textColor: "text-red-500",
    border: "border-red-200 dark:border-red-800/50",
    hoverBorder: "hover:border-red-500",
    shadowColor: "hover:shadow-red-500/25",
  },
  view: {
    gradient:
      "from-blue-50 via-blue-100/50 to-transparent dark:from-blue-950/30 dark:via-blue-900/20 dark:to-transparent",
    hoverGradient: "from-blue-500 via-blue-600 to-blue-700",
    textColor: "text-blue-500",
    border: "border-blue-200 dark:border-blue-800/50",
    hoverBorder: "hover:border-blue-500",
    shadowColor: "hover:shadow-blue-500/25",
  },
  primary: {
    gradient:
      "from-indigo-50 via-indigo-100/50 to-transparent dark:from-indigo-950/30 dark:via-indigo-900/20 dark:to-transparent",
    hoverGradient: "from-indigo-500 via-indigo-600 to-indigo-700",
    textColor: "text-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800/50",
    hoverBorder: "hover:border-indigo-500",
    shadowColor: "hover:shadow-indigo-500/25",
  },
  success: {
    gradient:
      "from-green-50 via-green-100/50 to-transparent dark:from-green-950/30 dark:via-green-900/20 dark:to-transparent",
    hoverGradient: "from-green-500 via-green-600 to-green-700",
    textColor: "text-green-500",
    border: "border-green-200 dark:border-green-800/50",
    hoverBorder: "hover:border-green-500",
    shadowColor: "hover:shadow-green-500/25",
  },
  warning: {
    gradient:
      "from-yellow-50 via-yellow-100/50 to-transparent dark:from-yellow-950/30 dark:via-yellow-900/20 dark:to-transparent",
    hoverGradient: "from-yellow-500 via-yellow-600 to-yellow-700",
    textColor: "text-yellow-600",
    border: "border-yellow-200 dark:border-yellow-800/50",
    hoverBorder: "hover:border-yellow-500",
    shadowColor: "hover:shadow-yellow-500/25",
  },
};

const sizeStyles = {
  sm: {
    iconOnly: "size-8",
    withText: "px-3 py-1.5 gap-1.5",
    iconSize: 16,
    textSize: "text-xs",
  },
  md: {
    iconOnly: "size-9",
    withText: "px-4 py-2 gap-2",
    iconSize: 18,
    textSize: "text-sm",
  },
  lg: {
    iconOnly: "size-10",
    withText: "px-5 py-2.5 gap-2.5",
    iconSize: 20,
    textSize: "text-base",
  },
};

const tooltipIconSizes = {
  sm: 10,
  md: 12,
  lg: 14,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "primary",
  icon: Icon,
  onClick,
  label,
  size = "md",
  className = "",
  disabled = false,
  showText = false,
}) => {
  const styles = variantStyles[variant];
  const defaultLabel =
    label || variant.charAt(0).toUpperCase() + variant.slice(1);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Determine display mode
  const hasIcon = !!Icon;
  const hasLabel = !!defaultLabel;
  const showTextInside = showText && hasLabel;
  const showIconOnly = hasIcon && !showTextInside;
  const showTextOnly = !hasIcon && showTextInside;
  const showBoth = hasIcon && showTextInside;

  // Determine if tooltip should be shown
  const shouldShowTooltip =
    !disabled && isHovered && !showTextInside && hasLabel;

  // Get button size class
  const getButtonSizeClass = () => {
    if (showTextInside) {
      return sizeStyles[size].withText;
    }
    return sizeStyles[size].iconOnly;
  };

  const handleMouseEnter = () => {
    if (!showTextInside) {
      setIsHovered(true);
      if (buttonRef.current && hasLabel) {
        const rect = buttonRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top - 40,
          left: rect.left + rect.width / 2,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderContent = () => {
    // Case 1: Icon only (label in tooltip)
    if (showIconOnly) {
      return (
        Icon && (
          <Icon
            size={sizeStyles[size].iconSize}
            className={`
            relative z-10 transition-all duration-300 
            group-hover:rotate-12 group-hover:scale-110
            ${disabled ? "group-hover:rotate-0 group-hover:scale-100" : ""}
          `}
          />
        )
      );
    }

    // Case 2: Text only (no tooltip needed)
    if (showTextOnly) {
      return (
        <span
          className={`
          relative z-10 font-medium transition-all duration-300
          ${sizeStyles[size].textSize}
          ${disabled ? "" : "group-hover:tracking-wide"}
        `}
        >
          {defaultLabel}
        </span>
      );
    }

    // Case 3: Both icon and text
    if (showBoth) {
      return (
        <>
          {Icon && (
            <Icon
              size={sizeStyles[size].iconSize}
              className={`
                relative z-10  transition-all duration-300 
                ${disabled ? "group-hover:scale-100" : ""}
              `}
            />
          )}
          <span
            className={`
            relative z-10 font-medium transition-all duration-300
            ${sizeStyles[size].textSize}
            ${disabled ? "" : ""}
          `}
          >
            {defaultLabel}
          </span>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          group cursor-pointer relative ${getButtonSizeClass()} rounded-xl 
          bg-linear-to-br ${styles.gradient}
          ${styles.textColor} hover:text-white 
          flex justify-center items-center 
          transition-all duration-300 
          ${styles.shadowColor} hover:shadow-xl
          ${showIconOnly ? "hover:scale-110" : "hover:scale-100"} active:scale-95 
          border ${styles.border} ${styles.hoverBorder}
          overflow-hidden backdrop-blur-sm
          ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}
          ${showTextInside ? "inline-flex" : ""}
          ${className}
        `}
        aria-label={!showTextInside && hasLabel ? defaultLabel : undefined}
      >
        {/* Animated gradient overlay */}
        <div
          className={`
            absolute inset-0 bg-linear-to-br ${styles.hoverGradient}
            opacity-0 group-hover:opacity-100 transition-all duration-500
            ${disabled ? "group-hover:opacity-0" : ""}
          `}
        />

        {/* Shine effect */}
        <div
          className={`
            absolute inset-0 -translate-x-full group-hover:translate-x-full 
            transition-transform duration-1000 
            bg-linear-to-r from-transparent via-white/20 to-transparent
            ${disabled ? "group-hover:translate-x-0" : ""}
          `}
        />

        {/* Content */}
        {renderContent()}
      </button>

      {/* Portal Tooltip - Only shown when label is NOT displayed inside the button */}
      {shouldShowTooltip &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: "translateX(-50%)",
              zIndex: 99999,
            }}
            className="
            px-3 py-1.5 bg-gray-900/95 text-white text-xs 
            rounded-lg pointer-events-none 
            whitespace-nowrap shadow-2xl backdrop-blur-sm 
            border border-white/10
          "
          >
            <span className="flex items-center gap-1.5">
              {Icon && <Icon size={tooltipIconSizes[size]} />}
              {defaultLabel}
            </span>
            <span
              className="
              absolute -bottom-1.5 left-1/2 -translate-x-1/2 
              w-3 h-3 bg-gray-900/95 rotate-45 
              border-r border-b border-white/10
            "
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default ActionButton;
