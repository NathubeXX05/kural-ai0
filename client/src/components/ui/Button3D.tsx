import React from "react";
import { cn } from "@/lib/utils";

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

export const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, variant = "primary", size = "md", fullWidth, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-[#58cc02] border-[#46a302] text-white hover:bg-[#61e002]",
      secondary: "bg-[#1cb0f6] border-[#1899d6] text-white hover:bg-[#20bdff]",
      accent: "bg-[#ffc800] border-[#e5b400] text-[#4b4b4b] hover:bg-[#ffd21f]",
      danger: "bg-[#ff4b4b] border-[#ea2b2b] text-white hover:bg-[#ff5c5c]",
      ghost: "bg-transparent border-transparent text-gray-500 hover:bg-gray-100 border-b-0",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      icon: "p-3",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-extrabold uppercase tracking-widest rounded-xl transition-all active:translate-y-[4px] active:border-b-0 disabled:opacity-50 disabled:pointer-events-none select-none",
          variant !== "ghost" && "border-b-4",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button3D.displayName = "Button3D";
