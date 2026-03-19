import { motion } from 'framer-motion';

const AnimatedButton = ({ children, className = '', onClick, type = "button" }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
