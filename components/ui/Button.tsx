import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "bg-primary text-secondary hover:bg-yellow-400 active:bg-yellow-500",
      secondary: "bg-secondary text-white hover:bg-secondary/90",
      outline: "border-2 border-secondary text-secondary hover:bg-gray-100",
      ghost: "text-secondary hover:bg-gray-100",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      sm: "h-10 px-4 text-sm rounded-xl",
      md: "h-12 px-6 text-base rounded-2xl",
      lg: "h-14 px-8 text-lg rounded-2xl",
      xl: "h-16 px-8 text-xl rounded-3xl font-bold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
