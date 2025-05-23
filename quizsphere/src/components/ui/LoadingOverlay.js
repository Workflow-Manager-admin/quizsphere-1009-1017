import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * LoadingOverlay component for displaying loading state with customization options
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Whether loading is active
 * @param {string} props.message - Loading message to display
 * @param {('fullscreen'|'container'|'inline')} props.type - Type of loading overlay
 * @param {boolean} props.transparent - Whether background should be transparent
 * @returns {React.ReactElement|null} Loading overlay component or null when not loading
 */
const LoadingOverlay = ({
  loading = false,
  message = 'Loading...',
  type = 'container',
  transparent = false
}) => {
  const theme = useTheme();
  
  if (!loading) return null;
  
  // Styles based on type
  const getStyles = () => {
    // Base styles
    const baseStyles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      zIndex: 1000,
    };
    
    // Type-specific positioning
    switch (type) {
      case 'fullscreen':
        return {
          ...baseStyles,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: transparent ? 
            alpha(theme.palette.background.default, 0.7) : 
            theme.palette.background.default,
        };
        
      case 'container':
        return {
          ...baseStyles,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: transparent ? 
            alpha(theme.palette.background.default, 0.5) : 
            theme.palette.background.default,
          minHeight: 200,
        };
        
      case 'inline':
      default:
        return {
          ...baseStyles,
          py: 3,
          minHeight: 100,
        };
    }
  };
  
  return (
    <Box sx={getStyles()}>
      <CircularProgress 
        color="primary" 
        size={type === 'inline' ? 40 : 60}
        thickness={4}
        sx={{ 
          color: theme.palette.primary.main,
          // Add slight shadow for better visibility on various backgrounds
          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))'
        }}
      />
      
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mt: 1,
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

LoadingOverlay.propTypes = {
  loading: PropTypes.bool,
  message: PropTypes.string,
  type: PropTypes.oneOf(['fullscreen', 'container', 'inline']),
  transparent: PropTypes.bool
};

export default LoadingOverlay;
