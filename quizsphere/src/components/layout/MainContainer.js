import React from 'react';
import { Container, Box, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * MainContainer component for QuizSphere application
 * Provides consistent layout structure, padding, and responsive behavior across all pages
 * Handles proper spacing below the fixed header
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child elements to render within the container
 * @param {boolean} props.disablePadding - Whether to disable standard padding
 * @param {string} props.maxWidth - Maximum width of container ('xs', 'sm', 'md', 'lg', 'xl', false)
 * @param {Object} props.sx - Additional custom styles to apply to the container
 * @returns {React.ReactElement} The rendered MainContainer component
 */
const MainContainer = ({ 
  children, 
  disablePadding = false, 
  maxWidth = 'lg',
  sx = {} 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: '100%',
        // Toolbar height (64px in desktop, 56px in mobile) + additional spacing
        pt: { xs: '76px', sm: '84px' },
        pb: 2,
        ...sx
      }}
    >
      <Container
        maxWidth={maxWidth}
        disableGutters={disablePadding}
        sx={{
          px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
          height: '100%',
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  disablePadding: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  sx: PropTypes.object
};

export default MainContainer;
