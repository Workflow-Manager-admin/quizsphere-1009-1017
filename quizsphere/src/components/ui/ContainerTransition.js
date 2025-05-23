import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { getAnimationVariant } from '../../utils/containerUtils';

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

  // Get animation variants from utility function
  const variants = getAnimationVariant(type, duration);

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
