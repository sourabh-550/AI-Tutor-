import { motion } from "framer-motion";

const variants = {
  primary: "gradient-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
  secondary: "glass-subtle text-text hover:bg-white/5 border-border-strong",
  ghost: "text-muted hover:text-text hover:bg-white/5",
  accent: "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
