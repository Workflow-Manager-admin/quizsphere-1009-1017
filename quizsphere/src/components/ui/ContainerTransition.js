import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// PUBLIC_INTERFACE
/**
 * ContainerTransition component for animated transitions between route changes
 * 
 * Provides smooth animations for content changes within MainContainer
 * Uses framer-motion for high-performance animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.locationKey - Current location key to detect route changes
 * @param {string} props.type - Animation type ('fade', 'slide', 'scale')
 * @param {number} props.duration - Animation duration in seconds
 * @param {boolean} props.disabled - Whether animations are disabled
 * @returns {React.ReactElement} Animated transition component
 */
const ContainerTransition = ({
  children,
  locationKey,
  type = 'fade',
  duration = 0.3,
  disabled = false,
  ...props
}) => {
  // Early return if animations are disabled
  if (disabled) {
    return <Box {...props}>{children}</Box>;
  }

  // Animation variants based on type
  const getVariants = () => {
    const durationMs = duration;
    
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
              duration: durationMs,
              ease: [0.25, 0.1, 0.25, 1.0]
            } 
          },
          exit: { 
            opacity: 0,
            y: -20,
            transition: { 
              duration: durationMs * 0.8,
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
              duration: durationMs,
              ease: [0.25, 0.1, 0.25, 1.0]
            } 
          },
          exit: { 
            opacity: 0,
            scale: 0.96,
            transition: { 
              duration: durationMs * 0.8,
              ease: [0.25, 0.1, 0.25, 1.0]
            } 
          }
        };
        
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { 
              duration: durationMs,
              ease: "easeInOut"
            } 
          },
          exit: { 
            opacity: 0,
            transition: { 
              duration: durationMs * 0.8,
              ease: "easeInOut"
            } 
          }
        };
    }
  };
  
  // Get correct variants
  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey || 'default'}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        style={{ width: '100%' }}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

ContainerTransition.propTypes = {
  children: PropTypes.node.isRequired,
  locationKey: PropTypes.string,
  type: PropTypes.oneOf(['fade', 'slide', 'scale']),
  duration: PropTypes.number,
  disabled: PropTypes.bool
};

export default ContainerTransition;
