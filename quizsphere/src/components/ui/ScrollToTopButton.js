import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger, Box } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * ScrollToTopButton component displays a floating action button to scroll back to top
 * when the user scrolls down the page
 * 
 * @param {Object} props - Component props
 * @param {number} props.threshold - Scroll threshold in pixels to show the button
 * @param {string} props.position - Button position ('right' or 'left')
 * @param {string} props.color - Button color
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @returns {React.ReactElement} ScrollToTopButton component
 */
const ScrollToTopButton = ({ 
  threshold = 300, 
  position = 'right',
  color = 'primary',
  size = 'medium'
}) => {
  // Track whether the button should be visible
  const [visible, setVisible] = useState(false);
  
  // Use Material UI's scroll trigger
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshold,
  });
  
  // Update visibility when scroll position changes
  useEffect(() => {
    setVisible(scrollTrigger);
  }, [scrollTrigger]);
  
  // Handle click to scroll to top
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Generate position styles
  const getPositionStyles = () => {
    return {
      position: 'fixed',
      bottom: 16,
      [position]: 16,
      zIndex: 1000,
    };
  };
  
  return (
    <Zoom in={visible}>
      <Box sx={getPositionStyles()}>
        <Fab
          color={color}
          size={size}
          aria-label="scroll back to top"
          onClick={handleClick}
          sx={{
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Box>
    </Zoom>
  );
};

ScrollToTopButton.propTypes = {
  threshold: PropTypes.number,
  position: PropTypes.oneOf(['left', 'right']),
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default ScrollToTopButton;
