import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { getAnimationVariant } from '../../utils/containerUtils';

// PUBLIC_INTERFACE
/**
 * FadeInSection component that animates children when they enter the viewport
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animation - Animation type ('fade', 'slide', 'scale')
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.threshold - Intersection threshold (0-1)
 * @param {boolean} props.disabled - Whether animations are disabled
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Animated section component
 */
const FadeInSection = ({ 
  children, 
  animation = 'fade',
  duration = 0.6,
  threshold = 0.2,
  disabled = false,
  sx = {},
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Skip for SSR or if disabled
    if (disabled || typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after becoming visible
          observer.unobserve(entry.target);
        }
      },
      {
        root: null, // browser viewport
        rootMargin: '0px',
        threshold: threshold,
      }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, disabled]);
  
  // Early return if animations are disabled
  if (disabled) {
    return <Box {...props} sx={sx}>{children}</Box>;
  }
  
  // Get animation variants
  const variants = getAnimationVariant(animation, duration);

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      variants={variants}
      style={{ width: '100%' }}
      sx={sx}
      {...props}
    >
      {children}
    </Box>
  );
};

FadeInSection.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf(['fade', 'slide', 'scale']),
  duration: PropTypes.number,
  threshold: PropTypes.number,
  disabled: PropTypes.bool,
  sx: PropTypes.object
};

export default FadeInSection;
