import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// PUBLIC_INTERFACE
/**
 * ContainerAnimation component for wrapping content with smooth animations
 * 
 * This component provides animated transitions for content within the MainContainer
 * using framer-motion animations.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.type - Animation type ('fade', 'slide', 'scale', 'none')
 * @param {number} props.duration - Animation duration in seconds
 * @param {boolean} props.disabled - Whether animations are disabled
 * @returns {React.ReactElement} Animated component
 */
const ContainerAnimation = ({ 
  children, 
  type = 'fade', 
  duration = 0.5,
  disabled = false,
  ...props 
}) => {
  // Early return if animations are disabled
  if (disabled) {
    return <Box {...props}>{children}</Box>;
  }
  
  // Define animation variants based on type
  const getVariants = () => {
    switch (type) {
      case 'slide':
        return {
          hidden: { 
            y: 20, 
            opacity: 0 
          },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
              duration: duration,
              ease: 'easeOut'
            }
          },
          exit: { 
            y: -20, 
            opacity: 0,
            transition: { 
              duration: duration * 0.75,
              ease: 'easeIn'
            }
          }
        };
        
      case 'scale':
        return {
          hidden: { 
            scale: 0.95, 
            opacity: 0 
          },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
              duration: duration,
              ease: 'easeOut'
            }
          },
          exit: { 
            scale: 0.95, 
            opacity: 0,
            transition: { 
              duration: duration * 0.75,
              ease: 'easeIn'
            }
          }
        };
        
      case 'none':
        return {
          hidden: {},
          visible: {},
          exit: {}
        };
        
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              duration: duration,
              ease: 'easeOut'
            }
          },
          exit: { 
            opacity: 0,
            transition: { 
              duration: duration * 0.75,
              ease: 'easeIn'
            }
          }
        };
    }
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={getVariants()}
      style={{ width: '100%' }}
      {...props}
    >
      {children}
    </Box>
  );
};

ContainerAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['fade', 'slide', 'scale', 'none']),
  duration: PropTypes.number,
  disabled: PropTypes.bool
};

export default ContainerAnimation;
