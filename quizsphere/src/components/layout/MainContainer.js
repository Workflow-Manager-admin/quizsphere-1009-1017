import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Typography,
  alpha
} from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// Import custom UI components
import ContainerTransition from '../ui/ContainerTransition';
import LoadingOverlay from '../ui/LoadingOverlay';

// PUBLIC_INTERFACE
/**
 * MainContainer component for QuizSphere application
 * Provides consistent layout structure, padding, and responsive behavior across all pages
 * Handles proper spacing below the fixed header, page transitions, and loading states
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child elements to render within the container
 * @param {boolean} props.disablePadding - Whether to disable standard padding
 * @param {string} props.maxWidth - Maximum width of container ('xs', 'sm', 'md', 'lg', 'xl', false)
 * @param {boolean} props.loading - Whether content is in loading state
 * @param {string} props.error - Error message to display (if any)
 * @param {boolean} props.disableAnimations - Whether to disable transition animations
 * @param {boolean} props.backgroundPattern - Whether to show background pattern
 * @param {Object} props.sx - Additional custom styles to apply to the container
 * @returns {React.ReactElement} The rendered MainContainer component
 */
const MainContainer = ({ 
  children, 
  disablePadding = false, 
  maxWidth = 'lg',
  loading = false,
  error = null,
  disableAnimations = false,
  backgroundPattern = false,
  sx = {} 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const containerRef = useRef(null);
  
  // Track whether this is the initial render
  const [isFirstRender, setIsFirstRender] = useState(true);
  // Track when content changes to trigger animations
  const [key, setKey] = useState(location.pathname);
  // Track container height for smooth transitions
  const [containerHeight, setContainerHeight] = useState('auto');
  
  // Update key when location changes to trigger animations
  useEffect(() => {
    // Short delay to allow smooth transition
    const timer = setTimeout(() => {
      setKey(location.pathname);
    }, 100);
    
    // Scroll to top on route change
    if (!isFirstRender) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      setIsFirstRender(false);
    }
    
    return () => clearTimeout(timer);
  }, [location.pathname, isFirstRender]);
  
  // Measure and update container height for smooth transitions
  useEffect(() => {
    if (containerRef.current && !disableAnimations) {
      const height = containerRef.current.offsetHeight;
      setContainerHeight(`${height}px`);
    }
  }, [children, disableAnimations]);
  
  // Generate the background pattern styles
  const getPatternStyles = () => {
    if (!backgroundPattern) return {};
    
    return {
      backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.1)} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 
          `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 1)} 0%, 
          ${alpha(theme.palette.background.default, 0.8)} 20%, 
          ${alpha(theme.palette.background.default, 0.8)} 80%, 
          ${alpha(theme.palette.background.default, 1)} 100%)`,
        pointerEvents: 'none',
        zIndex: -1,
      }
    };
  };
  
  // Render error state
  const renderError = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px',
        p: 3,
        textAlign: 'center',
        flexDirection: 'column',
        gap: 2,
        bgcolor: alpha(theme.palette.error.main, 0.05),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
      }}
    >
      <Typography variant="h6" color="error.main" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error || "We've encountered an issue loading this content. Please try again."}
      </Typography>
    </Box>
  );
  
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: '100%',
        // Toolbar height (64px in desktop, 56px in mobile) + additional spacing
        pt: { xs: '76px', sm: '84px' },
        pb: 2,
        transition: 'padding 0.3s ease',
        ...getPatternStyles(),
        ...sx
      }}
    >
      <Container
        ref={containerRef}
        maxWidth={maxWidth}
        disableGutters={disablePadding}
        sx={{
          px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
          height: !disableAnimations ? containerHeight : '100%',
          transition: !disableAnimations ? 'height 0.3s ease-out' : 'none',
          position: 'relative',
          // Accessibility improvements
          '&:focus': {
            outline: 'none',
          },
          // Smooth scrolling for the container content
          overflowY: 'visible',
          scrollBehavior: 'smooth',
        }}
        tabIndex={-1}
        aria-live="polite"
        role="region"
        aria-label="Main content"
      >
        {/* Show loading spinner when in loading state */}
        <LoadingOverlay
          loading={loading}
          message="Loading content..."
          type="container"
          transparent={true}
        />
        
        {/* Show error message when there's an error */}
        {error && renderError()}
        
        {/* Render children with transition if not loading or error */}
        {!loading && !error && (
          <ContainerTransition 
            locationKey={key}
            type="fade"
            duration={0.4}
            disabled={disableAnimations}
          >
            {children}
          </ContainerTransition>
        )}
      </Container>
    </Box>
  );
};

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  disablePadding: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  loading: PropTypes.bool,
  error: PropTypes.string,
  disableAnimations: PropTypes.bool,
  backgroundPattern: PropTypes.bool,
  sx: PropTypes.object
};

export default MainContainer;
