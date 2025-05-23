import React from 'react';
import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * BackgroundPattern component for adding visual texture to container backgrounds
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Pattern type ('dots', 'grid', 'waves')
 * @param {string} props.color - Pattern color (defaults to theme primary)
 * @param {number} props.opacity - Pattern opacity (0-1)
 * @param {number} props.size - Pattern size multiplier
 * @returns {React.ReactElement} Rendered BackgroundPattern component
 */
const BackgroundPattern = ({ 
  type = 'dots', 
  color, 
  opacity = 0.05,
  size = 1,
  ...props 
}) => {
  const theme = useTheme();
  const patternColor = color || theme.palette.primary.main;
  
  const getPatternStyles = () => {
    // Base styles
    const baseStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: opacity,
      zIndex: -1,
      pointerEvents: 'none',
      overflow: 'hidden',
    };
    
    // Pattern-specific styles
    switch(type) {
      case 'grid':
        return {
          ...baseStyles,
          backgroundImage: `
            linear-gradient(to right, ${patternColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${patternColor} 1px, transparent 1px)
          `,
          backgroundSize: `${20 * size}px ${20 * size}px`,
        };
        
      case 'waves':
        return {
          ...baseStyles,
          backgroundImage: `
            radial-gradient(ellipse at 50% 50%, ${patternColor} 0%, transparent 70%)
          `,
          backgroundSize: `${100 * size}px ${100 * size}px`,
          backgroundPosition: '0 0, 50px 50px',
        };
        
      case 'dots':
      default:
        return {
          ...baseStyles,
          backgroundImage: `radial-gradient(${patternColor} 1px, transparent 1px)`,
          backgroundSize: `${20 * size}px ${20 * size}px`,
        };
    }
  };
  
  // Gradient overlay for fade effect
  const gradientOverlay = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(to bottom, 
        ${theme.palette.background.default} 0%, 
        rgba(0,0,0,0) 15%, 
        rgba(0,0,0,0) 85%, 
        ${theme.palette.background.default} 100%
      )
    `,
    pointerEvents: 'none',
  };
  
  return (
    <Box 
      sx={{
        ...getPatternStyles(),
        '&::after': gradientOverlay,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

BackgroundPattern.propTypes = {
  type: PropTypes.oneOf(['dots', 'grid', 'waves']),
  color: PropTypes.string,
  opacity: PropTypes.number,
  size: PropTypes.number,
};

export default BackgroundPattern;
