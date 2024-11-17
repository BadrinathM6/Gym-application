// src/constants/animations.js

export const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100%',
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};
  
  export const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.95,
    },
    selected: {
      scale: 1.1,
      borderColor: '#4caf50',
      boxShadow: '0 0 15px rgba(76, 175, 80, 0.3)',
    },
  };
  
  // You can add more common animations here
  export const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  
  export const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };