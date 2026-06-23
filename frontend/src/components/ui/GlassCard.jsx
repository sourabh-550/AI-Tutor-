import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`glass rounded-2xl ${hover ? "transition-shadow hover:shadow-xl hover:shadow-primary/10" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
