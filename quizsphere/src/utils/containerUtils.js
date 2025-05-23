/**
 * Utility functions for container animations and behaviors
 */

/**
 * Generate a container animation variant based on type
 * @param {string} type - Animation type ('fade', 'slide', 'scale', 'none')
 * @param {number} duration - Animation duration in seconds
 * @returns {Object} Animation variants for framer-motion
 */
export const getAnimationVariant = (type = 'fade', duration = 0.3) => {
  // Duration in seconds
  const durationS = duration;
  
  switch (type) {
    case 'slide':
      return {
        initial: { 
          opacity: 0,
          y: 20
        },
        animate: { 
          opacity: 1,
          y: 0,
          transition: { 
            duration: durationS,
            ease: [0.25, 0.1, 0.25, 1.0]
          } 
        },
        exit: { 
          opacity: 0,
          y: -20,
          transition: { 
            duration: durationS * 0.8,
            ease: [0.25, 0.1, 0.25, 1.0]
          } 
        }
      };
    
    case 'scale':
      return {
        initial: { 
          opacity: 0,
          scale: 0.96
        },
        animate: { 
          opacity: 1,
          scale: 1,
          transition: { 
            duration: durationS,
            ease: [0.25, 0.1, 0.25, 1.0]
          } 
        },
        exit: { 
          opacity: 0,
          scale: 0.96,
          transition: { 
            duration: durationS * 0.8,
            ease: [0.25, 0.1, 0.25, 1.0]
          } 
        }
      };
      
    case 'none':
      return {
        initial: {},
        animate: {},
        exit: {}
      };
      
    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: { 
            duration: durationS,
            ease: "easeInOut"
          } 
        },
        exit: { 
          opacity: 0,
          transition: { 
            duration: durationS * 0.8,
            ease: "easeInOut"
          } 
        }
      };
  }
};

/**
 * Generate staggered animation variants for child elements
 * @param {string} type - Animation type ('fade', 'slide', 'scale', 'none')
 * @param {number} staggerDelay - Delay between each child in seconds
 * @param {number} initialDelay - Initial delay before starting animations
 * @returns {Object} Animation variants for children with staggered animations
 */
export const getStaggeredAnimationVariants = (
  type = 'fade', 
  staggerDelay = 0.1,
  initialDelay = 0.1
) => {
  // Base variants
  const baseVariant = getAnimationVariant(type);
  
  // Container variant (parent)
  const container = {
    initial: { opacity: 1 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    },
    exit: { opacity: 1 }
  };
  
  return {
    container,
    item: baseVariant
  };
};

/**
 * Format error messages for display in UI
 * @param {Error|string} error - Error object or string
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Check for common error types
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Generate a unique ID for animations
 * @returns {string} Unique ID
 */
export const generateAnimationKey = () => {
  return `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 9)}`;
};
